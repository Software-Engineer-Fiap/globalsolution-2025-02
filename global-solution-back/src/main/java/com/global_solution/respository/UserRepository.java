package com.global_solution.respository;

import com.global_solution.database.DAO.UserDAO;
import com.global_solution.model.User;

import java.util.List;
import java.util.UUID;

public class UserRepository implements IUserRepository {
    private final UserDAO userDAO;

    public UserRepository(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public void saveUser(User user) {
        userDAO.createUser(user);
    }

    @Override
    public void deleteUser(UUID Id) {
        userDAO.deleteUser(Id);
    }

    @Override
    public List<User> getAllUsers() {
        return userDAO.getAllUsers();
    }

    @Override
    public User findUserAuthByEmail(String email) {
        return userDAO.findUserAuthByEmail(email);
    }

    @Override
    public User findUserAuthById(UUID Id) {
        return userDAO.findUserAuthById(Id);
    }
}
