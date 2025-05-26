package com.example.demo.dto;

public class SkillDto {
    private Long id;
    private String name;
    private String proficiencyLevel;
    private Long resumeId;
    
    public SkillDto() {
    }
    
    public SkillDto(Long id, String name, String proficiencyLevel, Long resumeId) {
        this.id = id;
        this.name = name;
        this.proficiencyLevel = proficiencyLevel;
        this.resumeId = resumeId;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getProficiencyLevel() {
        return proficiencyLevel;
    }
    
    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }
    
    public Long getResumeId() {
        return resumeId;
    }
    
    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }
}