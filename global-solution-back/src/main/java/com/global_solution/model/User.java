package com.global_solution.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    private UUID Id;
    private String email;
    private String password;
    private String name;
    private String bio;
    private Number reputation;
    private Number questionsAsked;
    private Number answersAsked;
    private Number answersGiven;
    private List<String> tags;

    public User() {
        this.Id = UUID.randomUUID();
    }

    public User(String email, String password, String name, String bio, Number reputation, Number questionsAsked, List<String> tags, Number answersAsked, Number answersGiven) {
        this.Id = UUID.randomUUID();
        this.email = email;
        this.password = password;
        this.name = name;
        this.bio = bio;
        this.reputation = reputation;
        this.questionsAsked = questionsAsked;
        this.tags = tags;
        this.answersAsked = answersAsked;
        this.answersGiven = answersGiven;
    }

    public UUID getId() {
        return Id;
    }

    public void setId(UUID id) {
        Id = id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getBio() {
        return bio;
    }

    public Number getReputation() {
        return reputation;
    }

    public Number getQuestionsAsked() {
        return questionsAsked;
    }

    public Number getAnswersAsked() {
        return answersAsked;
    }

    public Number getAnswersGiven() {
        return answersGiven;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setReputation(Number reputation) {
        this.reputation = reputation;
    }

    public void setQuestionsAsked(Number questionsAsked) {
        this.questionsAsked = questionsAsked;
    }

    public void setAnswersAsked(Number answersAsked) {
        this.answersAsked = answersAsked;
    }

    public void setAnswersGiven(Number answersGiven) {
        this.answersGiven = answersGiven;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
