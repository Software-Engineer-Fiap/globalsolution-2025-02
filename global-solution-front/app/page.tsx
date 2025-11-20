"use client"

import { useState } from "react"
import { useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { QuestionCard } from "@/components/question-card"
import { AskQuestionModal } from "@/components/ask-question-modal"
import { mockAPI } from "@/lib/mock-api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { questionService } from "@/lib/question-service"
import { answerService } from "@/lib/answer-service"

type SortOption = "newest" | "popular" | "unanswered"

export default function Home() {
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get("search") || ""

    const { questions, setQuestions, tags } = useAuth();

    const [sortBy, setSortBy] = useState<SortOption>("newest")
    const [filterTag, setFilterTag] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [authorsMap, setAuthorsMap] = useState<Record<string, any>>({})
    const [answerCounts, setAnswerCounts] = useState<Record<string, number>>({})

    let displayedQuestions = [...questions]

    // Apply search filter first
    if (searchQuery) {
        displayedQuestions = displayedQuestions.filter((q) =>
            q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.body.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }

    // Filter by tag if selected
    if (filterTag) {
        displayedQuestions = displayedQuestions.filter((q) => q.tags.includes(filterTag))
    }

    // Sort questions
    if (sortBy === "popular") {
        displayedQuestions = displayedQuestions.sort((a, b) => b.views - a.views)
    } else if (sortBy === "unanswered") {
        displayedQuestions = displayedQuestions.filter((q) => q.answers.length === 0)
    } else {
        displayedQuestions = displayedQuestions.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }

    const allTags = mockAPI.getAllTags()

    // Prefetch authors and answer counts for displayed questions to avoid calling the API during render
    useEffect(() => {
        let mounted = true

        const qIds = displayedQuestions.map((q) => q.authorId).filter(Boolean) as string[]

        if (qIds.length > 0) {
            Promise.all(qIds.map((id) => mockAPI.getUser(id))).then((users) => {
                if (!mounted) return
                const map: Record<string, any> = {}
                qIds.forEach((aid, idx) => {
                    map[aid] = users[idx]
                })
                setAuthorsMap(map)
            }).catch(() => {
                if (!mounted) return
                setAuthorsMap({})
            })
        }

        return () => { mounted = false }
        // only refetch when the set of displayed question ids or authors changes
    }, [displayedQuestions.map((q) => q.id).join(','), displayedQuestions.map((q) => q.authorId).join(',')])

    useEffect(() => {
        let mounted = true;

        const qIds = displayedQuestions.map((q) => q.id).filter(Boolean) as string[];

        if (qIds.length > 0) {
            Promise.all(qIds.map((id) => answerService.getAnswersForQuestion(id))).then((answersArrays) => {
                if (!mounted) return;
                const counts: Record<string, number> = {};
                qIds.forEach((qid, idx) => {
                    counts[qid] = answersArrays[idx]?.length ?? 0;
                });
                setAnswerCounts(counts);
            }).catch(() => {
                if (!mounted) return;
                setAnswerCounts({});
            });
        }

        return () => { mounted = false; };
    }, [displayedQuestions.map((q) => q.id).join(",")]);

    const handleQuestionCreated = (newQuestion: Question) => {
        questionService.createQuestion(newQuestion);
        setQuestions((prevQuestions) => [newQuestion, ...prevQuestions]);
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-12 space-y-4">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Collective Intelligence Platform</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Share problems, find solutions. Every question becomes collective knowledge that helps everyone grow.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <SearchBar />
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-2">All Questions</h2>
                            <p className="text-muted-foreground">
                                Browse {displayedQuestions.length} question{displayedQuestions.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-foreground">Sort by:</span>
                            <div className="flex gap-2">
                                <Button
                                    variant={sortBy === "newest" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSortBy("newest")}
                                >
                                    Newest
                                </Button>
                                <Button
                                    variant={sortBy === "popular" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSortBy("popular")}
                                >
                                    Most Views
                                </Button>
                                <Button
                                    variant={sortBy === "unanswered" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSortBy("unanswered")}
                                >
                                    Unanswered
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex  gap-6">
                    {/* Main Content */}
                    <div className="flex-10 space-y-6">
                        {/* Questions List */}
                        {displayedQuestions.length === 0 ? (
                            <Card className="p-12 text-center">
                                <p className="text-muted-foreground text-lg mb-2">No questions found</p>
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery
                                        ? "Try searching for different keywords"
                                        : "Try adjusting your filters or come back later"}
                                </p>
                            </Card>
                        ) : (
                            <div className="flex flex-col space-y-6">
                                {displayedQuestions.map((question) => {
                                    const author = authorsMap[question.authorId]
                                    const answersCount = answerCounts[question.id!] ?? 0;

                                    // while loading authors/answers, you can show a placeholder
                                    if (!author) {
                                        return (
                                            <QuestionCard
                                                key={question.id} 
                                                question={question}
                                                author={{ id: '', email: '', role: '', name: 'Loading...', bio: '', reputation: 0, questionsAsked: 0, answersGiven: 0, tags: [], joinedAt: '' }}
                                                answerCount={answersCount}
                                                hasAcceptedAnswer={!!question.bestAnswerId}
                                            />
                                        );
                                    }

                                    return (
                                        <QuestionCard
                                            key={question.id}
                                            question={question}
                                            author={author}
                                            answerCount={answersCount}
                                            hasAcceptedAnswer={!!question.bestAnswerId}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex-3 w-4xl space-y-6">
                        {/* Stats Card */}
                        <Card className="p-6">
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-foreground">Questions Stats</h3>
                                <h4 className="text-sm">Stats of questions from app</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Questions</span>
                                    <span className="font-semibold text-foreground">{questions.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Answered</span>
                                    <span className="font-semibold text-foreground">
                                        {questions.filter((q) => q.answers.length > 0).length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Unanswered</span>
                                    <span className="font-semibold text-accent">
                                        {questions.filter((q) => q.answers.length === 0).length}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Tags Section */}
                        <Card className="p-6">
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-foreground">Popular Tags</h3>
                                <h4 className="text-sm">Tags used on the questions</h4>
                            </div>
                            <div className="space-y-2">
                                {tags.slice(0, 8).map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => setFilterTag(filterTag === tag.name ? null : tag.name)}
                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${filterTag === tag.name
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted hover:bg-muted/80 text-foreground"
                                            }`}
                                    >
                                        <span className="font-medium">{tag.name}</span>
                                        <span className="ml-2 text-xs opacity-75">{tag.count}</span>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <AskQuestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onQuestionCreated={handleQuestionCreated}
            />
        </div>
    )
}