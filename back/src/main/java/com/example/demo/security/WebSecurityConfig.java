package com.example.demo.security;

import com.example.demo.security.jwt.AuthEntryPointJwt;
import com.example.demo.security.services.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;    @Bean
    public com.example.demo.security.jwt.AuthTokenFilter authenticationJwtTokenFilter() {
        return new com.example.demo.security.jwt.AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }    @Bean
    public org.springframework.security.access.hierarchicalroles.RoleHierarchy roleHierarchy() {
        org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl hierarchy =
            new org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl();
        hierarchy.setHierarchy("ROLE_ADMIN > ROLE_USER");
        return hierarchy;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Create a logger for debug information
        Logger logger = LoggerFactory.getLogger(WebSecurityConfig.class);
        logger.info("Configuring security filter chain");

        http.cors(cors -> {
                    logger.info("CORS configuration enabled");
                    cors.configure(http);
                }) // Enable CORS
                .csrf(csrf -> {
                    logger.info("CSRF protection disabled for API endpoints");
                    csrf.disable();
                })
                .exceptionHandling(exception -> {
                    logger.info("Setting authentication entry point for handling exceptions");
                    exception.authenticationEntryPoint(unauthorizedHandler);
                })
                .sessionManagement(session -> {
                    logger.info("Session management policy set to STATELESS");
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })                .authorizeHttpRequests(auth -> {
                    logger.info("Configuring authorization rules");
                    auth.requestMatchers("/api/auth/**").permitAll()
                            .requestMatchers("/api/test/**").permitAll()
                            .requestMatchers("/api/debug/**").permitAll() // Allow access to debug controller
                            .requestMatchers("/api/public/**").permitAll() // Allow access to public endpoints
                            .requestMatchers("/api/public/resumes/**").permitAll() // Allow access to public resumes
                            .requestMatchers("/api/resumes/debug/**").permitAll() // Allow debug endpoints
                            .anyRequest().authenticated();
                });

        logger.info("Setting authentication provider");
        http.authenticationProvider(authenticationProvider());

        logger.info("Adding JWT token filter before UsernamePasswordAuthenticationFilter");
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        logger.info("Security filter chain configured successfully");
        return http.build();
    }
}
