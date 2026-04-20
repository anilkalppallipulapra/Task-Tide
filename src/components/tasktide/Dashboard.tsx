import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  TrendingUp,
  Sparkles,
  Trash2,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { dayOfGoal, type Goal } from "@/lib/tasktide";

type Tab = "today" | "progress";

interface Props {
  goals: Goal[];
  activeGoalId: string;
  onChangeGoal: (id: string) => void;
  onToggleTask: (taskId: string) => void;
  onNewGoal: () => void;
  onDeleteGoal: (id: string) => void;
}

export const Dashboard = ({
  goals,
  activeGoalId,
  onChangeGoal,
  onToggleTask,
  onNewGoal,
  onDeleteGoal,
}: Props) => {
  const [tab, setTab] = useState<Tab>("today");
  const goal = goals.find((g) => g.id === activeGoalId) ?? goals[0];

  const today = useMemo(() => dayOfGoal(goal), [goal]);
  const todaysTasks = goal.tasks.filter((t) => t.day === today);
  const doneToday = todaysTasks.filter((t) => t.done).length;
  const totalDone = goal.tasks.filter((t) => t.done).length;
  const pct = Math.round((totalDone / goal.tasks.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            {goals.length > 1 && (
              <select
                value={activeGoalId}
                onChange={(e) => onChangeGoal(e.target.value)}
                className="hidden rounded-lg border bg-card px-3 py-1.5 text-sm font-medium md:block"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            )}
            <Button variant="outline" size="sm" onClick={onNewGoal}>
              <Plus className="h-4 w-4" />
              New goal
            </Button>
          </div>
        </div>

        <div className="mx-auto flex max-w-5xl items-center gap-1 px-6 pb-2">
          {(
            [
              { id: "today", label: "Today", icon: Calendar },
              { id: "progress", label: "Progress", icon: TrendingUp },
            ] as { id: Tab; label: string; icon: typeof Calendar }[]
          ).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-smooth ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <AnimatePresence mode="wait">
          {tab === "today" ? (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-8">
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Day {today} of {goal.durationDays}
                </div>
                <h1 className="font-display mt-1 text-4xl font-bold tracking-tight md:text-5xl">
                  {goal.title}
                </h1>
                <div className="mt-3 flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    {doneToday} of {todaysTasks.length} tasks done today
                  </div>
                  {doneToday === todaysTasks.length && todaysTasks.length > 0 && (
                    <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                      ✨ All done!
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {todaysTasks.length === 0 ? (
                  <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
                    No tasks today — enjoy a rest day 🌊
                  </div>
                ) : (
                  todaysTasks.map((t, i) => (
                    <motion.button
                      key={t.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => onToggleTask(t.id)}
                      className={`group flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-smooth hover:shadow-soft ${
                        t.done
                          ? "border-success/30 bg-success/5"
                          : "bg-card hover:border-primary/40"
                      }`}
                    >
                      {t.done ? (
                        <CheckCircle2
                          className="h-6 w-6 shrink-0 text-success"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Circle className="h-6 w-6 shrink-0 text-muted-foreground/40 group-hover:text-primary" />
                      )}
                      <span
                        className={`flex-1 font-medium ${
                          t.done ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {t.title}
                      </span>
                    </motion.button>
                  ))
                )}
              </div>

              <div className="mt-12">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-lg font-semibold">Coming up</h2>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {goal.tasks
                    .filter((t) => t.day > today)
                    .slice(0, 4)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border bg-card/60 p-4 text-sm"
                      >
                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Day {t.day}
                        </div>
                        <div className="mt-0.5">{t.title}</div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Your <span className="text-gradient">progress</span>
              </h1>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <StatCard label="Overall" value={`${pct}%`} sub={`${totalDone}/${goal.tasks.length} tasks`} />
                <StatCard label="Current day" value={`${today}`} sub={`of ${goal.durationDays}`} />
                <StatCard
                  label="Streak"
                  value={`${computeStreak(goal)}`}
                  sub="days in a row"
                />
              </div>

              <div className="mt-8 rounded-3xl border bg-gradient-card p-6 shadow-soft md:p-8">
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{goal.title}</div>
                    <div className="font-display text-2xl font-bold">{pct}% complete</div>
                  </div>
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-tide"
                  />
                </div>

                <div className="mt-8">
                  <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Daily completion
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: goal.durationDays }, (_, i) => i + 1).map((d) => {
                      const dayTasks = goal.tasks.filter((t) => t.day === d);
                      const allDone = dayTasks.length && dayTasks.every((t) => t.done);
                      const someDone = dayTasks.some((t) => t.done);
                      const isToday = d === today;
                      return (
                        <div
                          key={d}
                          title={`Day ${d}`}
                          className={`h-7 w-7 rounded-md transition-smooth ${
                            allDone
                              ? "bg-primary"
                              : someDone
                              ? "bg-primary/40"
                              : "bg-muted"
                          } ${isToday ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {goals.length > 1 && (
                <div className="mt-10">
                  <h2 className="font-display mb-3 text-lg font-semibold">All goals</h2>
                  <div className="space-y-2">
                    {goals.map((g) => {
                      const gd = g.tasks.filter((t) => t.done).length;
                      const gp = Math.round((gd / g.tasks.length) * 100);
                      return (
                        <div
                          key={g.id}
                          className={`flex items-center gap-4 rounded-2xl border p-4 ${
                            g.id === activeGoalId ? "border-primary/50 bg-primary/5" : "bg-card"
                          }`}
                        >
                          <button
                            onClick={() => onChangeGoal(g.id)}
                            className="flex-1 text-left"
                          >
                            <div className="font-medium">{g.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {gp}% · {gd}/{g.tasks.length} tasks
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${g.title}"?`)) onDeleteGoal(g.id);
                            }}
                            className="rounded-lg p-2 text-muted-foreground transition-smooth hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="rounded-2xl border bg-gradient-card p-5 shadow-soft">
    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {label}
    </div>
    <div className="font-display mt-1 text-3xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{sub}</div>
  </div>
);

const computeStreak = (goal: Goal): number => {
  const today = dayOfGoal(goal);
  let streak = 0;
  for (let d = today; d >= 1; d--) {
    const dayTasks = goal.tasks.filter((t) => t.day === d);
    if (dayTasks.length && dayTasks.every((t) => t.done)) streak++;
    else break;
  }
  return streak;
};
