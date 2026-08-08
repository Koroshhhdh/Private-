import React, { useState, useEffect, useCallback } from "react";
import {
  Home,
  Trophy,
  Mic,
  CalendarCheck2,
  ShoppingBag,
  Flame,
  Play,
  Pause,
  Phone,
  Check,
  Plus,
  Minus,
  Pencil,
  ChevronLeft,
} from "lucide-react";

const C = {
  paper: "#FFF7EC",
  paperDark: "#FFEBD6",
  ink: "#332B5E",
  inkSoft: "#8A81B8",
  pen: "#FF5D8F",
  gold: "#FFB627",
  green: "#20C4B0",
  purple: "#8E7DFF",
  sky: "#3FC6E8",
  card: "#FFFFFF",
  line: "#F1E4F5",
};

import { getLocal, setLocal, getShared, setShared } from "./lib/storage";

const FONT_BODY = "'Vazirmatn', sans-serif";
const FONT_DISPLAY = "'Changa', sans-serif";

const digitMap = { "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴", "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹" };
const fa = (n) => String(n).replace(/[0-9]/g, (d) => digitMap[d]);
const todayStr = () => new Date().toISOString().slice(0, 10);

function BubbleGauge({ percent, size = 52, color = C.ink, bg = "#DEDCD0" }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, percent || 0));
  const offset = c * (1 - p / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth="5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fontSize={size * 0.26} fill={C.ink} fontWeight="700" style={{ fontFamily: FONT_BODY }}>
        {fa(Math.round(p))}
      </text>
    </svg>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1.5px solid ${C.line}`,
        borderRadius: 22,
        padding: 16,
        boxShadow: "0 6px 18px rgba(142,125,255,0.10)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, children, accent, emoji }) {
  return (
    <label className="block mb-3">
      <span style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 13, fontWeight: 700, color: C.ink }}>
        {emoji ? (
          <span style={{ fontSize: 14 }}>{emoji}</span>
        ) : accent ? (
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, display: "inline-block", flexShrink: 0 }} />
        ) : null}
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  background: C.paper,
  border: `1.5px solid ${C.line}`,
  borderRadius: 10,
  padding: "9px 12px",
  fontSize: 15,
  color: C.ink,
  outline: "none",
  fontFamily: FONT_BODY,
  boxSizing: "border-box",
};

const fancyInputStyle = (accent) => ({
  ...inputStyle,
  background: `${accent}15`,
  border: `2px solid ${accent}60`,
  borderRadius: 13,
  fontWeight: 700,
  color: C.ink,
});

export default function App() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  useEffect(() => {
    (async () => {
      const p = getLocal("profile");
      if (p) setProfile(p);
      const e1 = await getShared("entries");
      if (e1) setEntries(e1);
      const c1 = await getShared("consultations");
      if (c1) setConsultations(c1);
      setReady(true);
    })();
  }, []);

  const createProfile = (p) => {
    setLocal("profile", p);
    setProfile(p);
  };

  const refreshEntries = useCallback(async () => {
    const latest = (await getShared("entries")) || [];
    setEntries(latest);
    return latest;
  }, []);

  const saveEntry = async (data) => {
    setSaving(true);
    const latest = await refreshEntries();
    const updated = [
      ...latest.filter((e) => !(e.username === profile.username && e.date === data.date)),
      data,
    ];
    const ok = await setShared("entries", updated);
    if (ok) {
      setEntries(updated);
      showToast("ثبت شد ✓");
    } else {
      showToast("مشکلی پیش اومد، دوباره امتحان کن");
    }
    setSaving(false);
  };

  const saveConsultation = async (data) => {
    setSaving(true);
    const latest = (await getShared("consultations")) || consultations;
    const updated = [...latest, data];
    const ok = await setShared("consultations", updated);
    if (ok) {
      setConsultations(updated);
      showToast("درخواست ثبت شد ✓");
    } else {
      showToast("مشکلی پیش اومد، دوباره امتحان کن");
    }
    setSaving(false);
  };

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.paper, fontFamily: FONT_DISPLAY, fontSize: 28 }}>میدان</div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      lang="fa"
      style={{
        fontFamily: FONT_BODY,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F5F9EC 18%, #E6F1D4 40%, #CFE7B0 65%, #ABD68A 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: none; }
        ::selection { background: ${C.pen}; color: white; }
        @keyframes wiggle {
          0% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.18) rotate(-10deg); }
          40% { transform: scale(0.94) rotate(8deg); }
          60% { transform: scale(1.12) rotate(-6deg); }
          80% { transform: scale(1) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .owl-bounce { animation: wiggle 0.6s ease; }
        @keyframes floaty {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .blob { position: absolute; border-radius: 50%; filter: blur(2px); opacity: 0.5; animation: floaty 7s ease-in-out infinite; }
        @keyframes popIn {
          0% { transform: scale(0.7) translateY(6px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="blob" style={{ width: 100, height: 100, background: "#FFFFFF", top: 30, left: 20, opacity: 0.55, animationDelay: "0s" }} />
      <div className="blob" style={{ width: 70, height: 70, background: C.gold, top: "68%", left: 14, opacity: 0.35, animationDelay: "1.5s" }} />
      <div className="blob" style={{ width: 80, height: 80, background: "#8CC569", top: "22%", right: 16, opacity: 0.35, animationDelay: "0.8s" }} />
      <div className="blob" style={{ width: 55, height: 55, background: "#FFFFFF", top: "82%", right: 26, opacity: 0.45, animationDelay: "2.2s" }} />

      <div className="mx-auto w-full" style={{ maxWidth: 420, minHeight: "100vh", background: C.paper, position: "relative", boxShadow: "0 10px 50px rgba(142,125,255,0.25)" }}>
        {!profile ? (
          <Onboarding createProfile={createProfile} />
        ) : (
          <>
            <TopHeader profile={profile} entries={entries} />
            <div style={{ paddingBottom: 90 }}>
              <div style={{ display: tab === "dashboard" ? "block" : "none" }}>
                <Dashboard profile={profile} entries={entries} saveEntry={saveEntry} saving={saving} />
              </div>
              <div style={{ display: tab === "leaderboard" ? "block" : "none" }}>
                <Leaderboard profile={profile} entries={entries} />
              </div>
              <div style={{ display: tab === "podcast" ? "block" : "none" }}>
                <Podcast />
              </div>
              <div style={{ display: tab === "consultation" ? "block" : "none" }}>
                <Consultation profile={profile} consultations={consultations} saveConsultation={saveConsultation} saving={saving} />
              </div>
              <div style={{ display: tab === "shop" ? "block" : "none" }}>
                <Shop showToast={showToast} />
              </div>
            </div>
            <BottomNav tab={tab} setTab={setTab} />
            {toast && (
              <div
                style={{
                  position: "fixed",
                  bottom: 78,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: C.ink,
                  color: C.paper,
                  padding: "8px 18px",
                  borderRadius: 999,
                  fontSize: 14,
                  zIndex: 50,
                  maxWidth: 380,
                }}
              >
                {toast}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const FIELDS = [
  { key: "experimental", label: "تجربی", emoji: "🧬", color: "#20C4B0" },
  { key: "math", label: "ریاضی", emoji: "📐", color: "#3FC6E8" },
  { key: "humanities", label: "انسانی", emoji: "📚", color: "#8E7DFF" },
];

const GRADES = [
  { key: "10", label: "دهم", color: "#3FC6E8" },
  { key: "11", label: "یازدهم", color: "#FFB627" },
  { key: "12", label: "دوازدهم", color: "#FF5D8F" },
  { key: "graduate", label: "فارغ‌التحصیل", color: "#8E7DFF" },
];

function Onboarding({ createProfile }) {
  const [step, setStep] = useState("field");
  const [field, setField] = useState(null);
  const [grade, setGrade] = useState(null);
  const [nameInput, setNameInput] = useState("");

  const finish = () => {
    const username = nameInput.trim();
    if (!username) return;
    createProfile({ username, field: field.key, fieldLabel: field.label, grade: grade.key, gradeLabel: grade.label });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: 28 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 48, color: C.ink }}>میدان</div>
        <div style={{ color: C.inkSoft, fontSize: 14, marginTop: 4 }}>پیشرفتت رو هر روز ثبت کن، رتبه‌ات رو بساز</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
        {["field", "grade", "name"].map((s, i) => (
          <div
            key={s}
            style={{
              width: 26,
              height: 5,
              borderRadius: 999,
              background: step === s ? C.ink : ["field", "grade", "name"].indexOf(step) > i ? C.green : C.line,
            }}
          />
        ))}
      </div>

      {step !== "field" && (
        <button
          onClick={() => setStep(step === "name" ? "grade" : "field")}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.inkSoft, fontSize: 13, marginBottom: 10, cursor: "pointer", fontFamily: FONT_BODY, alignSelf: "flex-start" }}
        >
          <ChevronLeft size={14} style={{ transform: "rotate(180deg)" }} /> برگشت
        </button>
      )}

      {step === "field" && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 12 }}>رشته‌ات چیه؟</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FIELDS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setField(f); setStep("grade"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: `${f.color}1A`, border: `2px solid ${f.color}`, borderRadius: 14,
                  padding: "14px 16px", fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: FONT_BODY, cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 22 }}>{f.emoji}</span> {f.label}
              </button>
            ))}
          </div>
        </Card>
      )}

      {step === "grade" && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 12 }}>پایه‌ی تحصیلیت چیه؟</div>
          <div className="grid grid-cols-2 gap-3">
            {GRADES.map((g) => (
              <button
                key={g.key}
                onClick={() => { setGrade(g); setStep("name"); }}
                style={{
                  background: `${g.color}1A`, border: `2px solid ${g.color}`, borderRadius: 14,
                  padding: "16px 8px", fontSize: 15, fontWeight: 700, color: C.ink, fontFamily: FONT_BODY, cursor: "pointer",
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </Card>
      )}

      {step === "name" && (
        <Card>
          <div className="mb-2 text-sm" style={{ color: C.inkSoft }}>
            یه اسم برای خودت انتخاب کن. همین اسم روی جدول رتبه‌بندی به بقیه نشون داده می‌شه.
          </div>
          <input
            style={{ ...inputStyle, marginTop: 8 }}
            placeholder="مثلاً: علی_تجربی"
            value={nameInput}
            maxLength={20}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && finish()}
          />
          <button
            onClick={finish}
            disabled={!nameInput.trim()}
            style={{
              width: "100%",
              marginTop: 14,
              background: nameInput.trim() ? `linear-gradient(135deg, ${C.pen}, ${C.purple})` : C.line,
              color: "white",
              border: "none",
              borderRadius: 14,
              padding: "11px 0",
              fontSize: 15,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              cursor: nameInput.trim() ? "pointer" : "not-allowed",
            }}
          >
            بزن بریم
          </button>
        </Card>
      )}

      <div style={{ marginTop: 18, fontSize: 12, color: C.inkSoft, textAlign: "center", lineHeight: 1.9 }}>
        این یه نمونه‌ی اولیه‌ست — اطلاعات رتبه‌بندی بین همه‌ی کسایی که از این لینک استفاده می‌کنن مشترکه.
      </div>
    </div>
  );
}

const OWL_PHRASES = [
  "خسته نباشی! 💪",
  "امروز چند ساعت خوندی؟",
  "یه استکان چایی بزن، بریم که رتبه بسازیم!",
  "تست بزن، طلا کن! ✨",
  "رتبه‌ی تک‌رقمی همینجاست، نزدیکه!",
  "یادت نره امروز رو ثبت کنی 📖",
];

function OwlMascot() {
  const [bounce, setBounce] = useState(false);
  const [phrase, setPhrase] = useState(null);

  const tap = () => {
    setBounce(true);
    setPhrase(OWL_PHRASES[Math.floor(Math.random() * OWL_PHRASES.length)]);
    setTimeout(() => setBounce(false), 600);
    setTimeout(() => setPhrase(null), 2600);
  };

  return (
    <div style={{ position: "relative" }}>
      {phrase && (
        <div
          style={{
            position: "absolute",
            top: -14,
            right: 46,
            background: C.card,
            color: C.ink,
            fontSize: 11,
            padding: "6px 10px",
            borderRadius: 12,
            border: `1.5px solid ${C.line}`,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(142,125,255,0.18)",
            animation: "popIn 0.25s ease",
            zIndex: 10,
          }}
        >
          {phrase}
        </div>
      )}
      <button
        onClick={tap}
        className={bounce ? "owl-bounce" : ""}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}
        aria-label="جغد میدان"
      >
        <svg width="50" height="50" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="owlBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.purple} />
              <stop offset="100%" stopColor={C.pen} />
            </linearGradient>
          </defs>
          <ellipse cx="38" cy="90" rx="7" ry="4" fill={C.gold} />
          <ellipse cx="62" cy="90" rx="7" ry="4" fill={C.gold} />
          <ellipse cx="16" cy="58" rx="10" ry="19" fill="url(#owlBody)" transform="rotate(-18 16 58)" />
          <ellipse cx="84" cy="58" rx="10" ry="19" fill="url(#owlBody)" transform="rotate(18 84 58)" />
          <path d="M27 20 Q20 4 35 13 Z" fill="url(#owlBody)" />
          <path d="M73 20 Q80 4 65 13 Z" fill="url(#owlBody)" />
          <ellipse cx="50" cy="54" rx="35" ry="33" fill="url(#owlBody)" />
          <ellipse cx="50" cy="66" rx="20" ry="21" fill="#FFF8F1" />
          <path d="M41 60 Q50 65 59 60" stroke={C.paperDark} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M39 70 Q50 76 61 70" stroke={C.paperDark} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M22 35 Q31 25 41 32" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M78 35 Q69 25 59 32" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="32" cy="46" r="13" fill="#fff" />
          <circle cx="68" cy="46" r="13" fill="#fff" />
          <circle cx="33" cy="47" r="6" fill={C.ink} />
          <circle cx="69" cy="47" r="6" fill={C.ink} />
          <circle cx="31" cy="44" r="2" fill="#fff" />
          <circle cx="67" cy="44" r="2" fill="#fff" />
          <polygon points="50,52 44,61 56,61" fill={C.gold} />
        </svg>
      </button>
    </div>
  );
}

function TopHeader({ profile, entries }) {
  const streak = computeStreak(entries, profile.username);
  const initial = profile.username.trim()[0] || "؟";
  return (
    <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.pen}, ${C.purple})`,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {initial}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.username}</div>
          <div style={{ fontSize: 11, color: C.inkSoft, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            <Flame size={12} color={streak > 0 ? C.pen : C.inkSoft} />
            {fa(streak)} روز متوالی
            {profile.fieldLabel && <span>· {profile.fieldLabel} · {profile.gradeLabel}</span>}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.ink }}>میدان</div>
        <OwlMascot />
      </div>
    </div>
  );
}

function computeStreak(entries, username) {
  const dates = new Set(entries.filter((e) => e.username === username).map((e) => e.date));
  let streak = 0;
  let cursor = new Date();
  if (!dates.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
const GENERAL_SUBJECTS = [
  { key: "farsi", label: "فارسی", emoji: "📖", color: "#FF5D8F" },
  { key: "arabic", label: "عربی", emoji: "🕌", color: "#FFB627" },
  { key: "language", label: "زبان", emoji: "🌍", color: "#3FC6E8" },
  { key: "health", label: "سلامت", emoji: "💪", color: "#20C4B0" },
  { key: "identity", label: "هویت اجتماعی", emoji: "🧭", color: "#8E7DFF" },
];
const
