import { supabase } from "@/integrations/supabase/client";

export type Task = {
  id: string;
  title: string;
  day: number;
  done: boolean;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  durationDays: number;
  createdAt: number;
  tasks: Task[];
};

// AI-powered breakdown via edge function
export const generateBreakdown = async (
  title: string,
  description: string,
  durationDays: number
): Promise<Omit<Task, "id">[]> => {
  const { data, error } = await supabase.functions.invoke("generate-breakdown", {
    body: { title: title.trim(), description: description.trim(), durationDays },
  });
  if (error) throw new Error(error.message ?? "Failed to generate plan");
  if (data?.error) throw new Error(data.error);
  const tasks = (data?.tasks ?? []) as { day: number; title: string }[];
  return tasks.map((t) => ({ title: t.title, day: t.day, done: false }));
};

// Build an in-memory draft goal (not yet persisted)
export const draftGoal = async (
  title: string,
  description: string,
  durationDays: number
): Promise<Goal> => {
  const generated = await generateBreakdown(title, description, durationDays);
  const tasks = generated.map((t, i) => ({ ...t, id: `draft-${i}` }));
  return {
    id: "draft",
    title: title.trim(),
    description: description.trim(),
    durationDays,
    createdAt: Date.now(),
    tasks,
  };
};

export const dayOfGoal = (goal: Goal): number => {
  const days = Math.floor((Date.now() - goal.createdAt) / 86400000) + 1;
  return Math.min(Math.max(days, 1), goal.durationDays);
};

// ---- Cloud-backed operations ----

export const fetchGoals = async (userId: string): Promise<Goal[]> => {
  const { data: goalsData, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const ids = (goalsData ?? []).map((g) => g.id);
  if (!ids.length) return [];

  const { data: tasksData, error: tErr } = await supabase
    .from("tasks")
    .select("*")
    .in("goal_id", ids)
    .order("day", { ascending: true });
  if (tErr) throw tErr;

  return (goalsData ?? []).map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description ?? undefined,
    durationDays: g.duration_days,
    createdAt: new Date(g.created_at).getTime(),
    tasks: (tasksData ?? [])
      .filter((t) => t.goal_id === g.id)
      .map((t) => ({ id: t.id, title: t.title, day: t.day, done: t.done })),
  }));
};

export const persistGoal = async (userId: string, goal: Goal): Promise<Goal> => {
  const { data: gRow, error: gErr } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      title: goal.title,
      description: goal.description ?? null,
      duration_days: goal.durationDays,
    })
    .select()
    .single();
  if (gErr) throw gErr;

  const taskRows = goal.tasks.map((t) => ({
    goal_id: gRow.id,
    user_id: userId,
    title: t.title,
    day: t.day,
    done: t.done,
  }));
  const { data: tRows, error: tErr } = await supabase
    .from("tasks")
    .insert(taskRows)
    .select();
  if (tErr) throw tErr;

  return {
    id: gRow.id,
    title: gRow.title,
    description: gRow.description ?? undefined,
    durationDays: gRow.duration_days,
    createdAt: new Date(gRow.created_at).getTime(),
    tasks: (tRows ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      day: t.day,
      done: t.done,
    })),
  };
};

export const setTaskDone = async (taskId: string, done: boolean) => {
  const { error } = await supabase.from("tasks").update({ done }).eq("id", taskId);
  if (error) throw error;
};

export const deleteGoalCloud = async (goalId: string) => {
  const { error } = await supabase.from("goals").delete().eq("id", goalId);
  if (error) throw error;
};
