package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "personal_info", columnDefinition = "TEXT")
    private String personalInfo;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Education> educations = new HashSet<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Experience> experiences = new HashSet<>();
    
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Skill> skills = new HashSet<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "is_public")
    private Boolean isPublic = false;
    
    @Column(name = "template_name")
    private String templateName = "classic";
    
    @Column(name = "public_url")
    private String publicUrl;
    
    public Resume() {
    }
    
    public Resume(String title, User user, String personalInfo, String summary, 
                 LocalDateTime createdAt, Boolean isPublic, String templateName, String publicUrl) {
        this.title = title;
        this.user = user;
        this.personalInfo = personalInfo;
        this.summary = summary;
        this.createdAt = createdAt;
        this.isPublic = isPublic;
        this.templateName = templateName;
        this.publicUrl = publicUrl;
    }
    
    public Resume(Long id, String title, User user, String personalInfo, String summary,
                 Set<Education> educations, Set<Experience> experiences, Set<Skill> skills,
                 LocalDateTime createdAt, Boolean isPublic, String templateName, String publicUrl) {
        this.id = id;
        this.title = title;
        this.user = user;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Set<Education> getEducations() {
        return educations;
    }

    public void setEducations(Set<Education> educations) {
        this.educations = educations;
    }

    public Set<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(Set<Experience> experiences) {
        this.experiences = experiences;
    }

    public Set<Skill> getSkills() {
        return skills;
    }

    public void setSkills(Set<Skill> skills) {
        this.skills = skills;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
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

    @Override
    public String toString() {
        return "Resume{" +
               "id=" + id +
               ", title='" + title + '\'' +
               ", personalInfo='" + personalInfo + '\'' +
               ", summary='" + summary + '\'' +
               ", createdAt=" + createdAt +
               ", isPublic=" + isPublic +
               ", templateName='" + templateName + '\'' +
               '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Resume resume = (Resume) o;
        return Objects.equals(id, resume.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}