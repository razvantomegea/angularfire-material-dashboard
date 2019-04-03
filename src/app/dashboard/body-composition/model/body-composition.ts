export class BodyFat {
  constructor(
    public mass: number = 0,
    public percentage: number = 0
  ) {
  }
}

export class BodyMeasurements {
  constructor(
    public chest: number = 0,
    public height: number = 0,
    public hips: number = 0,
    public iliac: number = 0,
    public waist: number = 0,
    public weight: number = 0,
    public notes: string = ''
  ) {
  }

  public getHeight(): string {
    return this.height.toFixed(2);
  }

  public getWeight(): string {
    return this.weight.toFixed(2);
  }
}

export class HeartRate {
  constructor(
    public maximum: number = 0,
    public resting: number = 0,
    public trainingMaximum: number = 0,
    public trainingMinimum: number = 0
  ) {
  }

  public getTrainingHeartRate(): string {
    return `${this.trainingMinimum}-${this.trainingMaximum}bpm`;
  }
}

export class LeanMuscle {
  constructor(
    public mass: number = 0,
    public percentage: number = 0
  ) {
  }
}

export class BodyComposition {
  constructor(
    public bodyFat: BodyFat = new BodyFat(),
    public heartRate: HeartRate = new HeartRate(),
    public leanMuscle: LeanMuscle = new LeanMuscle(),
    public measurements: BodyMeasurements = new BodyMeasurements(),
    public restingMetabolicRate: number = 0
  ) {
  }
}
