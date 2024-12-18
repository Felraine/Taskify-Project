package com.project.taskify.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/signup", "/api/users/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/all").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/tasks/user/{userId}/task").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tasks/user/{userId}").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/tasks/{id}").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/tasks/{id}").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/archive/{taskId}/user/{userId}").permitAll() // Archive task
                .requestMatchers(HttpMethod.GET, "/api/archive/user/{userId}").permitAll() // Get archived tasks
                .requestMatchers(HttpMethod.PUT, "/api/tasks/user/{userId}/task/{taskId}").permitAll() //edit task
                .requestMatchers(HttpMethod.GET, "/api/tasks/status/statuses").permitAll() //get all status
                .requestMatchers(HttpMethod.GET, "/api/tasks/status/statuses/count/{userId}").permitAll() //get all status
                .requestMatchers(HttpMethod.PUT, "/api/tasks/user/{userId}/task/{taskId}").permitAll() // Edit task
                .requestMatchers(HttpMethod.GET, "/api/tasks/status/statuses").permitAll() // Get all statuses
                .requestMatchers(HttpMethod.PUT, "/api/users/update").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/users/change-password").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/users/update-profile-picture").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/update-profile-picture/{userId}").permitAll()
                .anyRequest().authenticated()
            )
            .cors(); 

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
