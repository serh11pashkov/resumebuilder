import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for the Creative template
const CreativeHeader = styled(Box)(({ theme }) => ({
  backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: theme.spacing(4),
  borderRadius: "10px 10px 0 0",
  color: "white",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  fontWeight: 700,
  "&:after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "60px",
    height: "4px",
    backgroundColor: "#764ba2",
  },
}));

const ExperienceItem = styled(Box)(({ theme }) => ({
  position: "relative",
  paddingLeft: theme.spacing(4),
  marginBottom: theme.spacing(4),
  "&:before": {
    content: '""',
    position: "absolute",
    left: "0",
    top: "8px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#764ba2",
    zIndex: 1,
  },
  "&:after": {
    content: '""',
    position: "absolute",
    left: "4px",
    top: "18px",
    width: "2px",
    height: "calc(100% - 10px)",
    backgroundColor: "#e0e0e0",
  },
}));

const SkillBar = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const CreativeTemplate = ({ resume }) => {
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
    website = "",
    profileImage = "",
  } = personalInfo || {};

  // Function to get a consistent skill level (1-100) from skill name for demo purposes
  const getSkillLevel = (skillName) => {
    let hash = 0;
    for (let i = 0; i < skillName.length; i++) {
      hash = skillName.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Scale to 60-100 range for more visually appealing bars
    return 60 + (Math.abs(hash) % 41);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: "100%",
        margin: "auto",
        overflow: "hidden",
        borderRadius: "10px",
      }}
    >
      <CreativeHeader>
        <Grid container spacing={3} alignItems="center">
          <Grid
            item
            xs={12}
            sm={3}
            md={2}
            sx={{ textAlign: { xs: "center", sm: "center" } }}
          >
            <Avatar
              src={profileImage}
              alt={fullName}
              sx={{
                width: 120,
                height: 120,
                margin: "auto",
                border: "4px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={9} md={10}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              {fullName}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
              {jobTitle}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
              {email && (
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {email}
                </Typography>
              )}
              {phone && (
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {phone}
                </Typography>
              )}
              {address && (
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {address}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CreativeHeader>

      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Summary Section */}
          {resume.summary && (
            <Grid item xs={12}>
              <SectionTitle variant="h5" component="h2">
                About Me
              </SectionTitle>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {resume.summary}
              </Typography>
            </Grid>
          )}

          {/* Experience Section */}
          <Grid item xs={12} md={7}>
            <SectionTitle variant="h5" component="h2">
              Work Experience
            </SectionTitle>

            {resume.experiences && resume.experiences.length > 0 ? (
              resume.experiences.map((exp, index) => (
                <ExperienceItem key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#764ba2" }}
                    >
                      {exp.company}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "rgba(118, 75, 162, 0.1)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        color: "#764ba2",
                      }}
                    >
                      {exp.startDate} -{" "}
                      {exp.isCurrent ? "Present" : exp.endDate}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {exp.position}
                    {exp.location && ` • ${exp.location}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", whiteSpace: "pre-line" }}
                  >
                    {exp.description}
                  </Typography>
                </ExperienceItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No experience listed
              </Typography>
            )}

            {/* Education Section */}
            <SectionTitle variant="h5" component="h2" sx={{ mt: 4 }}>
              Education
            </SectionTitle>

            {resume.educations && resume.educations.length > 0 ? (
              resume.educations.map((edu, index) => (
                <ExperienceItem key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#764ba2" }}
                    >
                      {edu.institution}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "rgba(118, 75, 162, 0.1)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        color: "#764ba2",
                      }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {edu.degree} in {edu.fieldOfStudy}
                  </Typography>
                  {edu.description && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", whiteSpace: "pre-line" }}
                    >
                      {edu.description}
                    </Typography>
                  )}
                </ExperienceItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No education listed
              </Typography>
            )}
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                backgroundColor: "rgba(118, 75, 162, 0.05)",
                p: 3,
                borderRadius: "8px",
              }}
            >
              <SectionTitle variant="h5" component="h2">
                Skills
              </SectionTitle>

              {resume.skills && resume.skills.length > 0 ? (
                resume.skills.map((skill, index) => (
                  <SkillBar key={index}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {skill.name}
                      </Typography>
                      <Typography variant="body2">
                        {getSkillLevel(skill.name)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getSkillLevel(skill.name)}
                      sx={{
                        mt: 0.5,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(0, 0, 0, 0.09)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#764ba2",
                        },
                      }}
                    />
                  </SkillBar>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No skills listed
                </Typography>
              )}

              {/* Contact Information */}
              <Box sx={{ mt: 4 }}>
                <SectionTitle variant="h5" component="h2">
                  Contact
                </SectionTitle>

                {email && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Email:
                    </Typography>
                    <Typography variant="body2">{email}</Typography>
                  </Box>
                )}

                {phone && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Phone:
                    </Typography>
                    <Typography variant="body2">{phone}</Typography>
                  </Box>
                )}

                {address && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Location:
                    </Typography>
                    <Typography variant="body2">{address}</Typography>
                  </Box>
                )}

                {linkedin && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      LinkedIn:
                    </Typography>
                    <Typography variant="body2">{linkedin}</Typography>
                  </Box>
                )}

                {website && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Website:
                    </Typography>
                    <Typography variant="body2">{website}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CreativeTemplate;
