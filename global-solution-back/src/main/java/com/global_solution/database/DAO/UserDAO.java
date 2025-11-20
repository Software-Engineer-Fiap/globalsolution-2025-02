package com.global_solution.database.DAO;

import com.global_solution.database.DatabaseConnection;
import com.global_solution.model.User;

import java.sql.*;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class UserDAO {
    private static final String INSERT_USER =
            "INSERT INTO global_solution_users (id, email, password, name, bio, reputation, questionAsked, tags, answersAsked, answersGiven) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String DELETE_USER_BY_ID =
            "DELETE FROM global_solution_users WHERE id = ?";

    private static final String SELECT_USER_BY_EMAIL =
            "SELECT id, email, password, name, bio, reputation, questionAsked, tags, answersAsked, answersGiven FROM global_solution_users WHERE email = ?";
    
    private static final String SELECT_USER_BY_ID =
        "SELECT id, email, password, name, bio, reputation, questionAsked, tags, answersAsked, answersGiven FROM global_solution_users WHERE id = ?";

    private static final String SELECT_ALL_USERS =
            "SELECT id, email, password, name, bio, reputation, questionAsked, tags, answersAsked, answersGiven FROM global_solution_users";

    private final DatabaseConnection databaseConnection;

    public UserDAO() {
        this.databaseConnection = DatabaseConnection.getInstance();
    }

    public void createUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        String generatedId = null;
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(INSERT_USER)) {
            stmt.setString(1, user.getId() != null ? user.getId().toString() : null);
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getPassword());
            stmt.setString(4, user.getName());
            stmt.setString(5, user.getBio());
            stmt.setInt(6, user.getReputation() != null ? user.getReputation().intValue() : 0);
            stmt.setInt(7, user.getQuestionsAsked() != null ? user.getQuestionsAsked().intValue() : 0);

            // tags: store as comma-separated string
            if (user.getTags() != null && !user.getTags().isEmpty()) {
                stmt.setString(8, String.join(",", user.getTags()));
            } else {
                stmt.setString(8, null);
            }

            stmt.setInt(9, user.getAnswersAsked() != null ? user.getAnswersAsked().intValue() : 0);
            stmt.setInt(10, user.getAnswersGiven() != null ? user.getAnswersGiven().intValue() : 0);

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                generatedId = user.getId().toString();
                databaseConnection.commit();
            }
        } catch (SQLException e) {
            try {
                databaseConnection.rollback();
            } catch (SQLException rollbackEx) {
                System.err.println("Erro no rollback: " + rollbackEx.getMessage());
            }
            System.err.println("Erro ao inserir usuário: " + e.getMessage());
            throw new RuntimeException("Falha ao inserir usuário: " + e.getMessage(), e);
        }
    }

    public void deleteUser(UUID id) {
        try (Connection conn = databaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(DELETE_USER_BY_ID)) {
            stmt.setString(1, id != null ? id.toString() : null);
            stmt.executeUpdate();
            databaseConnection.commit();
        } catch (SQLException e) {
            try {
                databaseConnection.rollback();
            } catch (SQLException rollbackEx) {
                System.err.println("Erro no rollback: " + rollbackEx.getMessage());
            }
            throw new RuntimeException("Erro ao deletar carteira: " + e.getMessage(), e);
        }
    }

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(SELECT_ALL_USERS); ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar usuários: " + e.getMessage(), e);
        }
        return users;
    }

    public User findUserAuthByEmail(String email) {
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(SELECT_USER_BY_EMAIL)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        } catch (Exception e) {
            System.err.println("Erro ao buscar usuário por email: " + e.getMessage());
            throw new RuntimeException("Falha ao buscar usuário por email: " + e.getMessage(), e);
        }
        return null;
    }

    public User findUserAuthById(UUID id) {
        try (Connection conn = databaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(SELECT_USER_BY_ID)) {
            stmt.setString(1, id != null ? id.toString() : null);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        } catch (Exception e) {
            System.err.println("Erro ao buscar usuário por id: " + e.getMessage());
            throw new RuntimeException("Falha ao buscar usuário por id: " + e.getMessage(), e);
        }
        return null;
    }

    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        UUID Id = null;
        String idStr = rs.getString("id");
        if (idStr != null && !idStr.isEmpty()) {
            Id = UUID.fromString(idStr);
        }

        String email = rs.getString("email");
        String password = rs.getString("password");
        String name = rs.getString("name");
        String bio = rs.getString("bio");

        Number reputation = null;
        Object repObj = rs.getObject("reputation");
        if (repObj instanceof Number) {
            reputation = (Number) repObj;
        }

        Number questionsAsked = null;
        Object qObj = rs.getObject("questionAsked");
        if (qObj instanceof Number) {
            questionsAsked = (Number) qObj;
        }

        Number answersAsked = null;
        Object aaObj = rs.getObject("answersAsked");
        if (aaObj instanceof Number) {
            answersAsked = (Number) aaObj;
        }

        Number answersGiven = null;
        Object agObj = rs.getObject("answersGiven");
        if (agObj instanceof Number) {
            answersGiven = (Number) agObj;
        }

        List<String> tags = new ArrayList<>();
        try {
            String tagsStr = rs.getString("tags");
            if (tagsStr != null && !tagsStr.isEmpty()) {
                tags = Arrays.stream(tagsStr.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao obter tags de usuario: " + e.getMessage(), e);
        }

        User user = new User(email, password, name, bio, reputation, questionsAsked, tags, answersAsked, answersGiven);
        if (Id != null) {
            user.setId(Id);
        }

        return user;
    }

    // UUIDs are stored as VARCHAR strings in the DB; no byte conversions required
}
