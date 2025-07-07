'use client';

import React from "react";
import HistoryPage from "@/components/tabs/HistoryPage";
import { useUserData } from "@/context/UserDataContext";
import JobSelectPage from "@/components/tabs/JobSelectionPage";

export default function Dashboard() {
  const { activePage } = useUserData()

  return (
    <div className="">
      {activePage === 'generation' && <JobSelectPage />}
      {activePage === 'history' && <HistoryPage />}
    </div>
  )
}