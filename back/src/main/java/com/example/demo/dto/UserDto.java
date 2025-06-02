package com.example.demo.dto;

import java.util.Set;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
    private String profilePhoto;
    
    public UserDto() {
    }
    
    public UserDto(Long id, String username, String email, Set<String> roles, String profilePhoto) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.profilePhoto = profilePhoto;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Set<String> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
    
    public String getProfilePhoto() {
        return profilePhoto;
    }
    
    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
}