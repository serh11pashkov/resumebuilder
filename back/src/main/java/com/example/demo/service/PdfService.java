package com.example.demo.service;

import com.example.demo.dto.ResumeDto;
import com.example.demo.model.Resume;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
    private static final Font SECTION_FONT = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
    private static final Font SUBSECTION_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
    private static final Font ITALIC_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC);

    public byte[] generateResumePdf(ResumeDto resumeDto) throws DocumentException, IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        PdfWriter.getInstance(document, outputStream);
        document.open();
        
        // Title
        Paragraph title = new Paragraph(resumeDto.getTitle(), TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);
        
        // Personal Info
        document.add(new Paragraph("Personal Information", SECTION_FONT));
        document.add(new Paragraph(resumeDto.getPersonalInfo(), NORMAL_FONT));
        document.add(Chunk.NEWLINE);
        
        // Summary
        document.add(new Paragraph("Summary", SECTION_FONT));
        document.add(new Paragraph(resumeDto.getSummary(), NORMAL_FONT));
        document.add(Chunk.NEWLINE);
        
        // Education
        document.add(new Paragraph("Education", SECTION_FONT));
        if (resumeDto.getEducations() != null && !resumeDto.getEducations().isEmpty()) {
            resumeDto.getEducations().forEach(education -> {
                try {
                    Paragraph institution = new Paragraph(education.getInstitution(), SUBSECTION_FONT);
                    document.add(institution);
                    
                    Paragraph degree = new Paragraph(
                            education.getDegree() + 
                            (education.getFieldOfStudy() != null ? " in " + education.getFieldOfStudy() : ""), 
                            NORMAL_FONT);
                    document.add(degree);
                    
                    if (education.getStartDate() != null && education.getEndDate() != null) {
                        Paragraph period = new Paragraph(
                                education.getStartDate() + " - " + education.getEndDate(), 
                                ITALIC_FONT);
                        document.add(period);
                    }
                    
                    if (education.getDescription() != null && !education.getDescription().isEmpty()) {
                        document.add(new Paragraph(education.getDescription(), NORMAL_FONT));
                    }
                    
                    document.add(Chunk.NEWLINE);
                } catch (Exception e) {
                    // Handle exception
                }
            });
        } else {
            document.add(new Paragraph("No education entries", ITALIC_FONT));
            document.add(Chunk.NEWLINE);
        }
        
        // Experience
        document.add(new Paragraph("Work Experience", SECTION_FONT));
        if (resumeDto.getExperiences() != null && !resumeDto.getExperiences().isEmpty()) {
            resumeDto.getExperiences().forEach(experience -> {
                try {
                    Paragraph company = new Paragraph(experience.getCompany(), SUBSECTION_FONT);
                    document.add(company);
                    
                    Paragraph position = new Paragraph(experience.getPosition(), NORMAL_FONT);
                    document.add(position);
                    
                    if (experience.getLocation() != null) {
                        Paragraph location = new Paragraph(experience.getLocation(), ITALIC_FONT);
                        document.add(location);
                    }
                    
                    String periodText;
                    if (Boolean.TRUE.equals(experience.getIsCurrent())) {
                        periodText = experience.getStartDate() + " - Present";
                    } else {
                        periodText = experience.getStartDate() + " - " + experience.getEndDate();
                    }
                    Paragraph period = new Paragraph(periodText, ITALIC_FONT);
                    document.add(period);
                    
                    if (experience.getDescription() != null && !experience.getDescription().isEmpty()) {
                        document.add(new Paragraph(experience.getDescription(), NORMAL_FONT));
                    }
                    
                    document.add(Chunk.NEWLINE);
                } catch (Exception e) {
                    // Handle exception
                }
            });
        } else {
            document.add(new Paragraph("No work experience entries", ITALIC_FONT));
            document.add(Chunk.NEWLINE);
        }
        
        // Skills
        document.add(new Paragraph("Skills", SECTION_FONT));
        if (resumeDto.getSkills() != null && !resumeDto.getSkills().isEmpty()) {
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            
            // Add header row
            PdfPCell cell1 = new PdfPCell(new Phrase("Skill", SUBSECTION_FONT));
            PdfPCell cell2 = new PdfPCell(new Phrase("Proficiency", SUBSECTION_FONT));
            table.addCell(cell1);
            table.addCell(cell2);
            
            // Add data rows
            resumeDto.getSkills().forEach(skill -> {
                table.addCell(new Phrase(skill.getName(), NORMAL_FONT));
                table.addCell(new Phrase(
                        skill.getProficiencyLevel() != null ? skill.getProficiencyLevel() : "-", 
                        NORMAL_FONT));
            });
            
            document.add(table);
        } else {
            document.add(new Paragraph("No skills listed", ITALIC_FONT));
        }
        
        document.close();
        return outputStream.toByteArray();
    }
}
