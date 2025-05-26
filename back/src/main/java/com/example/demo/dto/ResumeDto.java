package com.example.demo.dto;

import java.util.HashSet;
import java.util.Set;

public class ResumeDto {
    private Long id;
    private String title;
    private Long userId;
    private String personalInfo;
    private String summary;
    private Set<EducationDto> educations = new HashSet<>();
    private Set<ExperienceDto> experiences = new HashSet<>();
    private Set<SkillDto> skills = new HashSet<>();
    private String createdAt;  // Changed from LocalDateTime to String
    private Boolean isPublic = false;
    private String templateName = "classic";
    private String publicUrl;
    
    public ResumeDto() {
    }
    
    public ResumeDto(Long id, String title, Long userId, String personalInfo, String summary, 
                    Set<EducationDto> educations, Set<ExperienceDto> experiences, Set<SkillDto> skills, 
                    String createdAt, Boolean isPublic, String templateName, String publicUrl) {
        this.id = id;
        this.title = title;
        this.userId = userId;
        this.personalInfo = personalInfo;
        this.summary = summary;
        this.educations = educations;
        this.experiences = experiences;
        this.skills = skills;
        this.createdAt = createdAt;
        this.isPublic = isPublic;
        this.templateName = templateName;
        this.publicUrl = publicUrl;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getPersonalInfo() {
        return personalInfo;
    }
    
    public void setPersonalInfo(String personalInfo) {
        this.personalInfo = personalInfo;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
    
    public Set<EducationDto> getEducations() {
        return educations;
    }
    
    public void setEducations(Set<EducationDto> educations) {
        this.educations = educations;
    }
    
    public Set<ExperienceDto> getExperiences() {
        return experiences;
    }
    
    public void setExperiences(Set<ExperienceDto> experiences) {
        this.experiences = experiences;
    }
    
    public Set<SkillDto> getSkills() {
        return skills;
    }
    
    public void setSkills(Set<SkillDto> skills) {
        this.skills = skills;
    }
    
    public String getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    
    public Boolean getIsPublic() {
        return isPublic;
    }
    
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public String getTemplateName() {
        return templateName;
    }
    
    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }
    
    public String getPublicUrl() {
        return publicUrl;
    }
    
    public void setPublicUrl(String publicUrl) {
        this.publicUrl = publicUrl;
    }
}