import footerStyles from "@/styles/footer.module.scss";

const Footer = () => {
  return (
    <footer className={footerStyles.ctn}>
      <div className={footerStyles.topSection}>
        <div className={footerStyles.title}>
          <div className={footerStyles.logo}>바로지원</div>
          <span className={footerStyles.tagline}>지원서부터 면접까지, 바로지원가 도와드립니다.</span>
        </div>
      </div>
      <div className={footerStyles.bottomSection}>
        <p>© 2025 바로지원. All rights reserved. Made with ❤️ for Korean job seekers</p>
      </div>
    </footer>
  );
};

export default Footer;