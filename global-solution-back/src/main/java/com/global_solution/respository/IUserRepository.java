package com.global_solution.respository;

import com.global_solution.model.User;

import java.util.List;
import java.util.UUID;

public interface IUserRepository {
    void saveUser(User user);
    void deleteUser(UUID id);
    User findUserAuthByEmail(String email);
    User findUserAuthById(UUID Id);
    List<User> getAllUsers();
}
