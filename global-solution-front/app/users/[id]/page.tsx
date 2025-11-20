"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { QuestionCard } from "@/components/question-card"
import { mockAPI } from "@/lib/mock-api"
import { Award, Clock, Trophy } from "lucide-react"

export default function UserProfilePage() {
  const params = useParams()
  const userId = params?.id as string | undefined

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [allQuestions, setAllQuestions] = useState<Array<any>>([])
  const [allAnswers, setAllAnswers] = useState<Array<any>>([])

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!userId) {
        setError("User id missing")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [u, qs, ans] = await Promise.all([
          mockAPI.getUser(userId),
          mockAPI.getAllQuestions(),
          mockAPI.getAllAnswers(),
        ])

        if (!mounted) return

        if (!u) {
          setError("User not found")
          setLoading(false)
          return
        }

        setUser(u)
        setAllQuestions(qs || [])
        setAllAnswers(ans || [])
        setLoading(false)
      } catch (err) {
        if (!mounted) return
        setError((err as Error).message || "Failed to load user")
        setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [userId])

  const userQuestions = useMemo(() => allQuestions.filter((q) => q.authorId === userId), [allQuestions, userId])
  const userAnswers = useMemo(() => allAnswers.filter((a) => a.authorId === userId), [allAnswers, userId])

  const answerCountByQuestion = useMemo(() => {
    const map = new Map<string, number>()
    allAnswers.forEach((a) => {
      map.set(a.questionId, (map.get(a.questionId) || 0) + 1)
    })
    return map
  }, [allAnswers])

  const initials = useMemo(() => {
    if (!user) return ""
    return (
      user.name
        .split(" ")
        .map((n: string) => n[0] ?? "")
        .join("") || "?"
    )
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">Loading user…</Card>
        </main>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">{error ?? "User not found"}</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 flex-shrink-0">
              <AvatarImage src={""} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-foreground mb-1">{user.name}</h2>
                <p className="text-muted-foreground text-lg">{user.role}</p>
              </div>

              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <Badge variant="default" className="gap-2">
                  <Award className="h-4 w-4" />
                  {user.reputation} Reputation
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Member since 2024
                </Badge>
              </div>

              <p className="text-foreground mb-4">
                Passionate about building collective knowledge and helping others solve problems.
              </p>

              <Button>Follow</Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 space-y-3">
            <p className="text-sm text-muted-foreground">Questions Asked</p>
            <p className="text-4xl font-bold text-primary">{userQuestions.length}</p>
          </Card>
          <Card className="p-6 space-y-3">
            <p className="text-sm text-muted-foreground">Answers Given</p>
            <p className="text-4xl font-bold text-accent">{userAnswers.length}</p>
          </Card>
          <Card className="p-6 space-y-3">
            <p className="text-sm text-muted-foreground">Total Votes</p>
            <p className="text-4xl font-bold text-foreground">{userAnswers.reduce((sum, a) => sum + (a.votes || 0), 0)}</p>
          </Card>
        </div>

        {/* Tabs Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Questions */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Questions ({userQuestions.length})</h3>
              {userQuestions.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No questions asked yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {userQuestions.map((question) => {
                    const answersForQuestion = answerCountByQuestion.get(question.id!) || 0
                    return (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        author={user}
                        answerCount={answersForQuestion}
                        hasAcceptedAnswer={!!question.bestAnswerId}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Badges & Info */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h4 className="font-semibold text-foreground">Achievements</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start gap-2">
                  <Trophy className="h-4 w-4" />
                  Top Contributor
                </Badge>
                <Badge variant="outline" className="w-full justify-start gap-2">
                  <Award className="h-4 w-4" />
                  Expert
                </Badge>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h4 className="font-semibold text-foreground">Top Tags</h4>
              <div className="space-y-2">
                {["API Design", "Database", "Performance"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="w-full justify-center">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
