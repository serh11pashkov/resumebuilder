package com.example.demo.controller;

import com.example.demo.dto.ResumeDto;
import com.example.demo.service.PdfService;
import com.example.demo.service.ResumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/public/resumes")
public class PublicResumeController {
    
    private static final Logger logger = LoggerFactory.getLogger(PublicResumeController.class);

    @Autowired
    private ResumeService resumeService;
    
    @Autowired
    private PdfService pdfService;

    @GetMapping
    public ResponseEntity<List<ResumeDto>> getAllPublicResumes() {
        logger.info("Getting all public resumes");
        try {
            List<ResumeDto> resumes = resumeService.getAllPublicResumes();
            return new ResponseEntity<>(resumes, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error getting public resumes: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{url}")
    public ResponseEntity<ResumeDto> getPublicResumeByUrl(@PathVariable String url) {
        logger.info("Getting public resume with URL: {}", url);
        try {
            Optional<ResumeDto> resume = resumeService.getPublicResumeByUrl(url);
            if (resume.isPresent()) {
                return new ResponseEntity<>(resume.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error getting public resume: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{url}/pdf")
    public ResponseEntity<byte[]> getPublicResumePdf(@PathVariable String url) {
        try {
            Optional<ResumeDto> resumeOpt = resumeService.getPublicResumeByUrl(url);
            if (!resumeOpt.isPresent()) {
                logger.debug("Public resume not found with URL: {}", url);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            ResumeDto resume = resumeOpt.get();
            
            byte[] pdfBytes = pdfService.generateResumePdf(resume);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", resume.getTitle() + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error generating PDF for public resume URL: " + url, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
