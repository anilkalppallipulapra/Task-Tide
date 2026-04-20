import { useEffect, useState } from "react";
import { Landing } from "@/components/tasktide/Landing";
import { GoalCreate } from "@/components/tasktide/GoalCreate";
import { Breakdown } from "@/components/tasktide/Breakdown";
import { Dashboard } from "@/components/tasktide/Dashboard";
import { EmptyState } from "@/components/tasktide/EmptyState";
import { loadGoals, saveGoals, type Goal } from "@/lib/tasktide";

type View = "landing" | "create" | "breakdown" | "dashboard" | "empty";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string>("");
  const [draftGoal, setDraftGoal] = useState<Goal | null>(null);

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const enterApp = () => {
    if (goals.length === 0) setView("empty");
    else {
      setActiveGoalId(goals[0].id);
      setView("dashboard");
    }
  };

  const handleGoalCreated = (goal: Goal) => {
    setDraftGoal(goal);
    setView("breakdown");
  };

  const confirmPlan = () => {
    if (!draftGoal) return;
    setGoals((prev) => [draftGoal, ...prev]);
    setActiveGoalId(draftGoal.id);
    setDraftGoal(null);
    setView("dashboard");
  };

  const toggleTask = (taskId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === activeGoalId
          ? { ...g, tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
          : g
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => {
      const next = prev.filter((g) => g.id !== id);
      if (id === activeGoalId && next.length) setActiveGoalId(next[0].id);
      if (!next.length) setView("empty");
      return next;
    });
  };

  if (view === "landing") return <Landing onGetStarted={enterApp} />;
  if (view === "empty") return <EmptyState onCreate={() => setView("create")} />;
  if (view === "create")
    return (
      <GoalCreate
        onBack={() => setView(goals.length ? "dashboard" : "empty")}
        onCreated={handleGoalCreated}
      />
    );
  if (view === "breakdown" && draftGoal)
    return (
      <Breakdown
        goal={draftGoal}
        onBack={() => setView("create")}
        onConfirm={confirmPlan}
      />
    );
  if (view === "dashboard" && goals.length)
    return (
      <Dashboard
        goals={goals}
        activeGoalId={activeGoalId || goals[0].id}
        onChangeGoal={setActiveGoalId}
        onToggleTask={toggleTask}
        onNewGoal={() => setView("create")}
        onDeleteGoal={deleteGoal}
      />
    );

  return <Landing onGetStarted={enterApp} />;
};

export default Index;
