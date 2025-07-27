export default function Paywall() {
  return(
    <>
      <div className='bg-[#F9F9FB] rounded-xl p-4 sm:p-6'>
        <div className='font-extrabold text-center pb-4 text-xl'>직접 작성하기 어려우신가요?</div>
        <div className='flex justify-around gap-6'>
          <div className='flex flex-col justify-center gap-2'>
            <div>
              <strong>삼성- SK하이닉스 출신 <div className="h-px sm:hidden"><br/></div>인사팀 전문가들이 직접!</strong><br /><br />
              <div className="text-left sm:text-center"> 3,000건의 합격 자기소개서와 오직 채용 담당자만이 쌓아온 노하우를 결합한 AI 서비스입니다.<br />
              바로지원으로 서류 합격률을 높이는 자기소개서를 작성하세요.
              </div>
              <p className="text-left sm:text-center text-lg sm:text-xl max-w-xl">
                무제한 자기소개서 생성 및 수정 기능은 <strong>월 구독</strong>을 통해 제공됩니다. <br/>현재 얼리버드 선착순 할인 진행 중입니다
              </p>

              <a
                href="/pricing" 
                className="mt-6 inline-block bg-primary hover:bg-primary/70 font-semibold py-3 px-6 rounded-lg transition"
                style={{color:'white'}}
              >
                구독 안내 보기
              </a>
            </div>

            {/* <div>
            <strong>서비스 신청 방안</strong><br />
            <div className='flex flex-col w-[fit-content] text-left mx-auto items-start'>
                <div>① 하단 계좌번호 또는 카카오페이로 입금합니다</div>
                <div>② 입금 후, 아래 정보를 010-8961-1918로 문자로 보내주세요.</div>
                <div className="mx-auto text-center">[입금자명 / 이메일 주소 / 회사명 / 지원 직무명]</div>
                <div>③ 바로지원 팀에서 입금 결과를 확인 후, 30분 내로 모든 문항을 풀어줍니다.</div>
              </div>
            </div>
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
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}