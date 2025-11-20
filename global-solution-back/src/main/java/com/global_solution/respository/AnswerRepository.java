package com.global_solution.respository;


import com.global_solution.database.DAO.AnswerDAO;
import com.global_solution.model.Answer;

import java.util.List;
import java.util.UUID;

public class AnswerRepository implements IAnswerRepository {
    private final AnswerDAO answerDAO;

    public AnswerRepository(AnswerDAO answerDAO) {
        this.answerDAO = answerDAO;
    }

    @Override
    public void addAnswer(Answer answer) {
        answerDAO.addAnswer(answer);
    }

    @Override
    public void removeAnswer(UUID Id) {
        answerDAO.removeAnswer(Id);
    }

    @Override
    public List<Answer> getAllAnswers() {
        return answerDAO.getAllAnswers();
    }

    @Override
    public Answer getAnswerById(UUID questionId, UUID authorId) {
        return answerDAO.getAnswerById(questionId, authorId);
    }

    public List<Answer> getAnswersForQuestion(String questionId) {
        return answerDAO.getAnswersForQuestion(questionId);
    }
}
