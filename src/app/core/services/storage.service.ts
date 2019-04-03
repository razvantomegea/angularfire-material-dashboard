import { Injectable } from '@angular/core';

import { MetricSystem } from 'app/shared/models';

// Metric system
export const METRIC_SYSTEM = 'METRIC SYSTEM';
export const METRIC_SYSTEM_STANDARD_NAME = 'STANDARD';
export const METRIC_SYSTEM_US_NAME = 'US';

// Theme
export const THEME = 'THEME';
export const THEME_DARK = 'dark-blue-theme';
export const THEME_LIGHT = 'light-blue-theme';

/**
 * Maps standard metric system units
 * @const
 */
export const METRIC_SYSTEM_STANDARD: MetricSystem = new MetricSystem(
  'cm',
  METRIC_SYSTEM_STANDARD_NAME,
  'kg'
);

/**
 * Maps US metric system units
 * @const
 */
export const METRIC_SYSTEM_US: MetricSystem = new MetricSystem(
  'ft',
  METRIC_SYSTEM_US_NAME,
  'lb'
);

export const BLOOD_GLUCOSE_DETAILS = 'BLOOD_GLUCOSE_DETAILS';
export const BLOOD_HOMOCYSTEINE_DETAILS = 'BLOOD_HOMOCYSTEINE_DETAILS';
export const BLOOD_KETONES_DETAILS = 'BLOOD_KETONES_DETAILS';
export const BLOOD_LIPIDS_DETAILS = 'BLOOD_LIPIDS_DETAILS';
export const BLOOD_PRESSURE_DETAILS = 'BLOOD_PRESSURE_DETAILS';
export const BODY_MEASUREMENTS_DETAILS = 'BODY_MEASUREMENTS_DETAILS';
export const MEAL_DETAILS = 'MEAL_DETAILS';
export const SESSION_DETAILS = 'SESSION_DETAILS';
export const SLEEP_DETAILS = 'SLEEP_DETAILS';
export const USER_PROFILE_DETAILS = 'USER_PROFILE_DETAILS';

@Injectable()
export class StorageService {
  /**
   * @desc Deletes stored data from browser local storage
   * @param {string} key The key of the object data to delete
   * @returns {void}
   */
  public static delete(key: string): void {
    return localStorage.removeItem(key);
  }

  /**
   * @desc Deletes stored data from browser local storage
   * @param {string} key The key of the object data to delete
   * @returns {void}
   */
  public static deleteSessionStorage(key: string): void {
    return sessionStorage.removeItem(key);
  }

  /**
   * @desc Checks if any data is stored at specific key
   * @param {string} key The key of the object data to check
   * @returns {boolean} Returns true if data exists
   */
  public static exists(key: string): boolean {
    return !!localStorage.getItem(key);
  }

  /**
   * @desc Returns stored data from browser local storage
   * @param {string} key The key of the object data to return
   * @returns {any} Returns the data if exists
   */
  public static get(key: string): any {
    const data: any = localStorage.getItem(key);

    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }

  /**
   * @desc Returns stored data from browser session storage
   * @param {string} key The key of the object data to return
   * @returns {any} Returns the data if exists
   */
  public static getSessionStorage(key: string): any {
    const data: any = sessionStorage.getItem(key);

    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }

  /**
   * @desc Saves stored data from browser local storage
   * @param {string} key The key of the object data to save
   * @param {string} value The data to store at the specific key in the browser local storage
   * @returns {void}
   */
  public static save(key: string, value: any): void {
    if (typeof value === 'object') {
      return localStorage.setItem(key, JSON.stringify(value));
    } else {
      return localStorage.setItem(key, value);
    }
  }

  /**
   * @desc Saves stored data from browser session storage
   * @param {string} key The key of the object data to save
   * @param {string} value The data to store at the specific key in the browser local storage
   * @returns {void}
   */
  public static setSessionStorage(key: string, value: any): void {
    if (typeof value === 'object') {
      return sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      return sessionStorage.setItem(key, value);
    }
  }
}
