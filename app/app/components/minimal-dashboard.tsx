'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MinimalDashboard() {
  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>ForSure AI Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Welcome to ForSure AI! This is a simplified version of the
            dashboard.
          </p>
          <Button className="w-full">Start Building Your Project</Button>
        </CardContent>
      </Card>
    </div>
  )
}
