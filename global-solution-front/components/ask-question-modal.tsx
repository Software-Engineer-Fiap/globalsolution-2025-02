"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { mockAPI } from "@/lib/mock-api"
import type { Question } from "@/lib/types"
import { X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface AskQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onQuestionCreated: (question: Question) => void
  currentUserId?: string
}

export function AskQuestionModal({
  isOpen,
  onClose,
  onQuestionCreated,
  currentUserId,
}: AskQuestionModalProps) {
  const { user } = useAuth()

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allTags = mockAPI.getAllTags()
  const availableTags = allTags.map((t) => t.name).filter((t) => !selectedTags.includes(t))

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !body.trim() || selectedTags.length === 0) {
      alert("Please fill in all fields and select at least one tag")
      return
    }

    setIsSubmitting(true)

    const newQuestion = await mockAPI.createQuestion({
      title: title.trim(),
      body: body.trim(),
      tags: selectedTags,
      authorId: user?.id || currentUserId || "anonymous",
    })

    // Notify parent component
    onQuestionCreated(newQuestion)

    // Reset form
    setTitle("")
    setBody("")
    setSelectedTags([])
    setTagInput("")
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              placeholder="What's your question? Be specific and concise."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">Write a descriptive title that summarizes your question</p>
          </div>

          {/* Body Field */}
          <div className="space-y-2">
            <Label htmlFor="body">Question Details</Label>
            <Textarea
              id="body"
              placeholder="Provide more context and details about your question. Include any relevant code snippets or error messages."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isSubmitting}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Provide as much detail as possible to help others understand and answer your question
            </p>
          </div>

          {/* Tags Field */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="space-y-3">
              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 min-h-8">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:opacity-75 transition-opacity"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Tag Input */}
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Start typing to search tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  disabled={isSubmitting}
                  list="tags-list"
                />
                <datalist id="tags-list">
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>
              </div>

              {/* Tag Suggestions */}
              {tagInput && availableTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()))
                    .slice(0, 5)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                        disabled={isSubmitting}
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">Select at least one tag to categorize your question</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
