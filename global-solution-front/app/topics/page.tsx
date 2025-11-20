"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BookOpen } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import { mockAPI } from "@/lib/mock-api"

export default function TopicsPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [questions, setQuestions] = useState<Array<any>>([])
    const [users, setUsers] = useState<Array<any>>([])

    // Fetch questions and users from mockAPI and build tags
    useEffect(() => {
        let mounted = true

        async function load() {
            setLoading(true)
            setError(null)
            try {
                const [qs, us] = await Promise.all([mockAPI.getAllQuestions(), mockAPI.getAllUsers()])
                if (!mounted) return
                setQuestions(qs || [])
                setUsers(us || [])
                setLoading(false)
            } catch (err) {
                if (!mounted) return
                setError((err as Error).message || "Failed to load topics")
                setLoading(false)
            }
        }

        load()

        return () => {
            mounted = false
        }
    }, [])

    // Aggregate tags from questions
    const tags = useMemo(() => {
        const map = new Map<string, { id: string; name: string; description: string; count: number }>()
        questions.forEach((q) => {
            (q.tags || []).forEach((t: string) => {
                const key = t
                const existing = map.get(key)
                if (existing) {
                    existing.count += 1
                } else {
                    map.set(key, { id: key, name: key, description: `Questions about ${key}`, count: 1 })
                }
            })
        })
        return Array.from(map.values())
    }, [questions])

    // Sort tags by popularity
    const sortedTags = useMemo(() => [...tags].sort((a, b) => b.count - a.count), [tags])

    // Get stats for each topic
    const getTopicStats = (tagName: string) => {
        const questionsWithTag = questions.filter((q) => (q.tags || []).includes(tagName))
        const answeredCount = questionsWithTag.filter((q) => (q.answers || []).length > 0).length
        return {
            totalQuestions: questionsWithTag.length,
            answeredQuestions: answeredCount,
            followers: Math.floor(Math.random() * 100) + 10, // Mock follower count
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {loading && (
                    <Card className="p-12 text-center">
                        Loading topics…
                    </Card>
                )}

                {error && (
                    <Card className="p-12 text-center">
                        <p className="text-destructive">{error}</p>
                    </Card>
                )}

                {!loading && !error && (
                    <>
                        {/* Header */}
                        <div className="mb-12">
                            <h2 className="text-4xl font-bold text-foreground mb-2">Topics</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Explore knowledge areas and discover questions in topics that interest you.
                            </p>
                        </div>

                        {/* Hero Stats */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <Card className="p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Topics</p>
                                        <p className="text-2xl font-bold text-foreground">{tags.length}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Questions</p>
                                        <p className="text-2xl font-bold text-foreground">{questions.length}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-muted rounded-lg">
                                        <Users className="h-6 w-6 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Contributors</p>
                                        <p className="text-2xl font-bold text-foreground">{users.length}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Topics Grid */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Explore Topics</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {sortedTags.length === 0 && (
                                    <Card className="p-8">No topics found.</Card>
                                )}

                                {sortedTags.map((tag) => {
                                    const stats = getTopicStats(tag.name)
                                    return (
                                        <Card
                                            key={tag.id}
                                            className="p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
                                        >
                                            <div className="space-y-4">
                                                {/* Topic Header */}
                                                <div>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="text-xl font-semibold text-foreground">{tag.name}</h4>
                                                        <Badge variant="secondary">{stats.totalQuestions}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{tag.description}</p>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Answered</p>
                                                        <p className="text-lg font-semibold text-foreground">{stats.answeredQuestions}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Followers</p>
                                                        <p className="text-lg font-semibold text-foreground">{stats.followers}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Unanswered</p>
                                                        <p className="text-lg font-semibold text-accent">
                                                            {stats.totalQuestions - stats.answeredQuestions}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                <Link href={`/?filter=${tag.name}`}>
                                                    <Button variant="outline" className="w-full bg-transparent">
                                                        View Questions
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
