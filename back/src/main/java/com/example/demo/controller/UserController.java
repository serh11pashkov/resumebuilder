package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(userDto -> new ResponseEntity<>(userDto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
      @PutMapping("/{id}")
    @PreAuthorize("(hasAuthority('ROLE_USER') and #id == authentication.principal.id) or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        return userService.updateUser(id, userDto)
                .map(updatedUser -> new ResponseEntity<>(updatedUser, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
      @PostMapping("/{id}/change-password")
    @PreAuthorize("(hasAuthority('ROLE_USER') and #id == authentication.principal.id) or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id, 
            @RequestBody Map<String, String> passwordData) {
        
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");
        
        if (currentPassword == null || newPassword == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Current password and new password are required");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        
        boolean success = userService.changePassword(id, currentPassword, newPassword);
        
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password updated successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update password. Current password may be incorrect.");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }    @PostMapping("/{id}/upload-photo")
    @PreAuthorize("(hasAuthority('ROLE_USER') and #id == authentication.principal.id) or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> uploadProfilePhoto(
            @PathVariable Long id, 
            @RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new HashMap<String, String>() {{
                put("message", "Please select a file to upload");
            }});
        }

        try {
            String filename = file.getOriginalFilename();
            // In a real application, you would upload the file to a storage service
            // For simplicity, we'll just return a response with a simulated URL
            
            // Generate a URL for the uploaded photo (in a real app this would come from your storage service)
            String photoUrl = "/images/profile/" + id + "/" + filename;
              // Update the user profile with the photo URL
            return userService.updateProfilePhoto(id, photoUrl)
                .map(updatedUser -> ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("url", photoUrl);
                    put("message", "Photo uploaded successfully");
                    put("user", updatedUser);
                }}))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new HashMap<String, String>() {{
                    put("message", "Failed to upload photo: " + e.getMessage());
                }});
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
