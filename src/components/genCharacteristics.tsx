import { Sparkles, FileText, MousePointerClick } from "lucide-react";

export default function GenCharacteristics() {
  return (
    <div className="grid grid-rows-3 sm:grid-rows-1 sm:grid-cols-3 w-full gap-2 sm:gap-8">
      <div className="p-4 w-full bg-white rounded-lg shadow-lg flex sm:flex-col sm:justify-center items-center gap-2">
        <div className="p-4 bg-primary rounded-4xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <div className="font-extrabold text-gray-900 sm:text-center">AI 기반생성</div>
          <div className="text-gray-700 text-sm sm:text-center">
            최신 AI 기술로 기업과 직무에 최적화된<br/>
            자기소개서를 갱겅합니다
          </div>
        </div>
      </div>
      <div className="p-4 w-full bg-white rounded-lg shadow-lg flex sm:flex-col sm:justify-center items-center gap-2">
        <div className="p-4 bg-primary rounded-4xl">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <div className="font-extrabold text-gray-900 sm:text-center">맞춤형 내용</div>
          <div className="text-gray-700 text-sm sm:text-center">
            회사명, 직무, 문항에 따라 개인화된<br/>
            자기소개서를 작성합니다
          </div>
        </div>
      </div>
      <div className="p-4 w-full bg-white rounded-lg shadow-lg flex sm:flex-col sm:justify-center items-center gap-2">
        <div className="p-4 bg-primary rounded-4xl">
          <MousePointerClick className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
        <div className="font-extrabold text-gray-900 sm:text-center">간편한 사용</div>
          <div className="text-gray-700 text-sm sm:text-center">
            복잡한 설정 없이 몇가지 정조와 답변을<br/>
            입력하면 바로 생성됩니다
          </div>
        </div>
      </div>
    </div>
  ) 
}