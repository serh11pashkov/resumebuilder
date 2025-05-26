import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  Avatar,
} from "@mui/material";

const ModernTemplate = ({ resume, scale = 1 }) => {
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

  // Generate initials for avatar
  const getInitials = () => {
    if (personalInfo.firstName && personalInfo.lastName) {
      return `${personalInfo.firstName.charAt(0)}${personalInfo.lastName.charAt(
        0
      )}`;
    }
    return "CV";
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: `${scale * 800}px`,
        margin: "0 auto",
        backgroundColor: "#fff",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            backgroundColor: "#f5f5f5",
            p: 2,
            borderRadius: 1,
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {resume.title.split(" ")[0]}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {resume.personalInfo}
            </Typography>
          </Box>

          {resume.skills && resume.skills.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Skills
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {resume.skills.map((skill, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {skill.name}
                    </Typography>
                    <Box
                      sx={{
                        height: 6,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 3,
                        mt: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          backgroundColor:
                            skill.proficiencyLevel === "BEGINNER"
                              ? "#81c784"
                              : skill.proficiencyLevel === "INTERMEDIATE"
                              ? "#4caf50"
                              : skill.proficiencyLevel === "ADVANCED"
                              ? "#2e7d32"
                              : "#1b5e20",
                          borderRadius: 3,
                          width:
                            skill.proficiencyLevel === "BEGINNER"
                              ? "25%"
                              : skill.proficiencyLevel === "INTERMEDIATE"
                              ? "50%"
                              : skill.proficiencyLevel === "ADVANCED"
                              ? "75%"
                              : "100%",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          <Box mb={3}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#3f51b5" }}
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
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#3f51b5" }}
              >
                Work Experience
              </Typography>
              {resume.experiences.map((exp, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.position}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    {exp.company} | {exp.location}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {exp.startDate &&
                      new Date(exp.startDate).toLocaleDateString()}{" "}
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
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#3f51b5" }}
              >
                Education
              </Typography>
              {resume.educations.map((edu, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    {edu.institution}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {edu.startDate &&
                      new Date(edu.startDate).toLocaleDateString()}{" "}
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
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ModernTemplate;
