'use client'

import { useAuth } from '@/contexts/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Settings } from 'lucide-react'
import Link from 'next/link'

export function UserProfileCard() {
  const { user } = useAuth()

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar || '/placeholder.svg'}
              alt={user.name}
            />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/app/account">
              <User className="h-4 w-4 mr-1" />
              Profile
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/app/settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
