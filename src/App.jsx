import React, { useState, useMemo } from "react";
import {
  Users, Building2, GitCompareArrows, KanbanSquare, LayoutDashboard,
  Search, Plus, X, MapPin, Briefcase, GraduationCap, Wallet,
  ChevronRight, ChevronLeft, Check, ArrowRight, TrendingUp, Sparkles,
} from "lucide-react";

/* ============================ 基礎データ ============================ */

const SKILL_POOL = [
  "法人営業", "営業", "マーケティング", "Webマーケ", "経理", "財務",
  "人事", "労務", "Python", "JavaScript", "React", "SQL", "データ分析",
  "プロジェクト管理", "英語", "簿記2級", "ITコンサル", "UIデザイン",
  "カスタマーサポート",
];

const INDUSTRIES = ["IT・通信", "商社", "金融", "メーカー", "サービス", "コンサル"];
const LOCATIONS = ["東京", "大阪", "リモート"];

const STAGES = ["書類選考", "一次面接", "二次面接", "最終面接", "内定", "入社"];

const APPLICANT_STATUS = {
  新規: "bg-slate-100 text-slate-600",
  面談済: "bg-sky-100 text-sky-700",
  紹介中: "bg-indigo-100 text-indigo-700",
  選考中: "bg-amber-100 text-amber-700",
  決定: "bg-emerald-100 text-emerald-700",
  見送り: "bg-rose-100 text-rose-600",
};

const initialApplicants = [
  { id: "A01", name: "田中 健太", age: 32, role: "法人営業（IT商社）", exp: 8, skills: ["法人営業", "営業", "英語", "プロジェクト管理"], industry: "IT・通信", salary: 650, location: "東京", status: "紹介中", reg: "2026-05-12" },
  { id: "A02", name: "佐藤 美咲", age: 28, role: "Webマーケター", exp: 5, skills: ["Webマーケ", "マーケティング", "データ分析", "SQL"], industry: "IT・通信", salary: 550, location: "東京", status: "新規", reg: "2026-06-02" },
  { id: "A03", name: "鈴木 大輔", age: 38, role: "経理マネージャー", exp: 14, skills: ["経理", "財務", "簿記2級", "プロジェクト管理"], industry: "金融", salary: 750, location: "東京", status: "選考中", reg: "2026-04-20" },
  { id: "A04", name: "山本 彩", age: 26, role: "フロントエンドエンジニア", exp: 3, skills: ["JavaScript", "React", "UIデザイン"], industry: "IT・通信", salary: 500, location: "リモート", status: "選考中", reg: "2026-05-28" },
  { id: "A05", name: "中村 翔", age: 41, role: "人事部長", exp: 16, skills: ["人事", "労務", "プロジェクト管理", "英語"], industry: "メーカー", salary: 900, location: "大阪", status: "新規", reg: "2026-06-05" },
  { id: "A06", name: "小林 由香", age: 30, role: "データアナリスト", exp: 6, skills: ["データ分析", "Python", "SQL", "マーケティング"], industry: "IT・通信", salary: 600, location: "東京", status: "選考中", reg: "2026-05-09" },
  { id: "A07", name: "加藤 直樹", age: 35, role: "CS責任者", exp: 10, skills: ["カスタマーサポート", "プロジェクト管理", "英語"], industry: "サービス", salary: 520, location: "東京", status: "面談済", reg: "2026-06-01" },
  { id: "A08", name: "渡辺 梨花", age: 29, role: "ITコンサルタント", exp: 6, skills: ["ITコンサル", "プロジェクト管理", "SQL", "英語"], industry: "コンサル", salary: 700, location: "東京", status: "面談済", reg: "2026-05-22" },
];

const initialCompanies = [
  { id: "C01", name: "テックブリッジ株式会社", industry: "IT・通信", position: "シニアフロントエンドエンジニア", req: ["JavaScript", "React"], minExp: 3, salaryMin: 450, salaryMax: 650, location: "リモート", openings: 2 },
  { id: "C02", name: "株式会社グローバル商事", industry: "商社", position: "法人営業（海外）", req: ["法人営業", "英語"], minExp: 5, salaryMin: 550, salaryMax: 800, location: "東京", openings: 3 },
  { id: "C03", name: "ファイナンスパートナーズ", industry: "金融", position: "経理マネージャー候補", req: ["経理", "簿記2級"], minExp: 8, salaryMin: 650, salaryMax: 850, location: "東京", openings: 1 },
  { id: "C04", name: "株式会社マーケットラボ", industry: "IT・通信", position: "データマーケター", req: ["データ分析", "SQL"], minExp: 4, salaryMin: 500, salaryMax: 700, location: "東京", openings: 2 },
  { id: "C05", name: "ネクストHRソリューションズ", industry: "コンサル", position: "人事コンサルタント", req: ["人事", "労務"], minExp: 10, salaryMin: 700, salaryMax: 1000, location: "大阪", openings: 1 },
  { id: "C06", name: "株式会社カスタマーリンク", industry: "サービス", position: "CSマネージャー", req: ["カスタマーサポート", "プロジェクト管理"], minExp: 6, salaryMin: 480, salaryMax: 620, location: "東京", openings: 2 },
];

const initialPipeline = [
  { id: "P01", applicantId: "A03", companyId: "C03", stage: "二次面接", updated: "2026-06-06" },
  { id: "P02", applicantId: "A06", companyId: "C04", stage: "一次面接", updated: "2026-06-07" },
  { id: "P03", applicantId: "A04", companyId: "C01", stage: "最終面接", updated: "2026-06-05" },
  { id: "P04", applicantId: "A01", companyId: "C02", stage: "一次面接", updated: "2026-06-08" },
];

/* ============================ マッチングロジック ============================ */
// 合計100点：スキル40 / 年収20 / 業界15 / 勤務地15 / 経験10
function scoreMatch(a, c) {
  const matched = c.req.filter((s) => a.skills.includes(s));
  const missing = c.req.filter((s) => !a.skills.includes(s));
  const skill = c.req.length ? Math.round((matched.length / c.req.length) * 40) : 0;

  let salary;
  if (a.salary >= c.salaryMin && a.salary <= c.salaryMax) salary = 20;
  else {
    const dist = a.salary < c.salaryMin ? c.salaryMin - a.salary : a.salary - c.salaryMax;
    salary = Math.max(0, Math.round(20 - (dist / 100) * 8));
  }

  const industry = a.industry === c.industry ? 15 : 0;

  const flexible = a.location === "リモート" || c.location === "リモート";
  const location = a.location === c.location ? 15 : flexible ? 9 : 0;

  const exp = a.exp >= c.minExp ? 10 : Math.max(0, Math.round((a.exp / c.minExp) * 10));

  const total = skill + salary + industry + location + exp;
  return { total, skill, salary, industry, location, exp, matched, missing };
}

function scoreColor(t) {
  if (t >= 75) return { text: "text-emerald-600", bg: "bg-emerald-500", soft: "bg-emerald-50", ring: "#059669" };
  if (t >= 50) return { text: "text-amber-600", bg: "bg-amber-500", soft: "bg-amber-50", ring: "#d97706" };
  return { text: "text-slate-500", bg: "bg-slate-400", soft: "bg-slate-50", ring: "#94a3b8" };
}

/* ============================ 小物コンポーネント ============================ */

function ScoreRing({ value, size = 56 }) {
  const c = scoreColor(value);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - value / 100);
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c.ring} strokeWidth="6"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .5s ease" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        className={`font-bold ${c.text}`} style={{ fontSize: size * 0.3 }}>{value}</text>
    </svg>
  );
}

function Chip({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    indigo: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    rose: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  };
  return <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function Field({ label, children }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-slate-500">{label}</div>
      {children}
    </div>
  );
}

/* ============================ メイン ============================ */

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [applicants, setApplicants] = useState(initialApplicants);
  const [companies, setCompanies] = useState(initialCompanies);
  const [pipeline, setPipeline] = useState(initialPipeline);

  const font = { fontFamily: "'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic','Meiryo',sans-serif" };

  const applicantById = (id) => applicants.find((x) => x.id === id);
  const companyById = (id) => companies.find((x) => x.id === id);

  // 進捗を作成（マッチング画面から紹介）
  function refer(applicantId, companyId) {
    if (pipeline.some((p) => p.applicantId === applicantId && p.companyId === companyId)) return;
    const id = "P" + String(pipeline.length + 90);
    setPipeline((p) => [...p, { id, applicantId, companyId, stage: "書類選考", updated: "2026-06-09" }]);
    setApplicants((arr) => arr.map((a) => (a.id === applicantId && a.status === "新規" ? { ...a, status: "紹介中" } : a)));
    setTab("pipeline");
  }

  function moveStage(pid, dir) {
    setPipeline((arr) =>
      arr.map((p) => {
        if (p.id !== pid) return p;
        const i = STAGES.indexOf(p.stage);
        const ni = Math.min(STAGES.length - 1, Math.max(0, i + dir));
        return { ...p, stage: STAGES[ni], updated: "2026-06-09" };
      })
    );
  }

  const nav = [
    { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { id: "applicants", label: "応募者DB", icon: Users },
    { id: "companies", label: "紹介先DB", icon: Building2 },
    { id: "matching", label: "マッチング", icon: GitCompareArrows },
    { id: "pipeline", label: "進捗管理", icon: KanbanSquare },
  ];

  return (
    <div style={font} className="flex min-h-screen w-full bg-slate-50 text-slate-800">
      {/* サイドバー */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
            <Sparkles size={18} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">マッチワークス</div>
            <div className="text-[10px] text-slate-400">人材紹介管理プラットフォーム</div>
          </div>
        </div>
        <nav className="flex-1 px-3">
          {nav.map((n) => {
            const Icon = n.icon;
            const on = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition
                  ${on ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}>
                <Icon size={18} /> {n.label}
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 text-[10px] text-slate-400">デモ環境 / サンプルデータ</div>
      </aside>

      {/* モバイルタブ */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white md:hidden">
        {nav.map((n) => {
          const Icon = n.icon;
          const on = tab === n.id;
          return (
            <button key={n.id} onClick={() => setTab(n.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${on ? "text-indigo-600" : "text-slate-400"}`}>
              <Icon size={18} />{n.label.replace("DB", "")}
            </button>
          );
        })}
      </div>

      {/* メイン */}
      <main className="min-w-0 flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">
        {tab === "dashboard" && <Dashboard {...{ applicants, companies, pipeline, setTab }} />}
        {tab === "applicants" && <ApplicantsDB {...{ applicants, setApplicants, companies, refer }} />}
        {tab === "companies" && <CompaniesDB {...{ companies, setCompanies, applicants, refer }} />}
        {tab === "matching" && <Matching {...{ applicants, companies, refer, pipeline }} />}
        {tab === "pipeline" && <Pipeline {...{ pipeline, applicantById, companyById, moveStage }} />}
      </main>
    </div>
  );
}

/* ============================ ダッシュボード ============================ */
function Dashboard({ applicants, companies, pipeline, setTab }) {
  const active = pipeline.filter((p) => p.stage !== "入社").length;
  const offers = pipeline.filter((p) => p.stage === "内定" || p.stage === "入社").length;
  const totalOpenings = companies.reduce((s, c) => s + c.openings, 0);

  const kpis = [
    { label: "登録応募者", value: applicants.length, sub: "名", icon: Users, accent: "text-indigo-600", to: "applicants" },
    { label: "紹介先企業", value: companies.length, sub: `求人 ${totalOpenings}件`, icon: Building2, accent: "text-sky-600", to: "companies" },
    { label: "進行中の選考", value: active, sub: "件", icon: TrendingUp, accent: "text-amber-600", to: "pipeline" },
    { label: "内定・入社", value: offers, sub: "件", icon: Check, accent: "text-emerald-600", to: "pipeline" },
  ];

  const funnel = STAGES.map((s) => ({ stage: s, n: pipeline.filter((p) => p.stage === s).length }));
  const maxN = Math.max(1, ...funnel.map((f) => f.n));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">ダッシュボード</h1>
      <p className="mb-6 text-sm text-slate-500">応募者・紹介先・選考状況の全体像</p>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <button key={k.label} onClick={() => setTab(k.to)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{k.label}</span>
                <Icon size={16} className={k.accent} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{k.value}</span>
                <span className="text-xs text-slate-400">{k.sub}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-bold">選考ファネル</h2>
        <div className="space-y-2.5">
          {funnel.map((f) => (
            <div key={f.stage} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-slate-500">{f.stage}</span>
              <div className="h-6 flex-1 overflow-hidden rounded bg-slate-100">
                <div className="flex h-full items-center justify-end rounded bg-indigo-500 px-2 text-[10px] font-semibold text-white transition-all"
                  style={{ width: `${Math.max(8, (f.n / maxN) * 100)}%` }}>
                  {f.n > 0 ? f.n : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================ 応募者DB ============================ */
function ApplicantsDB({ applicants, setApplicants, companies, refer }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("すべて");
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);

  const filtered = applicants.filter((a) => {
    const hit = (a.name + a.role + a.skills.join("") + a.industry).includes(q);
    const sf = statusF === "すべて" || a.status === statusF;
    return hit && sf;
  });

  const sel = selected ? applicants.find((a) => a.id === selected) : null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">応募者DB</h1>
          <p className="text-sm text-slate-500">{applicants.length}名を登録中</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <Plus size={16} /> 応募者を追加
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
          <Search size={16} className="text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="氏名・職種・スキルで検索"
            className="w-full bg-transparent py-2 text-sm outline-none" />
        </div>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
          {["すべて", ...Object.keys(APPLICANT_STATUS)].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-4 py-3 font-medium">氏名 / 職種</th>
                <th className="px-4 py-3 font-medium">経験</th>
                <th className="px-4 py-3 font-medium">希望業界</th>
                <th className="px-4 py-3 font-medium">希望年収</th>
                <th className="px-4 py-3 font-medium">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} onClick={() => setSelected(a.id)}
                  className="cursor-pointer border-b border-slate-100 transition last:border-0 hover:bg-indigo-50/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{a.name} <span className="text-xs font-normal text-slate-400">{a.age}歳</span></div>
                    <div className="text-xs text-slate-500">{a.role}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{a.exp}年</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{a.industry}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{a.salary}万円</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${APPLICANT_STATUS[a.status]}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">条件に合う応募者がいません。検索条件を変えてみてください。</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {sel && <ApplicantDetail a={sel} companies={companies} onClose={() => setSelected(null)} refer={refer} />}
      {adding && <AddApplicant onClose={() => setAdding(false)} onAdd={(a) => { setApplicants((arr) => [...arr, a]); setAdding(false); }} count={applicants.length} />}
    </div>
  );
}

function ApplicantDetail({ a, companies, onClose, refer }) {
  const ranked = useMemo(
    () => companies.map((c) => ({ c, ...scoreMatch(a, c) })).sort((x, y) => y.total - x.total).slice(0, 3),
    [a, companies]
  );
  return (
    <Drawer onClose={onClose} title={a.name} subtitle={`${a.role} ・ ${a.age}歳`} status={a.status}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="経験年数"><div className="flex items-center gap-1.5 text-sm"><GraduationCap size={14} className="text-slate-400" />{a.exp}年</div></Field>
        <Field label="希望年収"><div className="flex items-center gap-1.5 text-sm"><Wallet size={14} className="text-slate-400" />{a.salary}万円</div></Field>
        <Field label="希望業界"><div className="flex items-center gap-1.5 text-sm"><Briefcase size={14} className="text-slate-400" />{a.industry}</div></Field>
        <Field label="勤務地"><div className="flex items-center gap-1.5 text-sm"><MapPin size={14} className="text-slate-400" />{a.location}</div></Field>
      </div>
      <Field label="スキル">
        <div className="flex flex-wrap gap-1.5">{a.skills.map((s) => <Chip key={s} tone="indigo">{s}</Chip>)}</div>
      </Field>
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <GitCompareArrows size={13} /> マッチ度の高い紹介先 TOP3
        </div>
        <div className="space-y-2">
          {ranked.map(({ c, total, missing }) => (
            <div key={c.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              <ScoreRing value={total} size={48} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{c.name}</div>
                <div className="truncate text-xs text-slate-500">{c.position}</div>
                {missing.length > 0 && <div className="mt-0.5 text-[10px] text-rose-500">不足: {missing.join("・")}</div>}
              </div>
              <button onClick={() => refer(a.id, c.id)}
                className="shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                紹介
              </button>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

function AddApplicant({ onClose, onAdd, count }) {
  const [f, setF] = useState({ name: "", age: 30, role: "", exp: 5, skills: [], industry: INDUSTRIES[0], salary: 500, location: LOCATIONS[0] });
  const toggle = (s) => setF((p) => ({ ...p, skills: p.skills.includes(s) ? p.skills.filter((x) => x !== s) : [...p.skills, s] }));
  const ok = f.name.trim() && f.role.trim();
  return (
    <Modal onClose={onClose} title="応募者を追加">
      <Field label="氏名"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp} placeholder="例：山田 太郎" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="年齢"><input type="number" value={f.age} onChange={(e) => setF({ ...f, age: +e.target.value })} className={inp} /></Field>
        <Field label="経験年数"><input type="number" value={f.exp} onChange={(e) => setF({ ...f, exp: +e.target.value })} className={inp} /></Field>
      </div>
      <Field label="現職・職種"><input value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className={inp} placeholder="例：法人営業" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="希望業界"><select value={f.industry} onChange={(e) => setF({ ...f, industry: e.target.value })} className={inp}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select></Field>
        <Field label="勤務地"><select value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} className={inp}>{LOCATIONS.map((i) => <option key={i}>{i}</option>)}</select></Field>
      </div>
      <Field label="希望年収（万円）"><input type="number" value={f.salary} onChange={(e) => setF({ ...f, salary: +e.target.value })} className={inp} /></Field>
      <Field label="スキル（複数選択可）">
        <div className="flex flex-wrap gap-1.5">
          {SKILL_POOL.map((s) => (
            <button key={s} onClick={() => toggle(s)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition ${f.skills.includes(s) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{s}</button>
          ))}
        </div>
      </Field>
      <button disabled={!ok}
        onClick={() => onAdd({ id: "A" + String(count + 90), ...f, status: "新規", reg: "2026-06-09" })}
        className="mt-1 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
        登録する
      </button>
    </Modal>
  );
}

/* ============================ 紹介先DB ============================ */
function CompaniesDB({ companies, setCompanies, applicants, refer }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);

  const filtered = companies.filter((c) => (c.name + c.position + c.req.join("") + c.industry).includes(q));
  const sel = selected ? companies.find((c) => c.id === selected) : null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">紹介先DB</h1>
          <p className="text-sm text-slate-500">{companies.length}社を登録中</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <Plus size={16} /> 紹介先を追加
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
        <Search size={16} className="text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="企業名・ポジション・必須スキルで検索"
          className="w-full bg-transparent py-2 text-sm outline-none" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((c) => (
          <button key={c.id} onClick={() => setSelected(c.id)}
            className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm">
            <div className="mb-1 flex items-start justify-between gap-2">
              <span className="font-bold leading-snug">{c.name}</span>
              <span className="shrink-0 rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">求人 {c.openings}名</span>
            </div>
            <div className="mb-2 text-xs text-slate-500">{c.industry} ・ {c.location}</div>
            <div className="mb-2 text-sm font-medium text-slate-700">{c.position}</div>
            <div className="flex flex-wrap gap-1.5">
              {c.req.map((s) => <Chip key={s}>{s}</Chip>)}
            </div>
            <div className="mt-2 text-xs text-slate-400">年収 {c.salaryMin}〜{c.salaryMax}万円 ・ 経験{c.minExp}年以上</div>
          </button>
        ))}
        {filtered.length === 0 && <div className="col-span-full py-10 text-center text-sm text-slate-400">条件に合う紹介先がありません。</div>}
      </div>

      {sel && <CompanyDetail c={sel} applicants={applicants} onClose={() => setSelected(null)} refer={refer} />}
      {adding && <AddCompany onClose={() => setAdding(false)} onAdd={(c) => { setCompanies((arr) => [...arr, c]); setAdding(false); }} count={companies.length} />}
    </div>
  );
}

function CompanyDetail({ c, applicants, onClose, refer }) {
  const ranked = useMemo(
    () => applicants.map((a) => ({ a, ...scoreMatch(a, c) })).sort((x, y) => y.total - x.total).slice(0, 3),
    [c, applicants]
  );
  return (
    <Drawer onClose={onClose} title={c.name} subtitle={`${c.industry} ・ ${c.location}`}>
      <div className="rounded-lg bg-slate-50 p-3">
        <div className="text-sm font-semibold">{c.position}</div>
        <div className="mt-1 text-xs text-slate-500">年収 {c.salaryMin}〜{c.salaryMax}万円 ・ 経験{c.minExp}年以上 ・ 募集{c.openings}名</div>
      </div>
      <Field label="必須スキル"><div className="flex flex-wrap gap-1.5">{c.req.map((s) => <Chip key={s} tone="indigo">{s}</Chip>)}</div></Field>
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <GitCompareArrows size={13} /> マッチ度の高い応募者 TOP3
        </div>
        <div className="space-y-2">
          {ranked.map(({ a, total, missing }) => (
            <div key={a.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              <ScoreRing value={total} size={48} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{a.name} <span className="text-xs font-normal text-slate-400">{a.age}歳</span></div>
                <div className="truncate text-xs text-slate-500">{a.role} ・ {a.exp}年</div>
                {missing.length > 0 && <div className="mt-0.5 text-[10px] text-rose-500">不足: {missing.join("・")}</div>}
              </div>
              <button onClick={() => refer(a.id, c.id)}
                className="shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">紹介</button>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

function AddCompany({ onClose, onAdd, count }) {
  const [f, setF] = useState({ name: "", industry: INDUSTRIES[0], position: "", req: [], minExp: 3, salaryMin: 400, salaryMax: 700, location: LOCATIONS[0], openings: 1 });
  const toggle = (s) => setF((p) => ({ ...p, req: p.req.includes(s) ? p.req.filter((x) => x !== s) : [...p.req, s] }));
  const ok = f.name.trim() && f.position.trim() && f.req.length > 0;
  return (
    <Modal onClose={onClose} title="紹介先を追加">
      <Field label="企業名"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp} placeholder="例：株式会社サンプル" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="業界"><select value={f.industry} onChange={(e) => setF({ ...f, industry: e.target.value })} className={inp}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select></Field>
        <Field label="勤務地"><select value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} className={inp}>{LOCATIONS.map((i) => <option key={i}>{i}</option>)}</select></Field>
      </div>
      <Field label="募集ポジション"><input value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} className={inp} placeholder="例：法人営業" /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="最低経験(年)"><input type="number" value={f.minExp} onChange={(e) => setF({ ...f, minExp: +e.target.value })} className={inp} /></Field>
        <Field label="年収下限"><input type="number" value={f.salaryMin} onChange={(e) => setF({ ...f, salaryMin: +e.target.value })} className={inp} /></Field>
        <Field label="年収上限"><input type="number" value={f.salaryMax} onChange={(e) => setF({ ...f, salaryMax: +e.target.value })} className={inp} /></Field>
      </div>
      <Field label="募集人数"><input type="number" value={f.openings} onChange={(e) => setF({ ...f, openings: +e.target.value })} className={inp} /></Field>
      <Field label="必須スキル（複数選択可）">
        <div className="flex flex-wrap gap-1.5">
          {SKILL_POOL.map((s) => (
            <button key={s} onClick={() => toggle(s)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition ${f.req.includes(s) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{s}</button>
          ))}
        </div>
      </Field>
      <button disabled={!ok}
        onClick={() => onAdd({ id: "C" + String(count + 90), ...f })}
        className="mt-1 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40">登録する</button>
    </Modal>
  );
}

/* ============================ マッチング ============================ */
function Matching({ applicants, companies, refer, pipeline }) {
  const [mode, setMode] = useState("applicant"); // applicant起点 / company起点
  const [pick, setPick] = useState(mode === "applicant" ? applicants[0].id : companies[0].id);

  const switchMode = (m) => { setMode(m); setPick(m === "applicant" ? applicants[0].id : companies[0].id); };

  const isReferred = (aid, cid) => pipeline.some((p) => p.applicantId === aid && p.companyId === cid);

  let results = [];
  if (mode === "applicant") {
    const a = applicants.find((x) => x.id === pick);
    results = companies.map((c) => ({ key: c.id, target: c, ...scoreMatch(a, c), a, c })).sort((x, y) => y.total - x.total);
  } else {
    const c = companies.find((x) => x.id === pick);
    results = applicants.map((a) => ({ key: a.id, target: a, ...scoreMatch(a, c), a, c })).sort((x, y) => y.total - x.total);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">マッチング</h1>
      <p className="mb-5 text-sm text-slate-500">スキル40・年収20・業界15・勤務地15・経験10 の100点満点で適合度を自動算出</p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {[["applicant", "応募者起点"], ["company", "企業起点"]].map(([m, label]) => (
            <button key={m} onClick={() => switchMode(m)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === m ? "bg-indigo-600 text-white" : "text-slate-500"}`}>{label}</button>
          ))}
        </div>
        <select value={pick} onChange={(e) => setPick(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none sm:flex-none sm:min-w-64">
          {mode === "applicant"
            ? applicants.map((a) => <option key={a.id} value={a.id}>{a.name}（{a.role}）</option>)
            : companies.map((c) => <option key={c.id} value={c.id}>{c.name}（{c.position}）</option>)}
        </select>
      </div>

      <div className="space-y-2.5">
        {results.map((r) => (
          <MatchRow key={r.key} r={r} mode={mode} refer={refer} referred={isReferred(r.a.id, r.c.id)} />
        ))}
      </div>
    </div>
  );
}

function MatchRow({ r, mode, refer, referred }) {
  const [open, setOpen] = useState(false);
  const c = scoreColor(r.total);
  const title = mode === "applicant" ? r.c.name : r.a.name;
  const sub = mode === "applicant" ? r.c.position : `${r.a.role} ・ ${r.a.exp}年`;
  const breakdown = [
    { label: "スキル", v: r.skill, max: 40 },
    { label: "年収", v: r.salary, max: 20 },
    { label: "業界", v: r.industry, max: 15 },
    { label: "勤務地", v: r.location, max: 15 },
    { label: "経験", v: r.exp, max: 10 },
  ];
  return (
    <div className={`overflow-hidden rounded-xl border bg-white transition ${open ? "border-indigo-300 shadow-sm" : "border-slate-200"}`}>
      <div className="flex items-center gap-4 p-4">
        <ScoreRing value={r.total} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold">{title}</div>
          <div className="truncate text-xs text-slate-500">{sub}</div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {r.matched.map((s) => <Chip key={s} tone="emerald">{s}</Chip>)}
            {r.missing.map((s) => <Chip key={s} tone="rose">{s}</Chip>)}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button onClick={() => refer(r.a.id, r.c.id)} disabled={referred}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold ${referred ? "bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
            {referred ? <><Check size={13} /> 紹介済</> : <>紹介する <ArrowRight size={13} /></>}
          </button>
          <button onClick={() => setOpen((o) => !o)} className="text-xs text-slate-400 hover:text-slate-600">
            {open ? "内訳を閉じる" : "内訳を見る"}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
          <div className="space-y-2">
            {breakdown.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-xs text-slate-500">{b.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${(b.v / b.max) * 100}%` }} />
                </div>
                <span className="w-12 shrink-0 text-right text-xs font-medium text-slate-600">{b.v}/{b.max}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================ 進捗管理（カンバン） ============================ */
function Pipeline({ pipeline, applicantById, companyById, moveStage }) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">進捗管理</h1>
      <p className="mb-5 text-sm text-slate-500">選考ステージごとのパイプライン。カード下の矢印でステージを移動できます。</p>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {STAGES.map((stage) => {
          const cards = pipeline.filter((p) => p.stage === stage);
          const last = stage === "入社";
          return (
            <div key={stage} className="flex w-60 shrink-0 flex-col">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className={`text-sm font-bold ${last ? "text-emerald-600" : "text-slate-700"}`}>{stage}</span>
                <span className="rounded-full bg-slate-100 px-2 text-xs font-medium text-slate-500">{cards.length}</span>
              </div>
              <div className={`flex-1 space-y-2 rounded-xl border border-dashed p-2 ${last ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-slate-100/40"}`}>
                {cards.map((p) => {
                  const a = applicantById(p.applicantId);
                  const c = companyById(p.companyId);
                  if (!a || !c) return null;
                  const i = STAGES.indexOf(p.stage);
                  return (
                    <div key={p.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="text-sm font-semibold">{a.name}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <Building2 size={11} /><span className="truncate">{c.name}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-slate-400">{c.position} / 更新 {p.updated}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <button onClick={() => moveStage(p.id, -1)} disabled={i === 0}
                          className="grid h-6 w-6 place-items-center rounded text-slate-400 hover:bg-slate-100 disabled:opacity-30">
                          <ChevronLeft size={15} />
                        </button>
                        <button onClick={() => moveStage(p.id, 1)} disabled={i === STAGES.length - 1}
                          className="flex items-center gap-0.5 rounded bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-30">
                          次へ <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {cards.length === 0 && <div className="py-6 text-center text-[11px] text-slate-300">該当なし</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ 共通UI ============================ */
const inp = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400";

function Drawer({ title, subtitle, status, children, onClose }) {
  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{title}</h2>
              {status && <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${APPLICANT_STATUS[status]}`}>{status}</span>}
            </div>
            <div className="text-xs text-slate-500">{subtitle}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="space-y-5 p-5">{children}</div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="space-y-3.5 p-5">{children}</div>
      </div>
    </div>
  );
}