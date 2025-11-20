package com.global_solution.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Question {
    private UUID id;
    private UUID authorId;
    private String title;
    private String body;
    private List<String> tags;
    private List<String> answers;
    private String bestAnswerId;
    private String createdAt;
    private Number views;

    public Question() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now().toString();
    }

    public Question(UUID Id, UUID authorId, String title, String body, List<String> tags, List<String> answers, String bestAnswerId, Number views) {
        this.id = Id;
        this.authorId = authorId;
        this.title = title;
        this.body = body;
        this.tags = tags;
        this.answers = answers;
        this.bestAnswerId = bestAnswerId;
        this.views = views;
        this.createdAt = LocalDateTime.now().toString();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAuthorId() {
        return authorId;
    }

    public void setAuthorId(UUID authorId) {
        this.authorId = authorId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public String getBestAnswerId() {
        return bestAnswerId;
    }

    public void setBestAnswerId(String bestAnswerId) {
        this.bestAnswerId = bestAnswerId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Number getViews() {
        return views;
    }

    public void setViews(Number views) {
        this.views = views;
    }
}
