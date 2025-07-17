"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { convertFirebaseTimestamp, parseCustomEndDate, getQuestionTemplate } from "../HelperFunctions";
import { imageMap } from "@/templates/imageMap";
import styles from "@/styles/revisions.module.scss"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from "lucide-react";

const JobCarousel = () => {
  const [jobList, setJobList] = useState<any[]>([]);
  const [jobTemplates, setJobTemplates] = useState<any[]>([]);
  const router = useRouter();

  const now = new Date();
  useEffect(() => {
    const fetchJobs = async () => {
      // If jobs_dictionary is a collection:
      const snapshot = await getDocs(collection(db, "jobs_dictionary"));
      const jobs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          startDate: data.startDate ? convertFirebaseTimestamp(data, "startDate", 'short') : undefined,
          endDate: data.endDate ? convertFirebaseTimestamp(data, "endDate", 'short') : undefined,
        };
      });
      setJobList(jobs);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      // If jobs_dictionary is a collection:
      const snapshot = await getDocs(collection(db, "job_templates"));
      const templates = snapshot.docs.map(doc => doc.data());
      setJobTemplates(templates);
    };
    fetchTemplates();
  }, []);

  const activeJobs = jobList.filter(item => !item.endDate || parseCustomEndDate(item.endDate) >= now)
      .sort((a, b) => {
        const aIsSK = a.company.toLowerCase().includes('sk');
        const bIsSK = b.company.toLowerCase().includes('sk');
  
        // Primary Sort: 'SK' companies first
        // If 'a' is an SK company and 'b' is not, 'a' comes before 'b' (return -1)
        if (aIsSK && !bIsSK) {
          return -1;
        }
        // If 'a' is not an SK company and 'b' is, 'a' comes after 'b' (return 1)
        if (!aIsSK && bIsSK) {
          return 1;
        }
  
        const dateA = a.endDate ? new Date(a.endDate) : new Date('9999-12-31'); // Put jobs without endDate at the end
        const dateB = b.endDate ? new Date(b.endDate) : new Date('9999-12-31');
  
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime(); // Soonest endDate first
        }
  
        const companyCompare = b.company.localeCompare(a.company);
        if (companyCompare !== 0) return companyCompare;
  
        return a.title.localeCompare(b.title);
      });
  
    const uniqueCompanies: any[] = Array.from(
      activeJobs
        .filter(item => {
          const template = getQuestionTemplate(String(item.job_id), jobTemplates);
          return !!template;
        })
        .reduce((map, item) => {
          const key = `${item.company}-${item.title}`;
          if (!map.has(key)) {
            map.set(key, {
              company: item.company,
              title: item.title,
              startDate: item.startDate,
              endDate: item.endDate,
              d_days: Math.ceil((new Date(item.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            });
          }
          return map;
        }, new Map<string, { company: string; title: string; startDate?: string; endDate?: string }>())
        .values()
    );

  const handlePickCompany = (e: any, company: any) => {
    e.preventDefault();
    router.push(`/generate/${company.company}_xyz${company.title}`);
  };

  return (
    <div className="min-h-fit flex flex-col justify-center py-16 lg:my-16">
      <h1 className="font-extrabold text-3xl mlg:text-5xl text-gray-700 px-12 xl:px-32">
        인기 기업 공고
      </h1>
      <div className="relative py-10">
        <div className="absolute bottom-0 w-full bg-bright/40 h-[8rem]"></div>
        <button className="custom-prev absolute z-10 top-1/2 left-2 lg:left-4 transform -translate-y-1/2"><ChevronLeft width={32} height={32} className="p-2 bg-primary/60 rounded-3xl"/></button>
        <button className="custom-next absolute z-10 top-1/2 right-2 lg:right-4 transform -translate-y-1/2"><ChevronRight width={32} height={32} className="p-2 bg-primary/60 rounded-3xl"/></button>
        <Swiper
          loop={uniqueCompanies.length > 5}
          modules={[Navigation]}
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 }, 
            1750: { slidesPerView: 5, spaceBetween: 20 }, 
          }}
          className="w-9/10"
        >
          {uniqueCompanies.map((company, idx) => {
            const companyImageSrc = imageMap[company.company as keyof typeof imageMap];

            return (
              <SwiperSlide key={idx} className="h-full ">
                <div 
                  onClick={(e) => handlePickCompany(e, company)}
                  className="flex flex-col items-stretch h-[16rem] bg-white border border-dark/20 shadow rounded-xl p-4 justify-start"
                >
                  <div className="h-17 sm:h-23">
                    {companyImageSrc && (
                      <div className="relative h-15 w-15 sm:h-20 sm:w-20 p-6 rounded-[10rem] border border-gray-200">
                        <Image
                          src={companyImageSrc}
                          alt={`${company.title} logo`}
                          fill
                          className="px-2 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-fit py-1 px-2 mt-2 text-xs font-semibold bg-gray-200 rounded-4xl">{company.d_days == 1 ? "오늘 마감" : `D-${company.d_days}`}</div>
                  <div className="mt-2 text-md font-semibold">{company.company}</div>
                  <div className="mt-2 text-sm text-gray-500">{company.title}</div>
                  <div className="text-xs text-gray-500">
                    {company.startDate} - {company.endDate}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default JobCarousel;
