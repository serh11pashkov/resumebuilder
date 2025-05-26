package com.example.demo.dto;

import com.example.demo.model.Education;
import com.example.demo.model.Experience;
import com.example.demo.model.Resume;
import com.example.demo.model.Skill;
import com.example.demo.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Utility class for converting between DTOs and Entities
 * This class helps prevent circular references that can cause StackOverflowError
 */
@Component
public class DtoConverter {
    
    private static final Logger logger = LoggerFactory.getLogger(DtoConverter.class);

    /**
     * Converts a Resume entity to a ResumeDto safely
     */
    public ResumeDto convertToDto(Resume resume) {
        if (resume == null) {
            return null;
        }        try {
            ResumeDto dto = new ResumeDto();
            dto.setId(resume.getId());
            dto.setTitle(resume.getTitle());
            dto.setPersonalInfo(resume.getPersonalInfo());
            dto.setSummary(resume.getSummary());
            
            // Set new fields
            dto.setIsPublic(resume.getIsPublic());
            dto.setTemplateName(resume.getTemplateName());
            dto.setPublicUrl(resume.getPublicUrl());
            
            // Format created date
            if (resume.getCreatedAt() != null) {
                dto.setCreatedAt(resume.getCreatedAt().toString());
            }
            
            // Set user ID safely
            if (resume.getUser() != null) {
                dto.setUserId(resume.getUser().getId());
            }
            
            // Convert collections safely
            dto.setEducations(convertEducations(resume));
            dto.setExperiences(convertExperiences(resume));
            dto.setSkills(convertSkills(resume));
            
            return dto;
        } catch (Exception e) {
            logger.error("Error converting Resume to DTO", e);
            throw new RuntimeException("Error converting Resume to DTO", e);
        }
    }
    
    /**
     * Safely converts Education collections, with proper null handling
     */
    private Set<EducationDto> convertEducations(Resume resume) {
        if (resume == null || resume.getEducations() == null) {
            return Collections.emptySet();
        }
        
        try {
            return resume.getEducations().stream()
                    .map(this::convertToEducationDto)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            logger.error("Error converting Education collection", e);
            return Collections.emptySet();
        }
    }
    
    /**
     * Safely converts Experience collections, with proper null handling
     */
    private Set<ExperienceDto> convertExperiences(Resume resume) {
        if (resume == null || resume.getExperiences() == null) {
            return Collections.emptySet();
        }
        
        try {
            return resume.getExperiences().stream()
                    .map(this::convertToExperienceDto)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            logger.error("Error converting Experience collection", e);
            return Collections.emptySet();
        }
    }
    
    /**
     * Safely converts Skill collections, with proper null handling
     */
    private Set<SkillDto> convertSkills(Resume resume) {
        if (resume == null || resume.getSkills() == null) {
            return Collections.emptySet();
        }
        
        try {
            return resume.getSkills().stream()
                    .map(this::convertToSkillDto)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            logger.error("Error converting Skill collection", e);
            return Collections.emptySet();
        }
    }
    
    /**
     * Converts an Education entity to an EducationDto
     */
    private EducationDto convertToEducationDto(Education education) {
        if (education == null) {
            return null;
        }
        
        try {
            EducationDto dto = new EducationDto();
            dto.setId(education.getId());
            dto.setInstitution(education.getInstitution());
            dto.setDegree(education.getDegree());
            dto.setFieldOfStudy(education.getFieldOfStudy());
            dto.setStartDate(education.getStartDate());
            dto.setEndDate(education.getEndDate());
            dto.setDescription(education.getDescription());
            
            // Set resume ID safely
            if (education.getResume() != null) {
                dto.setResumeId(education.getResume().getId());
            }
            
            return dto;
        } catch (Exception e) {
            logger.error("Error converting Education to DTO", e);
            return null;
        }
    }
    
    /**
     * Converts an Experience entity to an ExperienceDto
     */
    private ExperienceDto convertToExperienceDto(Experience experience) {
        if (experience == null) {
            return null;
        }
        
        try {
            ExperienceDto dto = new ExperienceDto();
            dto.setId(experience.getId());
            dto.setCompany(experience.getCompany());
            dto.setPosition(experience.getPosition());
            dto.setStartDate(experience.getStartDate());
            dto.setEndDate(experience.getEndDate());
            dto.setIsCurrent(experience.getIsCurrent());
            dto.setDescription(experience.getDescription());
            dto.setLocation(experience.getLocation());
            
            // Set resume ID safely
            if (experience.getResume() != null) {
                dto.setResumeId(experience.getResume().getId());
            }
            
            return dto;
        } catch (Exception e) {
            logger.error("Error converting Experience to DTO", e);
            return null;
        }
    }
    
    /**
     * Converts a Skill entity to a SkillDto
     */
    private SkillDto convertToSkillDto(Skill skill) {
        if (skill == null) {
            return null;
        }
        
        try {
            SkillDto dto = new SkillDto();
            dto.setId(skill.getId());
            dto.setName(skill.getName());
            dto.setProficiencyLevel(skill.getProficiencyLevel());
            
            // Set resume ID safely
            if (skill.getResume() != null) {
                dto.setResumeId(skill.getResume().getId());
            }
            
            return dto;
        } catch (Exception e) {
            logger.error("Error converting Skill to DTO", e);
            return null;
        }
    }
}
