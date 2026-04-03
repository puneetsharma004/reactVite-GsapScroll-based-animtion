import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const TARGET = new Date("2026-12-18T00:00:00");

function getTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 1000 / 60 / 60 / 24),
    hours: Math.floor((diff / 1000 / 60 / 60) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function DoomCountdown() {
  const [time, setTime] = useState(getTimeLeft());
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const taglineRef = useRef(null);

  // Live countdown tick
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Entrance animations on scroll into view
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40, letterSpacing: "0.5em" },
        {
          opacity: 1, y: 0, letterSpacing: "0.12em",
          duration: 1.4, ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 1, ease: "power3.out",
          stagger: 0.12,
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        taglineRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 1.2, delay: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const units = [
    { label: "days",    value: pad(time.days)    },
    { label: "hours",   value: pad(time.hours)   },
    { label: "minutes", value: pad(time.minutes) },
    { label: "seconds", value: pad(time.seconds) },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Background grid lines — architectural/doom feel */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Vertical side lines */}
      <div className="absolute top-0 left-16 w-px h-full bg-white/5" />
      <div className="absolute top-0 right-16 w-px h-full bg-white/5" />

      {/* Corner brackets */}
      <div className="absolute top-10 left-10 w-5 h-5 border-t border-l border-white/20" />
      <div className="absolute top-10 right-10 w-5 h-5 border-t border-r border-white/20" />
      <div className="absolute bottom-10 left-10 w-5 h-5 border-b border-l border-white/20" />
      <div className="absolute bottom-10 right-10 w-5 h-5 border-b border-r border-white/20" />

      {/* Top label */}
      <p className="text-[9px] tracking-[0.5em] text-white/20 uppercase font-mono mb-16">
        victor von doom / classified / mmxxvi
      </p>

      {/* Main heading */}
      <h2
        ref={headingRef}
        className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.12em] uppercase text-center mb-4 opacity-0"
      >
        The Hour Approaches
      </h2>

      {/* Sub heading */}
      <p
        ref={taglineRef}
        className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-mono mb-20 opacity-0"
      >
        18 · XII · MMXXVI — reckoning commences
      </p>

      {/* Countdown grid */}
      <div ref={gridRef} className="grid grid-cols-4 gap-0 w-full max-w-3xl">
        {units.map(({ label, value }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center py-10 relative
              ${i !== units.length - 1 ? "border-r border-white/10" : ""}
            `}
          >
            {/* Top micro line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-white/15" />

            <span className="font-display text-6xl md:text-8xl text-white leading-none tabular-nums">
              {value}
            </span>
            <span className="text-[8px] tracking-[0.4em] text-white/25 uppercase font-mono mt-4">
              {label}
            </span>

            {/* Bottom micro line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-white/15" />
          </div>
        ))}
      </div>

      {/* Horizontal rule */}
      <div className="w-full max-w-3xl h-px bg-white/10 mt-0" />

      {/* Bottom status line */}
      <div className="flex items-center gap-3 mt-8">
        {/* Pulsing dot */}
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/60" />
        </span>
        <p className="text-[8px] tracking-[0.4em] text-white/20 uppercase font-mono">
          countdown active — do not interfere
        </p>
      </div>

    </section>
  );
}