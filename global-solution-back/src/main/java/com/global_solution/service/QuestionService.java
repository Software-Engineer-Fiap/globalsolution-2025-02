package com.global_solution.service;

import com.global_solution.model.Answer;
import com.global_solution.model.Question;
import com.global_solution.respository.IQuestionRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class QuestionService {
    private final IQuestionRepository questionRepository;

    public QuestionService(IQuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Question createQuestion(UUID Id, UUID authorId, String title, String body, List<String> tags, List<String> answers, String bestAnswerId, Number views) {
        if (this.questionRepository.getQuestionById(Id) != null) {
            throw new IllegalArgumentException("Question already exists");
        }

        Question question = new Question(Id, authorId, title, body, tags, answers, bestAnswerId, views);
        questionRepository.createQuestion(question);

        return question;
    }

    public void deleteQuestion(UUID Id) {
        Question question = questionRepository.getQuestionById(Id);

        if (question == null) {
            throw new IllegalArgumentException("Question does not exist");
        }

        questionRepository.deleteQuestion(question.getId());
    }

    public Question getQuestionById(UUID Id) {
        Question question = questionRepository.getQuestionById(Id);

        if (question == null) {
            throw new IllegalArgumentException("Question does not exist");
        }

        return question;
    }

    public List<Question> getAllQuestions() {
        return new ArrayList<>(questionRepository.getAllQuestions());
    }
}
