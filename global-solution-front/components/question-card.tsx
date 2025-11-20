"use client"

import Link from "next/link"
import type { Question, User } from "@/lib/types"
import { UserBadge } from "./user-badge"
import { Tag } from "./tag"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface QuestionCardProps {
    question: Question
    author: User
    answerCount: number
    hasAcceptedAnswer: boolean
}

export function QuestionCard({ question, author, answerCount, hasAcceptedAnswer }: QuestionCardProps) {
    return (
        <Link href={`/questions/${question.id}`}>
            <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold leading-tight text-foreground hover:text-primary transition-colors">
                        {question.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">{question.body}</p>

                    <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                            <Tag key={tag} name={tag} />
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                            <UserBadge user={author} />
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span className="font-medium">{answerCount}</span>
                                <span>answer{answerCount !== 1 ? "s" : ""}</span>
                            </div>
                            {hasAcceptedAnswer && (
                                <Badge variant="default" className="bg-accent text-accent-foreground">
                                    solved
                                </Badge>
                            )}
                            <span>{formatDistanceToNow(new Date(question.createdAt!), { addSuffix: true })}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
}
