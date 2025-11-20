"use client"

import type { Answer, User } from "@/lib/types"
import { UserBadge } from "./user-badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp } from "lucide-react"

interface AnswerViewProps {
  answer: Answer
  author: User
  isBestAnswer: boolean
}

export function AnswerView({ answer, author, isBestAnswer }: AnswerViewProps) {
  return (
    <Card className={`p-5 ${isBestAnswer ? "border-accent border-2 bg-accent/5" : ""}`}>
      <div className="space-y-4">
        {isBestAnswer && (
          <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded text-xs font-medium">
            ✓ Best Answer
          </div>
        )}

        <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{answer.body}</div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <UserBadge user={author} />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-xs">{answer.votes}</span>
            </Button>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
