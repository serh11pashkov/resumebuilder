import React from "react";
import { Box, Typography, Paper, Divider, Chip, Grid } from "@mui/material";

const MinimalistTemplate = ({ resume, scale = 1 }) => {
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
        fontFamily: "'Helvetica', 'Arial', sans-serif",
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="300" gutterBottom>
          {resume.title}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {resume.personalInfo}
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", fontWeight: 300 }}
        >
          {resume.summary}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {resume.experiences && resume.experiences.length > 0 && (
        <Box mb={4}>
          <Typography
            variant="h6"
            fontWeight="300"
            textTransform="uppercase"
            gutterBottom
          >
            Experience
          </Typography>
          {resume.experiences.map((exp, index) => (
            <Box key={index} mb={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="textSecondary">
                    {exp.startDate &&
                      new Date(exp.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                    -<br />
                    {exp.isCurrent
                      ? "Present"
                      : exp.endDate &&
                        new Date(exp.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography variant="subtitle1" fontWeight="500">
                    {exp.position}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {exp.company}, {exp.location}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {exp.description}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {resume.educations && resume.educations.length > 0 && (
        <Box mb={4}>
          <Typography
            variant="h6"
            fontWeight="300"
            textTransform="uppercase"
            gutterBottom
          >
            Education
          </Typography>
          {resume.educations.map((edu, index) => (
            <Box key={index} mb={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="textSecondary">
                    {edu.startDate &&
                      new Date(edu.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                    -<br />
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : "Present"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography variant="subtitle1" fontWeight="500">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {edu.institution}
                  </Typography>
                  {edu.description && (
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {edu.description}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {resume.skills && resume.skills.length > 0 && (
        <Box mb={3}>
          <Typography
            variant="h6"
            fontWeight="300"
            textTransform="uppercase"
            gutterBottom
          >
            Skills
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {resume.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill.name}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default MinimalistTemplate;
