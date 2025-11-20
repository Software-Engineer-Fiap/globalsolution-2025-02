"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, MessageSquare, ThumbsUp } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import React, { useEffect, useMemo, useState } from "react"
import { mockAPI } from "@/lib/mock-api"

export default function UsersPage() {
    // local state fetched from mockAPI
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<Array<any>>([])
    const [questions, setQuestions] = useState<Array<any>>([])
    const [answers, setAnswers] = useState<Array<any>>([])

    useEffect(() => {
        let mounted = true

        async function load() {
            setLoading(true)
            setError(null)
            try {
                const [us, qs, ans] = await Promise.all([
                    mockAPI.getAllUsers(),
                    mockAPI.getAllQuestions(),
                    mockAPI.getAllAnswers(),
                ])
                if (!mounted) return
                setUsers(us || [])
                setQuestions(qs || [])
                setAnswers(ans || [])
                setLoading(false)
            } catch (err) {
                if (!mounted) return
                setError((err as Error).message || "Failed to load users")
                setLoading(false)
            }
        }

        load()

        return () => {
            mounted = false
        }
    }, [])

    // Get stats for each user
    const getUserStats = (userId: string) => {
        const userQuestions = questions.filter((q) => q.authorId === userId)
        const userAnswers = answers.filter((a) => a.authorId === userId)

        return {
            questionsCount: userQuestions.length,
            answersCount: userAnswers.length,
            totalVotes: userAnswers.reduce((sum, a) => sum + (a.votes || 0), 0),
        }
    }

    // Sort users by reputation
    const sortedUsers = useMemo(() => [...users].sort((a, b) => b.reputation - a.reputation), [users])

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-4xl font-bold text-foreground mb-2">Community Members</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Meet the experts and contributors who are building our collective knowledge base.
                    </p>
                </div>

                {/* Hero Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Members</p>
                                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-accent/10 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Answers</p>
                                <p className="text-2xl font-bold text-foreground">{answers.length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-muted rounded-lg">
                                <ThumbsUp className="h-6 w-6 text-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Rep</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {users.reduce((sum, u) => sum + u.reputation, 0)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Users Grid */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Top Contributors</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedUsers.map((user) => {
                            const stats = getUserStats(user.id)
                            const initials = user.name
                                .split(" ")
                                .map((n: string) => n[0] ?? "")
                                .join("")

                            return (
                                <Card
                                    key={user.id}
                                    className="p-6 hover:shadow-lg hover:border-primary/50 transition-all flex flex-col"
                                >
                                    {/* User Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <Avatar className="h-12 w-12 flex-shrink-0">
                                            <AvatarImage src={""} alt={user.name} />
                                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-foreground truncate">{user.name}</h4>
                                            <p className="text-xs text-muted-foreground">{user.role}</p>
                                        </div>
                                    </div>

                                    {/* Rep Badge */}
                                    <Badge className="w-fit mb-4" variant="default">
                                        {user.reputation} reputation
                                    </Badge>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-3 py-4 border-y border-border mb-4 flex-1">
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-foreground">{stats.questionsCount}</p>
                                            <p className="text-xs text-muted-foreground">Questions</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-foreground">{stats.answersCount}</p>
                                            <p className="text-xs text-muted-foreground">Answers</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-accent">{stats.totalVotes}</p>
                                            <p className="text-xs text-muted-foreground">Votes</p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link href={`/users/${user.id}`}>
                                        <Button variant="outline" className="w-full bg-transparent">
                                            View Profile
                                        </Button>
                                    </Link>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}
