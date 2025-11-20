import type { User, Question, Answer, Tag } from "./types"

import { authService } from './auth-service';
import { questionService } from "./question-service"
import { answerService } from "./answer-service"

export const mockAPI = {
    // Users
    getUser: (userId: string): Promise<User | undefined> => {
        return authService.getUserById(userId);
    },

    getAllUsers: (): Promise<User[]> => {
        return authService.getAllUsers();
    },

    // Questions
    getQuestion: (questionId: string): Promise<Question | undefined> => {
        return questionService.getQuestionById(questionId);
    },

    getAllQuestions: (): Promise<Question[]> => {
        return questionService.getAllQuestions();
    },

    searchQuestions: (query: string): Promise<Question[]> => {
        const lowerQuery = query.toLowerCase();
        return questionService.getAllQuestions().then((questions) => {
            return questions.filter(
                (q: Question) =>
                    q.title.toLowerCase().includes(lowerQuery) ||
                    q.body.toLowerCase().includes(lowerQuery) ||
                    q.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
            );
        })
    },

    createQuestion: (data: {
        title: string
        body: string
        tags: string[]
        authorId: string
    }): Promise<Question> => {
        const newQuestion: Question = {
            id: null,
            authorId: data.authorId,
            title: data.title,
            body: data.body,
            tags: data.tags,
            answers: [],
            bestAnswerId: '',
            views: 0,
        }

        return questionService.createQuestion(newQuestion);
    },

    // Answers
    getAnswer: (answerId: string): Promise<Answer> => {
        return answerService.getAnswerById(answerId);
    },

    // Get all answers (new method)
    getAllAnswers: (): Promise<Answer[]> => {
        return answerService.getAllAnswers()
    },

    getAnswersForQuestion: (questionId: string): Promise<Answer[]> => {
        return answerService.getAnswersForQuestion(questionId);
    },

    addAnswer: (data: {
        questionId: string
        authorId: string
        body: string
    }): Promise<Answer> => {
        return answerService.createAnswer(data.questionId, data.authorId, data.body);
    },

    // Tags
    getAllTags: (): Tag[] => {
        return [
            {
                id: '1',
                name: 'javascript',
                description: 'Questions about JavaScript programming language',
                count: 1
            },
            {
                id: '2',
                name: 'typescript',
                description: 'Questions about TypeScript programming language',
                count: 1
            },
            {
                id: '3',
                name: 'react',
                description: 'Questions about React framework',
                count: 1
            },
            {
                id: '4',
                name: 'java',
                description: 'Questions about java programming language',
                count: 1
            }
        ];
    },

    getTag: (tagId: string): Tag | undefined => {
        return undefined
    },
}
