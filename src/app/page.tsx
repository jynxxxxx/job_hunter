"use client"

import HeroSection from '../components/landingSections/HeroSection';
import Features from '../components/landingSections/Features';
import Testimonials from '../components/landingSections/Testimonials';
import Effects from '@/components/landingSections/Effects';
import { useAuth } from '@/context/AuthContext';
// import ApplicationPosting from '@/components/landingSections/ApplicationPosting';

export default function Home() {
  const { setJustSignedOut } = useAuth();
  setJustSignedOut(false); // reset flag if redirected from logout

  return (
    <>
      {/* <ApplicationPosting /> */}
      <HeroSection />
      <Effects />
      <Testimonials />
      <Features />
    </>
  )
}
