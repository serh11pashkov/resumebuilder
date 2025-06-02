package com.example.demo.controller;

import com.example.demo.dto.ResumeDto;
import com.example.demo.security.services.UserDetailsImpl;
import com.example.demo.service.PdfService;
import com.example.demo.service.ResumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
    

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/resumes")
public class ResumeController {
    
    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);

    @Autowired
    private ResumeService resumeService;
    
    @Autowired
    private PdfService pdfService;    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ResumeDto>> getAllResumes() {
        List<ResumeDto> resumes = resumeService.getAllResumes();
        return new ResponseEntity<>(resumes, HttpStatus.OK);
    }
      @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ResumeDto>> getResumesByUserId(@PathVariable Long userId) {
        logger.info("Getting resumes for user ID: {}", userId);
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("No authenticated user found when accessing resumes for user ID: {}", userId);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            String username = authentication.getName();
            logger.info("Authenticated user: {} is accessing resumes for user ID: {}", username, userId);
            
            logger.info("User '{}' authorities: {}", username, authentication.getAuthorities());
            
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().contains("ROLE_ADMIN"));
            logger.info("Is admin role present: {}", isAdmin);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            logger.info("Authenticated user ID: {}", authenticatedUserId);
            
            if (isAdmin || authenticatedUserId.equals(userId)) {
                List<ResumeDto> resumes = resumeService.getResumesByUserId(userId);
                logger.info("Found {} resumes for user ID: {}", resumes.size(), userId);
                return new ResponseEntity<>(resumes, HttpStatus.OK);
            } else {
                logger.warn("User '{}' (ID: {}) attempted to access resumes of user ID: {}", 
                        username, authenticatedUserId, userId);
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            logger.error("Error getting resumes for user ID: " + userId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
      @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResumeDto> getResumeById(@PathVariable Long id) {
        logger.debug("Getting resume by ID: {}", id);
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("No authenticated user found when accessing resume ID: {}", id);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
              String username = authentication.getName();
            logger.debug("Authenticated user: {} is accessing resume ID: {}", username, id);
            
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().contains("ADMIN"));
            
            Optional<ResumeDto> resumeOpt = resumeService.getResumeById(id);
            if (!resumeOpt.isPresent()) {
                logger.debug("Resume not found with ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            ResumeDto resume = resumeOpt.get();
            
            if (!isAdmin) {
                Long authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
                if (!authenticatedUserId.equals(resume.getUserId())) {
                    logger.warn("User {} (ID: {}) attempted to access resume ID: {} belonging to user ID: {}", 
                            username, authenticatedUserId, id, resume.getUserId());
                    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
                }
            } else {
                logger.info("Admin user {} is accessing resume ID: {} belonging to user ID: {}", 
                        username, id, resume.getUserId());
            }
            
            logger.debug("Resume found with ID: {}", id);
            return new ResponseEntity<>(resume, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error getting resume with ID: " + id, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/test-auth")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> testAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            logger.info("Authentication test successful for user: {}", authentication.getName());
            logger.info("User authorities: {}", authentication.getAuthorities());
            
            Map<String, String> response = Map.of(
                "message", "Authentication successful",
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities().toString()
            );
            
            return ResponseEntity.ok(response);
        } else {
            logger.warn("Authentication test failed - no authentication found");
            
            Map<String, String> response = Map.of(
                "message", "Not authenticated"
            );
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
      @PostMapping
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResumeDto> createResume(@RequestBody ResumeDto resumeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("No authenticated user found when creating a resume");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        String username = authentication.getName();
        logger.info("User '{}' is attempting to create a resume", username);        logger.info("User authorities: {}", authentication.getAuthorities());
        logger.info("Resume data: {}", resumeDto);
        
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ADMIN"));
        
        logger.info("Is user admin: {}", isAdmin);
        
        if (!isAdmin) {
            Long authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
            
            if (resumeDto.getUserId() == null || !authenticatedUserId.equals(resumeDto.getUserId())) {
                logger.info("Setting resume ownership to authenticated user ID: {}", authenticatedUserId);
                resumeDto.setUserId(authenticatedUserId);
            }
        } else {
            if (resumeDto.getUserId() == null) {
                Long adminUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
                logger.info("Admin user didn't specify a userId, setting to admin's ID: {}", adminUserId);
                resumeDto.setUserId(adminUserId);
            } else {
                logger.info("Admin user {} is creating a resume for user ID: {}", 
                        username, resumeDto.getUserId());
            }
        }
        
        try {
            ResumeDto createdResume = resumeService.createResume(resumeDto);
            logger.info("Resume created successfully with ID: {}", createdResume.getId());
            return new ResponseEntity<>(createdResume, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating resume", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
      @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResumeDto> updateResume(@PathVariable Long id, @RequestBody ResumeDto resumeDto) {
        logger.debug("Updating resume with ID: {}", id);
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("No authenticated user found when updating resume ID: {}", id);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            String username = authentication.getName();
            logger.debug("Authenticated user: {} is updating resume ID: {}", username, id);
            
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            Optional<ResumeDto> existingResumeOpt = resumeService.getResumeById(id);
            if (!existingResumeOpt.isPresent()) {
                logger.debug("Resume not found with ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            ResumeDto existingResume = existingResumeOpt.get();
            
            if (!isAdmin) {
                Long authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
                if (!authenticatedUserId.equals(existingResume.getUserId())) {
                    logger.warn("User {} (ID: {}) attempted to update resume ID: {} belonging to user ID: {}", 
                            username, authenticatedUserId, id, existingResume.getUserId());
                    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
                }
            } else {
                logger.info("Admin user {} is updating resume ID: {} belonging to user ID: {}", 
                        username, id, existingResume.getUserId());
            }
            
            Optional<ResumeDto> updatedResume = resumeService.updateResume(id, resumeDto);
            return updatedResume
                    .map(resume -> {
                        logger.debug("Resume updated successfully with ID: {}", id);
                        return new ResponseEntity<>(resume, HttpStatus.OK);
                    })
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            logger.error("Error updating resume with ID: " + id, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
      @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        logger.debug("Deleting resume with ID: {}", id);
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("No authenticated user found when deleting resume ID: {}", id);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            String username = authentication.getName();
            logger.debug("Authenticated user: {} is deleting resume ID: {}", username, id);
            
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            Optional<ResumeDto> existingResumeOpt = resumeService.getResumeById(id);
            if (!existingResumeOpt.isPresent()) {
                logger.debug("Resume not found with ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            ResumeDto existingResume = existingResumeOpt.get();
            
            if (!isAdmin) {
                Long authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
                if (!authenticatedUserId.equals(existingResume.getUserId())) {
                    logger.warn("User {} (ID: {}) attempted to delete resume ID: {} belonging to user ID: {}", 
                            username, authenticatedUserId, id, existingResume.getUserId());
                    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
                }
            } else {
                logger.info("Admin user {} is deleting resume ID: {} belonging to user ID: {}", 
                        username, id, existingResume.getUserId());
            }
            
            resumeService.deleteResume(id);
            logger.debug("Resume with ID: {} deleted successfully", id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            logger.error("Error deleting resume with ID: " + id, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<byte[]> getResumePdf(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("No authenticated user found when downloading PDF for resume ID: {}", id);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            String username = authentication.getName();
            logger.debug("Authenticated user: {} is downloading PDF for resume ID: {}", username, id);
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().contains("ADMIN"));
            
            Optional<ResumeDto> resumeOpt = resumeService.getResumeById(id);
            if (!resumeOpt.isPresent()) {
                logger.debug("Resume not found with ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            ResumeDto resume = resumeOpt.get();
            
            if (!isAdmin) {
                Long authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
                if (!authenticatedUserId.equals(resume.getUserId())) {
                    logger.warn("User {} (ID: {}) attempted to download PDF for resume ID: {} belonging to user ID: {}", 
                            username, authenticatedUserId, id, resume.getUserId());
                    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
                }
            } else {
                logger.info("Admin user {} is downloading PDF for resume ID: {} belonging to user ID: {}", 
                        username, id, resume.getUserId());
            }
            
            byte[] pdfBytes = pdfService.generateResumePdf(resume);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", resume.getTitle() + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            return new ResponseEntity<byte[]>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error generating PDF for resume ID: " + id, e);
            return new ResponseEntity<byte[]>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/debug/check-permissions/{userId}")
    public ResponseEntity<?> checkPermissions(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "accessAllowed", false,
                        "reason", "Not authenticated",
                        "timestamp", new java.util.Date()
                    ));
        }
        
        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ROLE_ADMIN"));
        
        Long authenticatedUserId = null;
        if (authentication.getPrincipal() instanceof UserDetailsImpl) {
            authenticatedUserId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        }
        
        boolean accessAllowed = isAdmin || (authenticatedUserId != null && authenticatedUserId.equals(userId));
        
        Map<String, Object> response = new HashMap<>();
        response.put("accessAllowed", accessAllowed);
        response.put("authenticatedUser", username);
        response.put("authenticatedUserId", authenticatedUserId);
        response.put("targetUserId", userId);
        response.put("isAdmin", isAdmin);
        response.put("authorities", authentication.getAuthorities().toString());
        response.put("timestamp", new java.util.Date());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/debug/user-roles")
    public ResponseEntity<?> getUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "error", "No authentication found",
                        "timestamp", new java.util.Date()
                    ));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("name", authentication.getName());
        response.put("authenticated", authentication.isAuthenticated());
        response.put("principal", authentication.getPrincipal().toString());
        response.put("authorities", authentication.getAuthorities().toString());
        
        if (authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            response.put("userId", userDetails.getId());
            response.put("username", userDetails.getUsername());
            response.put("email", userDetails.getEmail());
        }
        
        response.put("timestamp", new java.util.Date());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/debug/test-create")
    public ResponseEntity<?> testCreateResume(@RequestBody ResumeDto resumeDto) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                result.put("error", "Not authenticated");
                return new ResponseEntity<>(result, HttpStatus.UNAUTHORIZED);
            }
            
            String username = authentication.getName();
            result.put("username", username);
            result.put("originalResumeData", resumeDto);
            
            List<String> roles = authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList());
            result.put("roles", roles);
            
            boolean isAdmin = roles.stream().anyMatch(r -> r.contains("ADMIN"));
            result.put("isAdmin", isAdmin);
            
            Long authenticatedUserId = null;
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                authenticatedUserId = userDetails.getId();
                result.put("authenticatedUserId", authenticatedUserId);
            } else {
                result.put("error", "Principal is not UserDetailsImpl");
                return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
            Long originalUserId = resumeDto.getUserId();
            result.put("originalUserId", originalUserId);
            
            if (!isAdmin && (originalUserId == null || !originalUserId.equals(authenticatedUserId))) {
                resumeDto.setUserId(authenticatedUserId);
                result.put("userIdUpdated", true);
                result.put("newUserId", authenticatedUserId);
            } else {
                result.put("userIdUpdated", false);
            }
            
            result.put("message", "This is a debug endpoint that doesn't actually create a resume");
            result.put("resumeDataAfterChecks", resumeDto);
            
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("stackTrace", e.getStackTrace());
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/debug/check-resume-permissions/{id}")
    public ResponseEntity<?> checkResumePermissions(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                result.put("accessAllowed", false);
                result.put("reason", "Not authenticated");
                return new ResponseEntity<>(result, HttpStatus.UNAUTHORIZED);
            }
            
            String username = authentication.getName();
            result.put("username", username);
            
            List<String> authorities = authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList());
            result.put("authorities", authorities);
            
            boolean isAdmin = authorities.stream().anyMatch(a -> a.contains("ADMIN"));
            result.put("isAdmin", isAdmin);
            
            Long authenticatedUserId = null;
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                authenticatedUserId = userDetails.getId();
                result.put("authenticatedUserId", authenticatedUserId);
            } else {
                result.put("accessAllowed", false);
                result.put("reason", "Principal is not UserDetailsImpl");
                return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
            Optional<ResumeDto> resumeOpt = resumeService.getResumeById(id);
            if (!resumeOpt.isPresent()) {
                result.put("accessAllowed", false);
                result.put("reason", "Resume not found");
                return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
            }
            
            ResumeDto resume = resumeOpt.get();
            result.put("resumeUserId", resume.getUserId());
            result.put("resumeTitle", resume.getTitle());
            result.put("resumeIsPublic", resume.getIsPublic());
            
            boolean accessAllowed = isAdmin || 
                                   authenticatedUserId.equals(resume.getUserId()) || 
                                   Boolean.TRUE.equals(resume.getIsPublic());
            
            result.put("accessAllowed", accessAllowed);
            if (!accessAllowed) {
                result.put("reason", "User does not have permission to access this resume");
            }
            
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            result.put("accessAllowed", false);
            result.put("error", e.getMessage());
            result.put("stackTrace", e.getStackTrace());
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
