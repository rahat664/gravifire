"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import MissionScienceLink from "@/components/mission-control/MissionScienceLink";

type MissionId = "m0" | "m1" | "m4" | "m6";

const missionTitles: Record<MissionId, string> = {
  m0: "M0 · TWO SECONDS OF SMOKE",
  m1: "M1 · SIBAL: THE STANDARD",
  m4: "M4 · SILICONE: THE GASKET PARADOX",
  m6: "M6 · THE AEGIS LIST & THE LOCKED DOOR",
};

export default function PlayCanvasMissionChrome({ missionId, tutorial = false, reviewMode = false, children }: { missionId: MissionId; tutorial?: boolean; reviewMode?: boolean; children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => tutorial && missionId === "m0" && typeof window !== "undefined" && window.sessionStorage.getItem("gravifire:tutorial:playcanvas:v1") !== "1");
  const pauseDialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.pointerLockElement) document.exitPointerLock();
      setPaused((current) => {
        const next = !current;
        if (next && document.activeElement instanceof HTMLElement) previousFocusRef.current = document.activeElement;
        window.dispatchEvent(new CustomEvent("mission-pause", { detail: next }));
        return next;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!paused) {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
      return;
    }
    const dialog = pauseDialogRef.current;
    if (!dialog) return;
    const focusables = () => Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])'));
    focusables()[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = focusables();
      if (!elements.length) { event.preventDefault(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [paused]);

  const dismissTutorial = () => {
    window.sessionStorage.setItem("gravifire:tutorial:playcanvas:v1", "1");
    setShowTutorial(false);
  };

  const resume = () => {
    setPaused(false);
    window.dispatchEvent(new CustomEvent("mission-pause", { detail: false }));
  };

  return <div className="mission-chrome relative h-full w-full">
    {children}
    <div className="playcanvas-science-header">
      {reviewMode && <div className="playcanvas-review-badge" data-testid="playcanvas-review-badge">REVIEW MODE · PLAYCANVAS</div>}
      <MissionScienceLink missionId={missionId} />
    </div>
    <div className="pointer-events-none absolute inset-0 z-40">
      <div className="mission-control-hints absolute bottom-5 left-5 border-l border-cyan-200/35 bg-[#050a0d]/65 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400 backdrop-blur-sm">
        WASD MOVE · SHIFT SPRINT · E INTERACT · MOUSE LOOK · ESC PAUSE
      </div>
    </div>
    {showTutorial && !paused && <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-[#020507]/55 p-5 backdrop-blur-[2px]">
      <section className="mission-overlay-panel w-full max-w-sm border border-cyan-200/25 bg-[#071116]/95 p-6 text-white shadow-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-cyan-200">FIRST MISSION / CONTROL BRIEF</p>
        <h2 className="mt-3 text-xl font-light tracking-[0.08em]">LEARN THE FIELD GRAMMAR</h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">Move with WASD, sprint with Shift, and press E when a station is ready. Mouse look begins after clicking the mission view.</p>
        <button onClick={dismissTutorial} className="mt-6 w-full border border-cyan-200/45 bg-cyan-200 px-4 py-3 text-sm font-semibold text-slate-950">BEGIN {missionTitles[missionId]}</button>
      </section>
    </div>}
    {paused && <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-[#020507]/85 p-5 backdrop-blur-sm">
      <section ref={pauseDialogRef} role="dialog" aria-modal="true" aria-labelledby="mission-pause-heading" className="mission-overlay-panel w-full max-w-sm border border-cyan-200/25 bg-[#071116] p-6 text-center text-white shadow-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-cyan-200">GRAVIFIRE / MISSION CONTROL</p>
        <h2 id="mission-pause-heading" className="mt-3 text-2xl font-light tracking-[0.12em]">PAUSED</h2>
        <div className="mt-6 grid gap-2">
          <button onClick={resume} className="border border-cyan-200/50 bg-cyan-200 px-4 py-3 text-sm font-semibold text-slate-950">RESUME</button>
          <button onClick={() => setShowControls((current) => !current)} className="border border-white/15 px-4 py-3 text-sm">{showControls ? "HIDE CONTROLS" : "CONTROLS"}</button>
          <button onClick={() => window.location.reload()} className="border border-white/15 px-4 py-3 text-sm">RESTART MISSION</button>
          <a href="/mission-control" className="border border-white/15 px-4 py-3 text-sm">RETURN TO MISSION CONTROL</a>
        </div>
        {showControls && <p className="mt-5 border-t border-white/10 pt-4 font-mono text-[10px] uppercase leading-6 tracking-[0.12em] text-slate-400">WASD · MOVE<br />SHIFT · SPRINT<br />E · INTERACT / INSPECT / REVIEW<br />MOUSE · LOOK<br />ESC · PAUSE</p>}
      </section>
    </div>}
  </div>;
}
