import type { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="transition-all hover:shadow-md border border-primary/20 hover:border-primary/50 bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-2 flex justify-center">
        <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <h3 className="font-bold text-xl text-secondary">{title}</h3>
        <p className="text-secondary/80">{description}</p>
      </CardContent>
    </Card>
  )
}
