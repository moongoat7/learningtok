import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_DECK = [
  {
    id: "m1",
    type: "mcq",
    topic: "Physics: Kinematics",
    prompt: "A car accelerates from 0 to 20 m/s in 4 s. What is the average acceleration?",
    choices: ["2.5 m/s²", "5 m/s²", "10 m/s²", "80 m/s²"],
    correctIndex: 1,
    explain: "a = Δv/Δt = 20/4 = 5 m/s².",
    tags: ["physics", "kinematics"],
  },
  {
    id: "f1",
    type: "flashcard",
    topic: "Hebrew slang",
    front: "אשכרה (ashkara)",
    back:
      "Meaning: 'actually/for real' (emphatic).\n" +
      "Usage: 'אשכרה עשית את זה?' = 'You actually did it?'",
    tags: ["hebrew", "slang"],
  },
  {
    id: "v1",
    type: "video",
    topic: "Python: Functions",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    prompt: "Watch, then answer: What does `return` do in a Python function?",
    choices: [
      "Prints a value to the console",
      "Stops the function and provides a value to the caller",
      "Defines a variable",
      "Imports a module",
    ],
    correctIndex: 1,
    explain:
      "`return` ends the function's execution and hands a value back to the caller.",
    tags: ["python", "functions"],
  },
  {
    id: "m2",
    type: "mcq",
    topic: "Math: Derivatives",
    prompt: "d/dx (x^2) = ?",
    choices: ["x", "2x", "x^2", "2"],
    correctIndex: 1,
    explain: "Power rule: d/dx x^n = n x^{n-1}.",
    tags: ["math", "calculus"],
  },
];

const phoneShadow =
  "shadow-[0_10px_30px_rgba(0,0,0,0.25)] shadow-black/20 border border-white/10";

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

function ProgressRing({ value }) {
  const radius = 20;
  const stroke = 6;
  const norm = (value ?? 0) / 100;
  const circ = 2 * Math.PI * radius;
  const offset = circ - norm * circ;
  return (
    <svg width={52} height={52} className="rotate-[-90deg]">
      <circle cx={26} cy={26} r={radius} strokeWidth={stroke} stroke="currentColor" className="text-zinc-800" fill="transparent" />
      <circle cx={26} cy={26} r={radius} strokeWidth={stroke} stroke="currentColor" className="text-white" fill="transparent" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

function Header({ progressPercent, onImportClick, onReset }) {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
          <span className="text-xs font-bold">LT</span>
        </div>
        <div>
          <div className="text-sm text-white/90 font-semibold">LearningTok</div>
          <div className="text-xs text-white/60">Swipe to learn</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onImportClick} className="px-2.5 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition">Import</button>
        <button onClick={onReset} className="px-2.5 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition">Reset</button>
        <div className="text-white/80"><ProgressRing value={progressPercent} /></div>
      </div>
    </div>
  );
}

function PhoneChrome({ children }) {
  return (
    <div className={`relative mx-auto max-w-[380px] h-[740px] rounded-[2.25rem] ${phoneShadow} overflow-hidden bg-gradient-to-b from-zinc-900 to-black text-white`}>
      <div className="absolute left-1/2 -translate-x-1/2 top-2 w-40 h-5 rounded-b-2xl bg-black/40" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

function MCQCard({ item, onAnswered }) {
  const [picked, setPicked] = useState(null);
  const correct = picked !== null && picked === item.correctIndex;
  useEffect(() => {
    const onKey = (e) => {
      if (["1","2","3","4"].includes(e.key)) {
        const i = Number(e.key) - 1;
        if (i >= 0 && i < item.choices.length) setPicked(i);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item]);
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="text-xs uppercase tracking-wider text-white/60">{item.topic}</div>
      <h2 className="text-xl font-semibold leading-snug">{item.prompt}</h2>
      <div className="grid gap-2 mt-2">
        {item.choices.map((c, i) => (
          <button key={i} onClick={() => setPicked(i)} className={`text-left p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition ${picked === i ? (i === item.correctIndex ? "ring-2 ring-green-400" : "ring-2 ring-red-400") : ""}`}>
            <div className="text-sm font-medium">{c}</div>
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className={`mt-2 p-3 rounded-xl ${correct ? "bg-green-500/10" : "bg-red-500/10"}`}>
          <div className="text-sm whitespace-pre-line">{item.explain}</div>
          <button onClick={() => onAnswered(correct)} className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Next</button>
        </div>
      )}
      <div className="text-xs text-white/50 mt-auto">Tip: press 1–4 to answer.</div>
    </div>
  );
}

function FlashcardCard({ item, onFlip, flipped, onNext }) {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="text-xs uppercase tracking-wider text-white/60">{item.topic}</div>
      <h2 className="text-xl font-semibold leading-snug">Flashcard</h2>
      <button onClick={onFlip} className={`relative h-56 rounded-2xl border border-white/10 bg-white/5 overflow-hidden group`}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div key={flipped ? "back" : "front"} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0 p-4 flex items-center justify-center text-center">
            <div className="text-lg font-medium whitespace-pre-line">{flipped ? item.back : item.front}</div>
          </motion.div>
        </AnimatePresence>
      </button>
      {flipped && (
        <button onClick={onNext} className="self-start mt-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Next</button>
      )}
      <div className="text-xs text-white/50 mt-auto">Tap the card to flip.</div>
    </div>
  );
}

function VideoQuizCard({ item, onAnswered }) {
  const [picked, setPicked] = useState(null);
  const correct = picked !== null && picked === item.correctIndex;
  const videoRef = useRef(null);
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="text-xs uppercase tracking-wider text-white/60">{item.topic}</div>
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
        <video ref={videoRef} src={item.videoUrl} controls className="w-full h-56 object-cover" />
      </div>
      <div className="mt-2 text-base font-semibold">{item.prompt}</div>
      <div className="grid gap-2">
        {item.choices.map((c,i)=> (
          <button key={i} onClick={()=>setPicked(i)} className={`text-left p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition ${picked===i ? (i===item.correctIndex?"ring-2 ring-green-400":"ring-2 ring-red-400"):""}`}>
            <div className="text-sm font-medium">{c}</div>
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className={`mt-2 p-3 rounded-xl ${correct?"bg-green-500/10":"bg-red-500/10"}`}>
          <div className="text-sm whitespace-pre-line">{item.explain}</div>
          <button onClick={() => onAnswered(correct)} className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Next</button>
        </div>
      )}
    </div>
  );
}

function Card({ item, onNext, onCorrect }) {
  const [flipped, setFlipped] = useState(false);
  if (item.type === "mcq") {
    return <MCQCard item={item} onAnswered={(ok)=>{ if(ok) onCorrect?.(); onNext(); }} />;
  }
  if (item.type === "flashcard") {
    return (
      <FlashcardCard item={item} flipped={flipped} onFlip={() => setFlipped(!flipped)} onNext={() => { onCorrect?.(); onNext(); }} />
    );
  }
  if (item.type === "video") {
    return <VideoQuizCard item={item} onAnswered={(ok)=>{ if(ok) onCorrect?.(); onNext(); }} />;
  }
  return <div className="p-6">Unknown card type</div>;
}

export default function App() {
  const [deck, setDeck] = useLocalStorage("lt.deck", DEFAULT_DECK);
  const [index, setIndex] = useLocalStorage("lt.index", 0);
  const [correctMap, setCorrectMap] = useLocalStorage("lt.correct", {});
  const fileRef = useRef(null);

  const total = deck.length || 1;
  const correctCount = useMemo(() => Object.values(correctMap).filter(Boolean).length, [correctMap]);
  const progressPercent = Math.round((correctCount / total) * 100);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); next(); }
      if (e.key === "ArrowUp") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, deck]);

  const next = () => setIndex((i) => Math.min(i + 1, deck.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const onCorrect = () => {
    const id = deck[index]?.id;
    if (!id) return;
    setCorrectMap((m) => ({ ...m, [id]: true }));
  };

  const onImportClick = () => fileRef.current?.click();
  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("JSON must be an array of cards");
      setDeck(data);
      setIndex(0);
      setCorrectMap({});
    } catch (err) {
      alert("Import failed: " + err.message);
    } finally {
      e.target.value = "";
    }
  };

  const onReset = () => {
    setDeck(DEFAULT_DECK);
    setIndex(0);
    setCorrectMap({});
  };

  // touch/swipe vertical
  const touchStart = useRef(null);
  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    e.preventDefault();
  };
  const onTouchEnd = (e) => {
    const y = e.changedTouches[0].clientY;
    const dy = y - (touchStart.current ?? y);
    const TH = 50;
    if (dy < -TH) next();
    if (dy > TH) prev();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black py-8 px-4">
      <div className={`relative mx-auto max-w-[380px] h-[740px] rounded-[2.25rem] ${phoneShadow} overflow-hidden bg-gradient-to-b from-zinc-900 to-black text-white`}>
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-40 h-5 rounded-b-2xl bg-black/40" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative z-10 h-full flex flex-col">
          <Header progressPercent={progressPercent} onImportClick={onImportClick} onReset={onReset} />
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onFile} />
          <div className="relative flex-1 overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <AnimatePresence initial={false} mode="popLayout">
              {deck[index] && (
                <motion.div key={deck[index].id} initial={{ y: 80, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
                  <Card item={deck[index]} onNext={next} onCorrect={onCorrect} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute bottom-3 left-0 right-0 mx-auto w-full flex items-center justify-center gap-2 text-white/60 text-xs">
              <button onClick={() => prev()} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">Prev</button>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">{index+1} / {deck.length}</div>
              <button onClick={() => next()} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">Next</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[380px] mx-auto mt-4 text-center text-white/60 text-sm">
        <div className="mb-2">How to run:</div>
        <div className="text-left text-xs bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="font-semibold mb-1">Local:</div>
          <ol className="list-decimal list-inside space-y-1">
            <li>npm install</li>
            <li>npm run dev</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
