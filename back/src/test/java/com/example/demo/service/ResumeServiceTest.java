package com.example.demo.service;

import com.example.demo.dto.EducationDto;
import com.example.demo.dto.ExperienceDto;
import com.example.demo.dto.ResumeDto;
import com.example.demo.dto.SkillDto;
import com.example.demo.model.Education;
import com.example.demo.model.Experience;
import com.example.demo.model.Resume;
import com.example.demo.model.Skill;
import com.example.demo.model.User;
import com.example.demo.repository.ResumeRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ResumeServiceTest {

    @Mock
    private ResumeRepository resumeRepository;
    
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ResumeService resumeService;

    private Resume testResume;
    private ResumeDto testResumeDto;
    private User testUser;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        // Create test data
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        
        // Create Entity objects
        testResume = new Resume();
        testResume.setId(1L);
        testResume.setTitle("Test Resume");
        testResume.setPersonalInfo("Email: test@example.com\nPhone: 123-456-7890");
        testResume.setSummary("Experienced professional with skills in software development");
        testResume.setUser(testUser);
        
        // Add educations as Set
        Set<Education> educations = new HashSet<>();
        Education education = new Education();
        education.setId(1L);
        education.setInstitution("Test University");
        education.setDegree("Bachelor of Science");
        education.setFieldOfStudy("Computer Science");
        education.setResume(testResume);
        educations.add(education);
        testResume.setEducations(educations);
        
        // Add experiences as Set
        Set<Experience> experiences = new HashSet<>();
        Experience experience = new Experience();
        experience.setId(1L);
        experience.setCompany("Test Company");
        experience.setPosition("Software Developer");
        experience.setResume(testResume);
        experiences.add(experience);
        testResume.setExperiences(experiences);
        
        // Add skills as Set
        Set<Skill> skills = new HashSet<>();
        Skill skill = new Skill();
        skill.setId(1L);
        skill.setName("Java");
        skill.setProficiencyLevel("Expert");
        skill.setResume(testResume);
        skills.add(skill);
        testResume.setSkills(skills);
        
        // Create DTO objects
        testResumeDto = new ResumeDto();
        testResumeDto.setId(1L);
        testResumeDto.setTitle("Test Resume");
        testResumeDto.setPersonalInfo("Email: test@example.com\nPhone: 123-456-7890");
        testResumeDto.setSummary("Experienced professional with skills in software development");
        testResumeDto.setUserId(1L);
        
        Set<EducationDto> educationDtos = new HashSet<>();
        EducationDto educationDto = new EducationDto();
        educationDto.setId(1L);
        educationDto.setInstitution("Test University");
        educationDto.setDegree("Bachelor of Science");
        educationDto.setFieldOfStudy("Computer Science");
        educationDto.setResumeId(1L);
        educationDtos.add(educationDto);
        testResumeDto.setEducations(educationDtos);
        
        Set<ExperienceDto> experienceDtos = new HashSet<>();
        ExperienceDto experienceDto = new ExperienceDto();
        experienceDto.setId(1L);
        experienceDto.setCompany("Test Company");
        experienceDto.setPosition("Software Developer");
        experienceDto.setResumeId(1L);
        experienceDtos.add(experienceDto);
        testResumeDto.setExperiences(experienceDtos);
        
        Set<SkillDto> skillDtos = new HashSet<>();
        SkillDto skillDto = new SkillDto();
        skillDto.setId(1L);
        skillDto.setName("Java");
        skillDto.setProficiencyLevel("Expert");
        skillDto.setResumeId(1L);
        skillDtos.add(skillDto);
        testResumeDto.setSkills(skillDtos);
        
        // Mock finding a user
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    }

    @Test
    public void testGetAllResumes() {
        // Arrange
        List<Resume> mockResumes = new ArrayList<>();
        mockResumes.add(testResume);
        
        when(resumeRepository.findAll()).thenReturn(mockResumes);
        
        // Act
        List<ResumeDto> result = resumeService.getAllResumes();
        
        // Assert
        assertEquals(1, result.size());
        assertEquals(testResumeDto.getId(), result.get(0).getId());
        assertEquals(testResumeDto.getTitle(), result.get(0).getTitle());
        verify(resumeRepository, times(1)).findAll();
    }

    @Test
    public void testGetResumeById() {
        // Arrange
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(testResume));
        
        // Act
        Optional<ResumeDto> result = resumeService.getResumeById(1L);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals(testResumeDto.getId(), result.get().getId());
        assertEquals(testResumeDto.getTitle(), result.get().getTitle());
        verify(resumeRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetResumeById_NotFound() {
        // Arrange
        when(resumeRepository.findById(999L)).thenReturn(Optional.empty());
        
        // Act
        Optional<ResumeDto> result = resumeService.getResumeById(999L);
        
        // Assert
        assertFalse(result.isPresent());
        verify(resumeRepository, times(1)).findById(999L);
    }

    @Test
    public void testGetResumesByUserId() {
        // Arrange
        List<Resume> mockResumes = new ArrayList<>();
        mockResumes.add(testResume);
        
        when(resumeRepository.findByUserId(1L)).thenReturn(mockResumes);
        
        // Act
        List<ResumeDto> result = resumeService.getResumesByUserId(1L);
        
        // Assert
        assertEquals(1, result.size());
        assertEquals(testResumeDto.getId(), result.get(0).getId());
        assertEquals(testResumeDto.getTitle(), result.get(0).getTitle());
        verify(resumeRepository, times(1)).findByUserId(1L);
    }

    @Test
    public void testCreateResume() {
        // Arrange
        when(resumeRepository.save(any(Resume.class))).thenReturn(testResume);
        
        // Act
        ResumeDto result = resumeService.createResume(testResumeDto);
        
        // Assert
        assertNotNull(result);
        assertEquals(testResumeDto.getId(), result.getId());
        assertEquals(testResumeDto.getTitle(), result.getTitle());
        verify(resumeRepository, times(1)).save(any(Resume.class));
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    public void testUpdateResume() {
        // Arrange
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(testResume));
        when(resumeRepository.save(any(Resume.class))).thenReturn(testResume);
        
        // Update the DTO
        testResumeDto.setTitle("Updated Resume Title");
        
        // Act
        Optional<ResumeDto> result = resumeService.updateResume(1L, testResumeDto);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("Updated Resume Title", result.get().getTitle());
        verify(resumeRepository, times(1)).findById(1L);
        verify(resumeRepository, times(1)).save(any(Resume.class));
    }

    @Test
    public void testDeleteResume() {
        // Arrange
        doNothing().when(resumeRepository).deleteById(1L);
        
        // Act
        resumeService.deleteResume(1L);
        
        // Assert
        verify(resumeRepository, times(1)).deleteById(1L);
    }
}
