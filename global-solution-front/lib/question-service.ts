"use client"

import { FetchService } from "./fetch-service";
import { Question } from "./types";

class QuestionService extends FetchService {
    private static instance: QuestionService;

    private constructor() {
        super();
    }

    static getInstance(): QuestionService {
        if (!QuestionService.instance) {
            QuestionService.instance = new QuestionService();
        }
        return QuestionService.instance;
    }

    async getQuestionById(questionId: string) {
        try {
            const response = await this.fetch(`/question/${questionId}`, {
                method: 'GET'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getAllQuestions(): Promise<Question[]> {
        try {
            const response = await this.fetch(`/question/all`, {
                method: 'GET'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async createQuestion(data: Question): Promise<Question> {
        try {
            const response = await this.fetch(`/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw error;
        }
    }
}

export const questionService = QuestionService.getInstance();
