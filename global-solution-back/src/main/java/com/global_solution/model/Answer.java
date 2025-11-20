package com.global_solution.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Answer {
    private UUID Id;
    private UUID questionId;
    private UUID authorId;
    private String body;
    private Number votes;
    private String createdAt;

    public Answer() {
        this.Id = UUID.randomUUID();
        this.createdAt = new Date().toString();
        this.votes = 0;
    }

    public Answer(UUID questionId, UUID authorId, String body) {
        this.Id = UUID.randomUUID();
        this.questionId = questionId;
        this.authorId = authorId;
        this.body = body;
        this.votes = 0;
        this.createdAt = new Date().toString();
    }

    public UUID getId() {
        return Id;
    }

    public UUID getQuestionId() {
        return questionId;
    }

    public UUID getAuthorId() {
        return authorId;
    }

    public String getBody() {
        return body;
    }

    public Number getVotes() {
        return votes;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setId(UUID id) {
        this.Id = id;
    }

    public void setQuestionId(UUID questionId) {
        this.questionId = questionId;
    }

    public void setAuthorId(UUID authorId) {
        this.authorId = authorId;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public void setVotes(Number votes) {
        this.votes = votes;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Answer{" +
                "Id=" + Id +
                ", questionId=" + questionId +
                ", authorId=" + authorId +
                ", body='" + body + '\'' +
                ", votes=" + votes +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }
}
