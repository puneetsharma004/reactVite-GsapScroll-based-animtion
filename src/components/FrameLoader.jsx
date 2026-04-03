export default function FrameLoader({ progress }) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden font-mono">

      <div className="absolute top-6 left-6 w-3.5 h-3.5 border-t border-l border-white/15" />
      <div className="absolute top-6 right-6 w-3.5 h-3.5 border-t border-r border-white/15" />
      <div className="absolute bottom-6 left-6 w-3.5 h-3.5 border-b border-l border-white/15" />
      <div className="absolute bottom-6 right-6 w-3.5 h-3.5 border-b border-r border-white/15" />

      <div className="text-center w-[380px] relative">

        <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-6">
          scroll experience / 2025
        </p>

        <h1 className="font-display text-[72px] text-white tracking-wide leading-none mb-2">
          Loading
        </h1>

        <p className="text-[10px] tracking-[0.3em] text-white/25 uppercase mb-12">
          Preparing cinematic sequence
        </p>

        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase">frames</span>
            <span className="text-[13px] font-bold text-white">{progress}%</span>
          </div>

          <div className="w-full h-px bg-white/10 relative">
            <div
              className="h-px bg-white transition-all duration-150 ease-linear relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute -top-[3px] right-0 w-px h-[7px] bg-white" />
            </div>
          </div>
        </div>

        <p className="text-[9px] tracking-[0.3em] text-white/20 uppercase mt-8">
          {progress < 30 && "initializing..."}
          {progress >= 30 && progress < 60 && "decoding frames..."}
          {progress >= 60 && progress < 90 && "mapping scroll curve..."}
          {progress >= 90 && progress < 100 && "almost there..."}
          {progress === 100 && "ready."}
        </p>

      </div>
    </div>
  );
}