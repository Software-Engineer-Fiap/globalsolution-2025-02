"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { AnswerView } from "@/components/answer-view"
import { UserBadge } from "@/components/user-badge"
import { Tag } from "@/components/tag"
import { mockAPI } from "@/lib/mock-api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { AddAnswerModal } from "@/components/ask-answer-modal"
import { useAuth } from "@/hooks/use-auth"

interface PageProps {
    params?: { id?: string }
}

export default function QuestionPage(_: PageProps) {
    const routeParams = useParams()
    const id = routeParams?.id as string | undefined

    const { user } = useAuth();

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [question, setQuestion] = useState<any | null>(null)
    const [author, setAuthor] = useState<any | null>(null)
    const [answers, setAnswers] = useState<any[]>([])
    const [bestAnswer, setBestAnswer] = useState<any | null>(null)
    const [bestAnswerAuthor, setBestAnswerAuthor] = useState<any | null>(null)
    const [otherAuthors, setOtherAuthors] = useState<Array<any | null>>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        let mounted = true

        async function load() {
            setLoading(true)
            setError(null)

            if (!id) {
                setError("Question id missing")
                setLoading(false)
                return
            }

            try {
                const q = await mockAPI.getQuestion(id)
                if (!mounted) return

                if (!q) {
                    setQuestion(null)
                    setLoading(false)
                    return
                }

                setQuestion(q);
                
                const [auth, ans] = await Promise.all([
                    mockAPI.getUser(q.authorId),
                    mockAPI.getAnswersForQuestion(q.id!),
                ])

                if (!mounted) return

                setAuthor(auth ?? null)
                setAnswers(ans ?? [])

                // best answer
                if (q.bestAnswerId) {
                    const best = await mockAPI.getAnswer(q.bestAnswerId)
                    if (mounted) setBestAnswer(best ?? null)
                    if (best) {
                        const bestAuth = await mockAPI.getUser(best.authorId)
                        if (mounted) setBestAnswerAuthor(bestAuth ?? null)
                    }
                }

                // other answers authors
                const other = (ans ?? []).filter((a: any) => a.id !== q.bestAnswerId)
                const otherAuths = await Promise.all(other.map((a: any) => mockAPI.getUser(a.authorId)))
                if (mounted) setOtherAuthors(otherAuths)

                setLoading(false)
            } catch (err) {
                if (!mounted) return
                setError((err as Error).message ?? "An error occurred")
                setLoading(false)
            }
        }

        load()

        return () => {
            mounted = false
        }
    }, [id])

    const handleAnswerCreated = async (createdAnswer: any) => {
        // Append the new answer to local state and resolve its author
        try {
            // If the backend returned the answer object, add it to the list
            setAnswers((prev) => [createdAnswer, ...prev])

            // Fetch the author and append to otherAuthors (or bestAnswerAuthor if appropriate)
            const authorForNew = await mockAPI.getUser(createdAnswer.authorId)
            if (createdAnswer.id === question.bestAnswerId) {
                setBestAnswer(createdAnswer)
                setBestAnswerAuthor(authorForNew ?? null)
            } else {
                setOtherAuthors((prev) => [...prev, authorForNew ?? null])
            }
        } catch (err) {
            console.error("Error handling created answer:", err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Card className="p-12 text-center">Loading…</Card>
                </main>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Card className="p-12 text-center">
                        <p className="text-lg text-destructive">{error}</p>
                        <Link href="/" className="text-primary hover:underline mt-4 inline-block">
                            Back to questions
                        </Link>
                    </Card>
                </main>
            </div>
        )
    }

    if (!question) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Card className="p-12 text-center">
                        <p className="text-lg text-muted-foreground">Question not found</p>
                        <Link href="/" className="text-primary hover:underline mt-4 inline-block">
                            Back to questions
                        </Link>
                    </Card>
                </main>
            </div>
        )
    }

    const otherAnswers = answers.filter((a) => a.id !== question.bestAnswerId)

    if (!author) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Back to questions</span>
                </Link>

                {/* Question Content */}
                <Card className="p-8 mb-8">
                    <div className="space-y-6">
                        {/* Question Header */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-foreground mb-2">{question.title}</h1>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Asked {formatDistanceToNow(new Date(question.createdAt!), { addSuffix: true })}</span>
                                        <span>•</span>
                                        <span>{question.views} views</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Flag className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {question.tags.map((tag: string) => (
                                    <Tag key={tag} name={tag} />
                                ))}
                            </div>
                        </div>

                        {/* Question Body */}
                        <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
                            {question.body}
                        </div>

                        {/* Question Footer */}
                        <div className="border-t border-border pt-6 flex items-center justify-between">
                            <UserBadge user={author} />
                            <Badge variant="outline" className="text-xs">
                                {answers.length} answer{answers.length !== 1 ? "s" : ""}
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Answers Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">
                            {answers.length} Answer{answers.length !== 1 ? "s" : ""}
                        </h2>
                        <div>
                            <Button onClick={() => setIsModalOpen(true)}>Post an Answer</Button>
                        </div>
                    </div>

                    {/* Best Answer First */}
                    {bestAnswer && bestAnswerAuthor && (
                        <>
                            <AnswerView answer={bestAnswer} author={bestAnswerAuthor} isBestAnswer={true} />
                        </>
                    )}

                    {/* Other Answers */}
                    {otherAnswers
                        .map((answer: any, idx: number) => {
                            const answerAuthor = otherAuthors[idx]
                            if (!answerAuthor) return null

                            return <AnswerView key={answer.id} answer={answer} author={answerAuthor} isBestAnswer={false} />
                        })}

                    {answers.length === 0 && (
                        <Card className="p-12 text-center">
                            <p className="text-muted-foreground mb-4">No answers yet</p>
                            <p className="text-sm text-muted-foreground mb-6">Be the first to help solve this problem</p>
                            <Button onClick={() => setIsModalOpen(true)}>Post an Answer</Button>
                        </Card>
                    )}

                    {/* Answer modal */}
                    <AddAnswerModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAnswerCreated={handleAnswerCreated}
                        questionId={question.id!}
                        currentUserId={user?.id}
                    />
                </div>

                {/* AI Summary Section (Mock) */}
                <Card className="mt-12 p-6 bg-accent/5 border-accent/20">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-accent rounded-lg">
                            <svg className="h-5 w-5 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.5 1.5H5.75A2.25 2.25 0 0 0 3.5 3.75v12.5A2.25 2.25 0 0 0 5.75 18.5h8.5a2.25 2.25 0 0 0 2.25-2.25V8" />
                                <path d="M14 1.5v5h5" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">AI Summary</h3>
                            <p className="text-sm text-foreground mb-4">
                                <strong>Problem:</strong> The 401 Unauthorized error occurs when calling the internal payments API
                                despite providing the correct bearer token.
                            </p>
                            <p className="text-sm text-foreground">
                                <strong>Solution:</strong> The payments API requires an additional X-Service-Signature header generated
                                using HMAC-SHA256 from the request body with a secret key. Include this header in your request to
                                resolve the authentication issue.
                            </p>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    )
}
