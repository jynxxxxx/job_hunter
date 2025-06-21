
import { Toaster } from 'sonner';
import HeroSection from '../components/HeroSection';
import SignupForm from '../components/SignupForms';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Effects from '@/components/Effects';

export default function Home() {
  return (
    <>
      <Toaster position="top-center" />
      <HeroSection />
      <Features />
      <Testimonials />
      <Effects />
      <SignupForm />
      <Footer />
    </>
  )
}
