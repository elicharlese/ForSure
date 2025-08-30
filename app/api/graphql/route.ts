import { createYoga } from 'graphql-yoga'
import {
  schema,
  createContext,
  type GraphQLContext,
} from '@/lib/graphql/schema'

// Ensure Node runtime for SSE subscriptions
export const runtime = 'nodejs'
// Avoid caching for GraphiQL/SSE
export const dynamic = 'force-dynamic'

// Create a fetch handler compatible with Next.js App Router route handlers
const yoga = createYoga<GraphQLContext>({
  schema,
  graphqlEndpoint: '/api/graphql',
  context: ({ request }: { request: Request }) => createContext(request),
  fetchAPI: { Request, Response, Headers },
  maskedErrors: process.env.NODE_ENV === 'production',
})

export const { handleRequest } = yoga

// Support GET (queries, GraphiQL, SSE subscriptions), POST (queries/mutations), OPTIONS (CORS preflight)
export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }
