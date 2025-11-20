package com.global_solution.service;

import com.global_solution.model.Answer;
import com.global_solution.respository.IAnswerRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AnswerService {
    private final IAnswerRepository answerRepository;

    public AnswerService(IAnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public Answer createAnswer(UUID questionId, UUID authorId, String body) {
        Answer answer = new Answer(questionId, authorId, body);

        answerRepository.addAnswer(answer);

        return answer;
    }

    public void deleteAnswer(UUID questionId, UUID authorId) {
        Answer answer = answerRepository.getAnswerById(questionId, authorId);

        if (answer == null) {
            throw new IllegalArgumentException("Question does not exist");
        }

        answerRepository.removeAnswer(answer.getId());
    }

    public Answer getAnswer(UUID questionId, UUID authorId) {
        Answer answer = answerRepository.getAnswerById(questionId, authorId);

        if (answer == null) {
            throw new IllegalArgumentException("Question does not exist");
        }

        return answer;
    }

    public List<Answer> getAllAnswers() {
        return new ArrayList<>(answerRepository.getAllAnswers());
    }

    public List<Answer> getAnswersForQuestion(String questionId) {
        return new ArrayList<>(answerRepository.getAnswersForQuestion(questionId));
    }
}
