import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
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

const CreativeTemplate = ({ resume, darkMode = false }) => {
  if (!resume) {
    return <Typography>Дані резюме відсутні</Typography>;
  }

  let personalInfo;
  try {
    if (typeof resume.personalInfo === "string") {
      try {
        const trimmed = resume.personalInfo.trim();
        personalInfo = trimmed.startsWith("{")
          ? JSON.parse(trimmed)
          : { info: resume.personalInfo };
      } catch (jsonError) {
        console.error("Error parsing JSON string:", jsonError);
        personalInfo = { info: resume.personalInfo };
      }
    } else {
      personalInfo = resume.personalInfo || {};
    }
  } catch (error) {
    console.error("Error handling personal info:", error);
    personalInfo = {};
  }
  const firstName = personalInfo.firstName || "";
  const lastName = personalInfo.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const email = personalInfo.email || "";
  const phone = personalInfo.phone || "";
  const address = personalInfo.address || "";
  const linkedin = personalInfo.linkedin || "";
  const website = personalInfo.website || "";
  const photo = personalInfo.photo || "";
  // Position or job title can be stored in different ways
  const jobTitle =
    personalInfo.jobTitle || personalInfo.position || resume.title || "";

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
        width: "100%",
        maxWidth: "670px",
        margin: "auto",
        overflow: "hidden",
        borderRadius: "10px",
      }}
    >
      {" "}
      <CreativeHeader>
        {" "}
        <Grid
          container
          spacing={3}
          alignItems="center"
          sx={{
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <Grid
            item
            xs={12}
            sm={3}
            md={2}
            sx={{
              textAlign: { xs: "center", sm: "center" },
              marginBottom: { xs: 3, sm: 0 }, // Add spacing between photo and info on mobile
            }}
          >
            {" "}
            <Avatar
              src={photo}
              alt={fullName}
              sx={{
                width: 120,
                height: 120,
                margin: "auto",
                marginBottom: 2,
                border: "4px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {fullName ? fullName.charAt(0) : "U"}
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
              {" "}
              <SectionTitle variant="h5" component="h2">
                Про мене
              </SectionTitle>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {resume.summary}
              </Typography>
            </Grid>
          )}

          {/* Experience Section */}
          {resume.experiences && resume.experiences.length > 0 && (
            <Grid item xs={12} md={6}>
              {" "}
              <SectionTitle variant="h5" component="h2">
                Досвід роботи
              </SectionTitle>
              {resume.experiences.map((exp, index) => (
                <ExperienceItem key={index}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, wordBreak: "break-word" }}
                  >
                    {exp.position}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mb: 1, wordBreak: "break-word" }}
                  >
                    {exp.company}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, wordBreak: "break-word" }}
                  >
                    {exp.startDate && new Date(exp.startDate).getFullYear()} -{" "}
                    {exp.isCurrent
                      ? "По теперішній час"
                      : exp.endDate && new Date(exp.endDate).getFullYear()}
                    {exp.location && ` | ${exp.location}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
                  >
                    {exp.description}
                  </Typography>
                </ExperienceItem>
              ))}
            </Grid>
          )}

          {/* Education Section */}
          {resume.educations && resume.educations.length > 0 && (
            <Grid item xs={12} md={6}>
              {" "}
              <SectionTitle variant="h5" component="h2">
                Освіта
              </SectionTitle>
              {resume.educations.map((edu, index) => (
                <ExperienceItem key={index}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, wordBreak: "break-word" }}
                  >
                    {edu.degree}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mb: 1, wordBreak: "break-word" }}
                  >
                    {edu.institution}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, wordBreak: "break-word" }}
                  >
                    {edu.startDate && new Date(edu.startDate).getFullYear()} -{" "}
                    {edu.endDate
                      ? new Date(edu.endDate).getFullYear()
                      : "По теперішній час"}
                    {edu.fieldOfStudy &&
                      ` | Спеціальність: ${edu.fieldOfStudy}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
                  >
                    {edu.description}
                  </Typography>
                </ExperienceItem>
              ))}
            </Grid>
          )}

          {/* Skills Section */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                backgroundColor: "rgba(118, 75, 162, 0.05)",
                p: 3,
                borderRadius: "8px",
              }}
            >
              {" "}
              <SectionTitle variant="h5" component="h2">
                Навички
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
                  Навички не вказані
                </Typography>
              )}
              {/* Contact Information */}{" "}
              <Box sx={{ mt: 4 }}>
                <SectionTitle variant="h5" component="h2">
                  Контакти
                </SectionTitle>

                {email && (
                  <Box sx={{ mb: 1 }}>
                    {" "}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Електронна пошта:
                    </Typography>
                    <Typography variant="body2">{email}</Typography>
                  </Box>
                )}

                {phone && (
                  <Box sx={{ mb: 1 }}>
                    {" "}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Телефон:
                    </Typography>
                    <Typography variant="body2">{phone}</Typography>
                  </Box>
                )}

                {address && (
                  <Box sx={{ mb: 1 }}>
                    {" "}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Місцезнаходження:
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
                    {" "}
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Веб-сайт:
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
