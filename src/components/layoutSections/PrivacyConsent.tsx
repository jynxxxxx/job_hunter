// components/PrivacyAgreementModal.tsx

import { useEffect, useState } from 'react';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // assumes you use a custom hook
import { db } from '@/lib/firebase';

export default function PrivacyAgreementModal() {
  const { authUser } = useAuth(); // must return firebase.User | null
  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    const checkAgreement = async () => {
      const userRef = doc(db, 'users', authUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || !userSnap.data()?.agreedToPrivacy) {
        setShowModal(true);
      }

      setChecking(false);
    };

    checkAgreement();
  }, [authUser]);

  const handleAgree = async () => {
    if (!authUser) return;

    const userRef = doc(db, 'users', authUser.uid);
    await setDoc(userRef, { agreedToPrivacy: serverTimestamp()  }, { merge: true });

    setShowModal(false);
  };

  if (checking || !showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-fit h-fit p-6 rounded-xl shadow-lg text-sm">
        <h2 className="text-lg font-semibold mb-4">개인정보 처리방침 동의</h2>
        <div className="h-[40vh] overflow-y-auto border p-2 text-gray-700 text-xs mb-4">
          <div className="container mx-auto p-6 md:p-10 lg:p-12 max-w-4xl bg-white shadow-lg rounded-lg my-8">
            <header className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-2">개인정보 처리방침</h1>
              <p className="text-sm text-gray-500">
                <span className="block md:inline">시행일자: 2025년 07월 08일</span>
                <span className="block md:inline md:ml-4">최종 수정일자: 2025년 07월 08일</span>
              </p>
            </header>

            <section className="mb-8">
              <p className="mb-4 leading-relaxed">
                바로지원(이하 "회사" 또는 "당사")은 이용자의 개인정보를 소중하게 생각하며, 「개인정보 보호법」 및 관련 법령을 철저히 준수하고 있습니다. 본 개인정보 처리방침은 당사가 운영하는 AI 기반 커리어 어시스턴트 플랫폼(이하 “서비스”)을 이용하실 때 어떤 정보를 수집하고, 어떻게 이용 및 보관하며, 필요한 경우 제3자에게 제공하는지에 대한 내용을 명확히 안내합니다.
              </p>
            </section>

            <hr className="my-8 border-gray-200" />

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">1. 수집하는 개인정보 항목 및 수집 방법</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-600 mb-3">1.1 수집 항목</h3>
                <div className="mb-4 pl-4 border-l-4 border-blue-400">
                  <p className="font-medium text-gray-700 mb-2">가. 필수 수집 항목</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>이메일 주소</li>
                    <li>카카오 또는 구글 UID (고유 식별자)</li>
                    <li>로그인 인증 제공자 정보</li>
                    <li>프로필 정보 (닉네임, 프로필 사진 등)</li>
                  </ul>
                </div>
                <div className="mb-4 pl-4 border-l-4 border-blue-400">
                  <p className="font-medium text-gray-700 mb-2">나. 서비스 이용 시 자동 수집 항목</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>로그인/접속 일시, 마지막 로그인 시간</li>
                    <li>에세이 생성 및 수정 기록</li>
                    <li>클릭, 화면 스크롤, 체류 시간 등 사용자 UI 상호작용 데이터 (Microsoft Clarity를 통해 수집)</li>
                    <li>브라우저 정보, 기기 정보, IP 주소 (비식별화 형태)</li>
                  </ul>
                </div>
                <div className="mb-4 pl-4 border-l-4 border-blue-400">
                  <p className="font-medium text-gray-700 mb-2">다. 사용자가 생성한 콘텐츠</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>자기소개서(자소서) 및 서비스 내에서 생성된 기타 문서</li>
                    <li>사용자가 입력한 키워드, 경험, 응답 내용</li>
                    <li>AI 피드백에 대한 수정/확정 내역</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-600 mb-3">1.2 수집 방법</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>회원 가입 또는 로그인 시 자동 수집 (Firebase Authentication 이용)</li>
                  <li>사용자의 직접 입력을 통한 수집 (예: 자소서 작성 시)</li>
                  <li>Microsoft Clarity를 통한 브라우저 행동 기록 수집</li>
                  <li>Firebase Functions, Firestore를 통한 서버 수집</li>
                </ul>
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">2. 개인정보의 이용 목적</h2>
              <p className="mb-3 leading-relaxed">당사는 수집한 개인정보를 다음의 목적으로만 이용합니다.</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>AI 기반 자기소개서 생성 및 편집 기능 제공</li>
                <li>사용자의 이력 및 입력 데이터에 기반한 맞춤형 템플릿 및 추천 제공</li>
                <li>작성된 자기소개서 이력 저장 및 향후 재사용 기능 제공</li>
                <li>사용자 행동 패턴 분석을 통한 UI/UX 개선 및 서비스 품질 향상 (Clarity 기반)</li>
                <li>비정상 행위 탐지 및 서비스 보안 강화</li>
                <li>법적 의무 준수를 위한 기록 보존</li>
              </ul>
            </section>

            <hr className="my-8 border-gray-200" />

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">3. 개인정보의 제3자 제공 및 위탁</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-600 mb-3">3.1 제3자 제공</h3>
                <p className="mb-3 leading-relaxed">당사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 서비스 제공을 위해 필요한 경우 및 아래 명시된 예외적인 경우에 한하여 제3자에게 제공할 수 있습니다.</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">제공받는 자</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">제공 항목</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">제공 목적</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-3 px-4 text-gray-600">Google Firebase</td>
                        <td className="py-3 px-4 text-gray-600">UID, 이메일, 인증 정보</td>
                        <td className="py-3 px-4 text-gray-600">인증, 데이터 저장, 서버 기능 운영</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-600">Microsoft Clarity</td>
                        <td className="py-3 px-4 text-gray-600">클릭 로그, 스크롤 정보, 화면 이동 등 (비식별 데이터)</td>
                        <td className="py-3 px-4 text-gray-600">사용자 행동 분석, UI/UX 개선</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-600">법적 기관</td>
                        <td className="py-3 px-4 text-gray-600">요청 시 해당 정보</td>
                        <td className="py-3 px-4 text-gray-600">법령 준수, 수사 및 공공기관의 요청에 따른 협조</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-600 mb-3">3.2 개인정보 처리 위탁</h3>
                <p className="leading-relaxed">
                    당사는 서비스 운영 및 효율적인 개인정보 처리를 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다. 위탁 계약 시 개인정보보호 관련 법령을 철저히 준수하도록 관리·감독하고 있으며, 위탁사들은 개인정보를 안전하게 처리하도록 필요한 조치를 취하고 있습니다.
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-3">
                    <li>
                        <strong>Google Firebase:</strong> 사용자 인증, 데이터베이스, 스토리지 등 클라우드 기반 인프라 운영 및 관리
                    </li>
                    <li>
                        <strong>Microsoft Clarity:</strong> 사용자 행동 분석 및 UI/UX 개선을 위한 데이터 처리
                    </li>
                </ul>
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">4. 개인정보의 보유 및 이용 기간</h2>
              <p className="mb-3 leading-relaxed">이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용 목적이 달성되면 지체 없이 파기합니다. 단, 관련 법령에 의해 보존할 필요가 있는 경우 해당 법령의 규정에 따릅니다.</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>
                      <strong>사용자 계정 정보:</strong> 회원 탈퇴 시 즉시 삭제합니다.
                  </li>
                  <li>
                      <strong>생성된 자기소개서 및 활동 이력:</strong> 마지막 로그인 이후 1년간 보관합니다. 다만, 사용자의 명시적인 삭제 요청이 있을 경우 즉시 삭제 처리합니다.
                  </li>
                  <li>
                      <strong>로그 및 분석 데이터:</strong> 서비스 개선 및 통계 목적의 비식별화된 데이터는 최대 2년간 보관될 수 있습니다.
                  </li>
              </ul>
            </section>

            <hr className="my-8 border-gray-200" />

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">5. 이용자의 권리 및 행사 방법</h2>
              <p className="mb-3 leading-relaxed">이용자는 개인정보 주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>본인의 개인정보 **조회, 수정, 삭제** 요청</li>
                  <li>개인정보 처리에 대한 **동의 철회** (회원 탈퇴)</li>
                  <li>서비스 내에서 생성한 에세이 및 활동 내역에 대한 **다운로드 또는 이관** 요청</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                  위 권리 행사는 언제든지 이메일(<a href="mailto:teambarojiwon@gmail.com" className="text-blue-600 hover:underline">teambarojiwon@gmail.com</a>)을 통해 요청하실 수 있으며, 본인 확인 절차를 거친 후 **7일 이내**에 신속하게 처리해 드립니다.
              </p>
            </section>

            <hr className="my-8 border-gray-200" />

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">6. 개인정보의 파기 절차 및 방법</h2>
              <p className="mb-3 leading-relaxed">당사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>
                      <strong>전자적 파일 형태:</strong> 기록을 복구할 수 없는 기술적인 방법(로우레벨 포맷 등)을 사용하여 완전 삭제합니다.
                  </li>
                  <li>
                      <strong>출력물 등:</strong> 종이 문서 형태의 개인정보는 분쇄기로 파쇄하거나 소각하여 파기합니다.
                  </li>
              </ul>
            </section>

            <hr className="my-8 border-gray-200" />

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">7. 이용자 동의</h2>
              <p className="mb-3 leading-relaxed">이용자는 다음 사항에 동의함으로써 서비스를 원활하게 이용할 수 있습니다. 동의하지 않으실 경우 서비스 이용에 제한이 있을 수 있습니다.</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>본 개인정보 처리방침에서 명시된 개인정보의 수집 및 활용</li>
                  <li>Microsoft Clarity 기반의 사용자 행동 추적 도구 사용 (서비스 개선 목적)</li>
                  <li>AI 기반 콘텐츠 분석 및 생성 기능에 필요한 데이터 활용</li>
              </ul>
            </section>

            <hr className="my-8 border-gray-200" />

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">9. 개인정보 보호 책임자</h2>
              <p className="mb-3 leading-relaxed">개인정보 보호 관련 문의사항 또는 불만 접수 시 아래의 개인정보 보호 책임자에게 연락 주시면 성실히 답변해 드리겠습니다.</p>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="mb-1"><strong>개인정보보호 책임자:</strong> 박근철</p>
                  <p className="mb-1"><strong>이메일:</strong> <a href="mailto:teambarojiwon@gmail.com" className="text-blue-600 hover:underline">teambarojiwon@gmail.com</a></p>
                  {/* <p><strong>주소 (선택 사항):</strong> [회사 주소]</p> */}
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">10. 정책 변경에 대한 고지</h2>
              <p className="mb-3 leading-relaxed">
                  본 개인정보 처리방침은 관련 법령 및 회사 정책의 변경 또는 서비스 개선에 따라 변경될 수 있습니다. 중요한 변경사항이 있을 경우, 최소 7일 전에 이메일 또는 서비스 내 공지(배너, 팝업 등)를 통해 충분히 고지할 것입니다. 이용자는 사이트 하단에서 변경 이력을 확인할 수 있습니다.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                  이 정책에 대해 궁금한 점이 있으시면 언제든지 <a href="mailto:teambarojiwon@gmail.com" className="text-blue-600 hover:underline">teambarojiwon@gmail.com</a>으로 문의해 주십시오.
              </p>
            </section>
        </div>
        </div>
        <button
          onClick={handleAgree}
          className="bg-bright text-white text-lg px-4 py-2 rounded hover:brightness-90 w-full"
        >
          동의하고 계속하기
        </button>
      </div>
    </div>
  );
}
