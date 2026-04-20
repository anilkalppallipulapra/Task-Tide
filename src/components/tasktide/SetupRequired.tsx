import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const EXAMPLE_ENV = `VITE_SUPABASE_URL=https://your-project-ref.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key`;

export const SetupRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-soft px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-card p-8 shadow-soft md:p-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Logo />
          <Button asChild variant="outline" size="sm">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
            >
              Open Supabase
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Final setup needed
        </h1>
        <p className="mt-3 text-muted-foreground">
          TaskTide is ready, but it still needs your Supabase credentials to run end-to-end.
        </p>

        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
          <li>Create a Supabase project.</li>
          <li>Copy <code>.env.example</code> to <code>.env</code>.</li>
          <li>Paste your project URL and publishable key.</li>
          <li>Run the SQL migration in <code>supabase/migrations</code>.</li>
        </ol>

        <pre className="mt-6 overflow-x-auto rounded-xl border bg-background p-4 text-xs">{EXAMPLE_ENV}</pre>
      </div>
    </div>
  );
};
