import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ResumeService from "../services/resume.service";
import AuthService from "../services/auth.service";
import {
  Typography,
  TextField,
  Button,
  Box,
  Container,
  Paper,
  Grid,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Validation schema for the form
const resumeValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  personalInfo: Yup.string().required("Personal information is required"),
  summary: Yup.string().required("Summary is required"),
  educations: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string().required("Institution is required"),
      degree: Yup.string().required("Degree is required"),
      startDate: Yup.date().required("Start date is required"),
    })
  ),
  experiences: Yup.array().of(
    Yup.object().shape({
      company: Yup.string().required("Company is required"),
      position: Yup.string().required("Position is required"),
      startDate: Yup.date().required("Start date is required"),
    })
  ),
  skills: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Skill name is required"),
      proficiencyLevel: Yup.string().required("Proficiency level is required"),
    })
  ),
});

const ResumeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const currentUser = AuthService.getCurrentUser();
  const [loading, setLoading] = useState(isEditMode);
  const [serverError, setServerError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resumeData, setResumeData] = useState(null);  const initialValues = {
    title: "",
    personalInfo: "",
    summary: "",
    educations: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    experiences: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        location: "",
      },
    ],
    skills: [{ name: "", proficiencyLevel: "BEGINNER" }],
    userId: currentUser ? currentUser.id : null,
    templateId: 1, // Default template
    isPublic: false, // Default to private resume
    templateName: "classic", // Default template name
  };
  const loadResume = useCallback(() => {
    ResumeService.getById(id)
      .then((response) => {
        const data = response.data;

        // Format dates for form inputs if they exist
        if (data.educations) {
          data.educations.forEach((edu) => {
            if (edu.startDate) edu.startDate = edu.startDate.substring(0, 10);
            if (edu.endDate) edu.endDate = edu.endDate.substring(0, 10);
          });
        }

        if (data.experiences) {
          data.experiences.forEach((exp) => {
            if (exp.startDate) exp.startDate = exp.startDate.substring(0, 10);
            if (exp.endDate) exp.endDate = exp.endDate.substring(0, 10);
          });
        }

        // Ensure we have at least one entry for each array type
        if (!data.educations || data.educations.length === 0) {
          data.educations = [initialValues.educations[0]];
        }

        if (!data.experiences || data.experiences.length === 0) {
          data.experiences = [initialValues.experiences[0]];
        }

        if (!data.skills || data.skills.length === 0) {
          data.skills = [initialValues.skills[0]];
        }

        setResumeData(data);
        setLoading(false);
      })
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setServerError(message);
        setLoading(false);
      });
  }, [id, initialValues]);
  const formik = useFormik({
    initialValues: resumeData || initialValues,
    enableReinitialize: true,
    validationSchema: resumeValidationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setServerError(null); // Format the data to prevent circular references
      const formattedValues = {
        ...values,
        // For new items, remove id field if it's empty
        educations: values.educations.map((education) => ({
          ...education,
          id: education.id || null,
        })),
        experiences: values.experiences.map((experience) => ({
          ...experience,
          id: experience.id || null,
        })),
        skills: values.skills.map((skill) => ({
          ...skill,
          id: skill.id || null,
        })),
        // Ensure userId is set
        userId: currentUser ? currentUser.id : null,
      };
      console.log("Formatted resume data:", formattedValues);
      console.log("Current user:", currentUser);
      console.log("Is edit mode:", isEditMode);

      const savePromise = isEditMode
        ? ResumeService.update(id, formattedValues)
        : ResumeService.create(formattedValues);

      savePromise
        .then((response) => {
          console.log("Save successful:", response);
          setSubmitSuccess(true);
          setTimeout(() => {
            navigate("/resumes");
          }, 2000);
        })
        .catch((error) => {
          console.error("Save failed:", error);
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setServerError(message);
          setLoading(false);
        });
    },
  });
  useEffect(() => {
    if (isEditMode) {
      loadResume();
    }
  }, [id, isEditMode, loadResume]);

  // Helper functions for form arrays
  const addEducation = () => {
    const updatedEducations = [
      ...formik.values.educations,
      initialValues.educations[0],
    ];
    formik.setFieldValue("educations", updatedEducations);
  };

  const removeEducation = (index) => {
    if (formik.values.educations.length > 1) {
      const updatedEducations = [...formik.values.educations];
      updatedEducations.splice(index, 1);
      formik.setFieldValue("educations", updatedEducations);
    }
  };

  const addExperience = () => {
    const updatedExperiences = [
      ...formik.values.experiences,
      initialValues.experiences[0],
    ];
    formik.setFieldValue("experiences", updatedExperiences);
  };

  const removeExperience = (index) => {
    if (formik.values.experiences.length > 1) {
      const updatedExperiences = [...formik.values.experiences];
      updatedExperiences.splice(index, 1);
      formik.setFieldValue("experiences", updatedExperiences);
    }
  };

  const addSkill = () => {
    const updatedSkills = [...formik.values.skills, initialValues.skills[0]];
    formik.setFieldValue("skills", updatedSkills);
  };

  const removeSkill = (index) => {
    if (formik.values.skills.length > 1) {
      const updatedSkills = [...formik.values.skills];
      updatedSkills.splice(index, 1);
      formik.setFieldValue("skills", updatedSkills);
    }
  };

  // Handle experience current job checkbox
  const handleCurrentCheckbox = (e, index) => {
    const updatedExperiences = [...formik.values.experiences];
    updatedExperiences[index].isCurrent = e.target.checked;

    // If current job, clear end date
    if (e.target.checked) {
      updatedExperiences[index].endDate = "";
    }

    formik.setFieldValue("experiences", updatedExperiences);
  };

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? "Edit Resume" : "Create New Resume"}
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Snackbar
          open={submitSuccess}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success">
            Resume {isEditMode ? "updated" : "created"} successfully!
          </Alert>
        </Snackbar>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControl component="fieldset">
                  <Button
                    variant={formik.values.isPublic ? "contained" : "outlined"}
                    color={formik.values.isPublic ? "primary" : "inherit"}
                    onClick={() => formik.setFieldValue('isPublic', !formik.values.isPublic)}
                    startIcon={formik.values.isPublic ? <i className="fa fa-lock-open" /> : <i className="fa fa-lock" />}
                  >
                    {formik.values.isPublic ? "Public Resume" : "Private Resume"}
                  </Button>
                  <FormHelperText>
                    {formik.values.isPublic 
                      ? "This resume will be visible in the public gallery" 
                      : "This resume is private and only visible to you"}
                  </FormHelperText>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Personal Information"
                name="personalInfo"
                multiline
                rows={4}
                value={formik.values.personalInfo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.personalInfo &&
                  Boolean(formik.errors.personalInfo)
                }
                helperText={
                  formik.touched.personalInfo && formik.errors.personalInfo
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professional Summary"
                name="summary"
                multiline
                rows={4}
                value={formik.values.summary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.summary && Boolean(formik.errors.summary)}
                helperText={formik.touched.summary && formik.errors.summary}
              />
            </Grid>

            {/* Education Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Education</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addEducation}
                  variant="outlined"
                  size="small"
                >
                  Add Education
                </Button>
              </Box>

              {formik.values.educations.map((education, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Institution"
                        name={`educations[${index}].institution`}
                        value={education.institution}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.educations?.[index]?.institution &&
                          Boolean(
                            formik.errors.educations?.[index]?.institution
                          )
                        }
                        helperText={
                          formik.touched.educations?.[index]?.institution &&
                          formik.errors.educations?.[index]?.institution
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Degree"
                        name={`educations[${index}].degree`}
                        value={education.degree}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.educations?.[index]?.degree &&
                          Boolean(formik.errors.educations?.[index]?.degree)
                        }
                        helperText={
                          formik.touched.educations?.[index]?.degree &&
                          formik.errors.educations?.[index]?.degree
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Field of Study"
                        name={`educations[${index}].fieldOfStudy`}
                        value={education.fieldOfStudy}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        name={`educations[${index}].startDate`}
                        type="date"
                        value={education.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputLabelProps={{ shrink: true }}
                        error={
                          formik.touched.educations?.[index]?.startDate &&
                          Boolean(formik.errors.educations?.[index]?.startDate)
                        }
                        helperText={
                          formik.touched.educations?.[index]?.startDate &&
                          formik.errors.educations?.[index]?.startDate
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="End Date"
                        name={`educations[${index}].endDate`}
                        type="date"
                        value={education.endDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name={`educations[${index}].description`}
                        multiline
                        rows={2}
                        value={education.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>

                  {formik.values.educations.length > 1 && (
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeEducation(index)}
                      sx={{ position: "absolute", top: 10, right: 10 }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Paper>
              ))}
            </Grid>

            {/* Experience Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Experience</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addExperience}
                  variant="outlined"
                  size="small"
                >
                  Add Experience
                </Button>
              </Box>

              {formik.values.experiences.map((experience, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        name={`experiences[${index}].company`}
                        value={experience.company}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.experiences?.[index]?.company &&
                          Boolean(formik.errors.experiences?.[index]?.company)
                        }
                        helperText={
                          formik.touched.experiences?.[index]?.company &&
                          formik.errors.experiences?.[index]?.company
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Position"
                        name={`experiences[${index}].position`}
                        value={experience.position}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.experiences?.[index]?.position &&
                          Boolean(formik.errors.experiences?.[index]?.position)
                        }
                        helperText={
                          formik.touched.experiences?.[index]?.position &&
                          formik.errors.experiences?.[index]?.position
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name={`experiences[${index}].location`}
                        value={experience.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        name={`experiences[${index}].startDate`}
                        type="date"
                        value={experience.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputLabelProps={{ shrink: true }}
                        error={
                          formik.touched.experiences?.[index]?.startDate &&
                          Boolean(formik.errors.experiences?.[index]?.startDate)
                        }
                        helperText={
                          formik.touched.experiences?.[index]?.startDate &&
                          formik.errors.experiences?.[index]?.startDate
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          label="End Date"
                          name={`experiences[${index}].endDate`}
                          type="date"
                          value={experience.endDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          InputLabelProps={{ shrink: true }}
                          disabled={experience.isCurrent}
                        />
                        <FormHelperText>
                          <label>
                            <input
                              type="checkbox"
                              name={`experiences[${index}].isCurrent`}
                              checked={experience.isCurrent}
                              onChange={(e) => handleCurrentCheckbox(e, index)}
                              style={{ marginRight: "5px" }}
                            />
                            Current Position
                          </label>
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name={`experiences[${index}].description`}
                        multiline
                        rows={3}
                        value={experience.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>

                  {formik.values.experiences.length > 1 && (
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeExperience(index)}
                      sx={{ position: "absolute", top: 10, right: 10 }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Paper>
              ))}
            </Grid>

            {/* Skills Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Skills</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addSkill}
                  variant="outlined"
                  size="small"
                >
                  Add Skill
                </Button>
              </Box>

              {formik.values.skills.map((skill, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Skill Name"
                        name={`skills[${index}].name`}
                        value={skill.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.skills?.[index]?.name &&
                          Boolean(formik.errors.skills?.[index]?.name)
                        }
                        helperText={
                          formik.touched.skills?.[index]?.name &&
                          formik.errors.skills?.[index]?.name
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Proficiency Level"
                        name={`skills[${index}].proficiencyLevel`}
                        value={skill.proficiencyLevel}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <MenuItem value="BEGINNER">Beginner</MenuItem>
                        <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                        <MenuItem value="ADVANCED">Advanced</MenuItem>
                        <MenuItem value="EXPERT">Expert</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  {formik.values.skills.length > 1 && (
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeSkill(index)}
                      sx={{ position: "absolute", top: 10, right: 10 }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Paper>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/resumes")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : isEditMode ? (
                    "Update Resume"
                  ) : (
                    "Create Resume"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ResumeForm;
