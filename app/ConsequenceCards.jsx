'use client';
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   CONSEQUENCE CARDS — Data-Driven
   
   ALL VOLATILE NUMBERS LIVE IN THE DATA OBJECT BELOW.
   
   Daily update process:
   1. Change the numbers in DATA
   2. Update DATA.lastUpdated
   3. Commit and push
   4. Vercel redeploys in 45 seconds
   5. Every card updates simultaneously
   ═══════════════════════════════════════════════════════════════ */

const DATA = {
  lastUpdated: "April 6, 2026",
  sources: "Pentagon, AAA, CSIS, YouGov, CNN/SSRS, The Intercept",
  warStart: "2026-02-28T00:00:00Z",
  totalCost: 62_000_000_000,
  dailyRate: 1_800_000_000,
  perMinute: 1_250_000,
  perHousehold: 487,
  households: "127 million",
  gasBefore: 2.98,
  gasCurrent: 4.12,
  gasChange: 38,
  gasAnnualExtra: 1_430,
  kia: 15,
  wia: "520+",
  wiaPerDay: 14,
  missilesLaunched: 400,
  missileCostM: 2.2,
  missileInterval: 48,
  missileProduction: 190,
  interceptorPct: 34,
  interceptorCostM: 36.6,
  interceptorProduction: 76,
  ukraineYear1B: 113,
  ukrainePct: 55,
  childrenInsured: "21.8M",
  teacherSalaries: "953,846",
  scholarships: "1.55 million",
  approvalBefore: 46,
  approvalCurrent: 35,
  disapprovalPct: 66,
};

/* ═══ EVERYTHING BELOW READS FROM DATA ═══ */

const T = { mono: "'IBM Plex Mono','Menlo',monospace", serif: "'Playfair Display','Georgia',serif", bg: "#0c0c0d", red: "#dc2626" };
const SITE_URL = "https://consequence.app";
const WAR_START = new Date(DATA.warStart);
const PER_SECOND = DATA.dailyRate / 86400;
const totalB = (DATA.totalCost / 1e9).toFixed(0);
const dailyB = (DATA.dailyRate / 1e9).toFixed(1);
const approvalDrop = DATA.approvalBefore - DATA.approvalCurrent;

function LiveCost() {
  const [v, setV] = useState(0); const s = useRef(Date.now());
  useEffect(() => { const i = setInterval(() => setV(Math.floor(((Date.now() - s.current) / 1000) * PER_SECOND)), 60); return () => clearInterval(i); }, []);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>${v.toLocaleString('en-US')}</span>;
}
function Ticker() {
  const [v, setV] = useState(DATA.totalCost);
  useEffect(() => { const i = setInterval(() => setV(x => x + PER_SECOND * 0.05), 50); return () => clearInterval(i); }, []);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>${Math.floor(v).toLocaleString('en-US')}</span>;
}
function Days() {
  const [d, setD] = useState(0);
  useEffect(() => { const t = () => setD(Math.floor((Date.now() - WAR_START.getTime()) / 864e5)); t(); const i = setInterval(t, 60000); return () => clearInterval(i); }, []);
  return <span>{d}</span>;
}
function daysNow() { return Math.floor((Date.now() - WAR_START.getTime()) / 864e5); }

const CARDS = [
  { id: "since-you-opened", color: T.red,
    ogTitle: `The Iran war costs $${Math.round(PER_SECOND).toLocaleString('en-US')} every second`,
    ogDesc: "A teacher's annual salary every 3 seconds.",
    render: () => <>
      <div style={S.top}>Since you opened this</div>
      <div style={{ ...S.big, color: T.red }}><LiveCost /></div>
      <div style={S.line}>has been spent on the Iran war.</div>
      <div style={S.sub}>That's a teacher's annual salary every 3 seconds.</div>
    </> },
  { id: "total-cost", color: T.red,
    ogTitle: `$${totalB} billion and counting`,
    ogDesc: `$${dailyB} billion a day. $$1.25 million a minute.`,
    render: () => <>
      <div style={S.top}>Total cost · Day <Days /></div>
      <div style={{ ...S.big, color: T.red }}><Ticker /></div>
      <div style={S.line}>and counting.</div>
      <div style={S.sub}>${dailyB} billion a day. $1.25 million a minute.</div>
    </> },
  { id: "your-share", color: "#f97316",
    ogTitle: `Your household has paid $${DATA.perHousehold} for this war`,
    ogDesc: `Based on ${DATA.households} U.S. households.`,
    render: () => <>
      <div style={S.top}>Your share</div>
      <div style={{ ...S.big, color: "#f97316" }}>${DATA.perHousehold}</div>
      <div style={S.line}>That's what your household has paid so far.</div>
      <div style={S.sub}>Based on {DATA.households} U.S. households.</div>
    </> },
  { id: "gas-prices", color: "#eab308",
    ogTitle: `Gas: $${DATA.gasBefore} → $${DATA.gasCurrent} since the war started`,
    ogDesc: `+${DATA.gasChange}%. An extra $${DATA.gasAnnualExtra.toLocaleString('en-US')} per year.`,
    render: () => <>
      <div style={S.top}>At the pump</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", justifyContent: "center" }}>
        <span style={{ fontFamily: T.mono, fontSize: "18px", color: "rgba(255,255,255,0.15)", fontWeight: 500 }}>${DATA.gasBefore}</span>
        <span style={{ fontFamily: T.mono, fontSize: "14px", color: "rgba(255,255,255,0.08)" }}>→</span>
        <span style={{ ...S.big, color: "#eab308", margin: 0 }}>${DATA.gasCurrent}</span>
      </div>
      <div style={S.line}>Gas, per gallon, since Feb 28.</div>
      <div style={S.sub}>+{DATA.gasChange}%. An extra ${DATA.gasAnnualExtra.toLocaleString('en-US')} a year for your car.</div>
    </> },
  { id: "cruise-missiles", color: T.red,
    ogTitle: `Every ${DATA.missileInterval} seconds, a $${DATA.missileCostM}M cruise missile is gone`,
    ogDesc: `${DATA.missilesLaunched} launched. The U.S. produces ${DATA.missileProduction} a year.`,
    render: () => <>
      <div style={S.top}>Every {DATA.missileInterval} seconds</div>
      <div style={{ ...S.big, color: T.red }}>1 cruise missile</div>
      <div style={S.line}>${DATA.missileCostM} million. Gone.</div>
      <div style={S.sub}>{DATA.missilesLaunched} launched so far. The U.S. produces {DATA.missileProduction} a year.</div>
    </> },
  { id: "casualties", color: "#f97316",
    ogTitle: `${DATA.kia} Americans killed. ${DATA.wia} wounded.`,
    ogDesc: `${DATA.wiaPerDay} wounded every day since it started.`,
    render: () => <>
      <div style={S.top}>American service members</div>
      <div style={{ ...S.big, color: "#f97316" }}>{DATA.kia} killed</div>
      <div style={{ ...S.big, color: "rgba(255,255,255,0.2)", fontSize: "clamp(20px,5vw,30px)", marginTop: "2px" }}>{DATA.wia} wounded</div>
      <div style={S.line}>That's {DATA.wiaPerDay} wounded every day since it started.</div>
    </> },
  { id: "interceptor-stockpile", color: T.red,
    ogTitle: `${DATA.interceptorPct}% of the most expensive missile stockpile — gone in ${daysNow()} days`,
    ogDesc: `$${DATA.interceptorCostM}M each. ${DATA.interceptorProduction} produced per year.`,
    render: () => <>
      <div style={S.top}>America's most expensive interceptor</div>
      <div style={{ ...S.big, color: T.red }}>{DATA.interceptorPct}%</div>
      <div style={S.line}>of the entire stockpile. Used in <Days /> days.</div>
      <div style={S.sub}>${DATA.interceptorCostM} million each. {DATA.interceptorProduction} produced per year.</div>
    </> },
  { id: "ukraine-comparison", color: "#3b82f6",
    ogTitle: `${daysNow()} days of Iran = more than half of Ukraine's entire first year`,
    ogDesc: `$${totalB}B vs $${DATA.ukraineYear1B}B.`,
    render: () => <>
      <div style={S.top}>For context</div>
      <div style={{ ...S.big, color: "#3b82f6" }}>{DATA.ukrainePct}%</div>
      <div style={S.line}><Days /> days of Iran already cost more than half of what Ukraine cost in a full year.</div>
      <div style={S.sub}>${totalB}B vs ${DATA.ukraineYear1B}B.</div>
    </> },
  { id: "what-it-buys", color: "#22c55e",
    ogTitle: `$${totalB} billion buys ${DATA.childrenInsured} children health insurance`,
    ogDesc: `Or ${DATA.teacherSalaries} teacher salaries. Or ${DATA.scholarships} scholarships.`,
    render: () => <>
      <div style={S.top}>What ${totalB} billion buys</div>
      <div style={{ ...S.big, color: "#22c55e" }}>{DATA.childrenInsured}</div>
      <div style={S.line}>children covered by health insurance for a year.</div>
      <div style={S.sub}>Or {DATA.teacherSalaries} teacher salaries. Or {DATA.scholarships} full college scholarships.</div>
    </> },
  { id: "approval", color: T.red,
    ogTitle: `Approval dropped ${approvalDrop} points in ${daysNow()} days`,
    ogDesc: `${DATA.approvalBefore}% → ${DATA.approvalCurrent}%. ${DATA.disapprovalPct}% now disapprove.`,
    render: () => <>
      <div style={S.top}>Approval rating</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", justifyContent: "center" }}>
        <span style={{ fontFamily: T.mono, fontSize: "18px", color: "rgba(255,255,255,0.15)", fontWeight: 500 }}>{DATA.approvalBefore}%</span>
        <span style={{ fontFamily: T.mono, fontSize: "14px", color: "rgba(255,255,255,0.08)" }}>→</span>
        <span style={{ ...S.big, color: T.red, margin: 0 }}>{DATA.approvalCurrent}%</span>
      </div>
      <div style={S.line}>-{approvalDrop} points in <Days /> days.</div>
      <div style={S.sub}>{DATA.disapprovalPct}% of Americans now disapprove.</div>
    </> },
];

const S = {
  top: { fontFamily: T.mono, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", marginBottom: "10px" },
  big: { fontFamily: T.mono, fontSize: "clamp(32px,8vw,52px)", fontWeight: 700, lineHeight: 1, marginBottom: "6px" },
  line: { fontFamily: T.serif, fontSize: "15px", fontStyle: "italic", color: "rgba(255,255,255,0.45)", lineHeight: 1.4, marginTop: "12px" },
  sub: { fontFamily: T.mono, fontSize: "9px", color: "rgba(255,255,255,0.12)", lineHeight: 1.5, marginTop: "8px" },
};

function Shell({ card, index, total, onNext, onPrev, onShare, referred }) {
  return <div style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px", width: "100%", maxWidth: "380px", overflow: "hidden" }}>
    {/* CHANGE 3: "Someone sent you this" — only on shared links */}
    {referred && index === 0 && <div style={{ padding: "8px 28px 0", textAlign: "center" }}>
      <span style={{ fontFamily: T.mono, fontSize: "8px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.12)" }}>SOMEONE SENT YOU THIS</span>
    </div>}
    <div style={{ padding: referred && index === 0 ? "20px 28px 28px" : "36px 28px 28px", textAlign: "center", minHeight: "200px", display: "flex", flexDirection: "column", justifyContent: "center" }}>{card.render()}</div>
    <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
      <button onClick={onPrev} disabled={index === 0} style={nb(index === 0)}>←</button>
      <button onClick={onShare} style={{ ...nb(false), flex: 2, borderLeft: "1px solid rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.03)", fontSize: "8px", letterSpacing: "0.06em" }}>SHARE</button>
      <button onClick={onNext} disabled={index === total - 1} style={nb(index === total - 1)}>→</button>
    </div>
  </div>;
}
function nb(d) { return { flex: 1, padding: "11px", background: "none", border: "none", cursor: d ? "default" : "pointer", fontFamily: T.mono, fontSize: "10px", color: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.12)" }; }

export default function ConsequenceCards() {
  // CHANGE 1: Randomize card order — position effects wash out, dwell data becomes real signal
  const [cards] = useState(() => [...CARDS].sort(() => Math.random() - 0.5));
  const [cur, setCur] = useState(0);
  const [sd, setSd] = useState(0);
  const [ts, setTs] = useState(null);
  const [te, setTe] = useState(null);
  const [toast, setToast] = useState("");
  const [tv, setTv] = useState(false);
  // CHANGE 3: Detect if user arrived via a shared link
  const [referred] = useState(() => typeof window !== 'undefined' && window.location.pathname.startsWith('/c/'));
  const entry = useRef(Date.now()); const maxC = useRef(0);

  useEffect(() => {
    const dw = Date.now() - entry.current;
    if (dw > 100) console.log(`[T] dwell card=${cur} ms=${dw} id=${cards[cur]?.id}`);
    if (cur > maxC.current) maxC.current = cur;
    entry.current = Date.now();
    return () => console.log(`[T] terminal card=${cur} max=${maxC.current} id=${cards[cur]?.id}`);
  }, [cur]);

  const share = (i) => {
    const c = cards[i]; const url = `${SITE_URL}/c/${c.id}`;
    console.log(`[T] share card=${i} id=${c.id}`);
    if (navigator.share) navigator.share({ title: c.ogTitle, text: c.ogDesc, url }).catch(() => {});
    else navigator.clipboard.writeText(url).then(() => { setToast("Link copied"); setTv(true); setTimeout(() => setTv(false), 2000); }).catch(() => {});
  };

  const go = (d) => { const n = cur + d; if (n < 0 || n >= cards.length) return; setSd(d); setTimeout(() => { setCur(n); setSd(0); }, 350); };

  return <div style={{ width: "100%", minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", userSelect: "none", position: "relative", overflow: "hidden" }}
    onTouchStart={(e) => { setTe(null); setTs(e.targetTouches[0].clientX); }}
    onTouchMove={(e) => setTe(e.targetTouches[0].clientX)}
    onTouchEnd={() => { if (!ts || !te) return; const d = ts - te; if (Math.abs(d) > 50) go(d > 0 ? 1 : -1); }}>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 600px 400px at 30% 50%, rgba(220,38,38,0.025), transparent)", animation: "ad1 120s linear infinite" }} />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 500px 500px at 70% 60%, rgba(255,255,255,0.008), transparent)", animation: "ad2 160s linear infinite" }} />
    <div key={cur} style={{ transform: sd ? `translateX(${sd * -40}px) scale(0.96)` : "none", opacity: sd ? 0 : 1, transition: sd ? "transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease-out" : "none", animation: sd ? "none" : "si 0.4s cubic-bezier(0.16,1,0.3,1)", width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
      <Shell card={cards[cur]} index={cur} total={cards.length} onNext={() => go(1)} onPrev={() => go(-1)} onShare={() => share(cur)} referred={referred} />
    </div>
    {/* CHANGE 4: Transmission prompt — appears after last card */}
    {cur === cards.length - 1 && <div style={{ marginTop: "20px", fontFamily: T.serif, fontSize: "13px", fontStyle: "italic", color: "rgba(255,255,255,0.15)", textAlign: "center", maxWidth: "300px", lineHeight: 1.5, position: "relative", zIndex: 1, animation: "si 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
      Send this to one person who doesn't know these numbers.
    </div>}
    <div style={{ marginTop: "16px", fontFamily: T.mono, fontSize: "7px", color: "rgba(255,255,255,0.06)", textAlign: "center", position: "relative", zIndex: 1 }}>
      Numbers as of {DATA.lastUpdated} · {DATA.sources}
    </div>
    <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: `translateX(-50%) translateY(${tv ? "0" : "20px"})`, opacity: tv ? 1 : 0, transition: "all 0.25s", background: "#1a1a1e", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "4px", fontFamily: T.mono, fontSize: "9px", color: "rgba(255,255,255,0.4)", zIndex: 100, pointerEvents: "none" }}>{toast}</div>
    <style>{`*{box-sizing:border-box;margin:0}body{background:${T.bg}}button:active{opacity:0.6}
      @keyframes ad1{0%{transform:translate(0%,0%)}25%{transform:translate(15%,-8%)}50%{transform:translate(-5%,12%)}75%{transform:translate(-12%,-5%)}100%{transform:translate(0%,0%)}}
      @keyframes ad2{0%{transform:translate(0%,0%)}25%{transform:translate(-10%,10%)}50%{transform:translate(8%,-6%)}75%{transform:translate(12%,8%)}100%{transform:translate(0%,0%)}}
      @keyframes si{from{opacity:0;transform:translateX(30px) scale(1.03)}to{opacity:1;transform:translateX(0px) scale(1)}}`}</style>
  </div>;
}
