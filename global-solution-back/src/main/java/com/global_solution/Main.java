package com.global_solution;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import com.global_solution.filter.CORSFilter;

import java.io.IOException;
import java.net.URI;

public class Main {
    public static final String BASE_URI = "http://localhost:8080/api/";

    public static void main(String[] args) throws IOException {
        final ResourceConfig rc = new ResourceConfig().packages("com.global_solution.resource");
        rc.register(CORSFilter.class);

        try {
            rc.register(Class.forName("org.glassfish.jersey.jackson.JacksonFeature"));
        } catch (ClassNotFoundException ignored) {
            System.out.println("Jackson not found on classpath, JSON support may be limited.");
        }

        final HttpServer server = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);
        System.out.println("Server started at " + BASE_URI);
        System.out.println("Resources available: /user, /question, /answer");
        System.out.println("Press Ctrl+C to stop");

        try {
            Thread.currentThread().join();
        } catch (InterruptedException e) {
            System.out.println("Server interrupted, shutting down");
            server.shutdownNow();
        }
    }
}