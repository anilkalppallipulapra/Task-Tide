export type Task = {
  id: string;
  title: string;
  day: number; // 1-indexed day in plan
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

const KEY = "tasktide.goals.v1";

export const loadGoals = (): Goal[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Goal[]) : [];
  } catch {
    return [];
  }
};

export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem(KEY, JSON.stringify(goals));
};

const uid = () => Math.random().toString(36).slice(2, 10);

// Local "AI" breakdown — deterministic-feeling generator
export const generateBreakdown = (
  title: string,
  description: string,
  durationDays: number
): Task[] => {
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
  const tasks: Task[] = [];
  for (let day = 1; day <= durationDays; day++) {
    const idx = (day - 1) % themes.length;
    tasks.push({
      id: uid(),
      title: themes[idx],
      day,
      done: false,
    });
  }
  // Final day
  if (tasks.length) {
    tasks[tasks.length - 1] = {
      ...tasks[tasks.length - 1],
      title: `Reflect on "${t}" — what changed?`,
    };
  }
  return tasks;
};

export const newGoal = (
  title: string,
  description: string,
  durationDays: number
): Goal => ({
  id: uid(),
  title: title.trim(),
  description: description.trim(),
  durationDays,
  createdAt: Date.now(),
  tasks: generateBreakdown(title, description, durationDays),
});

export const dayOfGoal = (goal: Goal): number => {
  const days = Math.floor((Date.now() - goal.createdAt) / 86400000) + 1;
  return Math.min(Math.max(days, 1), goal.durationDays);
};
