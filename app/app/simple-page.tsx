"use client"

import { Button } from "@/components/ui/button"

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">ForSure AI</h1>
          <p className="text-muted-foreground">AI-powered project structure generator</p>
          <Button className="w-full">Get Started</Button>
        </div>
      </div>
    </div>
  )
}
