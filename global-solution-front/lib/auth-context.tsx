"use client"

import type React from "react"
import { createContext, useEffect, useState } from "react"

import type { Answer, Question, Tag, User } from "./types"

import { authService } from './auth-service';
import { questionService } from "./question-service";

interface AuthContextType {
    user: User | null
    users: User[]
    questions: Question[]
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
    awnsers: Answer[]
    tags: Tag[]
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    isLoading: boolean
}

const STORAGE_KEY = "auth:user"

type StoredAuth = {
    user: User
    expiresAt: number // timestamp em ms
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    const [users, setUsers] = useState<User[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const [awnsers, setAwnsers] = useState<Answer[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (typeof window === "undefined") return

        setIsLoading(true)
        try {
            if (!questions.length) {
                setIsLoading(true);
                questionService.getAllQuestions().then(setQuestions);
            }

            if (user) return;

            const stored = localStorage.getItem(STORAGE_KEY)
            if (!stored) return

            const parsed = JSON.parse(stored) as StoredAuth
            const now = Date.now()

            if (parsed.expiresAt > now) {
                setUser(parsed.user)
            } else {
                localStorage.removeItem(STORAGE_KEY)
            }
        } catch (error) {
            console.error("Erro ao ler auth do localStorage:", error)
            localStorage.removeItem(STORAGE_KEY)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            if (!email || !password) {
                throw new Error("Email e senha são obrigatórios")
            }

            if (await authService.login(email, password)) {
                const user = await authService.getUserByEmail(email);
                setUser(user)

                const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 horas
                const storedAuth: StoredAuth = { user, expiresAt }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(storedAuth))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true)
        try {
            if (!name || !email || !password) {
                throw new Error("Nome, email e senha são obrigatórios")
            }

            await authService.register(name, email, password);
            await login(email, password);
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY)
        }
    }

    return (
        <AuthContext.Provider value={{ user, users, questions, setQuestions, awnsers, tags, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}