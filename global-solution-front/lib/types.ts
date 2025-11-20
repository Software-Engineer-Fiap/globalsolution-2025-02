export interface User extends AuthUser {
    name: string
    bio: string
    reputation: number
    questionsAsked: number
    answersGiven: number
    tags: string[]
    joinedAt: string
}

export interface AuthUser {
    id: string
    email: string
    role: string
}

export interface Question {
    id: string | null
    authorId: string
    title: string
    body: string
    tags: string[]
    answers: string[]
    bestAnswerId?: string
    createdAt?: string
    views: number
}

export interface Answer {
    id: string
    questionId: string
    authorId: string
    body: string
    votes: number
    createdAt: string
}

export interface Tag {
    id: string
    name: string
    description: string
    count: number
}
