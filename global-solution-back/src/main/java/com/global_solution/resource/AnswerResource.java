package com.global_solution.resource;

import com.global_solution.database.DAO.AnswerDAO;
import com.global_solution.model.Answer;
import com.global_solution.model.Question;
import com.global_solution.respository.AnswerRepository;
import com.global_solution.respository.IAnswerRepository;
import com.global_solution.service.AnswerService;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Path("answer")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AnswerResource {
	private final AnswerService answerService;
	private final IAnswerRepository answerRepository;

	public AnswerResource() {
		AnswerDAO dao = new AnswerDAO();
		this.answerRepository = new AnswerRepository(dao);
		this.answerService = new AnswerService(this.answerRepository);
	}

	@POST
	public Response createAnswer(Answer answer, @Context UriInfo uriInfo) {
		try {
			UUID questionId = answer.getQuestionId();
			UUID authorId = answer.getAuthorId();
			Answer created = answerService.createAnswer(questionId, authorId, answer.getBody());
			URI uri = uriInfo.getAbsolutePathBuilder().path(created.getId().toString()).build();
			return Response.created(uri).entity(created).build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}

	@GET
	@Path("{questionId}/{authorId}")
	public Response getAnswer(@PathParam("questionId") String questionIdStr, @PathParam("authorId") String authorIdStr) {
		try {
			UUID questionId = UUID.fromString(questionIdStr);
			UUID authorId = UUID.fromString(authorIdStr);
			Answer a = answerService.getAnswer(questionId, authorId);
			return Response.ok(a).build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}

	@GET
	@Path("all")
	public Response getAllAnswers() {
		try {
			List<Answer> answers = answerService.getAllAnswers();

			return Response.ok(answers).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}

	@GET
	@Path("{questionId}/all")
	public Response getAnswersForQuestion(@PathParam("questionId") String questionId) {
		try {
			List<Answer> answers = answerService.getAnswersForQuestion(questionId);

			return Response.ok(answers).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}

	@DELETE
	@Path("{questionId}/{authorId}")
	public Response deleteAnswer(@PathParam("questionId") String questionIdStr, @PathParam("authorId") String authorIdStr) {
		try {
			UUID questionId = UUID.fromString(questionIdStr);
			UUID authorId = UUID.fromString(authorIdStr);
			answerService.deleteAnswer(questionId, authorId);
			return Response.noContent().build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}
}