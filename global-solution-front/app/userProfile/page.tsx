"use client"

import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { BarChart, MessageSquare, TrendingUp, Award } from "lucide-react"

export default function UserProfilePage() {
    const { user } = useAuth()

    if (!user) {
        redirect("/auth")
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
                        <p className="text-muted-foreground">Here's your contribution summary</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="p-6 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Questions Asked</span>
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{user.questionsAsked}</p>
                            <p className="text-xs text-accent">+5 this month</p>
                        </Card>

                        <Card className="p-6 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Answers Given</span>
                                <BarChart className="h-5 w-5 text-accent" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{user.answersGiven}</p>
                            <p className="text-xs text-accent">+12 this month</p>
                        </Card>

                        <Card className="p-6 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Reputation</span>
                                <TrendingUp className="h-5 w-5 text-accent" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{user.reputation}</p>
                            <p className="text-xs text-accent">+250 points</p>
                        </Card>
                    </div>

                    {/* Expertise Tags */}
                    <Card className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Your Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href={`/users/${user.id}`}>
                            <Card className="p-6 hover:bg-accent/5 cursor-pointer transition-colors space-y-2">
                                <h3 className="font-semibold text-foreground">View Profile</h3>
                                <p className="text-sm text-muted-foreground">Check your public profile and reputation</p>
                            </Card>
                        </Link>

                        <Link href="/questions">
                            <Card className="p-6 hover:bg-accent/5 cursor-pointer transition-colors space-y-2">
                                <h3 className="font-semibold text-foreground">Browse Questions</h3>
                                <p className="text-sm text-muted-foreground">Help others by answering questions</p>
                            </Card>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
