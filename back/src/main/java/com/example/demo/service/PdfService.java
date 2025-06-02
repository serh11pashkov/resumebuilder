package com.example.demo.service;

import com.example.demo.dto.EducationDto;
import com.example.demo.dto.ExperienceDto;
import com.example.demo.dto.ResumeDto;
import com.example.demo.dto.SkillDto;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

@Service
public class PdfService {
    private static final BaseColor CLASSIC_PRIMARY_COLOR = new BaseColor(44, 86, 134); 
    private static final BaseColor CLASSIC_SECONDARY_COLOR = BaseColor.DARK_GRAY;
    private static final BaseColor CLASSIC_TEXT_COLOR = BaseColor.BLACK;
    
    private static final Font TITLE_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 22, Font.BOLD, CLASSIC_PRIMARY_COLOR);
    private static final Font SECTION_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD, CLASSIC_PRIMARY_COLOR);
    private static final Font SUBSECTION_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.BOLD, CLASSIC_SECONDARY_COLOR);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.NORMAL, CLASSIC_TEXT_COLOR);
    private static final Font ITALIC_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.ITALIC, CLASSIC_TEXT_COLOR);
    
    public byte[] generateResumePdf(ResumeDto resumeDto) throws DocumentException, IOException {        Document document = new Document(PageSize.A4);
        document.setMargins(60, 60, 60, 60); // Add more margin space for a cleaner look
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        // Initialize PDF writer
        PdfWriter.getInstance(document, outputStream);
        document.open();
        
        // Title - Match the centered layout of ClassicTemplate.js
        Paragraph title = new Paragraph(resumeDto.getTitle(), TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(15);
        document.add(title);
        
        String personalInfoStr = resumeDto.getPersonalInfo();
        if (personalInfoStr != null && !personalInfoStr.isEmpty() && personalInfoStr.trim().startsWith("{")) {
            try {
                org.json.JSONObject personalInfo = new org.json.JSONObject(personalInfoStr);
                
                if (personalInfo.has("firstName") || personalInfo.has("lastName")) {
                    String fullName = 
                        (personalInfo.optString("firstName", "") + " " + 
                         personalInfo.optString("lastName", "")).trim();
                    
                    if (!fullName.isEmpty()) {
                        Font nameFont = new Font(Font.FontFamily.TIMES_ROMAN, 16, Font.BOLD, CLASSIC_TEXT_COLOR);
                        Paragraph namePara = new Paragraph(fullName, nameFont);
                        namePara.setAlignment(Element.ALIGN_CENTER);
                        namePara.setSpacingAfter(5);
                        document.add(namePara);
                    }
                }
                
                Paragraph contactInfo = new Paragraph();
                contactInfo.setAlignment(Element.ALIGN_CENTER);
                
                String email = personalInfo.optString("email", "");
                String phone = personalInfo.optString("phone", "");
                if (!email.isEmpty()) {
                    contactInfo.add(new Chunk(email, NORMAL_FONT));
                    if (!phone.isEmpty()) {
                        contactInfo.add(new Chunk(" • ", NORMAL_FONT));
                        contactInfo.add(new Chunk(phone, NORMAL_FONT));
                    }
                    contactInfo.add(Chunk.NEWLINE);
                } else if (!phone.isEmpty()) {
                    contactInfo.add(new Chunk(phone, NORMAL_FONT));
                    contactInfo.add(Chunk.NEWLINE);
                }
                
                String address = personalInfo.optString("address", "");
                if (!address.isEmpty()) {
                    contactInfo.add(new Chunk(address, NORMAL_FONT));
                }
                
                contactInfo.setSpacingAfter(10);
                document.add(contactInfo);
                
            } catch (Exception e) {
                document.add(new Paragraph("Contact Information", SECTION_FONT));
                document.add(new Paragraph(personalInfoStr, NORMAL_FONT));
            }
        }
        
        LineSeparator lineSeparator = new LineSeparator();
        lineSeparator.setLineColor(CLASSIC_PRIMARY_COLOR);
        lineSeparator.setLineWidth(1.5f);
        document.add(new Chunk(lineSeparator));
        document.add(Chunk.NEWLINE);
        
        try {
            if (resumeDto.getPersonalInfo() != null && !resumeDto.getPersonalInfo().isEmpty()) {
                document.add(new Paragraph("Personal Information", SECTION_FONT));
                
                if (personalInfoStr.trim().startsWith("{")) {
                    try {
                        Paragraph personalInfo = new Paragraph();
                        personalInfo.setIndentationLeft(10);
                        org.json.JSONObject jsonObj = new org.json.JSONObject(personalInfoStr);
                        
                        if (jsonObj.has("firstName")) {
                            personalInfo.add(new Chunk("First Name: " + jsonObj.getString("firstName") + "\n", NORMAL_FONT));
                        }
                        
                        if (jsonObj.has("lastName")) {
                            personalInfo.add(new Chunk("Last Name: " + jsonObj.getString("lastName") + "\n", NORMAL_FONT));
                        }
                        
                        if (jsonObj.has("email")) {
                            personalInfo.add(new Chunk("Email: " + jsonObj.getString("email") + "\n", NORMAL_FONT));
                        }
                        
                        if (jsonObj.has("phone")) {
                            personalInfo.add(new Chunk("Phone: " + jsonObj.getString("phone") + "\n", NORMAL_FONT));
                        }
                        
                        if (jsonObj.has("address")) {
                            personalInfo.add(new Chunk("Address: " + jsonObj.getString("address") + "\n", NORMAL_FONT));
                        }
                        
                        if (jsonObj.has("photo") && !jsonObj.getString("photo").isEmpty()) {
                            personalInfo.add(new Chunk("Photo: [Included in digital version]\n", NORMAL_FONT));
                        }
                        
                        document.add(personalInfo);
                    } catch (Exception e) {
                        document.add(new Paragraph(personalInfoStr, NORMAL_FONT));
                    }
                } else {
                    document.add(new Paragraph(personalInfoStr, NORMAL_FONT));
                }
                document.add(Chunk.NEWLINE);
            }
        } catch (Exception e) {
            document.add(new Paragraph("Personal Information", SECTION_FONT));
            document.add(new Paragraph("Error processing personal information", ITALIC_FONT));
            document.add(Chunk.NEWLINE);
        }
        
        if (resumeDto.getSummary() != null && !resumeDto.getSummary().isEmpty()) {
            document.add(new Paragraph("Professional Summary", SECTION_FONT));
            Paragraph summary = new Paragraph(resumeDto.getSummary(), NORMAL_FONT);
            summary.setAlignment(Element.ALIGN_JUSTIFIED);
            summary.setIndentationLeft(10);
            summary.setSpacingAfter(15);
            document.add(summary);
        }
        if (resumeDto.getExperiences() != null && !resumeDto.getExperiences().isEmpty()) {
            document.add(new Paragraph("Work Experience", SECTION_FONT));
            
            for (ExperienceDto experience : resumeDto.getExperiences()) {
                try {
                    Paragraph positionCompany = new Paragraph();
                    positionCompany.add(new Chunk(experience.getPosition() + " - " + experience.getCompany(), SUBSECTION_FONT));
                    document.add(positionCompany);
                    
                    Paragraph details = new Paragraph();
                    if (experience.getLocation() != null && !experience.getLocation().isEmpty()) {
                        details.add(new Chunk(experience.getLocation(), ITALIC_FONT));
                        details.add(new Chunk(" | ", ITALIC_FONT));
                    }
                    
                    String startDate = formatDate(experience.getStartDate());                    String endDate = Boolean.TRUE.equals(experience.getIsCurrent()) ? 
                                    "По теперішній час" : formatDate(experience.getEndDate());
                    details.add(new Chunk(startDate + " - " + endDate, ITALIC_FONT));
                    document.add(details);
                    
                    if (experience.getDescription() != null && !experience.getDescription().isEmpty()) {
                        Paragraph desc = new Paragraph(experience.getDescription(), NORMAL_FONT);
                        desc.setSpacingBefore(5);
                        document.add(desc);
                    }
                    
                    document.add(Chunk.NEWLINE);
                } catch (Exception e) {
                }
            }
        }
        if (resumeDto.getEducations() != null && !resumeDto.getEducations().isEmpty()) {
            document.add(new Paragraph("Education", SECTION_FONT));
            
            for (EducationDto education : resumeDto.getEducations()) {
                try {                  
                    Paragraph institutionDegree = new Paragraph();
                    String degreeText = "";
                    
                    if (education.getDegree() != null && !education.getDegree().isEmpty()) {
                        degreeText = education.getDegree();
                        if (education.getFieldOfStudy() != null && !education.getFieldOfStudy().isEmpty()) {
                            degreeText += " in " + education.getFieldOfStudy();
                        }
                        institutionDegree.add(new Chunk(degreeText, SUBSECTION_FONT));
                    } else {
                        institutionDegree.add(new Chunk(education.getInstitution(), SUBSECTION_FONT));
                    }
                    
                    document.add(institutionDegree);
                    
                    Paragraph institutionPara = new Paragraph();
                    institutionPara.add(new Chunk(education.getInstitution(), ITALIC_FONT));
                    institutionPara.add(new Chunk(" | ", ITALIC_FONT));
                    
                    String startDate = formatDate(education.getStartDate());                    String endDate = education.getEndDate() != null ? 
                                    formatDate(education.getEndDate()) : "По теперішній час";
                    institutionPara.add(new Chunk(startDate + " - " + endDate, ITALIC_FONT));
                    document.add(institutionPara);
                    
                    if (education.getDescription() != null && !education.getDescription().isEmpty()) {
                        Paragraph desc = new Paragraph(education.getDescription(), NORMAL_FONT);
                        desc.setSpacingBefore(5);
                        document.add(desc);
                    }
                    
                    document.add(Chunk.NEWLINE);
                } catch (Exception e) {
                }
            }
        }
        
        if (resumeDto.getSkills() != null && !resumeDto.getSkills().isEmpty()) {
            document.add(new Paragraph("Skills", SECTION_FONT));
            
            float[] columnWidths = {1f};
            PdfPTable skillsTable = new PdfPTable(columnWidths);
            skillsTable.setWidthPercentage(100);
            skillsTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);
            skillsTable.getDefaultCell().setPadding(0);
            
            PdfPCell skillsCell = new PdfPCell();
            skillsCell.setBorder(PdfPCell.NO_BORDER);
            skillsCell.setPadding(5);
            
            Paragraph skillsPara = new Paragraph();
            skillsPara.setIndentationLeft(10);
            
            int index = 0;
            for (Object skillObj : resumeDto.getSkills()) {
               
                String skillName = "";
                String proficiencyLevel = "";
                
                if (skillObj instanceof SkillDto) {
                    SkillDto skill = (SkillDto) skillObj;
                    skillName = skill.getName();
                    proficiencyLevel = skill.getProficiencyLevel();
                } else if (skillObj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> skillMap = (Map<String, Object>) skillObj;
                    skillName = (String) skillMap.get("name");
                    proficiencyLevel = (String) skillMap.get("proficiencyLevel");
                }
                
                String skillText = skillName;
                
                if (proficiencyLevel != null && !proficiencyLevel.isEmpty()) {
                    skillText += " (" + proficiencyLevel.toLowerCase() + ")";
                }
                
                Chunk skillChunk = new Chunk(" " + skillText + " ", NORMAL_FONT);
                skillsPara.add(skillChunk);
                
                if (index < resumeDto.getSkills().size() - 1) {
                    skillsPara.add(new Chunk("   ", NORMAL_FONT));
                }
                
                if ((index + 1) % 3 == 0 && index < resumeDto.getSkills().size() - 1) {
                    skillsPara.add(Chunk.NEWLINE);
                    skillsPara.add(new Chunk(" ", NORMAL_FONT)); 
                }
                
                index++;
            }
            
            skillsCell.addElement(skillsPara);
            skillsTable.addCell(skillsCell);
            document.add(skillsTable);
        }
        
        document.close();
        return outputStream.toByteArray();
    }
    
    
    private String formatDate(String dateString) {
        if (dateString == null || dateString.isEmpty()) {
            return "";
        }
        
        try {
            
            if (dateString.matches("\\d{4}-\\d{2}-\\d{2}.*")) {
                String[] parts = dateString.split("-");
                int year = Integer.parseInt(parts[0]);
                int month = Integer.parseInt(parts[1]);
                int day = Integer.parseInt(parts[2].substring(0, 2));
                
                
                return month + "/" + day + "/" + year;
            }
            
            
            return dateString;
        } catch (Exception e) {
            
            return dateString;
        }
    }
}
