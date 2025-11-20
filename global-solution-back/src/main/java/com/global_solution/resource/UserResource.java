package com.global_solution.resource;

import com.global_solution.database.DAO.UserDAO;
import com.global_solution.model.User;
import com.global_solution.respository.IUserRepository;
import com.global_solution.respository.UserRepository;
import com.global_solution.service.UserAuthService;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Path("user")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {
	private final UserAuthService userAuthService;

	public UserResource() {
		UserDAO dao = new UserDAO();
		IUserRepository repo = new UserRepository(dao);
		this.userAuthService = new UserAuthService(repo);
	}

	@POST
	public Response createUser(User user, @Context UriInfo uriInfo) {
		try {
			User created = userAuthService.createUser(
					user.getEmail(),
					user.getPassword(),
					user.getName(),
					"",
					0,
					0,
                    Collections.singletonList(""),
					0,
					0,
					null
			);
			created.setPassword(null);
			URI uri = uriInfo.getAbsolutePathBuilder().path(created.getEmail()).build();
			return Response.created(uri).entity(created).build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
		}
	}

    @POST
    @Path("login")
	public Response loginUser(User user, @Context UriInfo uriInfo) {
		try {
			Boolean loginStatus = userAuthService.login(user.getEmail(), user.getPassword());

			return Response.ok(loginStatus).build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
		}
	}

	@GET
	@Path("{email}")
	public Response getUserByEmail(@PathParam("email") String email) {
		try {
			User user = userAuthService.getUserAuthByEmail(email);
			user.setPassword(null);
			return Response.ok(user).build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}

	@GET
	@Path("id/{id}")
	public Response getUserById(@PathParam("id") String idStr) {
		try {
			java.util.UUID id = java.util.UUID.fromString(idStr);
			User user = userAuthService.getUserAuthById(id);
			user.setPassword(null);
			return Response.ok(user).build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}

    @GET
    @Path("all")
    public Response getAllUsers() {
        try {
            List<User> users = userAuthService.getAllUsers();
            // hide passwords
            for (User user : users) {
                user.setPassword(null);
            }
            return Response.ok(users).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

	@DELETE
	@Path("{email}")
	public Response deleteUser(@PathParam("email") String email) {
		try {
			userAuthService.deleteUser(email);
			return Response.noContent().build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}

}