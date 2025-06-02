import React from "react";
import { Box, Typography, Paper, Divider, Chip, Grid } from "@mui/material";

const MinimalistTemplate = ({ resume, scale = 1, darkMode = false }) => {
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
  const email = personalInfo.email || "";
  const phone = personalInfo.phone || "";
  const address = personalInfo.address || "";

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: "670px",
        margin: "0 auto",
        backgroundColor: darkMode ? "#2d2d2d" : "#fff",
        color: darkMode ? "#f1f1f1" : "#000",
        fontFamily: "'Helvetica', 'Arial', sans-serif",
        overflow: "hidden",
      }}
    >
      {" "}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="300" gutterBottom>
          {fullName || resume.title}
        </Typography>
        {jobTitle && (
          <Typography variant="subtitle1" gutterBottom>
            {jobTitle}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          {email && (
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              Ел. пошта: {email}
            </Typography>
          )}
          {phone && (
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              Телефон: {phone}
            </Typography>
          )}
          {address && (
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {address}
            </Typography>
          )}
        </Box>
      </Box>
      <Box mb={4}>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", fontWeight: 300 }}
        >
          {resume.summary}
        </Typography>{" "}
      </Box>
      <Divider
        sx={{
          mb: 3,
          borderColor: darkMode
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)",
        }}
      />
      {resume.experiences && resume.experiences.length > 0 && (
        <Box mb={4}>
          {" "}
          <Typography
            variant="h6"
            fontWeight="300"
            textTransform="uppercase"
            gutterBottom
          >
            Досвід роботи
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
                    -<br />{" "}
                    {exp.isCurrent
                      ? "По теперішній час"
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
      <Divider
        sx={{
          mb: 3,
          borderColor: darkMode
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)",
        }}
      />
      {resume.educations && resume.educations.length > 0 && (
        <Box mb={4}>
          {" "}
          <Typography
            variant="h6"
            fontWeight="300"
            textTransform="uppercase"
            gutterBottom
          >
            Освіта
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
                    -<br />{" "}
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : "По теперішній час"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  {" "}
                  <Typography variant="subtitle1" fontWeight="500">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy && `зі спеціальності ${edu.fieldOfStudy}`}
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
      <Divider
        sx={{
          mb: 3,
          borderColor: darkMode
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)",
        }}
      />
      {resume.skills && resume.skills.length > 0 && (
        <Box mb={3}>
          {" "}
          <Typography
            variant="h6"
            fontWeight="300"
            textTransform="uppercase"
            gutterBottom
          >
            Навички
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {resume.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill.name}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1,
                  borderColor: darkMode
                    ? "rgba(255, 255, 255, 0.23)"
                    : "rgba(0, 0, 0, 0.23)",
                  color: darkMode
                    ? "rgba(255, 255, 255, 0.87)"
                    : "rgba(0, 0, 0, 0.87)",
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default MinimalistTemplate;
