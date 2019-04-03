export interface HealthyHabitsLevel {
  levelName: string;
  areas: HabitArea[];
}

export interface HabitArea {
  name: string;
  tips: HabitTip[];
}

export interface HabitTip {
  name: string;
  completed: boolean;
}
