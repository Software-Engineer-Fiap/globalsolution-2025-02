"use client"

import { FetchService } from "./fetch-service";
import { Answer } from "./types";

class AnswerService extends FetchService {
    private static instance: AnswerService;

    private constructor() {
        super();
    }

    static getInstance(): AnswerService {
        if (!AnswerService.instance) {
            AnswerService.instance = new AnswerService();
        }
        return AnswerService.instance;
    }

    async getAnswerById(answerId: string) {
        try {
            const response = await this.fetch(`/answer/${answerId}`, {
                method: 'GET'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getAllAnswers() {
        try {
            const response = await this.fetch(`/answer/all`, {
                method: 'GET'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getAnswersForQuestion(questionId: string) {
        try {
            const response = await this.fetch(`/answer/${questionId}/all`, {
                method: 'GET'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async createAnswer(
        questionId: string,
        authorId: string,
        body: string,
    ): Promise<Answer> {
        try {
            const response = await this.fetch(`/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionId,
                    authorId,
                    body,
                }),
            });
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw error;
        }
    }
}

export const answerService = AnswerService.getInstance();
