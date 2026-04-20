import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { newGoal, type Goal } from "@/lib/tasktide";

interface Props {
  onBack: () => void;
  onCreated: (goal: Goal) => void;
}

const SUGGESTIONS = [
  "Learn Spanish to a conversational level",
  "Run a half-marathon",
  "Write the first draft of a novel",
  "Launch a side project",
  "Build a daily meditation habit",
];

export const GoalCreate = ({ onBack, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setGenerating(true);
    // Faux AI think-time
    await new Promise((r) => setTimeout(r, 1100));
    const goal = newGoal(title, description, duration);
    onCreated(goal);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="mx-auto flex max-w-3xl items-center gap-2 px-6 py-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">Back</span>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-primary" />
            Step 1 of 1 — tell us your goal
          </div>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            What do you want to <span className="text-gradient">achieve?</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Describe it like you'd tell a friend. Our AI will turn it into small daily tasks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 space-y-6 rounded-3xl border bg-gradient-card p-6 shadow-soft md:p-8"
        >
          <div className="space-y-2">
            <Label htmlFor="goal-title">Your goal</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Learn to play guitar"
              className="h-12 text-base"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-desc">Why does it matter? (optional)</Label>
            <Textarea
              id="goal-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A bit of context helps the AI tailor your plan…"
              rows={3}
              maxLength={400}
            />
          </div>

          <div className="space-y-3">
            <Label>Time horizon</Label>
            <div className="flex flex-wrap gap-2">
              {[7, 14, 30, 60, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
                    duration === d
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "bg-background hover:border-primary/50"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="hero"
            size="xl"
            onClick={handleGenerate}
            disabled={!title.trim() || generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is preparing your plan…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate my plan
              </>
            )}
          </Button>
        </motion.div>

        {!title && (
          <div className="mt-8">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Need inspiration?
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setTitle(s)}
                  className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-smooth hover:border-primary/50 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
