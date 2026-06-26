// Sehatek surfaces — integrated verbatim from user's Sehatek.jsx.
// Per strict rules: state, variables, functions, PowerBI embed URLs, and
// `reportsList` are NOT modified. Only the outermost wrappers are adapted
// so each surface mounts inside our route layout.

import { useState, useEffect } from "react";
import {
  Workflow,
  ChevronRight,
  Send,
  Database,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Server,
  TrendingUp,
  BrainCircuit,
  FileText,
  ChevronDown,
  RefreshCw,
  Bell,
} from "lucide-react";

/* ----------------------------------------------------------------- */
/* Global Styles & Color Palette Tokens Custom Engine                */
/* ----------------------------------------------------------------- */
export function SehatekGlobalStyles() {
  useEffect(() => {
    if (document.getElementById("sehatek-premium-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "sehatek-premium-styles";
    styleEl.innerHTML = `
      .font-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      .font-body { font-family: 'Inter', sans-serif; }
      .font-data { font-family: 'JetBrains Mono', monospace; }

      @keyframes heartbeat-draw {
        0% { stroke-dashoffset: 240; }
        100% { stroke-dashoffset: 0; }
      }
      .pulse-path {
        stroke-dasharray: 240;
        animation: heartbeat-draw 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      @keyframes slide-in-up {
        from { opacity: 0; transform: translateY(12px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .animate-toast { animation: slide-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-fade-in { animation: slide-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

      .scroll-premium::-webkit-scrollbar { height: 5px; width: 5px; }
      .scroll-premium::-webkit-scrollbar-track { background: transparent; }
      .scroll-premium::-webkit-scrollbar-thumb { background-color: rgba(139, 92, 246, 0.15); border-radius: 9999px; }

      .sidebar-transition { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }

      .glass-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(221, 214, 254, 0.5);
      }
    `;
    document.head.appendChild(styleEl);
  }, []);
  return null;
}

/* ----------------------------------------------------------------- */
/* Shared Visual Assets & Notifications                              */
/* ----------------------------------------------------------------- */
export function PulseLine({ strokeColor = "#8B5CF6", className = "" }: { strokeColor?: string; className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={`w-full h-5 ${className}`} preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,12 L40,12 L48,3 L56,21 L64,12 L92,12 L100,5 L108,19 L116,12 L240,12"
        fill="none"
        strokeWidth="2.5"
        className="pulse-path"
        style={{ stroke: strokeColor }}
      />
    </svg>
  );
}

type Toast = { title: string; message: string; type: "success" | "error" } | null;

export function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white/95 border border-[#EDE9FE] shadow-[0_10px_30px_rgba(119,51,237,0.1)] backdrop-blur-md rounded-2xl p-4 flex items-start gap-3.5 animate-toast">
      <div className={`p-2 rounded-xl mt-0.5 ${toast.type === "success" ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-[#DC2626]/10 text-[#DC2626]"}`}>
        {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-900 font-display">{toast.title}</h4>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-body">{toast.message}</p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function SehatekSubHeader({ activeLabel }: { activeLabel: string }) {
  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3.5 border-b bg-white/70 backdrop-blur-md sticky top-0 z-30" style={{ borderColor: "#EDE9FE" }}>
      <div className="flex items-center gap-2 text-xs font-medium font-body" style={{ color: "#64748B" }}>
        <span>Workspace Portal</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold" style={{ color: "#4C1D95" }}>{activeLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative cursor-pointer p-2 bg-slate-50 rounded-xl border" style={{ borderColor: "#EDE9FE", color: "#6D28D9" }}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#7C3AED" }} />
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------- */
/* Welcome Surface (Home) View Component                             */
/* ----------------------------------------------------------------- */
export function WelcomeSurface() {
  const customTechStack = [
    {
      category: "Database & Data Warehouse",
      icon: Database,
      items: [
        { name: "SQL Server", detail: "OLTP database (Se7tek)" },
        { name: "Azure Fabric", detail: "Warehouse + Lakehouse" },
        { name: "Medallion DWH", detail: "Bronze/Silver/Gold layers" },
        { name: "SSIS", detail: "ETL pipelines" },
      ],
    },
    {
      category: "Business Intelligence",
      icon: TrendingUp,
      items: [
        { name: "Power BI", detail: "Dashboards & semantic model" },
        { name: "Report Builder", detail: "SSRS paginated reports" },
        { name: "DAX", detail: "Semantic model measures" },
      ],
    },
    {
      category: "Automation & AI",
      icon: BrainCircuit,
      items: [
        { name: "n8n", detail: "Workflow automation" },
        { name: "Power Automate", detail: "Microsoft-native flows" },
      ],
    },
  ];

  return (
    <div className="w-full h-full p-6 space-y-8 overflow-y-auto max-w-none scroll-premium animate-fade-in" style={{ backgroundColor: "#FAFBFC" }}>
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden border shadow-sm" style={{ backgroundColor: "#4C1D95", borderColor: "#5B21B6" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(139,92,246,0.15)" }} />
        <div className="relative z-10 max-w-4xl">
          <h1 className="font-display font-bold mb-2.5" style={{ color: "#FFFFFF", fontSize: "28px", letterSpacing: "normal", lineHeight: "1.3" }}>
            Welcome to Sehatek Management Surface
          </h1>
          <p className="text-xs font-normal leading-relaxed max-w-2xl text-purple-100/90">
            An advanced enterprise clinical orchestration framework designed to unify analytical intelligence, automated synchronizations, and reporting pipelines over high-performance infrastructure.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-base font-bold tracking-tight" style={{ color: "#4C1D95" }}>Architectural Foundation</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-none">
        <div className="bg-white rounded-2xl p-6 border shadow-[0_2px_12px_rgba(76,29,149,0.02)] flex flex-col justify-between" style={{ borderColor: "#EDE9FE" }}>
          <div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "#F3E8FF", color: "#6D28D9" }}>
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900 tracking-tight mb-2">Fabric Real-Time Data Streams</h3>
            <p className="text-xs text-slate-500 font-body leading-relaxed">
              Connected directly to active Microsoft Fabric Architecture Streams. It captures operational clinical metrics, ensuring sub-second analytical syncing directly across medical layers.
            </p>
          </div>
          <div className="pt-6 border-t mt-6 flex items-center gap-1.5 text-[11px] font-semibold font-display" style={{ borderColor: "#F3E8FF", color: "#7C3AED" }}>
            <span>Active Production Bridge</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-[0_2px_12px_rgba(76,29,149,0.02)] flex flex-col justify-between" style={{ borderColor: "#EDE9FE" }}>
          <div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "#F3E8FF", color: "#6D28D9" }}>
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900 tracking-tight mb-2">Power BI Embedded Surface</h3>
            <p className="text-xs text-slate-500 font-body leading-relaxed">
              Houses direct integration layers for workspace embedded tokens. Includes specialized support for both high-density interactive dashboards and pixel-perfect paginated report builder definitions (`.RDL`).
            </p>
          </div>
          <div className="pt-6 border-t mt-6 flex items-center gap-1.5 text-[11px] font-semibold font-display" style={{ borderColor: "#F3E8FF", color: "#7C3AED" }}>
            <span>Dedicated Capacity Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-[0_2px_12px_rgba(76,29,149,0.02)] flex flex-col justify-between" style={{ borderColor: "#EDE9FE" }}>
          <div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "#F3E8FF", color: "#6D28D9" }}>
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900 tracking-tight mb-2">Orchestration & Proxy Triggers</h3>
            <p className="text-xs text-slate-500 font-body leading-relaxed">
              Maintains a localized server proxy gateway to execute workflows on-demand. Coordinates background processing, SharePoint record routing, and automated medical communications via n8n and Azure workflows.
            </p>
          </div>
          <div className="pt-6 border-t mt-6 flex items-center gap-1.5 text-[11px] font-semibold font-display" style={{ borderColor: "#F3E8FF", color: "#7C3AED" }}>
            <span>REST Edge Gateway Online</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="mb-5">
          <h2 className="font-display text-sm font-bold" style={{ color: "#4C1D95" }}>Technology Stack</h2>
          <p className="text-xs text-slate-500 font-body mt-0.5">Tools and platforms powering the Sehatek maternal health platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-none">
          {customTechStack.map((stack, idx) => {
            const IconComponent = stack.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 shadow-[0_2px_8px_rgba(76,29,149,0.01)] border flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(76,29,149,0.04)] transition-all duration-300"
                style={{ borderColor: "#EDE9FE" }}
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-purple-700 bg-purple-50 border border-purple-100/50 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 font-display tracking-tight">{stack.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {stack.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-purple-50/30 transition-colors duration-150">
                        <div className="w-1 h-1 rounded-full bg-purple-400 mt-2 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 font-display tracking-wide">{item.name}</p>
                          <p className="text-[11px] text-slate-500 font-body mt-0.5 leading-relaxed">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Combined Power BI View Layer (Interactive vs Paginated Switch)    */
/* ----------------------------------------------------------------- */
export function PowerBICombinedSurface({ initialTab }: { initialTab?: "interactive" | "paginated" }) {
  const [subView, setSubView] = useState<"interactive" | "paginated">(initialTab || "paginated");
  const [isOpen, setIsOpen] = useState(false);

  const [currentDoctorName, setCurrentDoctorName] = useState("Dr. Ahmed Ali");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedTrimester, setSelectedTrimester] = useState("Second");
  const [pregnancyId, setPregnancyId] = useState("108388");

  const [summaryMonth, setSummaryMonth] = useState("4");
  const [summaryYear, setSummaryYear] = useState("2022");

  const targetReportId = "258b759d-1651-4559-8b3d-64b296f471fc";
  const tenantWorkspaceEmbedUrl = `https://app.powerbi.com/reportEmbed?reportId=${targetReportId}&autoAuth=true&ctid=186a7fb9-ca91-438a-bf53-b13bcdebd8ba`;

  const reportsList = [
    {
      id: "content_engagement",
      name: "Content Engagement Analytics",
      embedUrl: `https://app.fabric.microsoft.com/rdlEmbed?reportId=3eeb2bdb-7263-4c31-bd41-ed2ec3073412&autoAuth=true&ctid=186a7fb9-ca91-438a-bf53-b13bcdebd8ba&experience=power-bi&rp:Select_Year=${selectedYear}&rp:Select_Trimester=${selectedTrimester}`
    },
    {
      id: "doctor_performance",
      name: "Doctor Performance Audit",
      embedUrl: `https://app.fabric.microsoft.com/rdlEmbed?reportId=38919acc-bc15-4fc5-beaa-50fb8bb2085e&autoAuth=true&ctid=186a7fb9-ca91-438a-bf53-b13bcdebd8ba&experience=power-bi&rp:Select_Doctor=${currentDoctorName}`
    },
    {
      id: "lab_results",
      name: "Lab Results Distribution",
      embedUrl: `https://app.fabric.microsoft.com/rdlEmbed?reportId=5380404d-7f51-4660-9cf2-32eac03b3904&autoAuth=true&ctid=186a7fb9-ca91-438a-bf53-b13bcdebd8ba&experience=power-bi&rp:Pregnancy_ID=${pregnancyId}`
    },
    {
      id: "monthly_summary",
      name: "Monthly Clinical Summary",
      embedUrl: `https://app.fabric.microsoft.com/rdlEmbed?reportId=fbff33e0-d614-4cde-a8b3-cc457ca3b052&autoAuth=true&ctid=186a7fb9-ca91-438a-bf53-b13bcdebd8ba&experience=power-bi&rp:Month=${summaryMonth}&rp:Year=${summaryYear}`
    },
    {
      id: "high_risk",
      name: "HighRisk Cases Monitoring",
      embedUrl: "https://app.fabric.microsoft.com/rdlEmbed?reportId=7d787954-bf1b-4dc2-8571-b119e219c4e7&autoAuth=true&ctid=186a7fb9-ca91-438a-bf53-b13bcdebd8ba"
    },
    {
      id: "pregnancy_followup",
      name: "Pregnancy Follow-up Registry",
      embedUrl: `https://app.fabric.microsoft.com/rdlEmbed?reportId=c0017f2e-b38f-498c-8569-00f5bfba7165&autoAuth=true&ctid=186a7fb9-ca91-438a-bf53-b13bcdebd8ba&experience=power-bi&rp:Pregnancy_ID=${pregnancyId}`
    }
  ];

  const [selectedReport, setSelectedReport] = useState(reportsList[5]);
  const activeReportInstance = reportsList.find(r => r.id === selectedReport.id) || selectedReport;

  useEffect(() => {
    if (initialTab) setSubView(initialTab);
  }, [initialTab]);

  return (
    <div className="w-full h-full p-4 flex flex-col space-y-3 overflow-hidden max-w-none animate-fade-in font-body bg-[#FAFBFC]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b pb-2 border-slate-200/80">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200/60 shadow-inner">
            <button
              onClick={() => setSubView("interactive")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subView === "interactive" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Interactive UI
            </button>
            <button
              onClick={() => setSubView("paginated")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subView === "paginated" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500 hover:text-purple-600"
              }`}
            >
              Paginated Builder (6 Reports)
            </button>
          </div>

          {subView === "paginated" && (
            <div className="flex flex-wrap items-center gap-2 bg-purple-50/50 p-1 rounded-xl border border-purple-100 text-xs">
              {activeReportInstance.id === "content_engagement" && (
                <>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 outline-none focus:border-purple-500"
                  >
                    <option value="2026">Year: 2026</option>
                    <option value="2025">Year: 2025</option>
                    <option value="2023">Year: 2023</option>
                  </select>
                  <select
                    value={selectedTrimester}
                    onChange={(e) => setSelectedTrimester(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 outline-none focus:border-purple-500"
                  >
                    <option value="All">Trimester: All</option>
                    <option value="First">Trimester: First</option>
                    <option value="Second">Trimester: Second</option>
                    <option value="Third">Trimester: Third</option>
                  </select>
                </>
              )}

              {activeReportInstance.id === "doctor_performance" && (
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 pl-1 font-medium">Doctor:</span>
                  <input
                    type="text"
                    value={currentDoctorName}
                    onChange={(e) => setCurrentDoctorName(e.target.value)}
                    placeholder="Enter Doctor Name"
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 outline-none focus:border-purple-500 w-32"
                  />
                </div>
              )}

              {(activeReportInstance.id === "lab_results" || activeReportInstance.id === "pregnancy_followup") && (
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 pl-1 font-medium">Pregnancy ID:</span>
                  <input
                    type="text"
                    value={pregnancyId}
                    onChange={(e) => setPregnancyId(e.target.value)}
                    placeholder="e.g. 108388"
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 outline-none focus:border-purple-500 w-28 font-data"
                  />
                </div>
              )}

              {activeReportInstance.id === "monthly_summary" && (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 pl-1 font-medium">Month:</span>
                    <input
                      type="number"
                      value={summaryMonth}
                      onChange={(e) => setSummaryMonth(e.target.value)}
                      placeholder="4"
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 outline-none focus:border-purple-500 w-16 font-data"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 pl-1 font-medium">Year:</span>
                    <input
                      type="number"
                      value={summaryYear}
                      onChange={(e) => setSummaryYear(e.target.value)}
                      placeholder="2022"
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 outline-none focus:border-purple-500 w-20 font-data"
                    />
                  </div>
                </>
              )}

              <span className="text-[10px] text-purple-600 font-bold px-1.5 flex items-center gap-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin"/> Dynamic Link Live
              </span>
            </div>
          )}
        </div>

        {subView === "paginated" && (
          <div className="relative z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all min-w-[250px] justify-between focus:outline-none focus:border-purple-500"
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">{activeReportInstance.name}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-fade-in max-h-60 overflow-y-auto scroll-premium">
                  <div className="px-2.5 py-1 text-[9px] font-bold font-display uppercase tracking-wider text-slate-400 border-b border-slate-50 mb-1">
                    Select Paginated Report
                  </div>
                  {reportsList.map((rep) => (
                    <button
                      key={rep.id}
                      onClick={() => {
                        setSelectedReport(rep);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium block truncate text-slate-600 hover:bg-slate-50"
                    >
                      {rep.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px] relative">
        {subView === "interactive" ? (
          <iframe
            title="Sehatek Interactive Production Dashboard"
            src={tenantWorkspaceEmbedUrl}
            className="absolute inset-0 w-full h-full border-0 block m-0 p-0"
            allowFullScreen={true}
          />
        ) : (
          <iframe
            key={activeReportInstance.id + selectedYear + selectedTrimester + currentDoctorName + pregnancyId + summaryMonth + summaryYear}
            title={activeReportInstance.name}
            src={activeReportInstance.embedUrl}
            className="absolute inset-0 w-full h-full border-0 m-0 p-0"
            allowFullScreen={true}
          />
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Core Automation Pipelines Component                               */
/* ----------------------------------------------------------------- */
export function AutomationPipelines() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRecurrentSyncing, setIsRecurrentSyncing] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (title: string, message: string, type: "success" | "error" = "success") => {
    setToast({ title, message, type });
  };

  const triggerPowerAutomateFlow = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("http://localhost:3001/api/trigger-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run" })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast("Pipeline Executed", "Power Automate 'Send Patient Content' triggered via proxy gateway.", "success");
      } else {
        showToast("Execution Refused", "Flow proxy returned error parsing schema matrix rules.", "error");
      }
    } catch (err) {
      showToast("Network Communication Failure", "Failed to interface with local server processing daemon.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const triggerRecurrenceFlow = async () => {
    setIsRecurrentSyncing(true);
    try {
      const response = await fetch("http://localhost:3001/api/trigger-recurrence-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run" })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast("Recurrence Triggered", "Send Doctor's Report data loops initiated successfully.", "success");
      } else {
        showToast("Asynchronous Process Refused", "Gateway rejected data aggregation handshake query.", "error");
      }
    } catch (err) {
      showToast("Network Gateway Error", "Underlying pipeline proxy cluster is unreachable.", "error");
    } finally {
      setIsRecurrentSyncing(false);
    }
  };

  return (
    <>
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
      <div className="w-full h-full p-6 space-y-6 overflow-y-auto max-w-none scroll-premium animate-fade-in" style={{ backgroundColor: "#F5F3FF" }}>
        <div className="relative rounded-2xl p-5 overflow-hidden border shadow-sm" style={{ backgroundColor: "#4C1D95", borderColor: "#5B21B6" }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(139,92,246,0.15)" }} />

          <div className="relative z-10 max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-display font-bold mb-1.5" style={{ color: "#FFFFFF", fontSize: "28px", letterSpacing: "normal", lineHeight: "1.3" }}>
                Automation Control Surface
              </h1>
              <p className="text-xs font-normal leading-relaxed font-body text-white/90" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Direct high-performance integration array bridge routing local telemetry parameters down to Azure Logic triggers, active n8n agents, and secure SharePoint document servers.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 sm:border-l sm:pl-4" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <div className="flex items-center gap-2 text-[11px] text-white" style={{ color: "#FFFFFF" }}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Gateway Active
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white" style={{ color: "#FFFFFF" }}>
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Proxy Routing Engine Active
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold mb-4" style={{ color: "#4C1D95" }}>Available Automation Triggers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-none">
            <div className="glass-card rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group" style={{ borderColor: "#DDD6FE" }}>
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.2)", color: "#0D9488" }}>
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Send Patient's Content Flow</h3>
                <p className="text-xs mt-2 mb-6 leading-relaxed font-body" style={{ color: "#64748B" }}>
                  Manually dispatches a cloud transaction loop to extract schema instances, parse clinical metadata strings, and invoke processing arrays before saving synchronized report outputs straight to active SharePoint storage drives.
                </p>
              </div>

              <button
                onClick={triggerPowerAutomateFlow}
                disabled={isSyncing}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                style={{ backgroundColor: "#7C3AED" }}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Stack Arrays...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    Send Patient's Content
                  </>
                )}
              </button>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group" style={{ borderColor: "#DDD6FE" }}>
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.2)", color: "#1D4ED8" }}>
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Send Doctor's Report Pipeline</h3>
                <p className="text-xs mt-2 mb-6 leading-relaxed font-body" style={{ color: "#64748B" }}>
                  Fires asynchronous query logic sequences against dynamic underlying active telemetry views to assemble multi-parameter lists, invokes edge endpoints, and saves logs directly onto tracking layers.
                </p>
              </div>

              <button
                onClick={triggerRecurrenceFlow}
                disabled={isRecurrentSyncing}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                style={{ backgroundColor: "#7C3AED" }}
              >
                {isRecurrentSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Evaluating Aggregations...
                  </>
                ) : (
                  <>
                    <Workflow className="w-4 h-4 text-violet-200" />
                    Send Doctor's Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
