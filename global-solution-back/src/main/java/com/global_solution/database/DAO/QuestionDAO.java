package com.global_solution.database.DAO;

import com.global_solution.database.DatabaseConnection;
import com.global_solution.model.Question;

import java.sql.*;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

public class QuestionDAO {
    private static final String INSERT_QUESTION =
            "INSERT INTO global_solution_questions (id, authorId, title, body, tags, answers, bestAnswerId, createdAt, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String DELETE_QUESTION_BY_ID =
            "DELETE FROM global_solution_questions WHERE id = ?";

    private static final String SELECT_QUESTION_BY_ID =
            "SELECT id, authorId, title, body, tags, answers, bestAnswerId, createdAt, views FROM global_solution_questions WHERE id = ?";

    private static final String SELECT_ALL_QUESTIONS =
            "SELECT id, authorId, title, body, tags, answers, bestAnswerId, createdAt, views FROM global_solution_questions";

    private final DatabaseConnection databaseConnection;

    public QuestionDAO() {
        this.databaseConnection = DatabaseConnection.getInstance();
    }

    public void createQuestion(Question question) {
        if (question == null) {
            throw new IllegalArgumentException("Question cannot be null");
        }

        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(INSERT_QUESTION)) {
            stmt.setString(1, question.getId() != null ? question.getId().toString() : null);
            stmt.setString(2, question.getAuthorId() != null ? question.getAuthorId().toString() : null);
            stmt.setString(3, question.getTitle());
            stmt.setString(4, question.getBody());

            List<String> tags = question.getTags();
            if (tags != null && !tags.isEmpty()) {
                try {
                    Array sqlTags = conn.createArrayOf("VARCHAR", tags.toArray(new String[0]));
                    stmt.setArray(5, sqlTags);
                } catch (SQLException e) {
                    stmt.setString(5, String.join(",", tags));
                }
            } else {
                stmt.setString(5, null);
            }

            List<String> answers = question.getAnswers();
            if (answers != null && !answers.isEmpty()) {
                try {
                    Array sqlAnswers = conn.createArrayOf("VARCHAR", answers.toArray(new String[0]));
                    stmt.setArray(6, sqlAnswers);
                } catch (SQLException e) {
                    stmt.setString(6, String.join(",", answers));
                }
            } else {
                stmt.setString(6, null);
            }

            stmt.setString(7, question.getBestAnswerId());
            stmt.setString(8, question.getCreatedAt());
            stmt.setInt(9, question.getViews() != null ? question.getViews().intValue() : 0);

            stmt.executeUpdate();
            databaseConnection.commit();
        } catch (SQLException e) {
            try {
                databaseConnection.rollback();
            } catch (SQLException rollbackEx) {
                System.err.println("Erro no rollback: " + rollbackEx.getMessage());
            }
            throw new RuntimeException("Erro ao inserir pergunta: " + e.getMessage(), e);
        }
    }

    public void deleteQuestion(UUID id) {
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(DELETE_QUESTION_BY_ID)) {
            stmt.setString(1, id != null ? id.toString() : null);
            stmt.executeUpdate();
            databaseConnection.commit();
        } catch (SQLException e) {
            try {
                databaseConnection.rollback();
            } catch (SQLException rollbackEx) {
                System.err.println("Erro no rollback: " + rollbackEx.getMessage());
            }
            throw new RuntimeException("Erro ao deletar pergunta: " + e.getMessage(), e);
        }
    }

    public Question getQuestionById(UUID id) {
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(SELECT_QUESTION_BY_ID)) {
            stmt.setString(1, id != null ? id.toString() : null);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToQuestion(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar pergunta: " + e.getMessage(), e);
        }
        return null;
    }

    public List<Question> getAllQuestions() {
        List<Question> questions = new ArrayList<>();
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(SELECT_ALL_QUESTIONS); ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                questions.add(mapResultSetToQuestion(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar perguntas: " + e.getMessage(), e);
        }
        return questions;
    }

    private Question mapResultSetToQuestion(ResultSet rs) throws SQLException {
        String idStr = rs.getString("id");
        UUID id = idStr != null ? UUID.fromString(idStr) : null;

        String authorIdStr = rs.getString("authorId");
        UUID authorId = authorIdStr != null ? UUID.fromString(authorIdStr) : null;

        String title = rs.getString("title");
        String body = rs.getString("body");

        List<String> tags = new ArrayList<>();
        try {
            // Prefer reading as String (CLOB-safe). If null, attempt to read as SQL Array.
            String tagsStr = rs.getString("tags");
            if (tagsStr != null && !tagsStr.isEmpty()) {
                tags = Arrays.stream(tagsStr.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            } else {
                try {
                    Array sqlTags = rs.getArray("tags");
                    if (sqlTags != null) {
                        Object arr = sqlTags.getArray();
                        if (arr instanceof String[]) {
                            tags = Arrays.asList((String[]) arr);
                        } else if (arr instanceof Object[]) {
                            tags = Arrays.stream((Object[]) arr).map(Object::toString).collect(Collectors.toList());
                        }
                    }
                } catch (SQLException inner) {
                    // Fallback: leave tags empty if DB driver doesn't support getArray on this column
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar pergunta: " + e.getMessage(), e);
        }

        List<String> answers = new ArrayList<>();
        try {
            // Prefer reading as String (CLOB-safe). If null, attempt to read as SQL Array.
            String ansStr = rs.getString("answers");
            if (ansStr != null && !ansStr.isEmpty()) {
                answers = Arrays.stream(ansStr.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            } else {
                try {
                    Array sqlAnswers = rs.getArray("answers");
                    if (sqlAnswers != null) {
                        Object arr = sqlAnswers.getArray();
                        if (arr instanceof String[]) {
                            answers = Arrays.asList((String[]) arr);
                        } else if (arr instanceof Object[]) {
                            answers = Arrays.stream((Object[]) arr).map(Object::toString).collect(Collectors.toList());
                        }
                    }
                } catch (SQLException inner) {
                    // Fallback: leave answers empty if DB driver doesn't support getArray on this column
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar pergunta: " + e.getMessage(), e);
        }

        String bestAnswerId = rs.getString("bestAnswerId");
        String createdAt = rs.getString("createdAt");

        Number views = null;
        Object vObj = rs.getObject("views");
        if (vObj instanceof Number) views = (Number) vObj;

        Question question = new Question(id, authorId, title, body, tags, answers, bestAnswerId, views);
        question.setCreatedAt(createdAt);
        return question;
    }

    // UUIDs are stored as VARCHAR strings in the DB; no byte conversions required
}
