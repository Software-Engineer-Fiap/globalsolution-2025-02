"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Zap, LogOut, User } from 'lucide-react'
import { AskQuestionModal } from "./ask-question-modal"
import type { Question } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [lastCreatedQuestion, setLastCreatedQuestion] = useState<Question | null>(null)

    const handleQuestionCreated = (question: Question) => {
        setLastCreatedQuestion(question)
    }

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <>
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="p-2 bg-primary rounded-lg">
                            <Zap className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="text-xl font-bold text-foreground">Synapse</h1>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors">
                            Questions
                        </Link>
                        <Link href="/topics" className="text-sm text-foreground hover:text-primary transition-colors">
                            Topics
                        </Link>
                        <Link href="/users" className="text-sm text-foreground hover:text-primary transition-colors">
                            Users
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Button onClick={() => setIsModalOpen(true)}>Ask Question</Button>
                                <Link href="/userProfile">
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <User className="h-4 w-4" />
                                        {user.name}
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Button onClick={() => setIsModalOpen(true)}>Ask Question</Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <AskQuestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onQuestionCreated={handleQuestionCreated}
            />
        </>
    )
}
