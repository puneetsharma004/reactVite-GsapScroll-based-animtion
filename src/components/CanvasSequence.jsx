import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import FrameLoader from "./FrameLoader";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 250;

function getFrameSrc(i) {
  const padded = String(i).padStart(3, "0");
  return `/assets/ezgif-frame-${padded}.jpg`;
}

export default function CanvasSequence() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const scrollHintRef = useRef(null);
  const labelRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let cancelled = false;

    // ── Canvas sizing ──────────────────────────────────
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ── Frame rendering ────────────────────────────────
    const images = new Array(TOTAL_FRAMES).fill(null);
    let settledCount = 0;
    const imageSeq = { frame: 0 };

    function renderFrame() {
      const img = images[Math.floor(imageSeq.frame)];
      if (!img?.complete || !img.naturalWidth) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const x = (canvas.width - img.naturalWidth * scale) / 2;
      const y = (canvas.height - img.naturalHeight * scale) / 2;
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    }

    // ── GSAP init ──────────────────────────────────────
    function initGSAP() {
      setLoaded(true);
      renderFrame();

      // Canvas fade in
      gsap.fromTo(
        canvas,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.inOut" }
      );

      // Label fade in
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" }
      );

      // Scroll sequence
      gsap.to(imageSeq, {
        frame: TOTAL_FRAMES - 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Hide scroll hint once user starts scrolling
            if (scrollHintRef.current) {
              scrollHintRef.current.style.opacity =
                self.progress > 0.05 ? "0" : "1";
            }
          },
        },
        onUpdate: renderFrame,
      });
    }

    // ── Preload frames ─────────────────────────────────
    function onSettle() {
      settledCount++;
      setProgress(Math.round((settledCount / TOTAL_FRAMES) * 100));
      if (settledCount === TOTAL_FRAMES && !cancelled) initGSAP();
    }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = () => { images[i] = img; onSettle(); };
      img.onerror = () => { console.warn(`Missing frame ${i}`); onSettle(); };
      img.src = getFrameSrc(i);
    }

    return () => {
      cancelled = true;
      ScrollTrigger.killAll();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      {!loaded && <FrameLoader progress={progress} />}

      <div ref={wrapperRef} className="relative">
        <canvas
          ref={canvasRef}
          className="block opacity-0"
        />

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 transition-opacity duration-500 z-10 pointer-events-none"
        >
          <span className="text-[14px] tracking-[0.4em] text-white/40 uppercase font-mono">
            scroll to explore
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-bounce" />
        </div>

        {/* Cinematic label */}
        <div
          ref={labelRef}
          className="fixed bottom-10 left-10 opacity-0 pointer-events-none z-10"
        >
          <p className="text-[9px] tracking-[0.35em] text-white/25 uppercase font-mono">
            sequence / 001
          </p>
        </div>
      </div>

      <div className="h-48" />
    </>
  );
}