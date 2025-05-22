"use client"

import { useState, useRef, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, MoreVertical, Reply, Edit, Trash2, Send } from "lucide-react"
import type { Comment } from "../hooks/use-saved-projects"

interface CommentSectionProps {
  shareId: string
  comments: Comment[]
  allowComments: boolean
  onAddComment: (comment: { author: string; content: string }) => void
  onEditComment: (commentId: string, content: string) => void
  onDeleteComment: (commentId: string) => void
  onAddReply: (commentId: string, reply: { author: string; content: string }) => void
}

export function CommentSection({
  shareId,
  comments,
  allowComments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onAddReply,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [authorName, setAuthorName] = useState(() => {
    // Try to get the author name from localStorage
    const savedName = localStorage.getItem("forsure-comment-author")
    return savedName || ""
  })
  const [showAuthorInput, setShowAuthorInput] = useState(!authorName)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const commentEndRef = useRef<HTMLDivElement>(null)

  // Save author name to localStorage when it changes
  useEffect(() => {
    if (authorName) {
      localStorage.setItem("forsure-comment-author", authorName)
    }
  }, [authorName])

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [comments.length])

  const handleSubmitComment = () => {
    if (!newComment.trim() || !authorName.trim()) return

    onAddComment({
      author: authorName,
      content: newComment,
    })

    setNewComment("")
    setShowAuthorInput(false)
  }

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim() || !authorName.trim()) return

    onAddReply(commentId, {
      author: authorName,
      content: replyContent,
    })

    setReplyContent("")
    setReplyingTo(null)
  }

  const handleStartEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const handleSubmitEdit = (commentId: string) => {
    if (!editContent.trim()) return

    onEditComment(commentId, editContent)
    setEditingComment(null)
    setEditContent("")
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent("")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getAvatarColor = (name: string) => {
    // Generate a consistent color based on the name
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash % 360)
    return `hsl(${hue}, 70%, 60%)`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No comments yet</p>
            {allowComments && <p className="text-sm">Be the first to leave a comment!</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8" style={{ backgroundColor: getAvatarColor(comment.author) }}>
                    <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                        </span>
                        {comment.isEdited && <span className="text-xs text-muted-foreground ml-2">(edited)</span>}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Comment actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setReplyingTo(comment.id)}>
                            <Reply className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          {comment.author === authorName && (
                            <>
                              <DropdownMenuItem onClick={() => handleStartEdit(comment)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => onDeleteComment(comment.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSubmitEdit(comment.id)}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">{comment.content}</div>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-11 space-y-3 border-l-2 border-muted pl-4 mt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="h-6 w-6" style={{ backgroundColor: getAvatarColor(reply.author) }}>
                          <AvatarFallback className="text-xs">{getInitials(reply.author)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-sm">{reply.author}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm">{reply.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="ml-11 border-l-2 border-muted pl-4 mt-2">
                    <div className="flex gap-3">
                      <Avatar
                        className="h-6 w-6"
                        style={{ backgroundColor: getAvatarColor(authorName || "Anonymous") }}
                      >
                        <AvatarFallback className="text-xs">{getInitials(authorName || "A")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={commentEndRef} />
      </CardContent>

      {allowComments && (
        <CardFooter>
          <div className="w-full space-y-4">
            {showAuthorInput && (
              <div className="space-y-2">
                <label htmlFor="author-name" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="author-name"
                  placeholder="Enter your name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Avatar className="h-8 w-8" style={{ backgroundColor: getAvatarColor(authorName || "Anonymous") }}>
                <AvatarFallback>{getInitials(authorName || "A")}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              {!showAuthorInput && authorName && (
                <Button variant="ghost" size="sm" onClick={() => setShowAuthorInput(true)}>
                  Change name
                </Button>
              )}
              <div className="ml-auto">
                <Button onClick={handleSubmitComment} disabled={!newComment.trim() || !authorName.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
