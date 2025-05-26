const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        &copy; {currentYear} Resume Builder Application. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
