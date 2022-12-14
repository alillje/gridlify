/**
 * Module for class GridGapValidator.
 *
 * @author Andreas Lillje
 * version 1.0.8
 */

import { RowColumnValidator } from './row-column-validator.js'

/**
 * Validates input values for a css grid layout
 *
 */
export class GapValidator extends RowColumnValidator {
  /**
   * Validates the input value represening a gap property in a CSS grid layout.
   *
   * @param {string} gap *
   * @throws {(Error)} - If any invalid parameters are passed.
   */
  validate (gap) {
    if (typeof gap !== 'string') {
      throw new TypeError('Gap value must be a string')
    } else if (!this.hasCorrectSuffix(gap)) {
      throw new TypeError('Gap value must end with a valid CSS measurement')
    } else if (!this.isPositiveNumber(gap)) {
      throw new TypeError('Gap values must be positvie numbers followed by a valid CSS measurement')
    }
  }
}
