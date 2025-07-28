'use client'

import Loading from "@/app/loading";
import AuthCheck from "@/components/AuthCheck";
import Chatbot from "@/components/Chatbot"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function RevisionChat() {
  const router = useRouter()
  const [company, setCompany] = useState("")
  const [job, setJob] = useState("")
  const [question, setQuestion] = useState("")
  const [draft, setDraft] = useState("")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('chatData');
    if (stored) {
      const { company, job, question, draft } = JSON.parse(stored);
      setCompany(company);
      setJob(job);
      setQuestion(question);
      setDraft(draft);
      localStorage.removeItem('chatData'); // optional
    }

    setTimeout(() => setReady(true), 100)
  }, []);

  useEffect(() => {
    if (ready && !draft) {
      router.push("/revision");
    }
  }, [ready, draft]);
  
  if (!ready || !draft) return <Loading />;

  return (
    <AuthCheck>
      <Chatbot company={company} job={job} question={question} draft={draft}/>
    </AuthCheck>
  )
}