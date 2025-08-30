import { createSchema } from 'graphql-yoga'
import type { PrismaClient } from '@prisma/client'
import { pubSub } from '@/lib/graphql/pubsub'
import { prisma } from '@/lib/prisma'
import { getBearerToken, verifyAccessToken } from '@/lib/auth'

// GraphQL Context
export type GraphQLContext = {
  prisma: PrismaClient
  pubSub: typeof pubSub
  user: { id: string; email: string; role?: string } | null
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const typeDefs = /* GraphQL */ `
  enum SortOrder {
    asc
    desc
  }
  enum ComponentsSortField {
    downloads
    stars
    created_at
    name
    category
  }

  type Profile {
    id: ID!
    name: String
    avatar_url: String
  }

  type Component {
    id: ID!
    name: String!
    slug: String!
    description: String
    category: String!
    tags: [String!]!
    prompt: String!
    preview_image_url: String
    downloads: Int!
    stars: Int!
    is_public: Boolean!
    created_at: String!
    updated_at: String!
    creator: Profile!
  }

  input ComponentsFilter {
    search: String
    category: String
    tags: [String!]
    is_public: Boolean
  }

  input Pagination {
    page: Int = 1
    limit: Int = 10
  }

  input ComponentsSort {
    field: ComponentsSortField = downloads
    order: SortOrder = desc
  }

  type ComponentsPage {
    nodes: [Component!]!
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  input CreateComponentInput {
    name: String!
    description: String
    category: String!
    tags: [String!]
    prompt: String!
    preview_image_url: String
    is_public: Boolean
  }

  type Query {
    component(id: ID, slug: String): Component
    components(
      filter: ComponentsFilter
      pagination: Pagination
      sort: ComponentsSort
    ): ComponentsPage!
  }

  type Mutation {
    createComponent(input: CreateComponentInput!): Component!
  }

  type Subscription {
    componentCreated: Component!
  }
`

export const schema = createSchema<GraphQLContext>({
  typeDefs,
  resolvers: {
    Query: {
      async component(
        _parent: unknown,
        args: { id?: string; slug?: string },
        ctx: GraphQLContext
      ) {
        const { id, slug } = args
        if (!id && !slug) return null
        const where = id ? { id } : { slug: slug as string }
        const db = ctx.prisma as any
        const row = await db.component.findUnique({
          where,
          include: {
            creator: { select: { id: true, name: true, avatar_url: true } },
          },
        })
        if (!row) return null
        return {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          category: row.category,
          tags: row.tags,
          prompt: row.prompt,
          preview_image_url: row.preview_image_url,
          downloads: row.download_count,
          stars: row.stars,
          is_public: row.is_public,
          created_at: row.created_at.toISOString(),
          updated_at: row.updated_at.toISOString(),
          creator: row.creator,
        }
      },
      async components(
        _parent: unknown,
        args: {
          filter?: any
          pagination?: { page?: number; limit?: number }
          sort?: { field?: string; order?: 'asc' | 'desc' }
        },
        ctx: GraphQLContext
      ) {
        const { filter, pagination, sort } = args
        const page = Math.max(1, Number(pagination?.page ?? 1))
        const limit = Math.min(
          100,
          Math.max(1, Number(pagination?.limit ?? 10))
        )
        const skip = (page - 1) * limit

        const where: any = {
          ...(filter?.is_public === undefined
            ? { is_public: true }
            : { is_public: !!filter.is_public }),
          ...(filter?.category ? { category: filter.category } : {}),
          ...(Array.isArray(filter?.tags) && filter.tags.length
            ? { tags: { hasSome: filter.tags } }
            : {}),
          ...(filter?.search
            ? {
                OR: [
                  {
                    name: {
                      contains: String(filter.search),
                      mode: 'insensitive',
                    },
                  },
                  {
                    description: {
                      contains: String(filter.search),
                      mode: 'insensitive',
                    },
                  },
                  {
                    category: {
                      contains: String(filter.search),
                      mode: 'insensitive',
                    },
                  },
                  { tags: { has: String(filter.search) } },
                ],
              }
            : {}),
        }

        const sortMap: Record<string, string> = {
          downloads: 'download_count',
          stars: 'stars',
          created_at: 'created_at',
          name: 'name',
          category: 'category',
        }
        const sortKey =
          sortMap[String(sort?.field ?? 'downloads')] || 'download_count'
        const sortOrder =
          String(sort?.order ?? 'desc') === 'asc' ? 'asc' : 'desc'

        const db = ctx.prisma as any
        const [total, rows] = await Promise.all([
          db.component.count({ where }),
          db.component.findMany({
            where,
            orderBy: { [sortKey]: sortOrder },
            skip,
            take: limit,
            include: {
              creator: { select: { id: true, name: true, avatar_url: true } },
            },
          }),
        ])

        return {
          nodes: rows.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            category: c.category,
            tags: c.tags,
            prompt: c.prompt,
            preview_image_url: c.preview_image_url,
            downloads: c.download_count,
            stars: c.stars,
            is_public: c.is_public,
            created_at: c.created_at.toISOString(),
            updated_at: c.updated_at.toISOString(),
            creator: c.creator,
          })),
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      },
    },
    Mutation: {
      async createComponent(
        _parent: unknown,
        args: {
          input: {
            name: string
            description?: string | null
            category: string
            tags?: string[]
            prompt: string
            preview_image_url?: string | null
            is_public?: boolean
          }
        },
        ctx: GraphQLContext
      ) {
        if (!ctx.user) {
          throw new Error('Unauthorized')
        }
        const input = args.input

        // generate unique slug
        const baseSlug = slugify(input.name)
        let uniqueSlug = baseSlug
        let counter = 1
        const db = ctx.prisma as any
        while (await db.component.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${baseSlug}-${counter++}`
        }

        const created = await db.component.create({
          data: {
            name: input.name,
            slug: uniqueSlug,
            description: input.description ?? null,
            category: input.category,
            tags: input.tags ?? [],
            prompt: input.prompt,
            preview_image_url: input.preview_image_url ?? null,
            is_public: input.is_public ?? true,
            creator_id: ctx.user.id,
          },
          include: {
            creator: { select: { id: true, name: true, avatar_url: true } },
          },
        })

        const payload = {
          id: created.id,
          name: created.name,
          slug: created.slug,
          description: created.description,
          category: created.category,
          tags: created.tags,
          prompt: created.prompt,
          preview_image_url: created.preview_image_url,
          downloads: created.download_count,
          stars: created.stars,
          is_public: created.is_public,
          created_at: created.created_at.toISOString(),
          updated_at: created.updated_at.toISOString(),
          creator: created.creator,
        }

        await ctx.pubSub.publish('componentCreated', {
          id: created.id,
          name: created.name,
          description: created.description,
          category: created.category,
          tags: created.tags,
          prompt: created.prompt,
          preview_image_url: created.preview_image_url,
          stars: created.stars,
          download_count: created.download_count,
          creator_id: created.creator_id,
          slug: created.slug,
          created_at: created.created_at,
          updated_at: created.updated_at,
          is_public: created.is_public,
        })
        return payload
      },
    },
    Subscription: {
      componentCreated: {
        subscribe: (_parent: unknown, _args: unknown, ctx: GraphQLContext) =>
          // Pass empty options to satisfy Yoga's subscribe signature types
          (ctx.pubSub as any).subscribe('componentCreated', {}),
        // Map DB row to GraphQL type on each event
        resolve: (c: any) => {
          return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            category: c.category,
            tags: c.tags,
            prompt: c.prompt,
            preview_image_url: c.preview_image_url,
            downloads: c.download_count,
            stars: c.stars,
            is_public: c.is_public,
            created_at: c.created_at.toISOString(),
            updated_at: c.updated_at.toISOString(),
            // creator will be resolved lazily if needed; for simplicity omit here
            // Clients can re-query the component if they need nested creator details
            creator: { id: c.creator_id },
          }
        },
      },
    },
    Component: {
      // Resolve nested creator if only id is provided by subscription payload
      async creator(parent: any, _args: unknown, ctx: GraphQLContext) {
        if (parent.creator?.id && parent.creator.name !== undefined)
          return parent.creator
        const profile = await ctx.prisma.profile.findUnique({
          where: { id: (parent.creator?.id || parent.creator_id) as string },
          select: { id: true, name: true, avatar_url: true },
        })
        return profile
      },
    },
  },
})

// Build context factory per request
export function createContext(request: Request): GraphQLContext {
  const authHeader = request.headers.get('authorization')
  const token = getBearerToken(authHeader)
  let user: GraphQLContext['user'] = null
  if (token) {
    try {
      const payload = verifyAccessToken(token)
      user = { id: payload.sub, email: payload.email, role: payload.role }
    } catch {
      user = null
    }
  }
  return { prisma, pubSub, user }
}
