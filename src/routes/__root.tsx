import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/20"
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
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap",
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

function SidebarNavButton({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  const { Icon } = item;
  const baseStyle: React.CSSProperties = { backgroundColor: "transparent", boxShadow: "none" };
  const activeStyle: React.CSSProperties = {
    backgroundColor: "#6D28D9",
    boxShadow: "0 4px 12px rgba(91,33,182,0.2)",
  };

  return (
    <Link
      to={item.to}
      title={isCollapsed ? item.label : undefined}
      activeOptions={item.exact ? { exact: true } : undefined}
      className={`w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative ${
        isCollapsed ? "justify-center p-3.5" : "gap-3.5 px-4 py-3.5"
      }`}
      style={baseStyle}
      activeProps={{ style: activeStyle }}
    >
      {({ isActive }) => (
        <>
          <Icon
            className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 duration-200"
            style={{ color: isActive ? "#FFFFFF" : "#C4B5FD" }}
          />
          {!isCollapsed && (
            <div className="text-left truncate">
              <p className="font-semibold tracking-wide leading-tight" style={{ color: isActive ? "#FFFFFF" : "#EDE9FE" }}>
                {item.label}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: isActive ? "#C4B5FD" : "#A78BFA" }}>
                {item.desc}
              </p>
            </div>
          )}
        </>
      )}
    </Link>
  );
}

function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (v: boolean) => void }) {
  return (
    <aside
      className={`hidden md:flex md:flex-col text-slate-200 flex-shrink-0 relative sidebar-transition ${
        isCollapsed ? "w-20" : "w-72"
      }`}
      style={{ backgroundColor: "#4C1D95", transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)" }}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-8 bg-white border shadow-md rounded-full p-1.5 transition-all z-50 group"
        style={{ borderColor: "#DDD6FE", color: "#6D28D9" }}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="p-6 overflow-hidden whitespace-nowrap" style={{ borderBottom: "1px solid #5B21B6" }}>
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-xl blur-sm opacity-70" style={{ backgroundColor: "#8B5CF6" }} />
            <span
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white font-extrabold text-lg shadow-inner"
              style={{ color: "#6D28D9", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              S
            </span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Sehatek
              </p>
              <p className="text-xs tracking-wide mt-0.5" style={{ color: "#C4B5FD" }}>
                Clinical Infrastructure
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-5 overflow-y-auto">
        <div className="space-y-1.5">
          {!isCollapsed && (
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#A78BFA" }}>
              Clinical Portal
            </p>
          )}
          {clinicalNav.map((item) => (
            <SidebarNavButton key={item.to} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>

        <div className="space-y-1.5">
          {!isCollapsed && (
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#A78BFA" }}>
              Knowledge System
            </p>
          )}
          {knowledgeNav.map((item) => (
            <SidebarNavButton key={item.to} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </nav>
    </aside>
  );
}

function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <header
      className="md:hidden px-5 py-4 flex justify-between items-center text-white w-full z-40 shadow-md"
      style={{ backgroundColor: "#4C1D95", borderBottom: "1px solid #5B21B6" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-extrabold text-sm"
          style={{ color: "#6D28D9", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          S
        </span>
        <span className="font-bold tracking-tight text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Sehatek
        </span>
      </div>
      <button onClick={onOpen} className="p-1 rounded-lg" style={{ backgroundColor: "#5B21B6", color: "#EDE9FE" }}>
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const all = [...clinicalNav, ...knowledgeNav];
  return (
    <div className="fixed inset-0 bg-slate-950/60 z-50 md:hidden backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-72 h-full p-5 shadow-2xl flex flex-col"
        style={{ backgroundColor: "#4C1D95" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid #5B21B6" }}>
          <p className="text-white font-bold text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Navigation Matrix
          </p>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5" style={{ color: "#C4B5FD" }} />
          </button>
        </div>
        <div className="space-y-1 mt-4 overflow-y-auto">
          {all.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.exact ? { exact: true } : undefined}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all"
              style={{ color: "#EDE9FE" }}
              activeProps={{ style: { backgroundColor: "#6D28D9", color: "#FFFFFF" } }}
            >
              <item.Icon className="w-5 h-5" style={{ color: "#C4B5FD" }} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { theme, toggle } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen bg-[#FAFBFC] antialiased overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <MobileTopBar onOpen={() => setMobileOpen(true)} />
          <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

          <div className="absolute top-3 right-4 z-40 hidden md:block">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="h-9 w-9 inline-flex items-center justify-center rounded-xl border bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors"
              style={{ borderColor: "#EDE9FE", color: "#6D28D9" }}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <main className="flex-1 overflow-y-auto relative">
            <Outlet />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
