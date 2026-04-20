import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Landing } from "@/components/tasktide/Landing";
import { GoalCreate } from "@/components/tasktide/GoalCreate";
import { Breakdown } from "@/components/tasktide/Breakdown";
import { Dashboard } from "@/components/tasktide/Dashboard";
import { EmptyState } from "@/components/tasktide/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchGoals,
  persistGoal,
  setTaskDone,
  deleteGoalCloud,
  type Goal,
} from "@/lib/tasktide";
import { toast } from "sonner";

type View = "create" | "breakdown" | "dashboard" | "empty";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [view, setView] = useState<View>("empty");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string>("");
  const [draft, setDraft] = useState<Goal | null>(null);
  const [loadingGoals, setLoadingGoals] = useState(false);

  // Load goals when user is available
  useEffect(() => {
    if (!user) return;
    setLoadingGoals(true);
    fetchGoals(user.id)
      .then((gs) => {
        setGoals(gs);
        if (gs.length) {
          setActiveGoalId(gs[0].id);
          setView("dashboard");
        } else {
          setView("empty");
        }
      })
      .catch((e) => toast.error(e.message ?? "Failed to load goals"))
      .finally(() => setLoadingGoals(false));
  }, [user]);

  // Public landing for unauthenticated visitors
  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-soft">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Landing onGetStarted={() => navigate("/auth")} />;
  }

  if (loadingGoals) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-soft">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const handleCreated = (goal: Goal) => {
    setDraft(goal);
    setView("breakdown");
  };

  const confirmPlan = async () => {
    if (!draft || !user) return;
    try {
      const saved = await persistGoal(user.id, draft);
      setGoals((prev) => [saved, ...prev]);
      setActiveGoalId(saved.id);
      setDraft(null);
      setView("dashboard");
      toast.success("Plan saved 🌊");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save plan");
    }
  };

  const toggleTask = async (taskId: string) => {
    const goal = goals.find((g) => g.id === activeGoalId);
    const task = goal?.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const next = !task.done;
    // Optimistic
    setGoals((prev) =>
      prev.map((g) =>
        g.id === activeGoalId
          ? { ...g, tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, done: next } : t)) }
          : g
      )
    );
    try {
      await setTaskDone(taskId, next);
    } catch (e: any) {
      toast.error("Couldn't sync — reverted");
      setGoals((prev) =>
        prev.map((g) =>
          g.id === activeGoalId
            ? { ...g, tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, done: !next } : t)) }
            : g
        )
      );
    }
  };

  const removeGoal = async (id: string) => {
    const prev = goals;
    const next = prev.filter((g) => g.id !== id);
    setGoals(next);
    if (id === activeGoalId && next.length) setActiveGoalId(next[0].id);
    if (!next.length) setView("empty");
    try {
      await deleteGoalCloud(id);
    } catch (e: any) {
      toast.error("Couldn't delete — reverted");
      setGoals(prev);
    }
  };

  if (view === "empty") {
    return (
      <EmptyState
        onCreate={() => setView("create")}
        onSignOut={signOut}
        userEmail={user.email ?? undefined}
      />
    );
  }
  if (view === "create")
    return (
      <GoalCreate
        onBack={() => setView(goals.length ? "dashboard" : "empty")}
        onCreated={handleCreated}
      />
    );
  if (view === "breakdown" && draft)
    return <Breakdown goal={draft} onBack={() => setView("create")} onConfirm={confirmPlan} />;
  if (view === "dashboard" && goals.length)
    return (
      <Dashboard
        goals={goals}
        activeGoalId={activeGoalId || goals[0].id}
        onChangeGoal={setActiveGoalId}
        onToggleTask={toggleTask}
        onNewGoal={() => setView("create")}
        onDeleteGoal={removeGoal}
        onSignOut={signOut}
        userEmail={user.email ?? undefined}
      />
    );

  return (
    <EmptyState
      onCreate={() => setView("create")}
      onSignOut={signOut}
      userEmail={user.email ?? undefined}
    />
  );
};

export default Index;
