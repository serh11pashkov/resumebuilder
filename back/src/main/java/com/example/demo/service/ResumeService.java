package com.example.demo.service;

import com.example.demo.dto.ResumeDto;
import com.example.demo.dto.EducationDto;
import com.example.demo.dto.ExperienceDto;
import com.example.demo.dto.SkillDto;
import com.example.demo.dto.DtoConverter;
import com.example.demo.model.*;
import com.example.demo.repository.ResumeRepository;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResumeService {
    
    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DtoConverter dtoConverter;

    public List<ResumeDto> getAllResumes() {
        logger.debug("Getting all resumes");
        return resumeRepository.findAll().stream()
                .map(dtoConverter::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ResumeDto> getResumesByUserId(Long userId) {
        logger.debug("Getting resumes for user ID: {}", userId);
        return resumeRepository.findByUserId(userId).stream()
                .map(dtoConverter::convertToDto)
                .collect(Collectors.toList());
    }    public Optional<ResumeDto> getResumeById(Long id) {
        logger.debug("Getting resume by ID: {}", id);
        return resumeRepository.findById(id)
                .map(dtoConverter::convertToDto);
    }
    
    public List<ResumeDto> getAllPublicResumes() {
        logger.debug("Getting all public resumes");
        return resumeRepository.findByIsPublicTrue().stream()
                .map(dtoConverter::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<ResumeDto> getPublicResumeByUrl(String url) {
        logger.debug("Getting public resume with URL: {}", url);
        return resumeRepository.findByPublicUrlAndIsPublicTrue(url)
                .map(dtoConverter::convertToDto);
    }
    
    @Transactional
    public ResumeDto makeResumePublic(Long id, Long userId) {
        logger.debug("Making resume with ID: {} public", id);
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
                
        if (!resume.getUser().getId().equals(userId)) {
            throw new RuntimeException("User does not own this resume");
        }
        
        if (resume.getPublicUrl() == null || resume.getPublicUrl().isEmpty()) {
            String uniqueUrl = generateUniqueUrl();
            resume.setPublicUrl(uniqueUrl);
        }
        
        resume.setIsPublic(true);
        Resume savedResume = resumeRepository.save(resume);
        return dtoConverter.convertToDto(savedResume);
    }
    
    @Transactional
    public ResumeDto makeResumePrivate(Long id, Long userId) {
        logger.debug("Making resume with ID: {} private", id);
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
                
        if (!resume.getUser().getId().equals(userId)) {
            throw new RuntimeException("User does not own this resume");
        }
        
        resume.setIsPublic(false);
        Resume savedResume = resumeRepository.save(resume);
        return dtoConverter.convertToDto(savedResume);
    }
      private String generateUniqueUrl() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        String url = sb.toString();
        
        if (resumeRepository.findByPublicUrl(url).isPresent()) {
            return generateUniqueUrl();
        }
        
        return url;
    }
      @Transactional
    public ResumeDto createResume(ResumeDto resumeDto) {
        logger.info("Creating resume: {}", resumeDto.getTitle());
        try {
            Resume resume = new Resume();
            resume.setTitle(resumeDto.getTitle());
            resume.setPersonalInfo(resumeDto.getPersonalInfo());
            resume.setSummary(resumeDto.getSummary());
            
            if (resumeDto.getIsPublic() != null) {
                resume.setIsPublic(resumeDto.getIsPublic());
            } else {
                resume.setIsPublic(false);
            }
            
            if (resumeDto.getTemplateName() != null && !resumeDto.getTemplateName().isEmpty()) {
                resume.setTemplateName(resumeDto.getTemplateName());
            } else {
                resume.setTemplateName("classic");
            }
            
            if (Boolean.TRUE.equals(resume.getIsPublic()) && resumeDto.getPublicUrl() != null) {
                resume.setPublicUrl(resumeDto.getPublicUrl());
            } else if (Boolean.TRUE.equals(resume.getIsPublic())) {
                resume.setPublicUrl(generateUniqueUrl());
            }
            
            resume.setCreatedAt(LocalDateTime.now());
            
            User user = userRepository.findById(resumeDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + resumeDto.getUserId()));
            resume.setUser(user);
            
            logger.debug("Saving basic resume without collections");
            Resume savedResume = resumeRepository.saveAndFlush(resume);
            logger.debug("Resume saved with ID: {}", savedResume.getId());
            
            if (savedResume.getEducations() == null) {
                savedResume.setEducations(new HashSet<>());
            }
            if (savedResume.getExperiences() == null) {
                savedResume.setExperiences(new HashSet<>());
            }
            if (savedResume.getSkills() == null) {
                savedResume.setSkills(new HashSet<>());
            }
            
            logger.debug("Processing educations collection");
            processEducations(savedResume, resumeDto.getEducations());
            
            logger.debug("Processing experiences collection");
            processExperiences(savedResume, resumeDto.getExperiences());
            
            logger.debug("Processing skills collection");
            processSkills(savedResume, resumeDto.getSkills());
            
            logger.debug("Saving resume with collections");
            savedResume = resumeRepository.save(savedResume);
            
            
            logger.debug("Converting to DTO and returning");
            return dtoConverter.convertToDto(savedResume);
        } catch (Exception e) {
            logger.error("Error creating resume", e);
            throw new RuntimeException("Failed to create resume: " + e.getMessage(), e);
        }
    }    @Transactional
    public Optional<ResumeDto> updateResume(Long id, ResumeDto resumeDto) {
        logger.info("Updating resume with ID: {}", id);
        try {
            return resumeRepository.findById(id)
                    .map(resume -> {
                        resume.setTitle(resumeDto.getTitle());
                        resume.setPersonalInfo(resumeDto.getPersonalInfo());
                        resume.setSummary(resumeDto.getSummary());
                        
                        
                        if (resumeDto.getIsPublic() != null) {
                            resume.setIsPublic(resumeDto.getIsPublic());
                        }
                        
                        if (resumeDto.getTemplateName() != null && !resumeDto.getTemplateName().isEmpty()) {
                            resume.setTemplateName(resumeDto.getTemplateName());
                        }
                        
                        
                        if (resumeDto.getPublicUrl() != null) {
                            resume.setPublicUrl(resumeDto.getPublicUrl());
                        } else if (Boolean.TRUE.equals(resume.getIsPublic()) && 
                                  (resume.getPublicUrl() == null || resume.getPublicUrl().isEmpty())) {
                            
                            resume.setPublicUrl(generateUniqueUrl());
                        }
                        
                        resume.getEducations().clear();
                        resume.getExperiences().clear();
                        resume.getSkills().clear();
                        
                        processEducations(resume, resumeDto.getEducations());
                        processExperiences(resume, resumeDto.getExperiences());
                        processSkills(resume, resumeDto.getSkills());
                        
                        Resume updatedResume = resumeRepository.save(resume);
                        return dtoConverter.convertToDto(updatedResume);
                    });
        } catch (Exception e) {
            logger.error("Error updating resume with ID: " + id, e);
            throw e;
        }
    }

    @Transactional
    public void deleteResume(Long id) {
        logger.info("Deleting resume with ID: {}", id);
        resumeRepository.deleteById(id);
    }
    
    private void processEducations(Resume resume, Set<EducationDto> educationDtos) {
        if (educationDtos != null) {
            Set<Education> educations = educationDtos.stream()
                    .map(eduDto -> {
                        Education education = new Education();
                        education.setResume(resume);
                        education.setInstitution(eduDto.getInstitution());
                        education.setDegree(eduDto.getDegree());
                        education.setFieldOfStudy(eduDto.getFieldOfStudy());
                        education.setStartDate(eduDto.getStartDate());
                        education.setEndDate(eduDto.getEndDate());
                        education.setDescription(eduDto.getDescription());
                        return education;
                    }).collect(Collectors.toSet());
            resume.getEducations().addAll(educations);
        }
    }
    
    private void processExperiences(Resume resume, Set<ExperienceDto> experienceDtos) {
        if (experienceDtos != null) {
            Set<Experience> experiences = experienceDtos.stream()
                    .map(expDto -> {
                        Experience experience = new Experience();
                        experience.setResume(resume);
                        experience.setCompany(expDto.getCompany());
                        experience.setPosition(expDto.getPosition());
                        experience.setStartDate(expDto.getStartDate());
                        experience.setEndDate(expDto.getEndDate());
                        experience.setIsCurrent(expDto.getIsCurrent());
                        experience.setDescription(expDto.getDescription());
                        experience.setLocation(expDto.getLocation());
                        return experience;
                    }).collect(Collectors.toSet());
            resume.getExperiences().addAll(experiences);
        }
    }
    
    private void processSkills(Resume resume, Set<SkillDto> skillDtos) {
        if (skillDtos != null) {
            Set<Skill> skills = skillDtos.stream()
                    .map(skillDto -> {
                        Skill skill = new Skill();
                        skill.setResume(resume);
                        skill.setName(skillDto.getName());
                        skill.setProficiencyLevel(skillDto.getProficiencyLevel());
                        return skill;
                    }).collect(Collectors.toSet());            resume.getSkills().addAll(skills);
        }
    }
}
