package com.global_solution.resource;

import com.global_solution.database.DAO.QuestionDAO;
import com.global_solution.model.Question;
import com.global_solution.respository.IQuestionRepository;
import com.global_solution.respository.QuestionRepository;
import com.global_solution.service.QuestionService;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Path("question")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class QuestionResource {
	private final QuestionService questionService;

	public QuestionResource() {
		QuestionDAO dao = new QuestionDAO();
		IQuestionRepository repo = new QuestionRepository(dao);
		this.questionService = new QuestionService(repo);
	}

	@POST
	public Response createQuestion(Question question, @Context UriInfo uriInfo) {
		try {
			UUID id = question.getId() != null ? question.getId() : UUID.randomUUID();
			Question created = questionService.createQuestion(
					id,
					question.getAuthorId(),
					question.getTitle(),
					question.getBody(),
					question.getTags(),
					question.getAnswers(),
					question.getBestAnswerId(),
					question.getViews()
			);
			URI uri = uriInfo.getAbsolutePathBuilder().path(created.getId().toString()).build();
			return Response.created(uri).entity(created).build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
		}
	}

	@GET
	@Path("{id}")
	public Response getQuestion(@PathParam("id") String idStr) {
		try {
			UUID id = UUID.fromString(idStr);
			Question q = questionService.getQuestionById(id);
			return Response.ok(q).build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
		}
	}

    @GET
    @Path("all")
    public Response getAllQuestions() {
        try {
            List<Question> questions = questionService.getAllQuestions();

            return Response.ok(questions).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

	@DELETE
	@Path("{id}")
	public Response deleteQuestion(@PathParam("id") String idStr) {
		try {
			UUID id = UUID.fromString(idStr);
			questionService.deleteQuestion(id);
			return Response.noContent().build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}
}