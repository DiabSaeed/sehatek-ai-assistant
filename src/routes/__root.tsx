import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home as HomeIcon,
  LayoutDashboard,
  Menu,
  Moon,
  Stethoscope,
  Sun,
  Workflow,
  BarChart3,
  X,
} from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useTheme } from "../hooks/use-theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-slate-900 dark:text-slate-100">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sehatek Clinical Portal" },
      { name: "description", content: "Enterprise clinical orchestration portal — RAG knowledge, analytics, reports, and automation." },
      { name: "author", content: "Sehatek" },
      { property: "og:title", content: "Sehatek Clinical Portal" },
      { property: "og:description", content: "Enterprise clinical orchestration portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

type NavItem = {
  to: string;
  label: string;
  desc: string;
  Icon: typeof HomeIcon;
  exact?: boolean;
};

const clinicalNav: NavItem[] = [
  { to: "/architecture", label: "Home", desc: "Project Architecture Hub", Icon: HomeIcon },
  { to: "/analytics", label: "Analytics Dashboard", desc: "Live service stream", Icon: LayoutDashboard },
  { to: "/reports", label: "Report Builder", desc: "Paginated structures", Icon: BarChart3 },
  { to: "/automation", label: "Automation Core", desc: "Pipeline orchestration", Icon: Workflow },
];

const knowledgeNav: NavItem[] = [
  { to: "/", label: "Dashboard", desc: "Projects overview", Icon: Stethoscope, exact: true },
  { to: "/documents", label: "Documents", desc: "Ingest clinical PDFs", Icon: FileText },
  { to: "/chat", label: "AI Assistant", desc: "Grounded RAG chat", Icon: Bot },
];

const ALL_NAV = [...clinicalNav, ...knowledgeNav];

function SidebarLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const { Icon } = item;
  return (
    <Link
      to={item.to}
      title={collapsed ? item.label : undefined}
      activeOptions={item.exact ? { exact: true } : undefined}
      className={`group w-full flex items-center rounded-xl text-sm font-medium transition-all relative text-violet-100/80 hover:text-white hover:bg-white/5 ${
        collapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
      }`}
      activeProps={{
        className: `group w-full flex items-center rounded-xl text-sm font-medium transition-all relative text-white bg-violet-500/25 ring-1 ring-inset ring-violet-400/30 ${
          collapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
        }`,
      }}
    >
      <Icon className="w-[18px] h-[18px] flex-shrink-0" />
      {!collapsed && (
        <div className="text-left truncate min-w-0">
          <p className="font-semibold leading-tight truncate">{item.label}</p>
          <p className="text-[11px] mt-0.5 text-violet-200/60 truncate">{item.desc}</p>
        </div>
      )}
    </Link>
  );
}

function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  return (
    <aside
      className={`hidden md:flex md:flex-col flex-shrink-0 relative bg-[#1e1638] dark:bg-[#15102a] border-r border-violet-950/40 transition-[width] duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
        className="absolute -right-3 top-7 z-50 h-6 w-6 inline-flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-violet-600 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand */}
      <div className={`h-16 flex items-center border-b border-white/5 ${collapsed ? "justify-center px-3" : "px-5"}`}>
        {collapsed ? (
          <span className="text-lg font-bold tracking-tight text-white">S</span>
        ) : (
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-white leading-none">Sehatek</p>
            <p className="text-[10.5px] mt-1 text-violet-300/70 tracking-wide">Clinical Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-violet-300/50">
              Clinical Portal
            </p>
          )}
          {clinicalNav.map((item) => (
            <SidebarLink key={item.to} item={item} collapsed={collapsed} />
          ))}
        </div>
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-violet-300/50">
              Knowledge System
            </p>
          )}
          {knowledgeNav.map((item) => (
            <SidebarLink key={item.to} item={item} collapsed={collapsed} />
          ))}
        </div>
      </nav>
    </aside>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 md:hidden" onClick={onClose}>
      <div
        className="w-72 h-full bg-[#1e1638] p-5 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <p className="text-white font-semibold">Sehatek</p>
          <button onClick={onClose} className="p-1 text-violet-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-1 mt-4 overflow-y-auto">
          {ALL_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.exact ? { exact: true } : undefined}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-violet-100 hover:bg-white/5"
              activeProps={{
                className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white bg-violet-500/25 ring-1 ring-inset ring-violet-400/30",
              }}
            >
              <item.Icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopHeader({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = ALL_NAV.find((n) => (n.exact ? pathname === n.to : pathname.startsWith(n.to))) ?? ALL_NAV[0];

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          aria-label="Open navigation"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium min-w-0">
          <span className="text-slate-400 dark:text-slate-500">Workspace</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{current.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-300 hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 antialiased"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <TopHeader onOpenMobile={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto relative">
            <Outlet />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
