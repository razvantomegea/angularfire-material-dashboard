export class Interval {
  constructor(
    public duration: number = 0,
    public name: string = '',
    public reps: number = 0,
    public rest: number = 0,
    public sets: number = 0,
    public weight: number = 0,
    public id?: string
  ) {
  }
}

export interface MuscleGroupExercise {
  comments: string[];
  id?: string;
  image: string;
  instructions: string[];
  muscles: string[];
  name: string;
  variations: string[];
  warning: string;
}

export interface MuscleGroup {
  exercises: MuscleGroupExercise[];
  group: string;
  id?: string;
}

export class Workout {
  constructor(
    public duration: number = 0,
    public energyExpenditure: number = 0,
    public intervals: Interval[] = [],
    public met: number = 0,
    public name: string = '',
    public id?: string
  ) {
  }
}
