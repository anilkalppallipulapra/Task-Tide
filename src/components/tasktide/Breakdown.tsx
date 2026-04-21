import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/lib/tasktide";

interface Props {
  goal: Goal;
  onBack: () => void;
  onConfirm: () => void;
}

export const Breakdown = ({ goal, onBack, onConfirm }: Props) => {
  // Group tasks by week
  const weeks: { label: string; tasks: typeof goal.tasks }[] = [];
  const perWeek = 7;
  for (let i = 0; i < goal.tasks.length; i += perWeek) {
    const num = Math.floor(i / perWeek) + 1;
    weeks.push({
      label: `Week ${num}`,
      tasks: goal.tasks.slice(i, i + perWeek),
    });
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="text-xs text-muted-foreground">Review your AI-generated plan</div>
            <div className="font-display text-base font-semibold">{goal.title}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Plan summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl border bg-gradient-card p-6 shadow-soft md:p-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Plan ready · {goal.tasks.length} daily tasks
          </div>
          <h1 className="font-display mt-4 text-3xl font-bold md:text-4xl">{goal.title}</h1>
          {goal.description && (
            <p className="mt-2 text-muted-foreground">{goal.description}</p>
          )}
          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-semibold">{goal.durationDays} days</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Daily commitment</div>
              <div className="font-semibold">~15–30 min</div>
            </div>
          </div>
        </motion.div>

        {/* Instruction hint */}
        <p className="mb-6 text-sm text-muted-foreground">
          Here's your full plan. Review it below, then hit{" "}
          <span className="font-semibold text-foreground">Start My Plan</span> when you're ready.
        </p>

        {/* Weekly task list — read-only preview */}
        <div className="space-y-8">
          {weeks.map((w, wi) => (
            <motion.section
              key={w.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wi * 0.08 }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="font-display text-lg font-semibold">{w.label}</div>
                <div className="h-px flex-1 bg-border" />
                <div className="text-xs text-muted-foreground">{w.tasks.length} tasks</div>
              </div>
              <div className="space-y-2">
                {w.tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start gap-3 rounded-2xl border bg-card p-4"
                  >
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {t.day}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Day {t.day}
                      </div>
                      <div className="mt-0.5 text-sm font-medium">{t.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </main>

      {/* Sticky bottom CTA — always visible, impossible to miss */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <div className="hidden text-sm text-muted-foreground sm:block">
            Looks good? Save this plan and start tracking your progress.
          </div>
          <Button variant="hero" size="xl" onClick={onConfirm} className="w-full sm:w-auto group">
            Start My Plan
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
