package com.global_solution.service;

import com.global_solution.model.Answer;
import com.global_solution.model.User;
import com.global_solution.respository.IUserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class UserAuthService {
    private final IUserRepository userRepository;

    public UserAuthService(IUserRepository userAuthRepository) {
        this.userRepository = userAuthRepository;
    }

    public Boolean login(String email, String password) {
        if (this.userRepository.findUserAuthByEmail(email) == null) {
            throw new IllegalArgumentException("User with email " + email + " doesnt exists");
        }

        User user = this.userRepository.findUserAuthByEmail(email);
        String currentEmail = user.getEmail();
        String currentPassword = user.getPassword();

        return password.equals(currentPassword) && currentEmail.equals(email);
    }

    public User createUser(String email, String password, String name, String bio, Number reputation, Number questionsAsked, List<String> tags, Number answersAsked, Number answersGiven, String joinedAt) {
        if (this.userRepository.findUserAuthByEmail(email) != null) {
            throw new IllegalArgumentException("User with email " + email + " already exists");
        }

        User user = new User(email, password, name, bio, reputation, questionsAsked, tags, answersAsked, answersGiven);
        userRepository.saveUser(user);

        return user;
    }

    public void deleteUser(String email) {
        User userAuth = userRepository.findUserAuthByEmail(email);
        if (userAuth == null) {
            throw new IllegalArgumentException("User with email " + email + " does not exist");
        }
        userRepository.deleteUser(userAuth.getId());
    }

    public User getUserAuthByEmail(String email) {
        User userAuth = this.userRepository.findUserAuthByEmail(email);

        if (userAuth == null) {
            throw new IllegalArgumentException("User with email " + email + " does not exist");
        }

        return userAuth;
    }

    public User getUserAuthById(UUID Id) {
        User userAuth = this.userRepository.findUserAuthById(Id);

        if (userAuth == null) {
            throw new IllegalArgumentException("User with email " + Id + " does not exist");
        }

        return userAuth;
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(userRepository.getAllUsers());
    }
}
