import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getFrameSrc(i) {
  const padded = String(i).padStart(3, "0");
  return `/assets/ezgif-frame-${padded}.jpg`;
}

const TOTAL_FRAMES = 250;

export default function App() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const images = [];
    let loadedCount = 0;
    const imageSeq = { frame: 0 };

    function renderFrame() {
      const img = images[Math.floor(imageSeq.frame)];
      if (!img?.complete) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const x = (canvas.width - img.naturalWidth * scale) / 2;
      const y = (canvas.height - img.naturalHeight * scale) / 2;
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    }

    function initGSAP() {
      setLoaded(true);
      renderFrame();

      gsap.to(imageSeq, {
        frame: TOTAL_FRAMES - 1,
        ease: "none",
        scrollTrigger: {
          trigger: canvas,
          start: "top top",
          end: "+=3000",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
        onUpdate: renderFrame,
      });

      return () => {
        ScrollTrigger.killAll();
        window.removeEventListener("resize", resizeCanvas);
      };
    }

    let cleanup = () => {};

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          cleanup = initGSAP();
        }
      };
      images.push(img);
    }

    return () => cleanup();
  }, []);

  return (
    <div>
      {!loaded && (
        <div style={{
          position: "fixed", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#000", color: "#fff", fontSize: "1.2rem", zIndex: 10
        }}>
          Loading frames...
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <div style={{ height: "200px" }} />
    </div>
  );
}