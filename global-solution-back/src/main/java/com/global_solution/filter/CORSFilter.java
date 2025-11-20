package com.global_solution.filter;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import jakarta.ws.rs.core.Response;
import java.io.IOException;

@Provider
public class CORSFilter implements ContainerRequestFilter, ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
                        Response.ResponseBuilder rb = Response.ok();
                        // Set single header values to avoid duplicates
                        rb.header("Access-Control-Allow-Origin", "*");
                        rb.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                        rb.header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
                        rb.header("Access-Control-Allow-Credentials", "true");
                        requestContext.abortWith(rb.build());
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        String allowOrigin = "*";
        if (!responseContext.getHeaders().containsKey("Access-Control-Allow-Origin")) {
            responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", allowOrigin);
        } else {
            // normalize to a single allowed origin value
            responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", allowOrigin);
        }

        String allowMethods = "GET, POST, PUT, DELETE, OPTIONS";
        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods", allowMethods);

        String allowHeaders = "origin, content-type, accept, authorization";
        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", allowHeaders);

        responseContext.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
    }
}
