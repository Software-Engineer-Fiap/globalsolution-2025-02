-- Tabela de usuários
CREATE TABLE global_solution_users (
    id VARCHAR2(36) PRIMARY KEY,
    email VARCHAR2(255) NOT NULL UNIQUE,
    password VARCHAR2(512) NOT NULL,
    name VARCHAR2(255),
    bio CLOB,
    reputation NUMBER DEFAULT 0,
    questionAsked NUMBER DEFAULT 0,
    tags CLOB,
    answersAsked NUMBER DEFAULT 0,
    answersGiven NUMBER DEFAULT 0
);

-- Tabela de perguntas
CREATE TABLE global_solution_questions (
    id VARCHAR2(36) PRIMARY KEY,
    authorId VARCHAR2(36),
    title VARCHAR2(1000),
    body CLOB,
    tags CLOB,
    answers CLOB,
    bestAnswerId VARCHAR2(36),
    createdAt VARCHAR2(255),
    views NUMBER DEFAULT 0
);

-- Tabela de respostas
CREATE TABLE global_solution_answers (
    id VARCHAR2(36) PRIMARY KEY,
    questionId VARCHAR2(36) NOT NULL,
    authorId VARCHAR2(36) NOT NULL,
    body CLOB,
    votes NUMBER DEFAULT 0,
    createdAt VARCHAR2(255),
    CONSTRAINT fk_answer_question FOREIGN KEY (questionId) REFERENCES global_solution_questions(id),
    CONSTRAINT fk_answer_author FOREIGN KEY (authorId) REFERENCES global_solution_users(id)
);

-- Índices úteis
CREATE INDEX idx_users_email ON global_solution_users(email);
CREATE INDEX idx_questions_author ON global_solution_questions(authorId);
CREATE INDEX idx_answers_question ON global_solution_answers(questionId);