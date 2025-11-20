package com.global_solution.respository;


import com.global_solution.database.DAO.QuestionDAO;
import com.global_solution.model.Question;

import java.util.List;
import java.util.UUID;

public class QuestionRepository implements IQuestionRepository {
    private final QuestionDAO questionDAO;

    public QuestionRepository(QuestionDAO questionDAO) {
        this.questionDAO = questionDAO;
    }

    @Override
    public void createQuestion(Question question) {
        questionDAO.createQuestion(question);
    }

    @Override
    public void deleteQuestion(UUID Id) {
        questionDAO.deleteQuestion(Id);
    }

    @Override
    public List<Question> getAllQuestions() {
        return questionDAO.getAllQuestions();
    }

    @Override
    public Question getQuestionById(UUID Id) {
        return questionDAO.getQuestionById(Id);
    }
}
