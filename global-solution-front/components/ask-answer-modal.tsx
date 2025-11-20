"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { mockAPI } from "@/lib/mock-api"
import type { Answer } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"

interface AddAnswerModalProps {
    isOpen: boolean
    onClose: () => void
    onAnswerCreated: (answer: Answer) => void
    questionId: string
    currentUserId?: string
}

export function AddAnswerModal({
    isOpen,
    onClose,
    onAnswerCreated,
    questionId,
    currentUserId,
}: AddAnswerModalProps) {
    const { user } = useAuth();

    const [body, setBody] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!body.trim()) {
            alert("Please write an answer")
            return
        }

        setIsSubmitting(true)

        try {
            const created = await mockAPI.addAnswer({
                questionId,
                body: body.trim(),
                authorId: user?.id || currentUserId || "anonymous",
            })

            // Notify parent component with the created answer
            onAnswerCreated(created)

            // Reset form
            setBody("")
            onClose()
        } catch (err) {
            console.error(err)
            alert((err as Error).message || "Failed to post answer")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Your Answer</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Body Field */}
                    <div className="space-y-2">
                        <Label htmlFor="answer-body">Your Answer</Label>
                        <Textarea
                            id="answer-body"
                            placeholder="Share your knowledge and help solve this problem. Be clear, detailed, and provide code examples if relevant."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            disabled={isSubmitting}
                            rows={8}
                        />
                        <p className="text-xs text-muted-foreground">
                            Provide a detailed answer with examples to help the person understand the solution
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Posting..." : "Post Answer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
