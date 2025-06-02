import { Typography, Box } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: "auto",
        textAlign: "center",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {currentYear} Конструктор резюме. Усі права захищено.
      </Typography>
    </Box>
  );
};

export default Footer;
