import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { MetricSystem } from 'app/shared/models';
import { isNil } from 'app/shared/utils/lodash-exports';
/**
 * FIXME: Need to change lib/index.js lodash imports after npm install; Uncaught ReferenceError: global is not defined
 * var convert
 * , keys = require('lodash/keys')
 * , each = require('lodash/foreach')
 */
import * as convert from 'convert-units';
import { METRIC_SYSTEM, METRIC_SYSTEM_STANDARD, METRIC_SYSTEM_STANDARD_NAME, StorageService } from './storage.service';

@Injectable()
export class UtilsService {

  /**
   * @desc Converts length units according to local storage metric system
   * @param {number} length
   * @returns {number} - Returns the converted length
   */
  public static convertLength(length: number): number {
    const metricSystem: MetricSystem = StorageService.get(METRIC_SYSTEM);
    return convert(length)
      .from(metricSystem.name === METRIC_SYSTEM_STANDARD_NAME ? 'ft' : 'cm')
      .to(metricSystem.name === METRIC_SYSTEM_STANDARD_NAME ? 'cm' : 'ft');
  }

  /**
   * @desc Converts mass units according to local storage metric system
   * @param {number} mass
   * @returns {number} - Returns the converted mass
   */
  public static convertMass(mass: number): number {
    const metricSystem: MetricSystem = StorageService.get(METRIC_SYSTEM);
    return convert(mass)
      .from(metricSystem.name === METRIC_SYSTEM_STANDARD_NAME ? 'lb' : 'kg')
      .to(metricSystem.name === METRIC_SYSTEM_STANDARD_NAME ? 'kg' : 'lb');
  }

  /**
   * @desc Makes a deeps search within an object by key
   * @param {any} obj - The object to search
   * @param {string} key - The key of the object to search for
   *
   * @returns {any} - The found value or false if not found
   *
   * @throws {Error} Object should be not null
   * @throws {TypeError} Object should not be primitive
   */
  public static getValueByKey(obj: any, key: string): any {
    if (typeof obj !== 'object') {
      throw new TypeError('Object should not be primitive.');
    }

    if (isNil(obj)) {
      throw Error('Object should be not null.');
    }

    if (Array.isArray(obj) && obj.length) {
      return this.getValueFromArray(obj, key);
    }

    return this.findValue(obj, key);
  }

  /**
   * @desc Checks if a specified form control has error
   * @param {FormGroup} form - The form the control belongs to
   * @param {string} on - The form control state (i.e. pristine, dirty)
   * @param {string} name - The form control name to check
   * @param {string} type - The error type
   * @returns {boolean} - True if the form control has error, false otherwise
   */
  public static hasFormError(form: FormGroup, on: string, name: string, type: string): boolean {
    const control: AbstractControl = form.controls[name];
    return control && control[on] && control.errors && control.errors[type];
  }

  /**
   * @desc Check if object is an Array
   * @param {any} obj
   * @returns {boolean} - True if the object is an Array
   */
  public static isArray(obj: any): boolean {
    return obj && Array.isArray(obj);
  }

  /**
   * Sets and returns the metric system in/from local storage
   * @returns {MetricSystem}
   */
  public static setupMetricSystem(): MetricSystem {
    const storageMetricSystem: MetricSystem = StorageService.get(METRIC_SYSTEM);

    if (!storageMetricSystem) {
      StorageService.save(METRIC_SYSTEM, METRIC_SYSTEM_STANDARD);
      return METRIC_SYSTEM_STANDARD;
    } else {
      return storageMetricSystem;
    }
  }

  private static findValue(obj: any, key: string): any {
    for (const objKey in obj) {
      if (obj.hasOwnProperty(objKey)) {
        const objVal: any = obj[objKey];

        if (objKey === key) {
          return objVal;
        }

        if (typeof objVal === 'object' && !isNil(objVal)) {
          return this.getValueByKey(objVal, key);
        }
      }
    }

    return false;
  }

  private static getValueFromArray(arr: any[], key: string): any {
    let foundValue: any = false;
    arr.forEach((child: any) => {
      foundValue = this.getValueByKey(child, key);
    });

    return foundValue;
  }
}
