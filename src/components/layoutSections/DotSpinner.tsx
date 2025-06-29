export const DotSpinner = () => (
  <div className="relative w-full h-full">
    {[...Array(9)].map((_, i) => (
      <span
        key={i}
        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-600 rounded-full"
        style={{
          transform: `rotate(${i * 45}deg) translate(12px)`,
          animation: 'dotSpin 1.5s linear infinite',
          animationDelay: `${i * 0.15}s`,
          opacity: 1 - i * 0.1,
        }}
      />
    ))}
    <style jsx>{`
      @keyframes dotSpin {
        0% {
          transform: rotate(0deg) translate(12px);
        }
        100% {
          transform: rotate(360deg) translate(12px);
        }
      }
    `}</style>
  </div>
);