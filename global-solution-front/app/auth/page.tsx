"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { Zap } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"

export default function AuthPage() {
    const router = useRouter()

    const { login, register, isLoading } = useAuth()

    const [isLoginMode, setIsLoginMode] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            if (isLoginMode) {
                await login(email, password)
                router.push("/userProfile")
            } else {
                await register(email, password, name);
                router.push("/userProfile");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed")
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <Card className="w-full max-w-md p-8 space-y-6">
                    <div className="space-y-2 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary rounded-lg">
                                <Zap className="h-6 w-6 text-primary-foreground" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">{isLoginMode ? "Welcome back" : "Join Synapse"}</h2>
                        <p className="text-sm text-muted-foreground">
                            {isLoginMode ? "Sign in to your account to continue" : "Create an account to start sharing knowledge"}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginMode && (
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLoginMode}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Loading..." : isLoginMode ? "Sign In" : "Create Account"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        {isLoginMode ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsLoginMode(false)}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsLoginMode(true)}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                </Card>
            </main>
        </div>
    )
}
