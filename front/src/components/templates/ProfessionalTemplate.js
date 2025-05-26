import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";

const ProfessionalTemplate = ({ resume }) => {
  // Parse personalInfo if it's a string
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

  const {
    fullName = "",
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
        maxWidth: "100%",
        mx: "auto",
        mb: 4,
        backgroundColor: "#fdfdfd",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
      }}
    >
      <Grid container spacing={4}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              pb: 2,
              borderBottom: "2px solid #2c3e50",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                }}
              >
                {fullName}
              </Typography>
              <Typography
                variant="h6"
                color="textSecondary"
                gutterBottom
                sx={{ fontStyle: "italic" }}
              >
                {jobTitle}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: 1,
                }}
              >
                <EmailIcon fontSize="small" sx={{ mr: 1, color: "#2c3e50" }} />
                <Typography variant="body2">{email}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: 1,
                }}
              >
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: "#2c3e50" }} />
                <Typography variant="body2">{phone}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: 1,
                }}
              >
                <LocationIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "#2c3e50" }}
                />
                <Typography variant="body2">{address}</Typography>
              </Box>
              {linkedin && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mb: 1,
                  }}
                >
                  <LinkedInIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "#2c3e50" }}
                  />
                  <Typography variant="body2">{linkedin}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Summary Section */}
        {resume.summary && (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: "#2c3e50",
                fontWeight: 600,
                borderBottom: "1px solid #bdc3c7",
                pb: 1,
              }}
            >
              Professional Summary
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ whiteSpace: "pre-line" }}
            >
              {resume.summary}
            </Typography>
          </Grid>
        )}

        {/* Experience Section */}
        {resume.experiences && resume.experiences.length > 0 && (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: "#2c3e50",
                fontWeight: 600,
                borderBottom: "1px solid #bdc3c7",
                pb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <WorkIcon sx={{ mr: 1 }} /> Professional Experience
            </Typography>

            {resume.experiences.map((exp, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {exp.position} at {exp.company}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </Typography>
                </Box>

                {exp.location && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {exp.location}
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  paragraph
                  sx={{ whiteSpace: "pre-line", mt: 1 }}
                >
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Grid>
        )}

        {/* Education Section */}
        {resume.educations && resume.educations.length > 0 && (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: "#2c3e50",
                fontWeight: 600,
                borderBottom: "1px solid #bdc3c7",
                pb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <SchoolIcon sx={{ mr: 1 }} /> Education
            </Typography>

            {resume.educations.map((edu, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {edu.degree} in {edu.fieldOfStudy}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {edu.startDate} - {edu.endDate}
                  </Typography>
                </Box>

                <Typography variant="body2" gutterBottom>
                  {edu.institution}
                </Typography>

                {edu.description && (
                  <Typography
                    variant="body2"
                    paragraph
                    sx={{ whiteSpace: "pre-line", mt: 1 }}
                  >
                    {edu.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Grid>
        )}

        {/* Skills Section */}
        {resume.skills && resume.skills.length > 0 && (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: "#2c3e50",
                fontWeight: 600,
                borderBottom: "1px solid #bdc3c7",
                pb: 1,
              }}
            >
              Skills
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {resume.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.name}
                  sx={{
                    backgroundColor: "#2c3e50",
                    color: "white",
                    fontWeight: 500,
                    m: 0.5,
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
