package com.global_solution.respository;

import com.global_solution.model.Answer;

import java.util.List;
import java.util.UUID;

public interface IAnswerRepository {
    void addAnswer(Answer answer);
    void removeAnswer(UUID Id);
    Answer getAnswerById(UUID questionId, UUID authorId);
    List<Answer> getAllAnswers();
    List<Answer> getAnswersForQuestion(String questionId);
}
