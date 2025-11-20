package com.global_solution.database.DAO;

import com.global_solution.database.DatabaseConnection;
import com.global_solution.model.Answer;

import java.sql.*;
import java.util.*;

public class AnswerDAO {
    private static final String INSERT_ANSWER =
            "INSERT INTO global_solution_answers (id, questionId, authorId, body, votes, createdAt) VALUES (?, ?, ?, ?, ?, ?)";

    private static final String DELETE_ANSWER_BY_ID =
            "DELETE FROM global_solution_answers WHERE id = ?";

    private static final String SELECT_ANSWER_BY_QUESTION_AND_AUTHOR =
            "SELECT id, questionId, authorId, body, votes, createdAt FROM global_solution_answers WHERE questionId = ? AND authorId = ?";

    private static final String SELECT_ALL_ANSWERS =
            "SELECT id, questionId, authorId, body, votes, createdAt FROM global_solution_answers";

    private static final String SELECT_ALL_ANSWERS_BY_QUESTION_ID =
            "SELECT id, questionId, authorId, body, votes, createdAt FROM global_solution_answers WHERE questionId = ?";


    private final DatabaseConnection databaseConnection;

    public AnswerDAO() {
        this.databaseConnection = DatabaseConnection.getInstance();
    }

    public void addAnswer(Answer answer) {
        if (answer == null) {
            throw new IllegalArgumentException("Answer cannot be null");
        }

        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(INSERT_ANSWER)) {
            stmt.setString(1, answer.getId() != null ? answer.getId().toString() : null);
            stmt.setString(2, answer.getQuestionId() != null ? answer.getQuestionId().toString() : null);
            stmt.setString(3, answer.getAuthorId() != null ? answer.getAuthorId().toString() : null);
            stmt.setString(4, answer.getBody());
            stmt.setInt(5, answer.getVotes() != null ? answer.getVotes().intValue() : 0);
            stmt.setString(6, answer.getCreatedAt());

            stmt.executeUpdate();

            databaseConnection.commit();
        } catch (SQLException e) {
            try {
                databaseConnection.rollback();
            } catch (SQLException rollbackEx) {
                System.err.println("Erro no rollback: " + rollbackEx.getMessage());
            }
            throw new RuntimeException("Erro ao inserir resposta: " + e.getMessage(), e);
        }
    }

    public void removeAnswer(UUID id) {
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(DELETE_ANSWER_BY_ID)) {
            stmt.setString(1, id != null ? id.toString() : null);
            stmt.executeUpdate();
            databaseConnection.commit();
        } catch (SQLException e) {
            try {
                databaseConnection.rollback();
            } catch (SQLException rollbackEx) {
                System.err.println("Erro no rollback: " + rollbackEx.getMessage());
            }
            throw new RuntimeException("Erro ao deletar resposta: " + e.getMessage(), e);
        }
    }

    public List<Answer> getAllAnswers() {
        List<Answer> answers = new ArrayList<>();
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(SELECT_ALL_ANSWERS); ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                answers.add(mapResultSetToAnswer(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar respostas: " + e.getMessage(), e);
        }
        return answers;
    }

    public List<Answer> getAnswersForQuestion(String questionId) {
        List<Answer> answers = new ArrayList<>();
        try (Connection conn = databaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_ALL_ANSWERS_BY_QUESTION_ID)) {

            stmt.setString(1, questionId != null ? questionId.toString() : null);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    answers.add(mapResultSetToAnswer(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar todas as respostas: " + e.getMessage(), e);
        }
        return answers;
    }

    public Answer getAnswerById(UUID questionId, UUID authorId) {
        try (Connection conn = databaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_ANSWER_BY_QUESTION_AND_AUTHOR)) {

            stmt.setString(1, questionId != null ? questionId.toString() : null);
            stmt.setString(2, authorId != null ? authorId.toString() : null);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToAnswer(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar resposta: " + e.getMessage(), e);
        }

        return null;
    }

    private Answer mapResultSetToAnswer(ResultSet rs) throws SQLException {
        String idStr = rs.getString("id");
        UUID id = idStr != null ? UUID.fromString(idStr) : null;

        String qStr = rs.getString("questionId");
        UUID questionId = qStr != null ? UUID.fromString(qStr) : null;

        String aStr = rs.getString("authorId");
        UUID authorId = aStr != null ? UUID.fromString(aStr) : null;

        String body = rs.getString("body");

        Number votes = null;
        Object vObj = rs.getObject("votes");
        if (vObj instanceof Number) {
            votes = (Number) vObj;
        }

        String createdAt = rs.getString("createdAt");

        Answer answer = new Answer(questionId, authorId, body);
        if (id != null) answer.setId(id);
        if (votes != null) answer.setVotes(votes);
        if (createdAt != null) answer.setCreatedAt(createdAt);

        return answer;
    }
}
