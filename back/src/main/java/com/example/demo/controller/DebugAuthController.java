package com.example.demo.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.services.UserDetailsImpl;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/debug-auth")
public class DebugAuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(DebugAuthController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (authentication == null) {
            response.put("authenticated", false);
            response.put("error", "No authentication found");
            return ResponseEntity.ok(response);
        }
        
        response.put("authenticated", authentication.isAuthenticated());
        response.put("principal", authentication.getPrincipal().toString());
        response.put("name", authentication.getName());
        
        if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            response.put("userId", userDetails.getId());
            response.put("username", userDetails.getUsername());
            response.put("email", userDetails.getEmail());
            
            List<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
            
            response.put("authorities", authorities);
            
            // Check if authorities contain ROLE_USER
            boolean hasUserRole = authorities.contains("ROLE_USER");
            response.put("hasUserRole", hasUserRole);
            
            // Check if authorities contain ROLE_ADMIN
            boolean hasAdminRole = authorities.contains("ROLE_ADMIN");
            response.put("hasAdminRole", hasAdminRole);
            
            // Additional role information from the database
            try {
                response.put("availableRoles", roleRepository.findAll().stream()
                    .map(r -> Map.of("id", r.getId(), "name", r.getName()))
                    .collect(Collectors.toList()));
                
                response.put("userRolesFromDb", userRepository.findById(userDetails.getId())
                    .map(user -> user.getRoles().stream()
                        .map(r -> Map.of("id", r.getId(), "name", r.getName()))
                        .collect(Collectors.toList()))
                    .orElse(null));
            } catch (Exception e) {
                response.put("roleDbError", e.getMessage());
            }
        } else {
            response.put("error", "User is not properly authenticated");
        }
        
        response.put("timestamp", new Date());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate-roles")
    public ResponseEntity<?> validateRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            response.put("error", "Not authenticated");
            return ResponseEntity.ok(response);
        }
        
        response.put("username", authentication.getName());
        
        if (authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getId();
            
            response.put("userId", userId);
            
            List<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
            
            response.put("authorities", authorities);
            
            // Test hasAuthority for USER and ADMIN roles
            boolean hasUserAuthority = authorities.contains("ROLE_USER");
            boolean hasAdminAuthority = authorities.contains("ROLE_ADMIN");
            
            response.put("hasUserAuthority", hasUserAuthority);
            response.put("hasAdminAuthority", hasAdminAuthority);
            
            // Test other authorities
            response.put("allAuthorities", authentication.getAuthorities());
        } else {
            response.put("error", "Principal is not UserDetailsImpl");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate-authorization")
    public ResponseEntity<?> validateAuthorization() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (authentication == null) {
            response.put("error", "No authentication found");
            return ResponseEntity.ok(response);
        }
        
        response.put("authenticated", authentication.isAuthenticated());
        
        // Check authorization header
        response.put("authorizationHeader", "Check server logs for this information");
        
        // Get user details
        if (authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            response.put("userId", userDetails.getId());
            response.put("username", userDetails.getUsername());
            
            // Log detailed information
            logger.info("User ID: {}", userDetails.getId());
            logger.info("Username: {}", userDetails.getUsername());
            logger.info("Authorities: {}", userDetails.getAuthorities());
        } else {
            response.put("principalType", authentication.getPrincipal().getClass().getName());
        }
        
        return ResponseEntity.ok(response);
    }
}
