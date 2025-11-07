"use client"

import type React from "react"
import type { TicketComment } from "@/lib/types"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Lock } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface TicketCommentsProps {
  ticketId: string
  comments: TicketComment[]
  currentUserId: string
  userRole: string
}

export function TicketComments({ ticketId, comments, currentUserId, userRole }: TicketCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("ticket_comments").insert([
        {
          ticket_id: ticketId,
          author_id: currentUserId,
          content: newComment.trim(),
          is_internal: isInternal,
        },
      ])

      if (error) throw error

      setNewComment("")
      setIsInternal(false)
      toast({
        title: "Comment added",
        description: "Your comment has been added to the ticket.",
      })

      // Refresh the page to show the new comment
      window.location.reload()
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error adding comment",
        description: "There was an error adding your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canSeeInternalComments = ["admin", "manager", "agent"].includes(userRole)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Comments</span>
        </CardTitle>
        <CardDescription>Conversation history and updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new comment */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex items-center justify-between">
            {canSeeInternalComments && (
              <div className="flex items-center space-x-2">
                <Checkbox id="internal" checked={isInternal} onCheckedChange={setIsInternal} />
                <label
                  htmlFor="internal"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Internal comment (not visible to customers)
                </label>
              </div>
            )}
            <Button type="submit" disabled={isLoading || !newComment.trim()}>
              {isLoading ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </form>

        {/* Comments list */}
        <div className="space-y-4">
          {comments
            .filter((comment) => canSeeInternalComments || !comment.is_internal)
            .map((comment) => {
              const authorInitials = comment.author
                ? `${comment.author.first_name?.[0] || ""}${comment.author.last_name?.[0] || ""}`
                : "U"

              return (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {comment.author
                          ? `${comment.author.first_name || ""} ${comment.author.last_name || ""}`.trim() ||
                            comment.author.email
                          : "Unknown User"}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                      {comment.is_internal && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Internal
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              )
            })}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No comments yet. Be the first to add one!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
