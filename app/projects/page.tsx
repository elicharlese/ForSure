'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type OwnerProfile = {
  name: string
  avatar_url: string | null
}

type Project = {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'archived'
  owner_id: string
  profiles?: OwnerProfile
  created_at: string
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (user) void fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('fs_access_token')
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Not authenticated',
          description: 'Please login to view projects',
        })
        return
      }
      const res = await fetch(
        `/api/v1/projects?search=${encodeURIComponent(search)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const json = await res.json()
      if (!res.ok || !json.success)
        throw new Error(json.error || 'Failed to fetch projects')
      setProjects(json.data?.projects ?? [])
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load projects',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view projects
          </h1>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-6xl">
      <div className="flex items-end gap-3 mb-8">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium mb-1">
            Search
          </label>
          <Input
            id="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
          />
        </div>
        <Button onClick={fetchProjects} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </Button>
      </div>

      {projects.length === 0 && !loading && (
        <div className="text-center text-muted-foreground">
          No projects found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(p => (
          <Card key={p.id} className="border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <span className={`text-xs px-2 py-1 rounded bg-muted`}>
                  {p.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {p.description}
              </p>
              <div className="text-xs text-muted-foreground">
                <div>Owner: {p.profiles?.name ?? 'You'}</div>
                <div>
                  Created: {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
