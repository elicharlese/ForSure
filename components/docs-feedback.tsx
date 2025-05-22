"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, Send, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DocsFeedback() {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type)
    if (type === "negative") {
      setShowDialog(true)
    } else {
      // Just record positive feedback without asking for details
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  const submitFeedback = () => {
    // Here you would typically send the feedback to your backend
    console.log("Feedback submitted:", { type: feedback, text: feedbackText })
    setShowDialog(false)
    setFeedbackText("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="mt-12 pt-6 border-t">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Was this page helpful?</h3>

        {submitted ? (
          <div className="flex items-center text-green-600">
            <Check className="mr-2 h-5 w-5" />
            <span>Thank you for your feedback!</span>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback("positive")}
              className="flex items-center"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Yes, it was helpful
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback("negative")}
              className="flex items-center"
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              No, it needs improvement
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How can we improve this page?</DialogTitle>
            <DialogDescription>Your feedback helps us make our documentation better.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Please let us know what was unclear or what could be improved..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitFeedback} className="flex items-center">
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
