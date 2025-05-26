package com.example.demo.config;

import com.example.demo.model.Role;
import com.example.demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Clean up duplicate roles and initialize roles
        cleanupAndInitRoles();
    }

    private void cleanupAndInitRoles() {
        try {
            // Get all roles with the name ROLE_USER
            List<Role> userRoles = roleRepository.findAll().stream()
                .filter(role -> role.getName() == Role.ERole.ROLE_USER)
                .toList();
            
            // Get all roles with the name ROLE_ADMIN
            List<Role> adminRoles = roleRepository.findAll().stream()
                .filter(role -> role.getName() == Role.ERole.ROLE_ADMIN)
                .toList();
            
            logger.info("Found {} USER roles and {} ADMIN roles", userRoles.size(), adminRoles.size());
            
            // If we have duplicates, clean them up
            if (userRoles.size() > 1) {
                logger.info("Cleaning up duplicate USER roles");
                // Keep the first one, delete the rest
                for (int i = 1; i < userRoles.size(); i++) {
                    roleRepository.delete(userRoles.get(i));
                }
            }
            
            if (adminRoles.size() > 1) {
                logger.info("Cleaning up duplicate ADMIN roles");
                // Keep the first one, delete the rest
                for (int i = 1; i < adminRoles.size(); i++) {
                    roleRepository.delete(adminRoles.get(i));
                }
            }
            
            // Create roles if they don't exist
            if (userRoles.isEmpty()) {
                logger.info("Creating USER role");
                Role userRole = new Role();
                userRole.setName(Role.ERole.ROLE_USER);
                roleRepository.save(userRole);
            }
            
            if (adminRoles.isEmpty()) {
                logger.info("Creating ADMIN role");
                Role adminRole = new Role();
                adminRole.setName(Role.ERole.ROLE_ADMIN);
                roleRepository.save(adminRole);
            }
            
            logger.info("Role initialization completed successfully");
        } catch (Exception e) {
            logger.error("Error initializing roles", e);
        }
    }
}
