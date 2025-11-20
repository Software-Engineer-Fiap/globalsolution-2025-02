package com.global_solution.respository;

import com.global_solution.model.Question;

import java.util.List;
import java.util.UUID;

public interface IQuestionRepository {
    void createQuestion(Question question);
    void deleteQuestion(UUID id);
    Question getQuestionById(UUID id);
    List<Question> getAllQuestions();
}
