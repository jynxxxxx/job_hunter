'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ChevronDown, Copy } from 'lucide-react';
import { chatBotRevision } from '@/app/api/dummy_data';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { collection, doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TypingDots from './TypingDots';

type UserMessage = { role: 'user'; content: string };
type AiMessage = { role: 'ai'; user_insight_target: string; edited_essay: string; followup_question: string };
type Message = UserMessage | AiMessage;

type Props = {
  company: string;
  job: string;
  question: string;
  draft?: string; 
};

export default function Chatbot({ company, job, question, draft }: Props) {
  const { authUser } = useAuth()
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiMessages = messages.filter((m) => m.role === 'ai');
  const [selectedRevisionIdx, setSelectedRevisionIdx] = useState(aiMessages.length - 1);
  const qaPairsRef = useRef<{ question: string; answer: string }[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const unsavedCountRef = useRef(0);

  useEffect(() => {
    setSelectedRevisionIdx(aiMessages.length - 1);
  }, [aiMessages.length]);

  const handleSubmit = async (e?: any, isInitial = false) => {
    if (e) e.preventDefault(); // Prevent newline
    setLoading(true);

    if (e && !input.trim()) return;

    const userMessage = isInitial ? "" : input;
    setInput('');
    if (!isInitial) {
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    }

    const lastAiMessage = [...messages].reverse().find(m => m.role === 'ai');

    const finalEssay = lastAiMessage?.edited_essay || draft || "";
    const followupQuestion = lastAiMessage?.followup_question || "";

    if (followupQuestion) {
      const newPairs = [...qaPairsRef.current, { question: followupQuestion, answer: userMessage }];
      qaPairsRef.current = newPairs;
    }
    const body = {
      final_essay: finalEssay, 
      company: company,
      job: job,
      question: question,
      qa_pairs: qaPairsRef.current,
    }

    let data: any

    try {
      data = await chatBotRevision(body);

    } catch (error) {
      console.error("chatBotRevision error:", error);
      toast.error("AI 수정 중 문제가 발생했습니다.");
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          user_insight_target: "AI 수정 중 문제가 발생했습니다.",
          edited_essay: "AI 수정 중 문제가 발생했습니다.",
          followup_question: "",
        },
      ]);
      setLoading(false)
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        user_insight_target: data.user_insight_target,
        edited_essay: data.edited_essay,
        followup_question: data.followup_question,
      },
    ]);
    scheduleSave()
    setLoading(false);
  };

  useEffect(() => {
    handleSubmit(undefined, true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
    }
  }, [messages]);

  const validRevisions = aiMessages
    .map((msg, idx) => ({ ...msg, originalIdx: idx }))
    .filter((msg) => msg.user_insight_target !== "AI 수정 중 문제가 발생했습니다.");
    
  async function saveChat() {
    if (!authUser) return;
    if (qaPairsRef.current.length === 0) return;

    console.log("Auto-saving chat with qaPairs:", qaPairsRef.current);
    // try {
    //   if (!chatId) {
    //     // Create new chat doc with auto ID
    //     const chatsColRef = collection(db, "revision_chats");
    //     const newDocRef = doc(chatsColRef);
    //     await setDoc(newDocRef, {
    //       userId: authUser.uid,
    //       chat: qaPairsRef.current,
    //       createdAt: serverTimestamp(),
    //       output: aiMessages[selectedRevisionIdx].edited_essay,
    //       company_name: company,
    //       job_name: job,
    //       question_text: question,
    //       input_draft: draft
    //     });
    //     setChatId(newDocRef.id);
    //   } else {
    //     await updateDoc(
    //       doc(db, "revision_chats", chatId),
    //       {
    //         chat: qaPairsRef.current,
    //         updatedAt: serverTimestamp(),
    //         output: aiMessages[selectedRevisionIdx].edited_essay,
    //       },
    //     );
    //   }
    //   unsavedCountRef.current = 0; // reset unsaved count after save
    // } catch (e) {
    //   console.error("Failed to save chat:", e);
    // }
  }

  function scheduleSave() {
    unsavedCountRef.current++;
    if (unsavedCountRef.current >= 3) {
      // Save immediately if 3+ new messages
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      saveChat();
    } else if (!saveTimerRef.current) {
      // Otherwise schedule save in 2 minutes
      saveTimerRef.current = setTimeout(() => {
        saveChat();
        saveTimerRef.current = null;
      }, 3 * 60 * 1000);
    }
  }

  const handleCopy = () => {
    if (!aiMessages[selectedRevisionIdx].edited_essay) {
      toast.error("복사 실패 했습니다!");
      return
    }
    navigator.clipboard.writeText(aiMessages[selectedRevisionIdx].edited_essay);
    toast.success("복사되었습니다!");
  };
  
  // async function handleSave() {
  //   if (saveTimerRef.current) {
  //     clearTimeout(saveTimerRef.current);
  //     saveTimerRef.current = null;
  //   }
  //   await saveChat();
  //   toast.success("자기소개서가 저장되었습니다."); 
  //   route.push("/revision")
  // }

  useEffect(() => {
    const handler = () => {
      if (!authUser || qaPairsRef.current.length === 0) return;

      const payload = { 
        chat: qaPairsRef.current,
        updatedAt: serverTimestamp(),
        output: aiMessages[selectedRevisionIdx].edited_essay,
        userId: authUser.uid,
        chatId: chatId
      }
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      });

      navigator.sendBeacon("/api/revision_chat_save", blob);
    };

    window.addEventListener('pagehide', handler);
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('pagehide', handler);
      window.removeEventListener('beforeunload', handler);
    };
  }, []);

  return (
    <div className='bg-white'>
      <div className='grid grid-rows-[1.3fr_1fr] sm:grid-rows-1 sm:grid-cols-[1.5fr_1fr] 2xl:gap-12 2xl:pb-12 2xl:pt-8 bg-gray-50 px-4 max-w-7xl mx-auto'>
        <div className="h-[85vh] pt-4 p-4 flex-1 flex flex-col">
          <div className="relative h-full">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-4 px-4 py-2 h-[65vh]"
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[75%] px-4 py-3 rounded-2xl whitespace-pre-line text-sm leading-relaxed shadow
                      ${m.role === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'}
                    `}
                  >
                    {m.role === 'user' ? m.content : (
                      <>
                        <div>{m.user_insight_target}</div>
                        <hr className="my-1 border-gray-300" />
                        <div>{m.followup_question}</div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start pb-2">
                  <div className="bg-gray-100 text-gray-500 text-sm px-4 py-2 rounded-2xl shadow">
                    AI가 답변을 검토하고 있습니다<TypingDots />
                  </div>
                </div>
              )}
            </div>
            <div className="absolute bottom-2 w-full flex gap-2 py-2 rounded-xl bg-white border popped">
              <textarea
                className="flex-1 px-3 py-2 resize-none break-all focus:outline-none"
                placeholder="수정 요청을 입력해주세요…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !loading) {
                    handleSubmit(e);
                  }
                }}
              />
              <button
                onClick={handleSubmit} 
                className="my-auto mx-2 p-2 h-fit rounded-4xl bg-gray-700 text-white disabled:opacity-50"
                disabled={loading}
              >
                <ArrowUp />
              </button>
              <div className="absolute sm:hidden left-1/2 -translate-x-1/2 animate-bounce text-gray-600 bottom-[-2.5rem]">
                <ChevronDown className="w-6 h-6 text-gray-600"/>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col my-6 space-y-2 ">
          <div className="overflow-y-scroll p-4 bg-white rounded-xl border h-[71vh]">
            <div className='flex justify-between w-full '>
              <h2 className="text-lg font-semibold">AI 수정본</h2>
              {validRevisions.length > 1 && (
                <select
                  value={selectedRevisionIdx}
                  onChange={(e) => setSelectedRevisionIdx(Number(e.target.value))}
                  className="border px-2 py-1 text-sm rounded-md focus:ring-0 outline-none"
                >
                  {validRevisions.map((_, idx) => (
                    <option key={idx} value={idx}>
                      수정본 {idx + 1}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {aiMessages[selectedRevisionIdx] ? (
              <div className="whitespace-pre-line text-sm text-gray-800">
                {aiMessages[selectedRevisionIdx].edited_essay}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">{draft}</p>
            )}
          </div>
          <div className='w-full'>
            <button 
              onClick={handleCopy} 
              className='flex justify-center gap-2 w-full bg-primary text-white rounded-xl text-center py-1 border border-gray-500 hover:bg-blue-500'
            >
              <Copy className="w-4 h-4 my-auto" />
              자기소개서 복사하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}