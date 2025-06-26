"use client"

import HeroSection from '../components/HeroSection';
import SignupForm from '../components/SignupForms';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Effects from '@/components/Effects';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { setJustSignedOut } = useAuth();
  setJustSignedOut(false); // reset flag if redirected from logout

  return (
    <>
      <HeroSection />
      <Features />
      <Testimonials />
      <Effects />
      <SignupForm />
    </>
  )
}
