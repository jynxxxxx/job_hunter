import footerStyles from "@/styles/layout.module.scss";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={footerStyles.ctn}>
      <div className={footerStyles.topSection}>
        <div className={footerStyles.title}>
          <div className={`${footerStyles.logo} h-[1.5rem] w-[6rem] relative`}>
            <Image
              src="/logo1.png"
              alt="바로지원"
              fill
              className="object-contain"
            />
          </div>
          <span className={footerStyles.tagline}>상호명: 바로지원㈜ | 사업자번호: 598-50-01044</span>
          <span className={footerStyles.tagline}>주소: 서울시 마포구 백범로 31길 21 서울창업허브</span>
          <span className={footerStyles.tagline}>대표이사: 박근철 | 이메일: teambarojiwon@gmail.com</span>
          <span className={footerStyles.tagline}><a href="/privacypolicy"> 개인정보 처리방침</a></span>
        </div>
      </div>
      <div className={footerStyles.bottomSection}>
        <p>2025 바로지원(주). All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;