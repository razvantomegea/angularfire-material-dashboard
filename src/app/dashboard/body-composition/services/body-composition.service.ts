import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { DataService } from 'app/shared/mixins';
import { Observable, take } from 'app/shared/utils/rxjs-exports';
import { BodyComposition, BodyFat, BodyMeasurements, HeartRate, LeanMuscle } from '../model';

const BODY_COMPOSITION_COLLECTION = 'body-composition';

@Injectable({
  providedIn: 'root'
})
export class BodyCompositionService extends DataService<BodyComposition> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, BODY_COMPOSITION_COLLECTION, false, null, true);
  }

  /**
   * @desc Calculates body composition
   * @param {number} age
   * @param {string} gender
   * @param {number} restingHeartRate
   * @param {BodyMeasurements} measurements
   * @returns {BodyComposition}
   */
  public calculateBodyComposition(
    age: number,
    gender: string,
    restingHeartRate: number,
    measurements: BodyMeasurements
  ): BodyComposition {
    const bodyFat: BodyFat = this.calculateBodyFat(age, gender, measurements);
    const heartRate: HeartRate = this.calculateHeartRate(age, restingHeartRate);
    const leanMuscle: LeanMuscle = this.calculateMuscleMass(measurements.weight, bodyFat);

    return new BodyComposition(
      bodyFat,
      heartRate,
      leanMuscle,
      measurements,
      this.calculateRMR(age, gender, measurements.height, leanMuscle.mass, measurements.weight)
    );
  }

  public getBodyComposition(): Promise<BodyComposition> {
    return this.getBodyCompositionChanges().pipe(take(1)).toPromise();
  }

  public getBodyCompositionChanges(): Observable<BodyComposition> {
    return this.subscribeToDataChanges();
  }

  public getBodyCompositionTrendsChanges(): Observable<BodyComposition[]> {
    return this.subscribeToTrendsChanges();
  }

  public async saveBodyComposition(bodyComposition: BodyComposition): Promise<BodyComposition> {
    return this.saveData(bodyComposition);
  }

  /**
   * @desc Calculates body fat mass and percentage
   * @description http://www.weightrainer.net/circbf.html
   * @param {number} age
   * @param {string} gender
   * @param {BodyMeasurements} measurements
   * @returns {BodyFat}
   */
  private calculateBodyFat(age: number, gender: string, measurements: BodyMeasurements): BodyFat {
    const { height, hips, iliac, waist, weight } = measurements;
    let bodyFatPercentage: number;

    if (gender === 'male') {
      bodyFatPercentage = 0.57914807 * waist + 0.25189114 * hips + 0.21366088 * iliac - 0.35595404 * weight *
        2.20462262 * 0.4535923704 - 47.371817;
    } else if (gender === 'female') {
      bodyFatPercentage = 495 /
        (1.168297 - 0.002824 * waist + 0.0000122098 * Math.pow(waist, 2) - 0.000733128 * hips + 0.000510477 * height -
          0.000216161 * age) - 450;
    }

    const fatMass: number = bodyFatPercentage / 100 * weight;

    return new BodyFat(fatMass, bodyFatPercentage);
  }

  /**
   * @desc Calculates the maximum heart rate
   * @description Nes, B.M, et al. HRMax formula (https://en.wikipedia.org/wiki/Heart_rate)
   * @param {number} age
   * @returns {number} The maximum heart rate
   */
  private calculateHRMax(age: number): number {
    return Math.round(211 - 0.64 * age);
  }

  /**
   * @desc Calculates the heart rate values
   * @description The Karvonen Formula (https://en.wikipedia.org/wiki/Heart_rate)
   * @param {number} age
   * @param {number} restingHeartRate - The resting heart rate
   * @returns {HeartRate}
   */
  private calculateHeartRate(age: number, restingHeartRate: number): HeartRate {
    const maximumHeartRate: number = this.calculateHRMax(age);

    return new HeartRate(
      maximumHeartRate,
      restingHeartRate,
      Math.round(0.85 * (maximumHeartRate - restingHeartRate) + restingHeartRate),
      Math.round(0.5 * (maximumHeartRate - restingHeartRate) + restingHeartRate)
    );
  }

  /**
   * @desc Calculates lean muscle mass and percentage
   * @param {number} weight
   * @param {BodyFat} bodyFat
   * @returns {LeanMuscle}
   */
  private calculateMuscleMass(weight: number, bodyFat: BodyFat): LeanMuscle {
    const muscleMass: number = weight - bodyFat.mass;
    const muscleMasPercentage: number = muscleMass * 100 / weight;

    return new LeanMuscle(muscleMass, muscleMasPercentage);
  }

  /**
   * @desc Calculates resting metabolic rate
   * Indian J Physiol Pharmacol 2011; 55 (1) : 77–83
   * Corresponding Author : Dr. Suchitra R. Patil w/o, Prof. S.V.Prabhu, Associate Professor, Department of
   * Mechanical Engineering, Indian Institute of Technology, Bombay, Powai, Mumbai – 400 076; Ph.: 022-2576-8515;
   * 0924233473; E-mail: svprabhu@iitb.ac.in
   * SHORT COMMUNICATION
   * COMPARISON OF DIFFERENT METHODS TO ESTIMATE BMR IN
   * ADOLOSCENT STUDENT POPULATION SUCHITRA R. PATIL*1 AND JYOTI BHARADWAJ 2
   * @param {number} age
   * @param {number} gender
   * @param {number} height
   * @param {number} leanMass
   * @param {number} weight
   * @returns {number}
   */
  private calculateRMR(age: number, gender: string, height: number, leanMass: number, weight: number): number {
    const cunningham: number = this.calculateRMRCunningham(leanMass);
    const harrisBenedict: number = this.calculateRmrHarrisBenedict(age, gender, height, weight);

    return (cunningham + harrisBenedict) / 2;
  }

  /**
   * @desc Calculates resting metabolic rate using Cunningham equation
   * @param {number} leanMass
   * @returns {number}
   */
  private calculateRMRCunningham(leanMass: number): number {
    return 501.6 + 21.6 * leanMass;
  }

  /**
   * @desc Calculates resting metabolic rate using the Revised Harris-Benedict Equation
   * @param {number} age
   * @param {number} gender
   * @param {number} height
   * @param {number} weight
   * @returns {number}
   */
  private calculateRmrHarrisBenedict(age: number, gender: string, height: number, weight: number): number {
    if (gender === 'male') {
      return Math.round(13.397 * weight + 4.799 * height - 5.677 * age + 88.362);
    } else {
      return Math.round(9.247 * weight + 3.098 * height - 4.33 * age + 447.593);
    }
  }
}
