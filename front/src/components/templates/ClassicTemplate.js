import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";

const ClassicTemplate = ({ resume, scale = 1, darkMode = false }) => {
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
        fontFamily: "'Times New Roman', serif",
        overflow: "hidden",
      }}
    >
      <Box textAlign="center" mb={2} sx={{ maxWidth: "100%" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontFamily: "'Times New Roman', serif",
            wordBreak: "break-word",
          }}
        >
          {resume.title}
        </Typography>

        {personalInfo.photo && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
            <img
              src={personalInfo.photo}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ccc",
              }}
              onError={(e) => {
                console.error("Failed to load image");
                e.target.style.display = "none";
              }}
            />
          </Box>
        )}

        <Box mt={1}>
          <Typography variant="body1" fontWeight="bold" fontSize="1.2rem">
            {personalInfo.firstName || ""} {personalInfo.lastName || ""}
          </Typography>
          <Typography variant="body2">
            {personalInfo.email || ""}
            {personalInfo.phone ? ` • ${personalInfo.phone}` : ""}
          </Typography>
          {personalInfo.address && (
            <Typography variant="body2">{personalInfo.address}</Typography>
          )}
        </Box>
      </Box>
      <Divider
        sx={{
          mb: 3,
          borderColor: darkMode
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)",
        }}
      />{" "}
      <Box mb={3} sx={{ maxWidth: "100%", overflow: "hidden" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: "'Times New Roman', serif" }}
        >
          {" "}
          Професійне резюме
        </Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          {resume.summary}
        </Typography>
      </Box>
      {resume.experiences && resume.experiences.length > 0 && (
        <Box mb={3}>
          {" "}
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontFamily: "'Times New Roman', serif",
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            Досвід роботи
          </Typography>
          {resume.experiences.map((exp, index) => (
            <Box
              key={index}
              mb={2}
              sx={{ maxWidth: "100%", overflow: "hidden" }}
            >
              {" "}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ wordBreak: "break-word" }}
              >
                {exp.position} - {exp.company}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ wordBreak: "break-word" }}
              >
                {exp.location} |{" "}
                {exp.startDate && new Date(exp.startDate).toLocaleDateString()}{" "}
                -{" "}
                {exp.isCurrent
                  ? " По теперішній час"
                  : exp.endDate &&
                    ` ${new Date(exp.endDate).toLocaleDateString()}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
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
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontFamily: "'Times New Roman', serif",
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            Освіта
          </Typography>
          {resume.educations.map((edu, index) => (
            <Box
              key={index}
              mb={2}
              sx={{ maxWidth: "100%", overflow: "hidden" }}
            >
              {" "}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ wordBreak: "break-word" }}
              >
                {" "}
                {edu.degree}{" "}
                {edu.fieldOfStudy && `зі спеціальності ${edu.fieldOfStudy}`}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ wordBreak: "break-word" }}
              >
                {edu.institution} |{" "}
                {edu.startDate && new Date(edu.startDate).toLocaleDateString()}{" "}
                -
                {edu.endDate
                  ? new Date(edu.endDate).toLocaleDateString()
                  : "По теперішній час"}
              </Typography>
              {edu.description && (
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {edu.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}{" "}
      {resume.skills && resume.skills.length > 0 && (
        <Box mb={3}>
          {" "}
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontFamily: "'Times New Roman', serif",
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            Навички
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} sx={{ maxWidth: "100%" }}>
            {resume.skills.map((skill, index) => (
              <Chip
                key={index}
                label={`${
                  skill.name
                } (${skill.proficiencyLevel.toLowerCase()})`}
                variant="outlined"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  whiteSpace: "normal",
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

export default ClassicTemplate;
