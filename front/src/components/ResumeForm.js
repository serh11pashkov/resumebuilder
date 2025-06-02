import { useState, useEffect } from "react";
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
  title: Yup.string().required("Назва обов'язкова"),
  personalInfo: Yup.string().required("Особиста інформація обов'язкова"),
  summary: Yup.string().required("Резюме обов'язкове"),
  educations: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string().required("Заклад освіти обов'язковий"),
      degree: Yup.string().required("Ступінь обов'язковий"),
      startDate: Yup.date().required("Дата початку обов'язкова"),
    })
  ),
  experiences: Yup.array().of(
    Yup.object().shape({
      company: Yup.string().required("Назва компанії обов'язкова"),
      position: Yup.string().required("Посада обов'язкова"),
      startDate: Yup.date().required("Дата початку обов'язкова"),
    })
  ),
  skills: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Назва навички обов'язкова"),
      proficiencyLevel: Yup.string().required("Рівень володіння обов'язковий"),
    })
  ),
});

const ResumeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  
  const formik = useFormik({
    initialValues: {
      title: "",
      personalInfo: JSON.stringify({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        photo: "",
      }),
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
          location: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
        },
      ],
      skills: [
        {
          name: "",
          proficiencyLevel: "BEGINNER",
        },
      ],
      
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      photo: "",
    },
    validationSchema: resumeValidationSchema,
    validateOnChange: false, 
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        
        const personalInfoObj = {
          firstName: values.firstName || "",
          lastName: values.lastName || "",
          email: values.email || "",
          phone: values.phone || "",
          photo: values.photo || "",
        };

        const dataToSubmit = {
          title: values.title,
          personalInfo: JSON.stringify(personalInfoObj),
          summary: values.summary,
          educations: values.educations,
          experiences: values.experiences,
          skills: values.skills,
        };

        if (isEditMode) {
          await ResumeService.update(id, dataToSubmit);
        } else {
          await ResumeService.create(dataToSubmit);
        }

        setSubmitSuccess(true);
        setTimeout(() => {
          navigate("/resumes");
        }, 2000);
      } catch (error) {
        console.error("Error submitting resume:", error);
        setServerError(
          "Не вдалося зберегти резюме. Будь ласка, перевірте введені дані та спробуйте знову."
        );
      } finally {
        setLoading(false);
      }
    },
  });


  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);


  useEffect(() => {
    if (isEditMode) {
      setLoading(true);

      const fetchResume = async () => {
        try {
          const response = await ResumeService.getById(id);
          setResume(response.data);

        
          let parsedPersonalInfo = {};
          try {
            if (typeof response.data.personalInfo === "string") {
              if (response.data.personalInfo.startsWith("{")) {
                parsedPersonalInfo = JSON.parse(response.data.personalInfo);
              } else {
                parsedPersonalInfo = { info: response.data.personalInfo };
              }
            } else if (response.data.personalInfo) {
              parsedPersonalInfo = response.data.personalInfo;
            }
          } catch (error) {
            console.error("Error parsing personal info:", error);
            parsedPersonalInfo = {};
          }

          formik.setValues({
            title: response.data.title || "",
            personalInfo:
              typeof response.data.personalInfo === "string"
                ? response.data.personalInfo
                : JSON.stringify(response.data.personalInfo || {}),
            summary: response.data.summary || "",
            educations: response.data.educations || [
              {
                institution: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
            experiences: response.data.experiences || [
              {
                company: "",
                position: "",
                location: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
                description: "",
              },
            ],
            skills: response.data.skills || [
              {
                name: "",
                proficiencyLevel: "BEGINNER",
              },
            ],
        
            firstName: parsedPersonalInfo.firstName || "",
            lastName: parsedPersonalInfo.lastName || "",
            email: parsedPersonalInfo.email || "",
            phone: parsedPersonalInfo.phone || "",
            photo: parsedPersonalInfo.photo || "",
          });
        } catch (error) {
          console.error("Error loading resume:", error);
          setServerError(
            "Не вдалося завантажити резюме. Будь ласка, спробуйте знову."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchResume();
    }
  }, [id, isEditMode]);


  const handleAddEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    formik.setFieldValue("educations", [
      ...formik.values.educations,
      newEducation,
    ]);
  };

  const handleRemoveEducation = (index) => {
    const updatedEducations = [...formik.values.educations];
    updatedEducations.splice(index, 1);
    formik.setFieldValue("educations", updatedEducations);
  };

  const handleAddExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    };
    formik.setFieldValue("experiences", [
      ...formik.values.experiences,
      newExperience,
    ]);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = [...formik.values.experiences];
    updatedExperiences.splice(index, 1);
    formik.setFieldValue("experiences", updatedExperiences);
  };

  const handleAddSkill = () => {
    const newSkill = {
      name: "",
      proficiencyLevel: "BEGINNER",
    };
    formik.setFieldValue("skills", [...formik.values.skills, newSkill]);
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formik.values.skills];
    updatedSkills.splice(index, 1);
    formik.setFieldValue("skills", updatedSkills);
  };

  const handleCurrentJobChange = (e, index) => {
    const updatedExperiences = [...formik.values.experiences];
    updatedExperiences[index].isCurrent = e.target.checked;
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
        {" "}
        <Typography variant="h4" gutterBottom>
          {isEditMode ? "Редагувати резюме" : "Створити нове резюме"}
        </Typography>
        {serverError && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {serverError}
          </Alert>
        )}{" "}
        <Snackbar
          open={submitSuccess}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }} variant="filled">
            Резюме {isEditMode ? "оновлено" : "створено"} успішно!
          </Alert>
        </Snackbar>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {" "}
              <TextField
                fullWidth
                label="Назва резюме"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            {/* Personal Information Section */}
            <Grid item xs={12}>
              {" "}
              <Typography variant="h6" gutterBottom>
                Особиста інформація
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ім'я"
                    name="firstName"
                    value={formik.values.firstName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Прізвище"
                    name="lastName"
                    value={formik.values.lastName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Електронна пошта"
                    name="email"
                    value={formik.values.email || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Телефон"
                    name="phone"
                    value={formik.values.phone || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12}>
                  {" "}
                  <Typography variant="subtitle1" gutterBottom>
                    Фото профілю (необов'язково)
                  </Typography>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      component="label"
                      color="primary"
                      sx={{ mb: 1 }}
                    >
                      Завантажити зображення
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              setServerError(
                                "Розмір зображення повинен бути менше 2MB"
                              );
                              return;
                            }

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              formik.setFieldValue("photo", reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Button>{" "}
                    <TextField
                      fullWidth
                      label="Або введіть URL фото"
                      name="photo"
                      placeholder="https://example.com/your-photo.jpg"
                      value={formik.values.photo || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Box>
                  {formik.values.photo && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <img
                        src={formik.values.photo}
                        alt="Profile"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          setServerError(
                            "Не вдалося завантажити зображення. Будь ласка, перевірте URL."
                          );
                          e.target.style.display = "none";
                        }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* Summary Section */}
            <Grid item xs={12}>
              {" "}
              <Typography variant="h6" gutterBottom>
                Резюме
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Резюме"
                name="summary"
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
                {" "}
                <Typography variant="h6">Освіта</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddEducation}
                  variant="outlined"
                  size="small"
                >
                  Додати освіту
                </Button>
              </Box>

              {formik.values.educations.map((education, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {" "}
                      {formik.values.educations.length > 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                          }}
                        >
                          <IconButton
                            onClick={() => handleRemoveEducation(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Заклад освіти"
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
                        label="Ступінь"
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
                        label="Галузь навчання"
                        name={`educations[${index}].fieldOfStudy`}
                        value={education.fieldOfStudy || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {" "}
                      <TextField
                        fullWidth
                        label="Дата початку"
                        type="date"
                        name={`educations[${index}].startDate`}
                        value={education.startDate || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputLabelProps={{
                          shrink: true,
                        }}
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
                    <Grid item xs={12} sm={6}>
                      {" "}
                      <TextField
                        fullWidth
                        label="Дата закінчення"
                        type="date"
                        name={`educations[${index}].endDate`}
                        value={education.endDate || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Опис"
                        multiline
                        rows={2}
                        name={`educations[${index}].description`}
                        value={education.description || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>

            {}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                {" "}
                <Typography variant="h6">Досвід роботи</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddExperience}
                  variant="outlined"
                  size="small"
                >
                  Додати досвід роботи
                </Button>
              </Box>

              {formik.values.experiences.map((experience, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {" "}
                      {formik.values.experiences.length > 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                          }}
                        >
                          <IconButton
                            onClick={() => handleRemoveExperience(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Компанія"
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
                        label="Посада"
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
                        label="Місце розташування"
                        name={`experiences[${index}].location`}
                        value={experience.location || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {" "}
                      <TextField
                        fullWidth
                        label="Дата початку"
                        type="date"
                        name={`experiences[${index}].startDate`}
                        value={experience.startDate || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputLabelProps={{
                          shrink: true,
                        }}
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
                    <Grid item xs={12} sm={6}>
                      <FormControl component="fieldset">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            name={`experiences[${index}].isCurrent`}
                            checked={experience.isCurrent || false}
                            onChange={(e) => handleCurrentJobChange(e, index)}
                            id={`current-job-${index}`}
                            style={{ marginRight: "8px" }}
                          />{" "}
                          <label htmlFor={`current-job-${index}`}>
                            Поточна робота
                          </label>
                        </Box>
                      </FormControl>
                    </Grid>
                    {!experience.isCurrent && (
                      <Grid item xs={12} sm={6}>
                        {" "}
                        <TextField
                          fullWidth
                          label="Дата закінчення"
                          type="date"
                          name={`experiences[${index}].endDate`}
                          value={experience.endDate || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Опис"
                        multiline
                        rows={3}
                        name={`experiences[${index}].description`}
                        value={experience.description || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>
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
                {" "}
                <Typography variant="h6">Навички</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddSkill}
                  variant="outlined"
                  size="small"
                >
                  Додати навичку
                </Button>
              </Box>

              <Grid container spacing={2}>
                {formik.values.skills.map((skill, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper sx={{ p: 2, position: "relative" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          {" "}
                          {formik.values.skills.length > 1 && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                              }}
                            >
                              <IconButton
                                onClick={() => handleRemoveSkill(index)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Назва навички"
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
                        <Grid item xs={12}>
                          {" "}
                          <TextField
                            select
                            fullWidth
                            label="Рівень володіння"
                            name={`skills[${index}].proficiencyLevel`}
                            value={skill.proficiencyLevel || "BEGINNER"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.skills?.[index]
                                ?.proficiencyLevel &&
                              Boolean(
                                formik.errors.skills?.[index]?.proficiencyLevel
                              )
                            }
                            helperText={
                              formik.touched.skills?.[index]
                                ?.proficiencyLevel &&
                              formik.errors.skills?.[index]?.proficiencyLevel
                            }
                            SelectProps={{
                              MenuProps: {
                                classes: { paper: "skill-select-menu" },
                                className: "skill-select-menu",
                                MenuListProps: {
                                  className: "skill-select-menu-list",
                                },
                              },
                            }}
                          >
                            {" "}
                            <MenuItem value="BEGINNER">Початківець</MenuItem>
                            <MenuItem value="INTERMEDIATE">Середній</MenuItem>
                            <MenuItem value="ADVANCED">Просунутий</MenuItem>
                            <MenuItem value="EXPERT">Експерт</MenuItem>
                          </TextField>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Submit buttons */}
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
                  Скасувати
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
                    "Оновити резюме"
                  ) : (
                    "Створити резюме"
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
