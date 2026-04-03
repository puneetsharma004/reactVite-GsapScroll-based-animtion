import CanvasSequence from "./components/CanvasSequence";
import DoomCountdown from "./components/Doomcountdown";


export default function App() {
  return (
    <main className="bg-black overflow-x-hidden">
      <CanvasSequence />
      <DoomCountdown />
    </main>
  );
}