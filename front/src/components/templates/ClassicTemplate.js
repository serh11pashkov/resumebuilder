import React from "react";
import { Box, Typography, Paper, Divider, Chip, Grid } from "@mui/material";

const ClassicTemplate = ({ resume, scale = 1 }) => {
  if (!resume) {
    return <Typography>No resume data available</Typography>;
  }

  // Parse personal info if it's a string
  let personalInfo;
  try {
    personalInfo =
      typeof resume.personalInfo === "string"
        ? JSON.parse(resume.personalInfo)
        : resume.personalInfo;
  } catch (error) {
    console.error("Error parsing personal info:", error);
    personalInfo = {};
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: `${scale * 800}px`,
        margin: "0 auto",
        backgroundColor: "#fff",
        fontFamily: "'Times New Roman', serif",
      }}
    >
      <Box textAlign="center" mb={2}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontFamily: "'Times New Roman', serif" }}
        >
          {resume.title}
        </Typography>
        {typeof resume.personalInfo === "string" ? (
          <Typography variant="body1" mt={1} sx={{ whiteSpace: "pre-line" }}>
            {resume.personalInfo}
          </Typography>
        ) : (
          <Box mt={1}>
            <Typography variant="body1">
              {personalInfo.firstName} {personalInfo.lastName}
            </Typography>
            <Typography variant="body2">
              {personalInfo.email} • {personalInfo.phone}
            </Typography>
            {personalInfo.address && (
              <Typography variant="body2">{personalInfo.address}</Typography>
            )}
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box mb={3}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: "'Times New Roman', serif" }}
        >
          Professional Summary
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {resume.summary}
        </Typography>
      </Box>

      {resume.experiences && resume.experiences.length > 0 && (
        <Box mb={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ fontFamily: "'Times New Roman', serif" }}
          >
            Work Experience
          </Typography>
          {resume.experiences.map((exp, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {exp.position} - {exp.company}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {exp.location} |{" "}
                {exp.startDate && new Date(exp.startDate).toLocaleDateString()}{" "}
                -
                {exp.isCurrent
                  ? " Present"
                  : exp.endDate &&
                    ` ${new Date(exp.endDate).toLocaleDateString()}`}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {exp.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {resume.educations && resume.educations.length > 0 && (
        <Box mb={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ fontFamily: "'Times New Roman', serif" }}
          >
            Education
          </Typography>
          {resume.educations.map((edu, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {edu.institution} |{" "}
                {edu.startDate && new Date(edu.startDate).toLocaleDateString()}{" "}
                -
                {edu.endDate
                  ? new Date(edu.endDate).toLocaleDateString()
                  : "Present"}
              </Typography>
              {edu.description && (
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {edu.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <Box mb={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ fontFamily: "'Times New Roman', serif" }}
          >
            Skills
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {resume.skills.map((skill, index) => (
              <Chip
                key={index}
                label={`${
                  skill.name
                } (${skill.proficiencyLevel.toLowerCase()})`}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ClassicTemplate;
