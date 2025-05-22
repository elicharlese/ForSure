import { MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Comment } from "../hooks/use-saved-projects"

interface CommentCountBadgeProps {
  comments: Comment[] | undefined
  className?: string
}

export function CommentCountBadge({ comments, className = "" }: CommentCountBadgeProps) {
  if (!comments || comments.length === 0) return null

  // Count total comments including replies
  const totalCount = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0)
  }, 0)

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
      <MessageSquare className="h-3 w-3" />
      {totalCount}
    </Badge>
  )
}
