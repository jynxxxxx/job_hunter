import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number; // Optional: defaults to 3
}

const ProgressIndicator = ({ currentStep, totalSteps = 3 }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8 px-4">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = currentStep > step;
          const isActive = currentStep >= step;

          return (
            <div key={step} className="flex items-center">
              {/* Step bubble */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? "bg-dark text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>

              {/* Line after step (except for last) */}
              {step !== totalSteps && (
                <div className="w-12 sm:w-32 h-0.5 bg-gray-200 mx-2 sm:mx-3">
                  <div
                    className={`h-full transition-all duration-300 ${
                      currentStep > step ? "bg-dark w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;