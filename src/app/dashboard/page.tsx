'use client';

import GenerationPage from "@/components/tabs/GenerationPage";
import HistoryPage from "@/components/tabs/HistoryPage";
import { useUserData } from "@/context/UserDataContext";

export default function Dashboard() {
  const { activePage } = useUserData()
  return (
    <>
      {activePage === 'generation' && <GenerationPage />}
      {activePage === 'history' && <HistoryPage />}
    </>
  )
}