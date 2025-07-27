import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function RequestForm() {
  const {authUser} = useAuth()
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim()) {
      toast.error('회사명과 공고를 모두 입력해주세요.');
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('request_list').insert([
      {
        company: companyName.trim(),
        title: jobTitle.trim(),
        email: authUser?.email,
        user_name: authUser?.displayName || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      toast.error('요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } else {
      toast.success('요청이 성공적으로 접수되었습니다.');
      setCompanyName('');
      setJobTitle('');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full lg:w-[65%] my-4">
      <div className='w-full md:w-1/2'>
        <label htmlFor="companyName" className="block font-semibold mb-1">
          회사명
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="예: 현대자동차"
          required
          disabled={loading}
        />
      </div>
      <div className='w-full md:w-1/2'>
        <label htmlFor="jobTitle" className="block font-semibold mb-1">
          공고명
        </label>
        <input
          id="jobTitle"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="예: 2025 신입사원 수시 채용"
          required
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className=" ml-auto mt-auto min-w-fit h-fit bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-dark disabled:opacity-50"
      >
        {loading ? '요청 중...' : '요청 하기'}
      </button>
    </form>
  );
}