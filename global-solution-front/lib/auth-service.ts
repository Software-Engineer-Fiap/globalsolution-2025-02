"use client"

import { FetchService } from "./fetch-service";

import { User } from "./types";

class AuthService extends FetchService {
    private static instance: AuthService;

    private constructor() {
        super();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(
        email: string,
        password: string
    ): Promise<boolean> {
        try {
            const response = await this.fetch('/user/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async register(
        email: string,
        password: string,
        name: string
    ): Promise<boolean> {
        try {
            const response = await this.fetch('/user/', {
                method: 'POST',
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        try {
            const response = await this.fetch(`/user/${email}`, {
                method: 'GET'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: string): Promise<User> {
        try {
            const response = await this.fetch(`/user/id/${id}`, {
                method: 'GET'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const response = await this.fetch('/user/all', {
                method: 'GET'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
}

export const authService = AuthService.getInstance();
