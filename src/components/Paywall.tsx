export default function Paywall() {
  return(
    <>
      <div className='bg-[#F9F9FB] rounded-xl p-4 sm:p-6'>
        <div className='font-extrabold text-center pb-4 text-xl'>직접 작성하기 어려우신가요?</div>
        <div className='flex justify-around gap-6'>
          <div className='flex flex-col justify-center gap-2'>
            <p>
              <strong>삼성- SK하이닉스 출신 <div className="h-px sm:hidden"><br/></div>인사팀 전문가들이 직접!</strong><br /><br />
              <div className="text-left sm:text-center"> 3,000건의 합격 자기소개서와 오직 채용 담당자만이 쌓아온 노하우를 결합한 AI 서비스입니다.<br />
              바로지원으로 서류 합격률을 높이는 자기소개서를 작성하세요.
              </div>
              <div className='text-left w-[fit-content] mx-auto '>
                <span style={{ textDecoration: 'line-through'}}>1차 얼리버드 무료 (30/30명 마감)</span><br />
                <span style={{ textDecoration: 'line-through'}}>2차 얼리버드 10,000원 (30/30명 마감)</span><br />
                <span>3차 얼리버드 20,000원 (8/30명 진행중)</span><br />
                <span>4차 정가 30,000원</span><br />
              </div>
              <div className='text-gray-600 flex gap-2 text-[0.85rem]'>
                <div className="w-fit my-auto">※</div>
                <div className='text-left text-gray-600'>실제 면접에서 핵심 질문은 5개로, 지원 기업의 최근 트렌드 정보를 반영한 질문 + 답변 세트를 제공해드립니다.</div>
              </div>
            </p>

            <p>
            <strong>서비스 신청 방안</strong><br />
            <div className='flex flex-col w-[fit-content] text-left mx-auto items-start'>
                <div>① 하단 계좌번호 또는 카카오페이로 입금합니다</div>
                <div>② 입금 후, 아래 정보를 010-8961-1918로 문자로 보내주세요.</div>
                <div className="mx-auto text-center">[입금자명 / 이메일 주소 / 회사명 / 지원 직무명]</div>
                <div>③ 바로지원 팀에서 입금 결과를 확인 후, 30분 내로 모든 문항을 풀어줍니다.</div>
              </div>
            </p>
            <div className='mx-auto w-full sm:w-3/5 flex items-center justify-around'>
              <img
                src="/qr.png"
                alt="Donate via QR Code"
                className='w-[8rem]'
              />
              <div>
                <p className="text-sm text-gray-700">카카오뱅크</p>
                <p className="font-extrabold text-xl text-gray-900 mb-1">3333058317631</p>
                <p className="text-sm text-gray-700">예금주: 박근철</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}