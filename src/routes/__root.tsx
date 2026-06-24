import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Bot, FileText, LayoutDashboard, Moon, Stethoscope, Sun } from "lucide-react";

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
      { title: "Sehatek Knowledge System" },
      { name: "description", content: "Enterprise Medical RAG assistant for clinical knowledge retrieval." },
      { name: "author", content: "Sehatek" },
      { property: "og:title", content: "Sehatek Knowledge System" },
      { property: "og:description", content: "Enterprise Medical RAG assistant for clinical knowledge retrieval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
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

function NavBar() {
  const { theme, toggle } = useTheme();
  const linkBase =
    "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all";
  const inactive = "text-muted-foreground hover:text-foreground hover:bg-primary-soft";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 mr-2">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-[var(--shadow-elevated)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-semibold text-[15px]">Sehatek</div>
            <div className="text-[10.5px] text-muted-foreground -mt-0.5">Knowledge System</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 ml-auto">
          <Link
            to="/"
            className={linkBase}
            activeOptions={{ exact: true }}
            activeProps={{ className: `${linkBase} bg-primary-soft text-primary` }}
            inactiveProps={{ className: `${linkBase} ${inactive}` }}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/documents"
            className={linkBase}
            activeProps={{ className: `${linkBase} bg-primary-soft text-primary` }}
            inactiveProps={{ className: `${linkBase} ${inactive}` }}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </Link>
          <Link
            to="/chat"
            className={linkBase}
            activeProps={{ className: `${linkBase} bg-primary-soft text-primary` }}
            inactiveProps={{ className: `${linkBase} ${inactive}` }}
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Assistant</span>
          </Link>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-2 h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border bg-card hover:bg-primary-soft hover:text-primary transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </main>
        <footer className="border-t border-border bg-card/40 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted-foreground flex items-center justify-between">
            <span>© Sehatek Knowledge System</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              API: localhost:5000
            </span>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
