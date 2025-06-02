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
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        
        testResume = new Resume();
        testResume.setId(1L);
        testResume.setTitle("Test Resume");
        testResume.setPersonalInfo("Email: test@example.com\nPhone: 123-456-7890");
        testResume.setSummary("Experienced professional with skills in software development");
        testResume.setUser(testUser);
        
        Set<Education> educations = new HashSet<>();
        Education education = new Education();
        education.setId(1L);
        education.setInstitution("Test University");
        education.setDegree("Bachelor of Science");
        education.setFieldOfStudy("Computer Science");
        education.setResume(testResume);
        educations.add(education);
        testResume.setEducations(educations);
        
        Set<Experience> experiences = new HashSet<>();
        Experience experience = new Experience();
        experience.setId(1L);
        experience.setCompany("Test Company");
        experience.setPosition("Software Developer");
        experience.setResume(testResume);
        experiences.add(experience);
        testResume.setExperiences(experiences);
        
        Set<Skill> skills = new HashSet<>();
        Skill skill = new Skill();
        skill.setId(1L);
        skill.setName("Java");
        skill.setProficiencyLevel("Expert");
        skill.setResume(testResume);
        skills.add(skill);
        testResume.setSkills(skills);
        
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
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    }

    @Test
    public void testGetAllResumes() {
        List<Resume> mockResumes = new ArrayList<>();
        mockResumes.add(testResume);
        
        when(resumeRepository.findAll()).thenReturn(mockResumes);
        
        List<ResumeDto> result = resumeService.getAllResumes();
        
        assertEquals(1, result.size());
        assertEquals(testResumeDto.getId(), result.get(0).getId());
        assertEquals(testResumeDto.getTitle(), result.get(0).getTitle());
        verify(resumeRepository, times(1)).findAll();
    }

    @Test
    public void testGetResumeById() {
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(testResume));
        
        Optional<ResumeDto> result = resumeService.getResumeById(1L);
        
        assertTrue(result.isPresent());
        assertEquals(testResumeDto.getId(), result.get().getId());
        assertEquals(testResumeDto.getTitle(), result.get().getTitle());
        verify(resumeRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetResumeById_NotFound() {
        when(resumeRepository.findById(999L)).thenReturn(Optional.empty());
        
        Optional<ResumeDto> result = resumeService.getResumeById(999L);
        
        assertFalse(result.isPresent());
        verify(resumeRepository, times(1)).findById(999L);
    }

    @Test
    public void testGetResumesByUserId() {
        List<Resume> mockResumes = new ArrayList<>();
        mockResumes.add(testResume);
        
        when(resumeRepository.findByUserId(1L)).thenReturn(mockResumes);
        
        List<ResumeDto> result = resumeService.getResumesByUserId(1L);
        
        assertEquals(1, result.size());
        assertEquals(testResumeDto.getId(), result.get(0).getId());
        assertEquals(testResumeDto.getTitle(), result.get(0).getTitle());
        verify(resumeRepository, times(1)).findByUserId(1L);
    }

    @Test
    public void testCreateResume() {
        when(resumeRepository.save(any(Resume.class))).thenReturn(testResume);
        
        ResumeDto result = resumeService.createResume(testResumeDto);
        
        assertNotNull(result);
        assertEquals(testResumeDto.getId(), result.getId());
        assertEquals(testResumeDto.getTitle(), result.getTitle());
        verify(resumeRepository, times(1)).save(any(Resume.class));
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    public void testUpdateResume() {
        when(resumeRepository.findById(1L)).thenReturn(Optional.of(testResume));
        when(resumeRepository.save(any(Resume.class))).thenReturn(testResume);
        
        testResumeDto.setTitle("Updated Resume Title");
        
        Optional<ResumeDto> result = resumeService.updateResume(1L, testResumeDto);
        
        assertTrue(result.isPresent());
        assertEquals("Updated Resume Title", result.get().getTitle());
        verify(resumeRepository, times(1)).findById(1L);
        verify(resumeRepository, times(1)).save(any(Resume.class));
    }

    @Test
    public void testDeleteResume() {
        doNothing().when(resumeRepository).deleteById(1L);
        
        resumeService.deleteResume(1L);
        
        // 
        verify(resumeRepository, times(1)).deleteById(1L);
    }
}
