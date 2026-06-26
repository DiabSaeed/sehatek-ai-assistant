// Sehatek surfaces — logic preserved verbatim from user's Sehatek.jsx.
// Only the return JSX has been restyled to the new clean SaaS look with
// full dark-mode support. State, fetch calls, PowerBI URLs, and reportsList
// are untouched.

import { useState, useEffect } from "react";
import {
  Workflow,
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
} from "lucide-react";

/* ----------------------------------------------------------------- */
/* Toast                                                              */
/* ----------------------------------------------------------------- */
type Toast = { title: string; message: string; type: "success" | "error" } | null;

export function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-4 flex items-start gap-3.5 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`p-2 rounded-xl mt-0.5 ${isSuccess ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"}`}>
        {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded-lg">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Welcome Surface (Home)                                             */
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

  const foundation = [
    {
      icon: Activity,
      title: "Fabric Real-Time Data Streams",
      body: "Connected directly to active Microsoft Fabric Architecture Streams. Captures operational clinical metrics with sub-second analytical syncing across medical layers.",
      tag: "Active Production Bridge",
    },
    {
      icon: Cpu,
      title: "Power BI Embedded Surface",
      body: "Direct integration with workspace embedded tokens. Supports both interactive dashboards and pixel-perfect paginated report builder definitions (.RDL).",
      tag: "Dedicated Capacity Active",
    },
    {
      icon: Server,
      title: "Orchestration & Proxy Triggers",
      body: "Localized server proxy gateway to execute workflows on-demand. Coordinates background processing, SharePoint routing, and automated clinical communications.",
      tag: "REST Edge Gateway Online",
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
        {/* Hero with soft gradient */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-violet-50 via-white to-violet-50/60 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/60 p-8 lg:p-12 shadow-sm">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 dark:border-violet-500/30 bg-white dark:bg-slate-900/40 px-3 py-1 text-[11px] font-semibold text-violet-700 dark:text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              Clinical Infrastructure · Online
            </span>
            <h1 className="mt-4 text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome to the Sehatek <span className="text-violet-600 dark:text-violet-400">Management Surface</span>
            </h1>
            <p className="mt-3 text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              An advanced enterprise clinical orchestration framework that unifies analytical intelligence,
              automated synchronizations, and reporting pipelines over high-performance infrastructure.
            </p>
          </div>
        </section>

        {/* Foundation cards */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Architectural Foundation</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Core surfaces powering the clinical platform.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {foundation.map(({ icon: Icon, title, body, tag }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 flex-1">{body}</p>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/70 flex items-center gap-1.5 text-[11px] font-medium text-violet-600 dark:text-violet-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Technology Stack</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tools and platforms powering the Sehatek maternal-health platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {customTechStack.map((stack, idx) => {
              const Icon = stack.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">{stack.category}</h3>
                  </div>
                  <div className="space-y-2">
                    {stack.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                      >
                        <div className="w-1 h-1 rounded-full bg-violet-400 mt-2 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Combined Power BI View Layer (Interactive vs Paginated Switch)     */
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

  const segBtn = (active: boolean, tone: "neutral" | "violet" = "neutral") =>
    `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
      active
        ? tone === "violet"
          ? "bg-white dark:bg-slate-700 text-violet-700 dark:text-violet-300 shadow-sm"
          : "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
    }`;

  const inputCls =
    "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-violet-500 dark:focus:border-violet-400";

  return (
    <div className="w-full h-full p-4 lg:p-6 flex flex-col gap-4 overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button onClick={() => setSubView("interactive")} className={segBtn(subView === "interactive")}>
              Interactive UI
            </button>
            <button onClick={() => setSubView("paginated")} className={segBtn(subView === "paginated", "violet")}>
              Paginated Builder (6 Reports)
            </button>
          </div>

          {subView === "paginated" && (
            <div className="flex flex-wrap items-center gap-2 bg-violet-50 dark:bg-violet-500/10 p-1.5 rounded-xl border border-violet-100 dark:border-violet-500/20 text-xs">
              {activeReportInstance.id === "content_engagement" && (
                <>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={inputCls}>
                    <option value="2026">Year: 2026</option>
                    <option value="2025">Year: 2025</option>
                    <option value="2023">Year: 2023</option>
                  </select>
                  <select value={selectedTrimester} onChange={(e) => setSelectedTrimester(e.target.value)} className={inputCls}>
                    <option value="All">Trimester: All</option>
                    <option value="First">Trimester: First</option>
                    <option value="Second">Trimester: Second</option>
                    <option value="Third">Trimester: Third</option>
                  </select>
                </>
              )}

              {activeReportInstance.id === "doctor_performance" && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 pl-1 font-medium">Doctor:</span>
                  <input
                    type="text"
                    value={currentDoctorName}
                    onChange={(e) => setCurrentDoctorName(e.target.value)}
                    placeholder="Enter Doctor Name"
                    className={`${inputCls} w-36`}
                  />
                </div>
              )}

              {(activeReportInstance.id === "lab_results" || activeReportInstance.id === "pregnancy_followup") && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 pl-1 font-medium">Pregnancy ID:</span>
                  <input
                    type="text"
                    value={pregnancyId}
                    onChange={(e) => setPregnancyId(e.target.value)}
                    placeholder="e.g. 108388"
                    className={`${inputCls} w-28 font-mono`}
                  />
                </div>
              )}

              {activeReportInstance.id === "monthly_summary" && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 pl-1 font-medium">Month:</span>
                    <input
                      type="number"
                      value={summaryMonth}
                      onChange={(e) => setSummaryMonth(e.target.value)}
                      placeholder="4"
                      className={`${inputCls} w-16 font-mono`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 pl-1 font-medium">Year:</span>
                    <input
                      type="number"
                      value={summaryYear}
                      onChange={(e) => setSummaryYear(e.target.value)}
                      placeholder="2022"
                      className={`${inputCls} w-20 font-mono`}
                    />
                  </div>
                </>
              )}

              <span className="text-[10px] text-violet-700 dark:text-violet-300 font-semibold px-1.5 flex items-center gap-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Dynamic Link Live
              </span>
            </div>
          )}
        </div>

        {subView === "paginated" && (
          <div className="relative z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-violet-400 dark:hover:border-violet-400 transition-all min-w-[250px] justify-between"
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileText className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                <span className="truncate">{activeReportInstance.name}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50 max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 mb-1">
                    Select Paginated Report
                  </div>
                  {reportsList.map((rep) => (
                    <button
                      key={rep.id}
                      onClick={() => {
                        setSelectedReport(rep);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium truncate transition-colors ${
                        rep.id === activeReportInstance.id
                          ? "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                      }`}
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

      <div className="flex-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden min-h-[500px] relative">
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
/* Core Automation Pipelines Component                                */
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
      <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
          {/* Hero */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-violet-50 via-white to-violet-50/60 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/60 p-8 lg:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 dark:border-violet-500/30 bg-white dark:bg-slate-900/40 px-3 py-1 text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                  Automation Gateway
                </span>
                <h1 className="mt-4 text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Automation Control <span className="text-violet-600 dark:text-violet-400">Surface</span>
                </h1>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Route local telemetry through Azure Logic triggers, active n8n agents, and secure SharePoint
                  document servers via a single high-performance integration bridge.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 shrink-0">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 px-3 py-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Gateway Active
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 px-3 py-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Proxy Routing Online
                </div>
              </div>
            </div>
          </section>

          {/* Triggers */}
          <section>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Available Automation Triggers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1 */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Send Patient's Content Flow
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 flex-1">
                  Dispatches a cloud transaction loop to extract schema instances, parse clinical metadata, and
                  save synchronized report outputs straight to active SharePoint storage drives.
                </p>
                <button
                  onClick={triggerPowerAutomateFlow}
                  disabled={isSyncing}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Stack Arrays…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Send Patient's Content
                    </>
                  )}
                </button>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Send Doctor's Report Pipeline
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 flex-1">
                  Fires asynchronous query logic against active telemetry views to assemble multi-parameter
                  lists, invoke edge endpoints, and persist logs onto tracking layers.
                </p>
                <button
                  onClick={triggerRecurrenceFlow}
                  disabled={isRecurrentSyncing}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRecurrentSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Evaluating Aggregations…
                    </>
                  ) : (
                    <>
                      <Workflow className="w-4 h-4" />
                      Send Doctor's Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
