import React from "react";
import { Box, Typography, Grid, Paper, Chip } from "@mui/material";
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";

const ProfessionalTemplate = ({ resume, darkMode = false }) => {
  let personalInfo;
  try {
    personalInfo =
      typeof resume.personalInfo === "string"
        ? resume.personalInfo.startsWith("{")
          ? JSON.parse(resume.personalInfo)
          : { info: resume.personalInfo }
        : resume.personalInfo || {};
  } catch (error) {
    console.error("Error parsing personal info:", error);
    personalInfo =
      resume.personalInfo && typeof resume.personalInfo === "string"
        ? { info: resume.personalInfo }
        : {};
  }
  const {
    firstName = "",
    lastName = "",
    fullName = firstName && lastName ? `${firstName} ${lastName}` : "",
    jobTitle = "",
    email = "",
    phone = "",
    address = "",
    linkedin = "",
  } = personalInfo || {};
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        width: "100%",
        maxWidth: "670px",
        mx: "auto",
        backgroundColor: darkMode ? "#2d2d2d" : "#fdfdfd",
        color: darkMode ? "#f1f1f1" : "#000",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Grid container spacing={4} sx={{ width: "auto", margin: "0 auto" }}>
        {}
        <Grid item xs={12}>
          <Box
            sx={{
              pb: 2,
              borderBottom: `2px solid ${darkMode ? "#5a7a9a" : "#2c3e50"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            {" "}
            <Box sx={{ maxWidth: "100%" }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: darkMode ? "#f1f1f1" : "#2c3e50",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {fullName}
              </Typography>{" "}
              <Typography
                variant="h6"
                color="textSecondary"
                gutterBottom
                sx={{ fontStyle: "italic", wordBreak: "break-word" }}
              >
                {jobTitle}
              </Typography>
            </Box>{" "}
            <Box sx={{ textAlign: "right", maxWidth: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                {" "}
                <EmailIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                    color: darkMode ? "#a0c0f0" : "#2c3e50",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                >
                  {email}
                </Typography>
              </Box>{" "}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                {" "}
                <PhoneIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                    color: darkMode ? "#a0c0f0" : "#2c3e50",
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {phone}
                </Typography>
              </Box>{" "}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {address}
                </Typography>
              </Box>{" "}
              {linkedin && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mb: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {" "}
                  <LinkedInIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: darkMode ? "#a0c0f0" : "#2c3e50",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                  >
                    {linkedin}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>{" "}
        {}
        {resume.summary && (
          <Grid item xs={12} sx={{ maxWidth: "100%", overflow: "hidden" }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: darkMode ? "#a0c0f0" : "#2c3e50",
                fontWeight: 600,
                borderBottom: `1px solid ${darkMode ? "#5a7a9a" : "#bdc3c7"}`,
                pb: 1,
                maxWidth: "100%",
              }}
            >
              {" "}
              Професійне резюме
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {resume.summary}
            </Typography>
          </Grid>
        )}{" "}
        {}
        {resume.experiences && resume.experiences.length > 0 && (
          <Grid item xs={12} sx={{ maxWidth: "100%", overflow: "hidden" }}>
            {" "}
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: darkMode ? "#a0c0f0" : "#2c3e50",
                fontWeight: 600,
                borderBottom: `1px solid ${darkMode ? "#5a7a9a" : "#bdc3c7"}`,
                pb: 1,
                display: "flex",
                alignItems: "center",
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              <WorkIcon sx={{ mr: 1, flexShrink: 0 }} /> Досвід роботи
            </Typography>
            {resume.experiences.map((exp, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      wordBreak: "break-word",
                      maxWidth: { xs: "100%", sm: "70%" },
                    }}
                  >
                    {exp.position} at {exp.company}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      wordBreak: "break-word",
                      flexShrink: 0,
                    }}
                  >
                    {exp.startDate} -{" "}
                    {exp.isCurrent ? "По теперішній час" : exp.endDate}
                  </Typography>
                </Box>
                {exp.location && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{ wordBreak: "break-word" }}
                  >
                    {exp.location}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  paragraph
                  sx={{
                    whiteSpace: "pre-line",
                    mt: 1,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Grid>
        )}{" "}
        {}
        {resume.educations && resume.educations.length > 0 && (
          <Grid item xs={12} sx={{ maxWidth: "100%", overflow: "hidden" }}>
            {" "}
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: darkMode ? "#a0c0f0" : "#2c3e50",
                fontWeight: 600,
                borderBottom: `1px solid ${darkMode ? "#5a7a9a" : "#bdc3c7"}`,
                pb: 1,
                display: "flex",
                alignItems: "center",
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {" "}
              <SchoolIcon sx={{ mr: 1, flexShrink: 0 }} /> Освіта
            </Typography>
            {resume.educations.map((edu, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      wordBreak: "break-word",
                      maxWidth: { xs: "100%", sm: "70%" },
                    }}
                  >
                    {edu.degree} зі спеціальності {edu.fieldOfStudy}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      wordBreak: "break-word",
                      flexShrink: 0,
                    }}
                  >
                    {edu.startDate} - {edu.endDate}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ wordBreak: "break-word" }}
                >
                  {edu.institution}
                </Typography>
                {edu.description && (
                  <Typography
                    variant="body2"
                    paragraph
                    sx={{
                      whiteSpace: "pre-line",
                      mt: 1,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {edu.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Grid>
        )}{" "}
        {}
        {resume.skills && resume.skills.length > 0 && (
          <Grid item xs={12} sx={{ maxWidth: "100%", overflow: "hidden" }}>
            {" "}
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: darkMode ? "#a0c0f0" : "#2c3e50",
                fontWeight: 600,
                borderBottom: `1px solid ${darkMode ? "#5a7a9a" : "#bdc3c7"}`,
                pb: 1,
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {" "}
              Навички
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                maxWidth: "100%",
              }}
            >
              {resume.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.name}
                  sx={{
                    backgroundColor: darkMode ? "#1a2633" : "#2c3e50",
                    color: "white",
                    fontWeight: 500,
                    m: 0.5,
                    maxWidth: "100%",
                    height: "auto",
                    whiteSpace: "normal",
                  }}
                />
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default ProfessionalTemplate;
