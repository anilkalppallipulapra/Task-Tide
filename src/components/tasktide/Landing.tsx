import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

interface Props {
  onGetStarted: () => void;
}

export const Landing = ({ onGetStarted }: Props) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-soft">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Button variant="ghost" onClick={onGetStarted}>
          Sign In
        </Button>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-24 text-center md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-powered daily planning
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        >
          Big goals,
          <br />
          <span className="text-gradient">tiny daily waves.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
        >
          TaskTide breaks ambitious goals into small, doable daily tasks — so you ride the
          momentum instead of fighting overwhelm.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button variant="hero" size="xl" onClick={onGetStarted} className="group">
            Get Started — it's free
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="ghost" size="xl" onClick={onGetStarted}>
            Sign In
          </Button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-3"
        >
          {[
            {
              icon: Sparkles,
              title: "AI breakdown",
              text: "Type a goal. Get a clear plan of small daily steps in seconds.",
            },
            {
              icon: Calendar,
              title: "Today view",
              text: "Just what to do today. No noise. No overwhelm.",
            },
            {
              icon: TrendingUp,
              title: "Visible progress",
              text: "Watch streaks build and your goal inch closer every day.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border bg-gradient-card p-6 text-left shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Mock preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mx-auto mt-20 max-w-3xl"
        >
          <div className="rounded-3xl border bg-gradient-card p-2 shadow-elegant">
            <div className="rounded-2xl bg-background p-6 text-left">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Today · Day 4 of 30
                  </div>
                  <div className="font-display text-xl font-semibold">Run a half-marathon</div>
                </div>
                <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  3 of 4 done
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  ["Easy 3km recovery jog", true],
                  ["Stretch + foam roll 10 min", true],
                  ["Log today's energy level", true],
                  ["Plan tomorrow's tempo run", false],
                ].map(([t, done]) => (
                  <li
                    key={t as string}
                    className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm"
                  >
                    <CheckCircle2
                      className={`h-5 w-5 ${done ? "text-success" : "text-muted-foreground/40"}`}
                      strokeWidth={done ? 2.5 : 1.5}
                    />
                    <span className={done ? "text-muted-foreground line-through" : ""}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t bg-background/40 py-6 text-center text-sm text-muted-foreground backdrop-blur-sm">
        Built with care · Ride your tide 🌊
      </footer>
    </div>
  );
};
