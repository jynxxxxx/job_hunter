'use client';

import React, { useState } from "react";
import HistoryPage from "@/components/tabs/HistoryPage";
import { useUserData } from "@/context/UserDataContext";
import { companyList } from "@/data"; // adjust path as needed
import { useRouter } from "next/navigation";
import JobSelectPage from "@/components/tabs/JobSelectionPage";

const uniqueCompanies = Array.from(new Set(companyList.map(item => item.company)));

export default function Dashboard() {
  const { activePage } = useUserData()

  return (
    <div className="">
      {activePage === 'generation' && <JobSelectPage />}
      {activePage === 'history' && <HistoryPage />}
    </div>
  )
}