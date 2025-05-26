package com.example.demo.controller;

import com.example.demo.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/debug")
public class DebugController {
    
    private static final Logger logger = LoggerFactory.getLogger(DebugController.class);
    
    @GetMapping("/auth-status")
    public ResponseEntity<?> getAuthStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (authentication == null) {
            response.put("authenticated", false);
            response.put("message", "No authentication found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        response.put("authenticated", authentication.isAuthenticated());
        response.put("principal", authentication.getPrincipal().toString());
        response.put("name", authentication.getName());
        
        if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            response.put("userId", userDetails.getId());
            response.put("username", userDetails.getUsername());
            response.put("email", userDetails.getEmail());
            
            List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
            response.put("roles", roles);
        }
        
        response.put("authorities", authentication.getAuthorities().toString());
        response.put("timestamp", new Date());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-permissions/{userId}")
    public ResponseEntity<?> checkPermissions(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            response.put("accessAllowed", false);
            response.put("reason", "Not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ROLE_ADMIN"));
        
        Long authenticatedUserId = null;
        if (authentication.getPrincipal() instanceof UserDetailsImpl) {
            authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        }
        
        boolean accessAllowed = isAdmin || (authenticatedUserId != null && authenticatedUserId.equals(userId));
        
        response.put("accessAllowed", accessAllowed);
        response.put("authenticatedUser", username);
        response.put("authenticatedUserId", authenticatedUserId);
        response.put("targetUserId", userId);
        response.put("isAdmin", isAdmin);
        response.put("authorities", authentication.getAuthorities().toString());
        response.put("timestamp", new Date());
        
        logger.info("Permission check: user={}, userId={}, targetId={}, isAdmin={}, allowed={}", 
                username, authenticatedUserId, userId, isAdmin, accessAllowed);
        
        return ResponseEntity.ok(response);
    }
}
