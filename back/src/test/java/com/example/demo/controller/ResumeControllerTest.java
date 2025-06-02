package com.example.demo.controller;

import com.example.demo.dto.EducationDto;
import com.example.demo.dto.ExperienceDto;
import com.example.demo.dto.ResumeDto;
import com.example.demo.dto.SkillDto;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ResumeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class ResumeControllerTest {

    @Mock
    private ResumeService resumeService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private ResumeController resumeController;

    private ResumeDto testResumeDto;
    private User testUser;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("testuser");
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        
        testResumeDto = new ResumeDto();
        testResumeDto.setId(1L);
        testResumeDto.setTitle("Test Resume");
        testResumeDto.setPersonalInfo("Email: test@example.com\nPhone: 123-456-7890");
        testResumeDto.setSummary("Experienced professional with skills in software development");
        testResumeDto.setUserId(testUser.getId());
        
        Set<EducationDto> educations = new HashSet<>();
        EducationDto education = new EducationDto();
        education.setId(1L);
        education.setInstitution("Test University");
        education.setDegree("Bachelor of Science");
        education.setFieldOfStudy("Computer Science");
        education.setResumeId(1L);
        educations.add(education);
        testResumeDto.setEducations(educations);
        
        Set<ExperienceDto> experiences = new HashSet<>();
        ExperienceDto experience = new ExperienceDto();
        experience.setId(1L);
        experience.setCompany("Test Company");
        experience.setPosition("Software Developer");
        experience.setResumeId(1L);
        experiences.add(experience);
        testResumeDto.setExperiences(experiences);
        
        Set<SkillDto> skills = new HashSet<>();
        SkillDto skill = new SkillDto();
        skill.setId(1L);
        skill.setName("Java");
        skill.setProficiencyLevel("Expert");
        skill.setResumeId(1L);
        skills.add(skill);
        testResumeDto.setSkills(skills);
    }

    @Test
    public void testGetAllResumes() {
        List<ResumeDto> mockResumes = new ArrayList<>();
        mockResumes.add(testResumeDto);
        
        when(resumeService.getAllResumes()).thenReturn(mockResumes);
        
        ResponseEntity<List<ResumeDto>> response = resumeController.getAllResumes();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockResumes, response.getBody());
        verify(resumeService, times(1)).getAllResumes();
    }

    @Test
    public void testGetResumesByUserId() {
        Long userId = 1L;
        List<ResumeDto> mockResumes = new ArrayList<>();
        mockResumes.add(testResumeDto);
        
        when(resumeService.getResumesByUserId(userId)).thenReturn(mockResumes);
        
        ResponseEntity<List<ResumeDto>> response = resumeController.getResumesByUserId(userId);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockResumes, response.getBody());
        verify(resumeService, times(1)).getResumesByUserId(userId);
    }

    @Test
    public void testGetResumeById() {
        Long resumeId = 1L;
        when(resumeService.getResumeById(resumeId)).thenReturn(Optional.of(testResumeDto));
        
        ResponseEntity<ResumeDto> response = resumeController.getResumeById(resumeId);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testResumeDto, response.getBody());
        verify(resumeService, times(1)).getResumeById(resumeId);
    }

    @Test
    public void testGetResumeById_NotFound() {
        Long resumeId = 999L;
        when(resumeService.getResumeById(resumeId)).thenReturn(Optional.empty());
        
        ResponseEntity<ResumeDto> response = resumeController.getResumeById(resumeId);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(resumeService, times(1)).getResumeById(resumeId);
    }

    @Test
    public void testCreateResume() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(resumeService.createResume(any(ResumeDto.class))).thenReturn(testResumeDto);
        
        ResponseEntity<ResumeDto> response = resumeController.createResume(testResumeDto);
        
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testResumeDto, response.getBody());
        verify(resumeService, times(1)).createResume(any(ResumeDto.class));
    }

    @Test
    public void testUpdateResume() {
        Long resumeId = 1L;
        when(resumeService.updateResume(eq(resumeId), any(ResumeDto.class)))
            .thenReturn(Optional.of(testResumeDto));
        
        ResponseEntity<ResumeDto> response = resumeController.updateResume(resumeId, testResumeDto);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testResumeDto, response.getBody());
        verify(resumeService, times(1)).updateResume(eq(resumeId), any(ResumeDto.class));
    }

    @Test
    public void testUpdateResume_NotFound() {
        Long resumeId = 999L;
        when(resumeService.updateResume(eq(resumeId), any(ResumeDto.class)))
            .thenReturn(Optional.empty());
        
        ResponseEntity<ResumeDto> response = resumeController.updateResume(resumeId, testResumeDto);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(resumeService, times(1)).updateResume(eq(resumeId), any(ResumeDto.class));
    }

    @Test
    public void testDeleteResume() {
        Long resumeId = 1L;
        doNothing().when(resumeService).deleteResume(resumeId);
        
        ResponseEntity<Void> response = resumeController.deleteResume(resumeId);
        
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(resumeService, times(1)).deleteResume(resumeId);
    }
}
