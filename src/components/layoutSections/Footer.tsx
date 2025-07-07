import footerStyles from "@/styles/layout.module.scss";

const Footer = () => {
  return (
    <footer className={footerStyles.ctn}>
      <div className={footerStyles.topSection}>
        <div className={footerStyles.title}>
          <div className={footerStyles.logo}>
            <img
              src="/logo_white.png"
              alt="바로지원"
              className='h-[2.5rem]'
            />
          </div>
          <span className={footerStyles.tagline}>지원서부터 면접까지, 바로지원이 도와드립니다.</span>
          <span className={footerStyles.tagline}>상호명: 바로지원㈜ | 사업자번호: 711-09-03129</span>
          <span className={footerStyles.tagline}>주소: 서울시 마포구 백범로 31길 21 서울창업허브</span>
          <span className={footerStyles.tagline}>개인정보보호책임자: 문인욱 (teambarojiwon@gmail.com)</span>
          <span className={footerStyles.tagline}>대표이사: 문인욱</span>
        </div>
      </div>
      <div className={footerStyles.bottomSection}>
        <p>2025 바로지원(주). All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;