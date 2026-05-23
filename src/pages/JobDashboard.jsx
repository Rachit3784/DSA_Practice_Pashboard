import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import {
  Briefcase, ShieldCheck, Search, Plus, Pencil, Trash2, Upload, Share2,
  Eye, EyeOff, Copy, X, TrendingUp, CheckCircle2, XCircle, MessageSquare,
  Mail, Send, FileText, Menu, Bell, FileSpreadsheet, Zap, Target, Award,
  Building2, User, Globe, Download, Rocket, BarChart3, Clock, AlertCircle,
  ThumbsUp, ThumbsDown, Minus, Activity, Home, Link, ExternalLink, Sun, Moon,
  Hand
} from "lucide-react";

/* ─── UTILS ─── */
const uid = () => Math.random().toString(36).slice(2, 9);
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_CFG = {
  Applied:   { color: "var(--status-Applied)", light: "var(--status-Applied-light)", icon: Clock },
  Screening: { color: "var(--status-Screening)", light: "var(--status-Screening-light)", icon: Activity },
  Interview: { color: "var(--status-Interview)", light: "var(--status-Interview-light)", icon: MessageSquare },
  Offered:   { color: "var(--status-Offered)", light: "var(--status-Offered-light)", icon: ThumbsUp },
  Rejected:  { color: "var(--status-Rejected)", light: "var(--status-Rejected-light)", icon: ThumbsDown },
  Withdrawn: { color: "var(--status-Withdrawn)", light: "var(--status-Withdrawn-light)", icon: Minus },
};

const SEED_JOBS = [];

const SEED_ACCOUNTS = [];

/* ─── CSV / EXCEL / PDF ─── */
const escCSV = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
function buildCSV(rows) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]).filter(k => k !== "id");
  return [keys.join(","), ...rows.map(r => keys.map(k => escCSV(r[k])).join(","))].join("\n");
}
function dlFile(content, name, mime) {
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([content], { type: mime })), download: name,
  });
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 400);
}
function dlCSV(rows, name)   { dlFile(buildCSV(rows), name + ".csv", "text/csv;charset=utf-8;"); }
function dlExcel(rows, name) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]).filter(k => k !== "id");
  const xe = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const hdr = keys.map(k => `<Cell ss:StyleID="h"><Data ss:Type="String">${xe(k.toUpperCase())}</Data></Cell>`).join("");
  const body = rows.map(r => `<Row>${keys.map(k=>`<Cell><Data ss:Type="String">${xe(r[k])}</Data></Cell>`).join("")}</Row>`).join("");
  const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles><Style ss:ID="h"><Interior ss:Color="#6C5CE7" ss:Pattern="Solid"/><Font ss:Color="#FFFFFF" ss:Bold="1"/></Style></Styles>
<Worksheet ss:Name="Sheet1"><Table><Row>${hdr}</Row>${body}</Table></Worksheet></Workbook>`;
  dlFile(xml, name + ".xls", "application/vnd.ms-excel");
}
function dlPDF(rows, title) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]).filter(k => k !== "id");
  const win = window.open("", "_blank");
  if (!win) { alert("Allow popups to download PDF"); return; }
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;padding:32px;background:#f7f8fc;color:#2d3436}
    h2{background:linear-gradient(135deg,#6C5CE7,#a29bfe);color:#fff;padding:20px 28px;border-radius:14px;margin-bottom:24px;font-size:20px}
    table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)}
    th{background:#6C5CE7;color:#fff;padding:11px 13px;text-align:left;font-size:10px;font-weight:800;letter-spacing:.7px;text-transform:uppercase}
    td{padding:11px 13px;border-bottom:1px solid #eef0f5;font-size:12px}tr:nth-child(even)td{background:#f7f8fc}
    .foot{text-align:center;margin-top:18px;font-size:10px;color:#aaa}
  </style></head><body>
    <h2>${title} · ${rows.length} records · ${new Date().toLocaleDateString("en-IN")}</h2>
    <table><thead><tr>${keys.map(k=>`<th>${k.toUpperCase()}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r=>`<tr>${keys.map(k=>`<td>${r[k]??""}</td>`).join("")}</tr>`).join("")}</tbody></table>
    <div class="foot">JobTrack Pro · Confidential</div>
  </body></html>`);
  win.document.close(); win.focus();
  setTimeout(() => win.print(), 600);
}

/* ─── CSV PARSER ─── */
function parseCSV(text) {
  const lines = text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").trim().split("\n");
  if (lines.length < 2) return [];
  const parseRow = (line) => {
    const vals = []; let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQ && line[i+1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
      else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    vals.push(cur.trim());
    return vals.map(v => v.replace(/^"|"$/g, "").trim());
  };
  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[\s\-]/g, "_"));
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const obj = { id: uid() };
    headers.forEach((h, i) => { obj[h] = parseRow(line)[i] ?? ""; });
    return obj;
  });
}
function mapJob(row) {
  const g = (...ks) => { for (const k of ks) { const v = row[k]||row[k.replace(/_/g,"")]||row[k.replace(/_/g," ")]; if(v) return v; } return ""; };
  return {
    id: uid(),
    company:  g("company","company_name","employer","organisation","organization"),
    role:     g("role","job_title","position","title","designation"),
    status:   Object.keys(STATUS_CFG).find(s=>s.toLowerCase()===(g("status","stage","application_status")||"").toLowerCase())||"Applied",
    date:     g("date","applied_date","application_date","date_applied") || todayStr(),
    resume:   g("resume","resume_file","cv","cv_file"),
    notes:    g("notes","note","comments","description","details"),
    location: g("location","city","place","work_location"),
    jobLink:  g("job_link","link","url","job_url","apply_link","application_link"),
  };
}
function mapAccount(row) {
  const g = (...ks) => { for (const k of ks) { const v = row[k]||row[k.replace(/_/g,"")]; if(v) return v; } return ""; };
  return {
    id: uid(),
    company:  g("company","portal","website_name","platform","name","site"),
    website:  g("website","url","site","domain","portal_url"),
    email:    g("email","username","login","user","mail"),
    password: g("password","pass","pwd","secret","credentials"),
    notes:    g("notes","note","comments","description","plan","tier"),
    category: g("category","type","kind"),
  };
}

/* ═══ DESIGN TOKENS ═══ */
const C = {
  brand: "var(--jt-brand)",
  brand2: "var(--jt-brand-hover)",
  brandSoft: "var(--jt-brand-soft)",
  brandMid: "var(--jt-brand-mid)",
  accent: "var(--jt-brand)",
  accentSoft: "var(--jt-brand-soft)",
  green: "var(--jt-green)",
  red: "var(--jt-red)",
  amber: "var(--jt-amber)",
  amberD: "var(--jt-amber-dark)",
  bg: "var(--jt-bg)",
  surface: "var(--jt-surface)",
  border: "var(--jt-border)",
  text: "var(--jt-text)",
  sub: "var(--jt-sub)",
  muted: "var(--jt-muted)",
  sidebar: "var(--jt-sidebar)",
};

/* ─── GLOBAL CSS ─── */
const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:'Outfit',sans-serif;background:${C.bg};color:${C.text};transition:background 0.22s ease,color 0.22s ease}
input,textarea,select,button{font-family:'Outfit',sans-serif}
::placeholder{color:${C.muted}}
select option{background:var(--jt-surface);color:var(--jt-text)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${C.brandMid};border-radius:6px}
@keyframes slideUp{from{opacity:0;transform:translateY(22px) scale(.97)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes toastPop{0%{opacity:0;transform:translateX(-50%) translateY(14px) scale(.93)}100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
@keyframes sheetUp{from{opacity:0;transform:translateY(44px)}to{opacity:1;transform:none}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(0,208,156,.4)}70%{box-shadow:0 0 0 9px rgba(0,208,156,0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.lift{transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}
.lift:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,208,156,.15)!important}
.row-hl:hover{background:${C.brandSoft}!important}
.btn{transition:transform .15s,box-shadow .15s,background .15s,opacity .15s;cursor:pointer}
.btn:hover{transform:translateY(-1px)}
.btn:active{transform:scale(.96)}
.nav-lnk{transition:all .18s;border-radius:14px;cursor:pointer;border:none;background:transparent;text-align:left;width:100%}
.nav-lnk:hover{background:rgba(0,208,156,.12)!important}
.icobtn{transition:background .12s,transform .1s;border-radius:10px;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center}
.icobtn:hover{background:${C.brandSoft};transform:scale(1.09)}
.pill{cursor:pointer;transition:all .15s;border:none;user-select:none}
.pill:hover{opacity:.87;transform:scale(1.02)}
.ifo:focus{border-color:${C.brand}!important;box-shadow:0 0 0 3px ${C.brandSoft}!important;outline:none}
.ovl{animation:fadeIn .18s ease both}
/* Layout */
#root,#app{height:100%}
.app-shell{display:flex;height:100dvh;overflow:hidden}
.sidebar-wrap{width:240px;flex-shrink:0;height:100dvh;overflow:hidden}
.main-wrap{flex:1;min-width:0;display:flex;flex-direction:column;height:100dvh;overflow:hidden}
.topbar{flex-shrink:0;position:relative;z-index:10}
.page-scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
/* Bottom nav */
.mob-bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:500;transition:transform .32s cubic-bezier(.4,0,.2,1)}
.mob-bottom-nav.nav-hidden{transform:translateY(110%)}
.mob-bottom-nav.nav-visible{transform:translateY(0)}
/* Responsive */
@media(max-width:900px){
  .sidebar-wrap{display:none!important}
  .hamburger{display:flex!important}
  .mob-bottom-nav{display:flex}
  .page-scroll{padding-bottom:90px!important}
  .stats-grid{grid-template-columns:1fr 1fr!important}
  .dash-bottom{grid-template-columns:1fr!important}
  .analytics-bottom{grid-template-columns:1fr!important}
  .job-form-grid{grid-template-columns:1fr!important}
  .action-bar{flex-wrap:wrap}
  .hide-mob{display:none!important}
}
@media(max-width:520px){
  .stats-grid{grid-template-columns:1fr 1fr!important}
  .pill-row{flex-wrap:wrap;gap:5px!important}
  .topbar{padding:10px 14px!important}
}

/* Navi UPI App Theme variables definition */
:root {
  --jt-brand: #00D09C; /* Navi signature Teal */
  --jt-brand-hover: #00B589;
  --jt-brand-soft: rgba(0, 208, 156, 0.08);
  --jt-brand-mid: rgba(0, 208, 156, 0.2);
  --jt-green: #10B981;
  --jt-red: #EF4444;
  --jt-amber: #F59E0B;
  --jt-amber-dark: #D97706;

  /* Default Light theme variables */
  --jt-bg: var(--bg-base);
  --jt-surface: var(--bg-glass);
  --jt-border: var(--border);
  --jt-text: var(--text-primary);
  --jt-sub: var(--text-secondary);
  --jt-muted: var(--text-muted);
  --jt-sidebar: rgba(255,255,255,0.4);

  --status-Applied: #00D09C;
  --status-Applied-light: rgba(0, 208, 156, 0.1);
  --status-Screening: #F59E0B;
  --status-Screening-light: rgba(245, 158, 11, 0.1);
  --status-Interview: #3B82F6;
  --status-Interview-light: rgba(59, 130, 246, 0.1);
  --status-Offered: #10B981;
  --status-Offered-light: rgba(16, 185, 129, 0.1);
  --status-Rejected: #EF4444;
  --status-Rejected-light: rgba(239, 68, 68, 0.1);
  --status-Withdrawn: #64748B;
  --status-Withdrawn-light: rgba(100, 116, 139, 0.1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --jt-bg: var(--bg-base);
    --jt-surface: var(--bg-glass);
    --jt-border: var(--border);
    --jt-text: var(--text-primary);
    --jt-sub: var(--text-secondary);
    --jt-muted: var(--text-muted);
    --jt-sidebar: rgba(20,20,25,0.6);
    --jt-brand-soft: rgba(0, 208, 156, 0.15);
    --jt-brand-mid: rgba(0, 208, 156, 0.3);
  }
}

html.light {
  --jt-bg: var(--bg-base);
  --jt-surface: var(--bg-glass);
  --jt-border: var(--border);
  --jt-text: var(--text-primary);
  --jt-sub: var(--text-secondary);
  --jt-muted: var(--text-muted);
  --jt-sidebar: rgba(255,255,255,0.4);
}

html.dark {
  --jt-bg: var(--bg-base);
  --jt-surface: var(--bg-glass);
  --jt-border: var(--border);
  --jt-text: var(--text-primary);
  --jt-sub: var(--text-secondary);
  --jt-muted: var(--text-muted);
  --jt-sidebar: rgba(20,20,25,0.6);
  --jt-brand-soft: rgba(0, 208, 156, 0.15);
  --jt-brand-mid: rgba(0, 208, 156, 0.3);
}
`;

/* ═══ PRIMITIVES ═══ */

function Badge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.Applied;
  const Icon = c.icon;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:24,
      background:c.light, color:c.color, fontSize:11, fontWeight:800, letterSpacing:.3,
      border:`1px solid ${c.color}28`, whiteSpace:"nowrap" }}>
      <Icon size={11} strokeWidth={2.5}/>{status}
    </span>
  );
}

function Pill({ children, active, onClick, color }) {
  return (
    <button onClick={onClick} className="pill btn" style={{
      padding:"6px 15px", borderRadius:24, fontSize:12, fontWeight:700,
      background: active ? (color||C.brand) : C.surface,
      color: active ? "#fff" : C.sub,
      boxShadow: active ? `0 4px 14px ${(color||C.brand)}45` : "0 1px 4px rgba(0,0,0,.07)",
    }}>{children}</button>
  );
}

function Card({ children, style={} }) {
  return (
    <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`,
      boxShadow:"0 2px 10px rgba(0,0,0,.04)", ...style }}>
      {children}
    </div>
  );
}

function StatCard({ icon:Icon, label, value, color, sub, delay=0 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const end = Number(value); let i = 0;
    const t = setTimeout(() => {
      const tick = () => { i++; setN(Math.min(Math.round((i/30)*end),end)); if(i<30) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, delay+80);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="lift" style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`,
      padding:"20px 18px", boxShadow:"0 2px 10px rgba(0,0,0,.04)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-14, right:-14, width:72, height:72, borderRadius:"50%", background:`${color}0e` }}/>
      <div style={{ position:"absolute", bottom:0, left:0, height:3, width:"50%",
        background:`linear-gradient(90deg,${color},transparent)`, borderRadius:"0 3px 3px 0" }}/>
      <div style={{ width:42, height:42, borderRadius:13, background:`${color}16`,
        display:"flex", alignItems:"center", justifyContent:"center", marginBottom:13 }}>
        <Icon size={21} color={color} strokeWidth={2}/>
      </div>
      <div style={{ fontWeight:900, fontSize:34, color:C.text, lineHeight:1, letterSpacing:"-1.5px",
        animation:`countUp .5s ${delay}ms both` }}>{n}</div>
      <div style={{ fontSize:12, color:C.sub, marginTop:5, fontWeight:600 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color, marginTop:3, fontWeight:700 }}>{sub}</div>}
    </div>
  );
}

function Toast({ msg, type="success", onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  const bg = type==="error" ? C.red : type==="warn" ? C.amberD : C.brand;
  return (
    <div style={{ position:"fixed", bottom:90, left:"50%", zIndex:9999, background:bg, color:"#fff",
      padding:"11px 22px", borderRadius:40, fontWeight:700, fontSize:13, pointerEvents:"none",
      boxShadow:"0 8px 36px rgba(0,0,0,.22)", animation:"toastPop .3s cubic-bezier(.34,1.56,.64,1) both",
      whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:8, maxWidth:"88vw" }}>
      {type==="success"&&<CheckCircle2 size={15}/>}
      {type==="error"&&<XCircle size={15}/>}
      {type==="warn"&&<AlertCircle size={15}/>}
      <span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>{msg}</span>
    </div>
  );
}

/* ── Export Sheet ── */
function ExportSheet({ rows, filename, label, onClose, toast }) {
  const csv = useMemo(() => buildCSV(rows), [rows]);
  const items = [
    { icon:Download,      label:"Download CSV",           color:C.green,  fn:()=>{ dlCSV(rows,filename); toast("CSV downloaded!"); onClose(); } },
    { icon:FileSpreadsheet,label:"Download Excel (.xls)", color:C.brand,  fn:()=>{ dlExcel(rows,filename); toast("Excel downloaded!"); onClose(); } },
    { icon:FileText,      label:"Download / Print PDF",   color:C.red,    fn:()=>{ dlPDF(rows,label); toast("Opening PDF…"); onClose(); } },
    { icon:Copy,          label:"Copy CSV to Clipboard",  color:C.sub,    fn:async()=>{ try{await navigator.clipboard.writeText(csv);toast("Copied!");}catch{toast("Copy failed","error");} onClose(); } },
    { icon:MessageSquare, label:"Share via WhatsApp",     color:"#25D366",fn:()=>{ window.open(`https://wa.me/?text=${encodeURIComponent(label+"\n\n"+csv.slice(0,300)+"…")}`, "_blank"); onClose(); } },
    { icon:Send,          label:"Share via Telegram",     color:"#0088CC",fn:()=>{ window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(label+"\n"+csv.slice(0,200))}`, "_blank"); onClose(); } },
    { icon:Mail,          label:"Share via Email",        color:C.brand2, fn:()=>{ window.location.href=`mailto:?subject=${encodeURIComponent(label)}&body=${encodeURIComponent(csv.slice(0,500))}`; onClose(); } },
  ];
  return (
    <div className="ovl" style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(19,19,43,.62)", backdropFilter:"blur(12px)" }}/>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.surface, borderRadius:"24px 24px 0 0", width:"100%",
        maxWidth:500, zIndex:1, animation:"sheetUp .3s cubic-bezier(.34,1.2,.64,1)", boxShadow:"0 -8px 60px rgba(0,0,0,.2)",
        overflow:"hidden", maxHeight:"88vh", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px 22px 12px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ width:38, height:4, borderRadius:4, background:C.border, margin:"0 auto 13px" }}/>
          <div style={{ fontWeight:800, fontSize:16, color:C.text }}>Export & Share</div>
          <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{label} · {rows.length} records</div>
        </div>
        <div style={{ overflowY:"auto", padding:"8px 12px 12px" }}>
          {items.map(({ icon:Icon, label:l, color, fn }) => (
            <button key={l} onClick={fn} className="btn" style={{ display:"flex", alignItems:"center", gap:14, width:"100%",
              padding:"12px 12px", background:"transparent", border:"none", borderRadius:14, textAlign:"left" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ width:42, height:42, borderRadius:13, background:`${color}18`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon size={18} color={color} strokeWidth={2}/>
              </div>
              <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{l}</span>
            </button>
          ))}
        </div>
        <div style={{ padding:"8px 16px 24px", flexShrink:0 }}>
          <button onClick={onClose} className="btn" style={{ width:"100%", padding:"13px", background:C.bg, border:"none",
            color:C.sub, borderRadius:14, fontSize:13, fontWeight:700 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Confirm Delete ── */
function ConfirmDel({ onConfirm, onClose }) {
  return (
    <div className="ovl" style={{ position:"fixed", inset:0, zIndex:2500, display:"flex",
      alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(19,19,43,.55)", backdropFilter:"blur(10px)" }}/>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.surface, borderRadius:22, width:"100%", maxWidth:340,
        zIndex:1, animation:"slideUp .22s cubic-bezier(.34,1.56,.64,1)", boxShadow:"0 24px 72px rgba(0,0,0,.18)",
        padding:"28px 24px", textAlign:"center" }}>
        <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(239, 68, 68, 0.12)",
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <Trash2 size={26} color={C.red}/>
        </div>
        <div style={{ fontWeight:800, fontSize:16, color:C.text, marginBottom:8 }}>Delete this?</div>
        <div style={{ fontSize:13, color:C.sub, marginBottom:22, fontWeight:500 }}>This action cannot be undone.</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} className="btn" style={{ flex:1, padding:"11px", background:C.bg,
            border:`1.5px solid ${C.border}`, borderRadius:13, color:C.sub, fontWeight:700, fontSize:14 }}>Cancel</button>
          <button onClick={onConfirm} className="btn" style={{ flex:1, padding:"11px", background:C.red,
            border:"none", borderRadius:13, color:"#fff", fontWeight:800, fontSize:14,
            boxShadow:`0 6px 20px ${C.red}44` }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal wrapper ── */
function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="ovl" style={{ position:"fixed", inset:0, zIndex:2000, display:"flex",
      alignItems:"center", justifyContent:"center", padding:14 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(19,19,43,.55)", backdropFilter:"blur(12px)" }}/>
      <div style={{ background:C.surface, borderRadius:22, width:"100%", maxWidth:540, zIndex:1, display:"flex",
        flexDirection:"column", maxHeight:"90vh",
        boxShadow:"0 28px 80px rgba(0,0,0,.2)", animation:"slideUp .24s cubic-bezier(.34,1.56,.64,1)", overflow:"hidden" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0,
          background:`linear-gradient(135deg,${C.brandSoft} 0%,${C.surface} 60%)`,
          display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:C.text }}>{title}</div>
            {subtitle && <div style={{ fontSize:12, color:C.sub, marginTop:3, fontWeight:500 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} className="icobtn btn"
            style={{ width:32, height:32, background:C.bg, border:`1px solid ${C.border}`, color:C.sub, flexShrink:0, marginLeft:8 }}>
            <X size={15}/>
          </button>
        </div>
        <div style={{ overflowY:"auto", padding:"22px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Form primitives ─── */
const FL = { display:"block", fontSize:10, fontWeight:800, color:C.sub, marginBottom:5, letterSpacing:.7, textTransform:"uppercase" };
const INP = { width:"100%", padding:"11px 13px", borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14,
  color:C.text, background:C.surface, transition:"border-color .15s,box-shadow .15s" };

function FI({ label, value, onChange, placeholder, mono, type="text", req, right }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={FL}>{label}{req&&<span style={{color:C.red}}> *</span>}</label>
      <div style={{ position:"relative" }}>
        <input type={type} className="ifo" value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder} style={{ ...INP, fontFamily:mono?"'DM Mono',monospace":"inherit", paddingRight:right?42:13 }}/>
        {right}
      </div>
    </div>
  );
}
function FS({ label, value, onChange, children, req }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={FL}>{label}{req&&<span style={{color:C.red}}> *</span>}</label>
      <select className="ifo" value={value} onChange={e=>onChange(e.target.value)}
        style={{ ...INP, cursor:"pointer", appearance:"none",
          backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23636E72' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat:"no-repeat", backgroundPosition:"right 11px center", paddingRight:34 }}>
        {children}
      </select>
    </div>
  );
}
function FTA({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={FL}>{label}</label>
      <textarea className="ifo" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        rows={3} style={{ ...INP, resize:"vertical", minHeight:76, lineHeight:1.55 }}/>
    </div>
  );
}

/* ═══ JOB FORM ═══ */
function JobForm({ initial, onSave, onClose }) {
  const blank = { company:"", role:"", status:"Applied", date:todayStr(), resume:"", notes:"", location:"", jobLink:"" };
  const [f, setF] = useState(initial || blank);
  const [resumeFile, setResumeFile] = useState(null);
  const fref = useRef();
  const set = k => v => setF(p=>({...p,[k]:v}));

  return (
    <div>
      <div className="job-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <FI label="Company" value={f.company} onChange={set("company")} placeholder="e.g. Google" req/>
        <FI label="Role / Job Title" value={f.role} onChange={set("role")} placeholder="e.g. SDE II" req/>
      </div>
      <div className="job-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <FS label="Status" value={f.status} onChange={set("status")} req>
          {Object.keys(STATUS_CFG).map(s=><option key={s}>{s}</option>)}
        </FS>
        <FI label="Date Applied" type="date" value={f.date} onChange={set("date")} req/>
      </div>
      <div className="job-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <FI label="Location" value={f.location} onChange={set("location")} placeholder="e.g. Bangalore"/>
        <div style={{ marginBottom:16 }}>
          <label style={FL}>Resume File</label>
          <div style={{ display:"flex", gap:7 }}>
            <input className="ifo" value={f.resume} onChange={e=>set("resume")(e.target.value)}
              placeholder="filename.pdf" style={{ ...INP, flex:1 }}/>
            <button onClick={()=>fref.current?.click()} className="icobtn btn"
              style={{ width:42, height:42, background:C.brandSoft, border:`1.5px solid ${C.brandMid}`,
                borderRadius:12, color:C.brand, flexShrink:0 }}>
              <Upload size={17}/>
            </button>
            <input ref={fref} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}}
              onChange={e=>{ const fl=e.target.files?.[0]; if(fl){setResumeFile(fl);set("resume")(fl.name);} }}/>
          </div>
          {resumeFile&&<div style={{fontSize:10,color:C.green,marginTop:4,fontWeight:700}}>✓ {resumeFile.name}</div>}
        </div>
      </div>
      {/* Job Link */}
      <FI label="Job Posting Link" value={f.jobLink} onChange={set("jobLink")}
        placeholder="https://careers.company.com/job/123"/>
      <FTA label="Notes" value={f.notes} onChange={set("notes")} placeholder="Salary, referral, round details…"/>
      <div style={{ display:"flex", gap:9, justifyContent:"flex-end" }}>
        <button onClick={onClose} className="btn" style={{ padding:"11px 22px", borderRadius:12, background:C.bg,
          border:`1.5px solid ${C.border}`, color:C.sub, fontWeight:700, fontSize:14 }}>Cancel</button>
        <button onClick={()=>{ if(!f.company||!f.role) return; onSave(f); }} className="btn"
          style={{ padding:"11px 24px", borderRadius:12, background:C.brand, border:"none", color:"#fff",
            fontWeight:800, fontSize:14, boxShadow:`0 6px 20px ${C.brand}50` }}>
          {initial ? "Update" : "Add Application"}
        </button>
      </div>
    </div>
  );
}

/* ═══ ACCOUNT FORM ═══ */
function AccountForm({ initial, onSave, onClose }) {
  const blank = { company:"", website:"", email:"", password:"", notes:"", category:"Job Portal" };
  const [f, setF] = useState(initial || blank);
  const [showP, setShowP] = useState(false);
  const set = k => v => setF(p=>({...p,[k]:v}));
  return (
    <div>
      <div className="job-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <FI label="Platform / Company" value={f.company} onChange={set("company")} placeholder="e.g. Naukri" req/>
        <FI label="Website" value={f.website} onChange={set("website")} placeholder="naukri.com"/>
      </div>
      <div className="job-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <FI label="Email / Username" value={f.email} onChange={set("email")} placeholder="you@gmail.com" req/>
        <FS label="Category" value={f.category} onChange={set("category")}>
          {["Job Portal","Professional","Freelance","Company","Other"].map(c=><option key={c}>{c}</option>)}
        </FS>
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={FL}>Password <span style={{color:C.red}}>*</span></label>
        <div style={{ position:"relative" }}>
          <input type={showP?"text":"password"} className="ifo" value={f.password}
            onChange={e=>set("password")(e.target.value)} placeholder="Enter password"
            style={{ ...INP, fontFamily:"'DM Mono',monospace", paddingRight:44 }}/>
          <button onClick={()=>setShowP(p=>!p)}
            style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", cursor:"pointer", color:C.muted, display:"flex" }}>
            {showP?<EyeOff size={16}/>:<Eye size={16}/>}
          </button>
        </div>
      </div>
      <FTA label="Notes" value={f.notes} onChange={set("notes")} placeholder="Plan, subscription, profile status…"/>
      <div style={{ display:"flex", gap:9, justifyContent:"flex-end" }}>
        <button onClick={onClose} className="btn" style={{ padding:"11px 22px", borderRadius:12, background:C.bg,
          border:`1.5px solid ${C.border}`, color:C.sub, fontWeight:700, fontSize:14 }}>Cancel</button>
        <button onClick={()=>{ if(!f.company||!f.email||!f.password) return; onSave(f); }} className="btn"
          style={{ padding:"11px 24px", borderRadius:12, background:C.accent, border:"none", color:"#fff",
            fontWeight:800, fontSize:14, boxShadow:`0 6px 20px ${C.accent}50` }}>
          {initial?"Update":"Save Account"}
        </button>
      </div>
    </div>
  );
}

/* ═══ SIDEBAR ═══ */
const NAV = [
  { id:"dashboard", icon:Home,        label:"Dashboard"    },
  { id:"jobs",      icon:Briefcase,   label:"Applications" },
  { id:"accounts",  icon:ShieldCheck, label:"My Accounts"  },
  { id:"analytics", icon:BarChart3,   label:"Analytics"    },
];

function Sidebar({ active, setActive, onClose }) {
  return (
    <div style={{ width:240, background:C.sidebar, height:"100dvh", display:"flex", flexDirection:"column",
      borderRight:"1px solid rgba(255,255,255,.06)" }}>
      {/* Logo */}
      <div style={{ padding:"26px 20px 18px", borderBottom:"1px solid rgba(255,255,255,.07)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:13,
              background:`linear-gradient(135deg,${C.brand},${C.accent})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 16px ${C.brand}55`, animation:"pulseGlow 2.5s infinite" }}>
              <Rocket size={19} color="#fff" strokeWidth={2.5}/>
            </div>
            <div>
              <div style={{ fontWeight:900, fontSize:14, color:C.text, letterSpacing:-.2 }}>JobTrack</div>
              <div style={{ fontSize:9, color:C.sub, fontWeight:700, letterSpacing:.8 }}>PRO DASHBOARD</div>
            </div>
          </div>
         
        </div>
        {onClose && (
          <button onClick={onClose} style={{ position:"absolute", top:22, right:14,
            background:"transparent", border:"none",
            padding:6, cursor:"pointer", color:C.muted, display:"flex" }}>
            <X size={15}/>
          </button>
        )}
      </div>
      {/* Nav */}
      <div style={{ flex:1, padding:"14px 10px", overflowY:"auto" }}>
        <div style={{ fontSize:9, color:"rgba(255,255,255,.28)", fontWeight:800, letterSpacing:1.1,
          padding:"0 10px", marginBottom:8 }}>MENU</div>
        {NAV.map(({ id, icon:Icon, label }) => {
          const act = active===id;
          return (
            <button key={id} onClick={()=>{ setActive(id); onClose?.(); }}
              className="nav-lnk"
              style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 12px",
                marginBottom:4, borderRadius:14, cursor:"pointer",
                background: act ? C.brand : "transparent",
                boxShadow: act ? `0 4px 16px ${C.brand}55` : "none" }}>
              <Icon size={17} color={act?"#fff":"rgba(255,255,255,.4)"} strokeWidth={2}/>
              <span style={{ fontSize:13, fontWeight:700, color:act?"#fff":"rgba(255,255,255,.5)" }}>{label}</span>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}

/* ═══ DASHBOARD PAGE ═══ */
function DashboardPage({ jobs, accounts }) {
  const s = useMemo(() => ({
    total:    jobs.length,
    active:   jobs.filter(j=>["Applied","Screening","Interview"].includes(j.status)).length,
    offers:   jobs.filter(j=>j.status==="Offered").length,
    rejected: jobs.filter(j=>j.status==="Rejected").length,
  }), [jobs]);
  const recent  = useMemo(() => [...jobs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5), [jobs]);
  const byStatus = useMemo(() => {
    const m = {}; Object.keys(STATUS_CFG).forEach(k=>m[k]=0);
    jobs.forEach(j=>{ m[j.status]=(m[j.status]||0)+1; }); return m;
  }, [jobs]);

  return (
    <div>
      {/* Hero banner */}
      <div style={{ background:`linear-gradient(135deg,${C.brand} 0%,${C.accent} 100%)`,
        borderRadius:22, padding:"26px 24px", marginBottom:20, position:"relative", overflow:"hidden",
        boxShadow:`0 12px 40px ${C.brand}40` }}>
        <div style={{ position:"absolute", top:-24, right:-24, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
        <div style={{ position:"absolute", bottom:-30, right:60, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,.05)" }}/>
        <div style={{ fontWeight:900, fontSize:20, color:"#fff", letterSpacing:-.3, position:"relative", display:"flex", alignItems:"center", gap:8 }}>
          Welcome back! <Hand size={20} color="#fff" />
        </div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", marginTop:5, position:"relative", fontWeight:500 }}>
          <strong style={{color:"#fff"}}>{s.active}</strong> active applications ·{" "}
          <strong style={{color:"#fff"}}>{s.offers}</strong> offer{s.offers!==1?"s":""}
        </div>
        <div style={{ display:"flex", gap:10, marginTop:16, flexWrap:"wrap", position:"relative" }}>
          {[["Total",s.total],["Active",s.active],["Offers",s.offers]].map(([l,v])=>(
            <div key={l} style={{ background:"rgba(255,255,255,.14)", borderRadius:13, padding:"9px 18px",
              backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.18)" }}>
              <div style={{ fontWeight:900, fontSize:24, color:"#fff", lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.68)", fontWeight:700, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <StatCard icon={Briefcase}   label="Total Applied"   value={s.total}          color={C.brand}  delay={0}   sub="All time"/>
        <StatCard icon={Activity}    label="Active Pipeline" value={s.active}          color={C.accent} delay={80}  sub="In progress"/>
        <StatCard icon={Award}       label="Offers"          value={s.offers}          color={C.green}  delay={160} sub="Received"/>
        <StatCard icon={ShieldCheck} label="Accounts Saved"  value={accounts.length}  color={C.amberD} delay={240} sub="Portals"/>
      </div>

      {/* Bottom split — stacks on mobile */}
      <div className="dash-bottom" style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, alignItems:"start" }}>
        {/* Recent apps */}
        <Card>
          <div style={{ padding:"16px 20px 14px", borderBottom:`1px solid ${C.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:800, fontSize:14, color:C.text }}>Recent Applications</div>
            <span style={{ fontSize:11, color:C.brand, fontWeight:700 }}>Latest 5</span>
          </div>
          {recent.length===0
            ? <div style={{padding:"32px",textAlign:"center",color:C.muted,fontSize:13}}>No applications yet</div>
            : recent.map((j,i)=>(
              <div key={j.id} className="row-hl" style={{ display:"flex", alignItems:"center", gap:12,
                padding:"13px 20px", borderBottom:i<recent.length-1?`1px solid ${C.border}`:"none",
                transition:"background .12s" }}>
                <div style={{ width:38, height:38, borderRadius:12, background:C.brandSoft,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Building2 size={17} color={C.brand} strokeWidth={2}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.text, overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{j.company}</div>
                  <div style={{ fontSize:11, color:C.sub, marginTop:1, fontWeight:500,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{j.role}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <Badge status={j.status}/>
                  <div style={{ fontSize:10, color:C.muted, marginTop:4, fontWeight:500 }}>{fmtDate(j.date)}</div>
                </div>
              </div>
            ))
          }
        </Card>

        {/* Status bars */}
        <Card>
          <div style={{ padding:"16px 20px 14px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:800, fontSize:14, color:C.text }}>Status Breakdown</div>
          </div>
          <div style={{ padding:"16px 18px" }}>
            {Object.entries(byStatus).map(([st,cnt])=>{
              const cfg=STATUS_CFG[st];
              const pct=s.total>0?Math.round((cnt/s.total)*100):0;
              return (
                <div key={st} style={{marginBottom:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:700,color:C.sub}}>{st}</span>
                    <span style={{fontSize:12,fontWeight:800,color:cfg.color}}>{cnt}</span>
                  </div>
                  <div style={{height:7,borderRadius:8,background:C.bg,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,borderRadius:8,
                      background:`linear-gradient(90deg,${cfg.color},${cfg.color}99)`,
                      transition:"width .7s cubic-bezier(.34,1.2,.64,1)"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══ JOBS PAGE ═══ */
function JobsPage({ jobs, setJobs, toast }) {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [modal, setModal]       = useState(null);
  const [exportOpen, setExport] = useState(false);
  const [delId, setDelId]       = useState(null);
  const fileRef = useRef();

  const filtered = useMemo(() => {
    let r = filter==="All" ? jobs : jobs.filter(j=>j.status===filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(j=>[j.company,j.role,j.notes,j.location].join(" ").toLowerCase().includes(q));
    }
    return [...r].sort((a,b)=>b.date.localeCompare(a.date));
  }, [jobs, search, filter]);

  const handleSave = useCallback((f) => {
    if (modal==="add") { setJobs(p=>[{...f,id:uid()},...p]); toast("Application added!"); }
    else { setJobs(p=>p.map(j=>j.id===modal.id?{...f,id:j.id}:j)); toast("Updated!"); }
    setModal(null);
  }, [modal, setJobs, toast]);

  const handleImport = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const rows = parseCSV(ev.target.result);
        if (!rows.length) { toast("No data in file","error"); return; }
        const mapped = rows.map(mapJob).filter(j=>j.company||j.role);
        if (!mapped.length) { toast("Couldn't match columns","error"); return; }
        setJobs(p=>[...mapped,...p]); toast(`Imported ${mapped.length} rows!`);
      } catch { toast("Import failed","error"); }
    };
    reader.onerror = ()=>toast("File read error","error");
    reader.readAsText(file); e.target.value="";
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontWeight:900, fontSize:20, color:C.text, letterSpacing:-.3 }}>Job Applications</div>
          <div style={{ fontSize:12, color:C.sub, marginTop:2, fontWeight:500 }}>{filtered.length} of {jobs.length} shown</div>
        </div>
        <div className="action-bar" style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          <button onClick={()=>fileRef.current?.click()} className="btn" style={{ display:"flex", alignItems:"center",
            gap:6, padding:"9px 14px", background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12,
            fontSize:12, fontWeight:700, color:C.sub }}>
            <Upload size={14}/> Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={handleImport}/>
          <button onClick={()=>setExport(true)} className="btn" style={{ display:"flex", alignItems:"center",
            gap:6, padding:"9px 14px", background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12,
            fontSize:12, fontWeight:700, color:C.sub }}>
            <Share2 size={14}/> Export
          </button>
          <button onClick={()=>setModal("add")} className="btn" style={{ display:"flex", alignItems:"center",
            gap:6, padding:"9px 18px", background:C.brand, border:"none", borderRadius:12,
            fontSize:12, fontWeight:800, color:"#fff", boxShadow:`0 6px 18px ${C.brand}50` }}>
            <Plus size={15}/> Add
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <Card style={{ padding:"12px 16px", marginBottom:16 }}>
        <div style={{ position:"relative", marginBottom:10 }}>
          <Search size={15} color={C.muted} style={{ position:"absolute", left:12, top:"50%",
            transform:"translateY(-50%)", pointerEvents:"none" }}/>
          <input className="ifo" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search company, role, location…"
            style={{ ...INP, paddingLeft:38 }}/>
        </div>
        <div className="pill-row" style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {["All",...Object.keys(STATUS_CFG)].map(s=>(
            <Pill key={s} active={filter===s} onClick={()=>setFilter(s)}
              color={s==="All"?C.brand:STATUS_CFG[s]?.color}>{s}</Pill>
          ))}
        </div>
      </Card>

      {/* Table — scrollable */}
      <Card>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:650 }}>
            <thead>
              <tr style={{ background:`linear-gradient(135deg,${C.brandSoft},${C.surface})` }}>
                {["Company","Role","Status","Date","Location","Notes","Link","Actions"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:10, fontWeight:800,
                    color:C.sub, letterSpacing:.7, textTransform:"uppercase",
                    borderBottom:`2px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={8} style={{ padding:"44px", textAlign:"center", color:C.muted, fontSize:13 }}>
                    <div style={{marginBottom:8}}><Briefcase size={28} color={C.border}/></div>No applications found
                  </td></tr>
                : filtered.map((j,i)=>(
                  <tr key={j.id} className="row-hl"
                    style={{ borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none", transition:"background .1s" }}>
                    <td style={{padding:"13px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:34,height:34,borderRadius:11,background:C.brandSoft,
                          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <Building2 size={15} color={C.brand} strokeWidth={2}/>
                        </div>
                        <span style={{fontWeight:700,fontSize:13,color:C.text,whiteSpace:"nowrap"}}>{j.company}</span>
                      </div>
                    </td>
                    <td style={{padding:"13px 16px"}}>
                      <span style={{fontSize:13,fontWeight:600,color:C.text,whiteSpace:"nowrap"}}>{j.role}</span>
                    </td>
                    <td style={{padding:"13px 16px"}}><Badge status={j.status}/></td>
                    <td style={{padding:"13px 16px"}}>
                      <span style={{fontSize:11,color:C.sub,fontWeight:500,whiteSpace:"nowrap"}}>{fmtDate(j.date)}</span>
                    </td>
                    <td style={{padding:"13px 16px"}}>
                      <span style={{fontSize:12,color:C.sub,fontWeight:500}}>{j.location||"—"}</span>
                    </td>
                    <td style={{padding:"13px 16px",maxWidth:160}}>
                      <span style={{fontSize:11,color:C.sub,display:"block",overflow:"hidden",
                        textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{j.notes||"—"}</span>
                    </td>
                    <td style={{padding:"13px 16px"}}>
                      {j.jobLink
                        ? <a href={j.jobLink} target="_blank" rel="noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,
                              color:C.brand,fontWeight:700,textDecoration:"none",
                              background:C.brandSoft,padding:"4px 10px",borderRadius:20,
                              border:`1px solid ${C.brandMid}`,whiteSpace:"nowrap"}}
                            onClick={e=>e.stopPropagation()}>
                            <ExternalLink size={10}/> View
                          </a>
                        : <span style={{fontSize:11,color:C.muted}}>—</span>
                      }
                    </td>
                    <td style={{padding:"13px 16px"}}>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setModal(j)} className="icobtn"
                          style={{width:30,height:30,color:C.brand,background:C.brandSoft}}>
                          <Pencil size={13}/>
                        </button>
                        <button onClick={()=>setDelId(j.id)} className="icobtn"
                          style={{width:30,height:30,color:C.red,background:`${C.red}15`}}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal==="add"?"New Application":"Edit Application"}
          subtitle={modal==="add"?"Track a job you've applied for":`${modal.company} · ${modal.role}`}
          onClose={()=>setModal(null)}>
          <JobForm initial={modal==="add"?null:modal} onSave={handleSave} onClose={()=>setModal(null)}/>
        </Modal>
      )}
      {delId && (
        <ConfirmDel onConfirm={()=>{ setJobs(p=>p.filter(j=>j.id!==delId)); toast("Deleted","warn"); setDelId(null); }}
          onClose={()=>setDelId(null)}/>
      )}
      {exportOpen && (
        <ExportSheet rows={filtered.map(({id,...r})=>r)} filename="job_applications" label="Job Applications"
          onClose={()=>setExport(false)} toast={toast}/>
      )}
    </div>
  );
}

/* ═══ ACCOUNTS PAGE ═══ */
function AccountsPage({ accounts, setAccounts, toast }) {
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null);
  const [exportOpen, setExport] = useState(false);
  const [delId, setDelId]       = useState(null);
  const [vis, setVis]           = useState({});
  const fileRef = useRef();

  const filtered = useMemo(() => {
    if (!search.trim()) return accounts;
    const q = search.toLowerCase();
    return accounts.filter(a=>[a.company,a.website,a.email,a.category].join(" ").toLowerCase().includes(q));
  }, [accounts, search]);

  const handleSave = useCallback((f) => {
    if (modal==="add") { setAccounts(p=>[{...f,id:uid()},...p]); toast("Account saved!"); }
    else { setAccounts(p=>p.map(a=>a.id===modal.id?{...f,id:a.id}:a)); toast("Updated!"); }
    setModal(null);
  }, [modal, setAccounts, toast]);

  const copyTxt = async (t, label) => {
    try { await navigator.clipboard.writeText(t); toast(`${label} copied!`); }
    catch { toast("Copy failed","error"); }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const rows = parseCSV(ev.target.result);
        if (!rows.length) { toast("No data","error"); return; }
        const mapped = rows.map(mapAccount).filter(a=>a.company||a.email);
        if (!mapped.length) { toast("Couldn't match columns","error"); return; }
        setAccounts(p=>[...mapped,...p]); toast(`Imported ${mapped.length} accounts!`);
      } catch { toast("Import failed","error"); }
    };
    reader.onerror = ()=>toast("File error","error");
    reader.readAsText(file); e.target.value="";
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontWeight:900, fontSize:20, color:C.text, letterSpacing:-.3 }}>My Accounts</div>
          <div style={{ fontSize:12, color:C.sub, marginTop:2, fontWeight:500 }}>{filtered.length} portals saved</div>
        </div>
        <div className="action-bar" style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          <button onClick={()=>fileRef.current?.click()} className="btn" style={{ display:"flex", alignItems:"center",
            gap:6, padding:"9px 14px", background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12,
            fontSize:12, fontWeight:700, color:C.sub }}>
            <Upload size={14}/> Import
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={handleImport}/>
          <button onClick={()=>setExport(true)} className="btn" style={{ display:"flex", alignItems:"center",
            gap:6, padding:"9px 14px", background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12,
            fontSize:12, fontWeight:700, color:C.sub }}>
            <Share2 size={14}/> Export
          </button>
          <button onClick={()=>setModal("add")} className="btn" style={{ display:"flex", alignItems:"center",
            gap:6, padding:"9px 18px", background:C.accent, border:"none", borderRadius:12,
            fontSize:12, fontWeight:800, color:"#fff", boxShadow:`0 6px 18px ${C.accent}50` }}>
            <Plus size={15}/> Add Account
          </button>
        </div>
      </div>

      <Card style={{ padding:"12px 16px", marginBottom:16 }}>
        <div style={{ position:"relative" }}>
          <Search size={15} color={C.muted} style={{ position:"absolute", left:12, top:"50%",
            transform:"translateY(-50%)", pointerEvents:"none" }}/>
          <input className="ifo" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search portal, email, category…" style={{ ...INP, paddingLeft:38 }}/>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {filtered.length===0 && (
          <div style={{ gridColumn:"1/-1", padding:"44px", textAlign:"center", color:C.muted, fontSize:13,
            background:C.surface, borderRadius:20, border:`1px solid ${C.border}` }}>
            <ShieldCheck size={28} color={C.border} style={{marginBottom:8}}/><div>No accounts found</div>
          </div>
        )}
        {filtered.map(a=>(
          <div key={a.id} className="lift" style={{ background:C.surface, borderRadius:20,
            border:`1px solid ${C.border}`, boxShadow:"0 2px 10px rgba(0,0,0,.04)", overflow:"hidden" }}>
            <div style={{ padding:"16px 18px 13px", borderBottom:`1px solid ${C.border}`,
              background:`linear-gradient(135deg,${C.brandSoft},${C.surface})` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:13,
                    background:`linear-gradient(135deg,${C.brand},${C.accent})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:`0 4px 12px ${C.brand}30`, flexShrink:0 }}>
                    <Globe size={18} color="#fff" strokeWidth={2}/>
                  </div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, color:C.text }}>{a.company}</div>
                    {a.website
                      ? <a href={`https://${a.website}`} target="_blank" rel="noreferrer"
                          style={{ fontSize:11, color:C.brand, textDecoration:"none", fontWeight:600 }}
                          onClick={e=>e.stopPropagation()}>{a.website}</a>
                      : <span style={{ fontSize:11, color:C.muted }}>No website</span>
                    }
                  </div>
                </div>
                <div style={{ display:"flex", gap:4 }}>
                  <button onClick={()=>setModal(a)} className="icobtn"
                    style={{ width:28, height:28, color:C.brand, background:C.brandSoft }}>
                    <Pencil size={12}/>
                  </button>
                  <button onClick={()=>setDelId(a.id)} className="icobtn"
                    style={{ width:28, height:28, color:C.red, background:`${C.red}15` }}>
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>
            </div>
            <div style={{ padding:"14px 18px" }}>
              {/* Email row */}
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:9, color:C.muted, fontWeight:800, letterSpacing:.8,
                  textTransform:"uppercase", marginBottom:3 }}>Email</div>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.text, flex:1,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.email}</span>
                  <button onClick={()=>copyTxt(a.email,"Email")} className="icobtn"
                    style={{ width:24, height:24, color:C.muted, flexShrink:0 }}>
                    <Copy size={11}/>
                  </button>
                </div>
              </div>
              {/* Password row */}
              <div style={{ marginBottom:11 }}>
                <div style={{ fontSize:9, color:C.muted, fontWeight:800, letterSpacing:.8,
                  textTransform:"uppercase", marginBottom:3 }}>Password</div>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, flex:1, color:C.text,
                    letterSpacing:vis[a.id]?.show?".4px":"3px",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {vis[a.id]?.show ? a.password : "•".repeat(Math.min(a.password.length,14))}
                  </span>
                  <div style={{ display:"flex", gap:3, flexShrink:0 }}>
                    <button onClick={()=>setVis(p=>({...p,[a.id]:{show:!p[a.id]?.show}}))} className="icobtn"
                      style={{ width:24, height:24, color:C.muted }}>
                      {vis[a.id]?.show?<EyeOff size={11}/>:<Eye size={11}/>}
                    </button>
                    <button onClick={()=>copyTxt(a.password,"Password")} className="icobtn"
                      style={{ width:24, height:24, color:C.muted }}>
                      <Copy size={11}/>
                    </button>
                  </div>
                </div>
              </div>
              {a.category && (
                <span style={{ display:"inline-flex", padding:"3px 9px", borderRadius:20,
                  background:C.accentSoft, color:C.accent, fontSize:10, fontWeight:700 }}>{a.category}</span>
              )}
              {a.notes && (
                <div style={{ fontSize:11, color:C.sub, marginTop:9, fontWeight:500,
                  padding:"7px 11px", background:C.bg, borderRadius:9, lineHeight:1.5 }}>{a.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal==="add"?"Add New Account":"Edit Account"}
          subtitle={modal==="add"?"Save portal credentials":modal.company}
          onClose={()=>setModal(null)}>
          <AccountForm initial={modal==="add"?null:modal} onSave={handleSave} onClose={()=>setModal(null)}/>
        </Modal>
      )}
      {delId && (
        <ConfirmDel onConfirm={()=>{ setAccounts(p=>p.filter(a=>a.id!==delId)); toast("Deleted","warn"); setDelId(null); }}
          onClose={()=>setDelId(null)}/>
      )}
      {exportOpen && (
        <ExportSheet rows={filtered.map(({id,...r})=>({...r,password:"[HIDDEN]"}))}
          filename="my_accounts" label="My Accounts"
          onClose={()=>setExport(false)} toast={toast}/>
      )}
    </div>
  );
}

/* ═══ ANALYTICS PAGE ═══ */
function AnalyticsPage({ jobs }) {
  const d = useMemo(() => {
    const byS = {}; Object.keys(STATUS_CFG).forEach(k=>byS[k]=0);
    jobs.forEach(j=>{ byS[j.status]=(byS[j.status]||0)+1; });
    const byC = {}; jobs.forEach(j=>{ byC[j.company]=(byC[j.company]||0)+1; });
    const top5 = Object.entries(byC).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const rate = jobs.length>0?Math.round((byS.Offered/jobs.length)*100):0;
    const conv = jobs.length>0?Math.round(((byS.Offered+byS.Interview)/jobs.length)*100):0;
    return { byS, top5, rate, conv };
  }, [jobs]);

  return (
    <div>
      <div style={{ fontWeight:900, fontSize:20, color:C.text, letterSpacing:-.3, marginBottom:18 }}>Analytics</div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14, marginBottom:20 }}>
        {[
          { icon:TrendingUp, label:"Offer Rate",       val:`${d.rate}%`,  color:C.green,  sub:`${d.byS.Offered} of ${jobs.length}` },
          { icon:Target,     label:"Conversion Rate",  val:`${d.conv}%`,  color:C.brand,  sub:"Interview + Offers" },
          { icon:Zap,        label:"Active Pipeline",  val:d.byS.Applied+d.byS.Screening+d.byS.Interview, color:C.amberD, sub:"Applied+Screen+Interview" },
        ].map(({ icon:Icon, label, val, color, sub })=>(
          <div key={label} className="lift" style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`,
            padding:"22px 20px", boxShadow:"0 2px 10px rgba(0,0,0,.04)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-14, right:-14, width:70, height:70, borderRadius:"50%", background:`${color}0d` }}/>
            <div style={{ width:40, height:40, borderRadius:13, background:`${color}16`,
              display:"flex", alignItems:"center", justifyContent:"center", marginBottom:13 }}>
              <Icon size={20} color={color} strokeWidth={2}/>
            </div>
            <div style={{ fontWeight:900, fontSize:38, color, lineHeight:1, letterSpacing:"-1.5px" }}>{val}</div>
            <div style={{ fontSize:12, color:C.sub, marginTop:6, fontWeight:600 }}>{label}</div>
            <div style={{ fontSize:11, color, marginTop:3, fontWeight:700 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="analytics-bottom" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <div style={{ padding:"16px 20px 13px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:800, fontSize:14, color:C.text }}>By Status</div>
          </div>
          <div style={{ padding:"18px 20px" }}>
            {Object.entries(d.byS).map(([st,cnt])=>{
              const cfg=STATUS_CFG[st];
              const pct=jobs.length>0?Math.round((cnt/jobs.length)*100):0;
              return (
                <div key={st} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:cfg.color}}/>
                      <span style={{fontSize:12,fontWeight:700,color:C.text}}>{st}</span>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:800,color:cfg.color}}>{cnt}</span>
                      <span style={{fontSize:10,color:C.muted,fontWeight:500}}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{height:8,borderRadius:10,background:C.bg,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,borderRadius:10,
                      background:`linear-gradient(90deg,${cfg.color},${cfg.color}99)`,
                      transition:"width .8s cubic-bezier(.34,1.2,.64,1)"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ padding:"16px 20px 13px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:800, fontSize:14, color:C.text }}>Top Companies</div>
          </div>
          <div style={{ padding:"8px 0" }}>
            {d.top5.length===0
              ? <div style={{padding:"32px",textAlign:"center",color:C.muted,fontSize:12}}>No data yet</div>
              : d.top5.map(([co,cnt],i)=>(
                <div key={co} className="row-hl" style={{ display:"flex", alignItems:"center", gap:13,
                  padding:"12px 20px", transition:"background .1s" }}>
                  <div style={{ width:26, height:26, borderRadius:9, background:C.brandSoft,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:800, fontSize:11, color:C.brand, flexShrink:0 }}>{i+1}</div>
                  <div style={{ flex:1, fontWeight:700, fontSize:13, color:C.text }}>{co}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ height:5, width:cnt*16, maxWidth:72, borderRadius:5,
                      background:`linear-gradient(90deg,${C.brand},${C.accent})` }}/>
                    <span style={{ fontSize:12, fontWeight:800, color:C.brand }}>{cnt}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══ MOBILE BOTTOM NAV (auto-hide on scroll) ═══ */
function BottomNav({ active, setActive }) {
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const scrollEl = document.querySelector(".page-scroll");
    if (!scrollEl) return;
    const onScroll = () => {
      const y = scrollEl.scrollTop;
      if (y > lastY.current + 6 && y > 60) setNavHidden(true);
      else if (y < lastY.current - 4) setNavHidden(false);
      lastY.current = y;
    };
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`mob-bottom-nav ${navHidden ? "nav-hidden" : "nav-visible"}`}
      style={{
        background: `${C.surface}EE`,
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        boxShadow: "0 -4px 24px rgba(0,0,0,.12)",
        paddingBottom: "env(safe-area-inset-bottom,0px)",
      }}>
      {/* 🏠 Return Home Portal button */}
      <a href="#home"
        style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          padding:"10px 4px 8px", textDecoration:"none", color: C.muted, transition:"color .15s" }}>
        <div style={{ width:40, height:32, borderRadius:12, display:"flex", alignItems:"center",
          justifyContent:"center", background: "transparent", transition:"background .15s" }}>
          <Home size={19} strokeWidth={2}/>
        </div>
        <span style={{ fontSize:10, fontWeight:700, marginTop:1, letterSpacing:.1 }}>Home</span>
      </a>

      {NAV.map(({ id, icon:Icon, label })=>{
        const act = active===id;
        return (
          <button key={id} onClick={()=>setActive(id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              padding:"10px 4px 8px", background:"transparent", border:"none", cursor:"pointer",
              color: act ? C.brand : C.muted, transition:"color .15s" }}>
            <div style={{ width:40, height:32, borderRadius:12, display:"flex", alignItems:"center",
              justifyContent:"center",
              background: act ? C.brandSoft : "transparent",
              border: act ? `1.5px solid ${C.brandMid}` : "1.5px solid transparent",
              transition:"background .18s,transform .18s,border .18s",
              transform: act ? "scale(1.08)" : "scale(1)",
              boxShadow: act ? `0 4px 14px ${C.brand}30` : "none",
            }}>
              <Icon size={19} strokeWidth={act?2.5:2}/>
            </div>
            <span style={{ fontSize:10, fontWeight:700, marginTop:2, letterSpacing:.1 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══ TOP BAR (glassmorphism) ═══ */
function TopBar({ page, onHamburger, theme, toggleTheme }) {
  const titles = { dashboard: "Overview", jobs: "Job Pipeline", accounts: "Credential Vault", analytics: "Insights" };
  return (
    <header className="topbar" style={{
      padding: "16px 22px", background: C.bg,
      borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onHamburger} className="icobtn btn hamburger"
          style={{
            width: 44, height: 44, background: C.brandSoft, border: `1.5px solid ${C.brandMid}`,
            color: C.brand, display: "none"
          }}>
          <Menu size={22} />
        </button>
        <div>
          <div style={{ fontSize: 10, color: C.brand, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>{titles[page]}</div>
          <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{titles[page]}</div>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Theme Toggle */}
        <button className="icobtn btn" onClick={toggleTheme} title="Toggle Theme"
          style={{
            width: 44, height: 44, background: C.surface, border: `1.5px solid ${C.border}`,
            color: C.sub, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.color = C.brand; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.sub; }}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
      </div>
    </header>
  );
}

/* ═══ APP ROOT ═══ */
export default function App({ theme, toggleTheme }) {
  const [jobs, setJobs] = useState(() => {
    try { const s = localStorage.getItem("jt-jobs"); return s ? JSON.parse(s) : SEED_JOBS; }
    catch { return SEED_JOBS; }
  });
  const [accounts, setAccounts] = useState(() => {
    try { const s = localStorage.getItem("jt-accounts"); return s ? JSON.parse(s) : SEED_ACCOUNTS; }
    catch { return SEED_ACCOUNTS; }
  });
  const [page, setPage] = useState("dashboard");
  const [mobOpen, setMobOpen] = useState(false);
  const [toastState, setToastState] = useState(null);

  useEffect(() => {
    localStorage.setItem("jt-jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("jt-accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "jt-global";
    el.textContent = GCSS;
    document.head.appendChild(el);
    return () => document.getElementById("jt-global")?.remove();
  }, []);

  const toast = useCallback((msg, type = "success") => {
    setToastState({ msg, type, k: uid() });
  }, []);

  return (
    <div className="app-shell">
      {/* Desktop sidebar */}
      <div className="sidebar-wrap">
        <Sidebar active={page} setActive={setPage} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobOpen && (
        <div className="ovl" style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
          <div onClick={() => setMobOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(19,19,43,.55)", backdropFilter: "blur(8px)" }} />
          <div style={{
            position: "absolute", top: 0, left: 0, height: "100%", width: 240,
            animation: "slideUp .22s ease", boxShadow: "4px 0 30px rgba(0,0,0,.2)"
          }}>
            <Sidebar active={page} setActive={p => { setPage(p); setMobOpen(false); }} onClose={() => setMobOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content column */}
      <div className="main-wrap">
        <TopBar page={page} theme={theme} toggleTheme={toggleTheme} onHamburger={() => setMobOpen(true)} />

        {/* Scrollable page area — this is the ONLY scroll container */}
        <div className="page-scroll" style={{ padding: "22px 22px 64px 22px" }}>
          {page === "dashboard" && <DashboardPage jobs={jobs} accounts={accounts} />}
          {page === "jobs" && <JobsPage jobs={jobs} setJobs={setJobs} toast={toast} />}
          {page === "accounts" && <AccountsPage accounts={accounts} setAccounts={setAccounts} toast={toast} />}
          {page === "analytics" && <AnalyticsPage jobs={jobs} />}
        </div>
      </div>

      {/* Mobile bottom nav — fixed, outside scroll */}
      <BottomNav active={page} setActive={setPage} />

      {/* Toast */}
      {toastState && (
        <Toast key={toastState.k} msg={toastState.msg} type={toastState.type}
          onDone={() => setToastState(null)} />
      )}
    </div>
  );
}
