import React from "react";
import { Box, Typography, Paper, Divider, Grid, Avatar } from "@mui/material";

const ModernTemplate = ({ resume, scale = 1, darkMode = false }) => {
  if (!resume) {
    return <Typography>Дані резюме відсутні</Typography>;
  }
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
  const firstName = personalInfo.firstName || "";
  const lastName = personalInfo.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const jobTitle = personalInfo.jobTitle || "";
  const profileImage = personalInfo.photo || "";
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: `${scale * 800}px`,
        margin: "0 auto",
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: darkMode ? "#2d2d2d" : "#fff",
        color: darkMode ? "#f1f1f1" : "#000",
      }}
      className="resume-template-paper"
    >
      <Grid container spacing={3}>
        {" "}
        <Grid
          item
          xs={12}
          md={4}
          className="template-left-panel"
          sx={{
            backgroundColor: darkMode ? "#1e1e1e" : "#f5f5f5",
            p: 2,
            borderRadius: 1,
          }}
        >
          {" "}
          <Box textAlign="center" mb={3}>
            {profileImage ? (
              <Avatar
                src={profileImage}
                alt={fullName}
                sx={{ width: 100, height: 100, margin: "auto", mb: 2 }}
              />
            ) : fullName ? (
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: "auto",
                  mb: 2,
                  bgcolor: "#3f51b5",
                }}
              >
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </Avatar>
            ) : null}

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {fullName || resume.title.split(" ")[0]}
            </Typography>

            {jobTitle && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                {jobTitle}
              </Typography>
            )}

            <Divider sx={{ mb: 2, mt: 1 }} />
          </Box>
          {resume.skills && resume.skills.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Навички
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {resume.skills.map((skill, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    {" "}
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      className="skill-name"
                      sx={{ color: "text.primary" }}
                    >
                      {skill.name}
                    </Typography>{" "}
                    <Box
                      sx={{
                        height: 6,
                        backgroundColor: darkMode ? "#555555" : "#e0e0e0",
                        borderRadius: 3,
                        mt: 0.5,
                      }}
                      className="skill-progress-background"
                    >
                      <Box
                        sx={{
                          height: "100%",
                          backgroundColor:
                            skill.proficiencyLevel === "BEGINNER"
                              ? darkMode
                                ? "#5a8c5c"
                                : "#81c784"
                              : skill.proficiencyLevel === "INTERMEDIATE"
                              ? darkMode
                                ? "#357a38"
                                : "#4caf50"
                              : skill.proficiencyLevel === "ADVANCED"
                              ? darkMode
                                ? "#1c4c1f"
                                : "#2e7d32"
                              : darkMode
                              ? "#103813"
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
                        className="skill-progress-bar"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          {" "}
          <Box mb={3}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#3f51b5" }}
            >
              Професійне резюме
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
                Досвід роботи
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
                    -{" "}
                    {exp.isCurrent
                      ? " По теперішній час"
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
              {" "}
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#3f51b5" }}
              >
                Освіта
              </Typography>
              {resume.educations.map((edu, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy && `зі спеціальності ${edu.fieldOfStudy}`}
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
                    -{" "}
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString()
                      : "По теперішній час"}
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
