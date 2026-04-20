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

// Local "AI" breakdown — deterministic-feeling generator
export const generateBreakdown = (
  title: string,
  _description: string,
  durationDays: number
): Omit<Task, "id">[] => {
  const t = title.trim() || "your goal";
  const themes = [
    `Define what success looks like for "${t}"`,
    `Research the top 3 obstacles for ${t}`,
    `Outline a simple daily routine`,
    `Set up your environment & tools`,
    `Take one tiny first step`,
    `Document a baseline measurement`,
    `Identify one accountability partner`,
    `Block focused time on your calendar`,
    `Practice the core skill for 20 minutes`,
    `Review what worked, drop what didn't`,
    `Push slightly past your comfort zone`,
    `Teach the concept to someone (or yourself)`,
    `Refine your approach based on feedback`,
    `Celebrate a small win`,
    `Plan next week's focus`,
  ];
  const tasks: Omit<Task, "id">[] = [];
  for (let day = 1; day <= durationDays; day++) {
    const idx = (day - 1) % themes.length;
    tasks.push({ title: themes[idx], day, done: false });
  }
  if (tasks.length) {
    tasks[tasks.length - 1] = {
      ...tasks[tasks.length - 1],
      title: `Reflect on "${t}" — what changed?`,
    };
  }
  return tasks;
};

// Build an in-memory draft goal (not yet persisted)
export const draftGoal = (
  title: string,
  description: string,
  durationDays: number
): Goal => {
  const tasks = generateBreakdown(title, description, durationDays).map((t, i) => ({
    ...t,
    id: `draft-${i}`,
  }));
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
