/**
 * Module for class GridGenerator.
 *
 * @author Andreas Lillje
 * version 1.0.8
 */

import { GridValidator } from './grid-validator.js'
import { RowColumnValidator } from './row-column-validator.js'
import { GapValidator } from './gap-validator.js'

/**
 * Responsible for generating grid template layouts and setting style properties for DOM elements.
 *
 * @class
 */
export class GridGenerator {
  #gridValidator
  #rowColumnValidator
  #gapValidator

  /**
   * Creates an instance of GridGenerator.
   */
  constructor () {
    this.#gridValidator = new GridValidator()
    this.#rowColumnValidator = new RowColumnValidator()
    this.#gapValidator = new GapValidator()
  }

  /**
   * Creates a string representation of a CSS grid layout template.
   *
   * @param {object} grid - An object containin all the grid properties in a css grid layout.
   * @param {string[]} grid.rows - An array containing different values representing grid-template-row in a css grid layout.
   * @param {string[]} grid.columns - An array containing different values representing grid-template-column properties in a css grid layout.
   * @param {string} grid.rowGap - A string representing the grid-row-gap property.
   * @param {string} grid.columnGap - A string representing the grid-column-gap property.
   * @returns {string} - The CSS grid layout template.
   */
  getGridCss ({ rows = ['100%'], columns = ['100%'], rowGap = '0px', columnGap = '0px' }) {
    const gridParams = { rows, columns, rowGap, columnGap }
    this.#gridValidator.validateAllParams(gridParams)
    const grid = `{ \n  display: grid;\n  grid-template-rows: ${rows.join(' ')};\n  grid-template-columns: ${columns.join(' ')};\n  grid-row-gap: ${rowGap};\n  grid-column-gap: ${columnGap};\n}`
    return grid
  }

  /**
   * Creates a string representation of a CSS grid position template.
   * Must contain a value for startRow and startColumn.
   * If no end values exists, they are set to the same as start values.
   *
   * @param {object} positions - An object containin all the position properties in a css grid.
   * @param {number} positions.startRow - A number representig a HTML elements row start position in a css grid layout.
   * @param {number} positions.endRow - A number representig a HTML elements column end position in a css grid layout.
   * @param {number} positions.startColumn - A number representig a HTML elements columns start position in a css grid layout.
   * @param {number} positions.endColumn - A number representig a HTML elements columns end position in a css grid layout.
   * @returns {string} - The CSS grid-position template.
   */
  getPositionCss ({ startRow, endRow, startColumn, endColumn }) {
    let positionTemplate = ''
    const positions = {
      startRow,
      startColumn,
      endRow,
      endColumn
    }

    const validatedPositions = this.#gridValidator.validatePositions(positions)
    if (validatedPositions.startRow && validatedPositions.startColumn) {
      positionTemplate = `{ grid-area: ${parseInt(validatedPositions.startRow)} / ${parseInt(validatedPositions.startColumn)} / ${!validatedPositions.endRow ? parseInt(validatedPositions.startRow) : parseInt(validatedPositions.endRow)} / ${!validatedPositions.endColumn ? parseInt(validatedPositions.startColumn) : parseInt(validatedPositions.endColumn)}; }`
    }
    return positionTemplate
  }

  /**
   * Modifies an element in the DOM to reflect the grid layout.
   *
   * @param {object} grid - An object containin all the grid properties in a css grid layout.
   * @param {string[]} grid.rows - An array containing different values representing grid-template-row in a css grid layout.
   * @param {string[]} grid.columns - An array containing different values representing grid-template-column properties in a css grid layout.
   * @param {string} grid.rowGap - A string representing the grid-row-gap property.
   * @param {string} grid.columnGap - A string representing the grid-column-gap property.
   * @param {string} htmlIdentifier - Identifier of the DOM element to manipulate.
   */
  setGrid ({ rows = ['100%'], columns = ['100%'], rowGap = '0px', columnGap = '0px' }, htmlIdentifier) {
    this.#gridValidator.validateAllParams({ rows, columns, rowGap, columnGap })
    if (!this.#rowColumnValidator.isString(htmlIdentifier)) {
      throw new Error('HTML element identifier must be a string')
    } else if (htmlIdentifier) {
      document.querySelector(htmlIdentifier).style.display = 'grid'
      document.querySelector(htmlIdentifier).style.gridTemplateRows = `${rows.join(' ')}`
      document.querySelector(htmlIdentifier).style.gridTemplateColumns = `${columns.join(' ')}`
      document.querySelector(htmlIdentifier).style.gridRowGap = `${rowGap}`
      document.querySelector(htmlIdentifier).style.gridColumnGap = `${columnGap}`
    }
  }

  /**
   * Modifies an element in the DOM to set grid positioning.
   * Must contain a value for startRow and startColumn.
   * If no end values exist, they will be set to same as start values.
   *
   * @param {object} positions - An object containin all the position properties in a css grid.
   * @param {number} positions.startRow - A number representig a HTML elements row start position in a css grid layout.
   * @param {number} positions.endRow - A number representig a HTML elements column end position in a css grid layout.
   * @param {number} positions.startColumn - A number representig a HTML elements columns start position in a css grid layout.
   * @param {number} positions.endColumn - A number representig a HTML elements columns end position in a css grid layout.
   * @param {string} htmlIdentifier - Identifier of the DOM element to manipulate.
   */
  setPosition ({ startRow, endRow, startColumn, endColumn }, htmlIdentifier) {
    const validatedPositions = this.#gridValidator.validatePositions({
      startRow,
      startColumn,
      endRow,
      endColumn
    })
    if (validatedPositions.startRow && validatedPositions.startColumn) {
      document.querySelector(htmlIdentifier).style.gridRow = `${parseInt(validatedPositions.startRow)} / ${!validatedPositions.endRow ? parseInt(validatedPositions.startRow) : parseInt(validatedPositions.endRow)}`
      document.querySelector(htmlIdentifier).style.gridColumn = `${parseInt(validatedPositions.startColumn)} / ${!validatedPositions.endColumn ? parseInt(validatedPositions.startColumn) : parseInt(validatedPositions.endColumn)}`
    }
  }

  /**
   * Modifies an element in the DOM to set grid rows positioning.
   *
   * @param {string[]} rows - An array containin all the row properties for css grid.
   * @param {string} htmlIdentifier - Identifier of the DOM element to manipulate.
   */
  setRows (rows, htmlIdentifier) {
    this.#rowColumnValidator.validate(rows)
    if (this.#gridValidator.isString(htmlIdentifier)) {
      document.querySelector(htmlIdentifier).style.gridTemplateRows = `${rows.join(' ')}`
    }
  }

  /**
   * Modifies an element in the DOM to set grid rows positioning.
   *
   * @param {string[]} columns - An array containin all the row properties for css grid.
   * @param {string} htmlIdentifier - Identifier of the DOM element to manipulate.
   */
  setColumns (columns, htmlIdentifier) {
    this.#rowColumnValidator.validate(columns)
    if (this.#gridValidator.isString(htmlIdentifier)) {
      document.querySelector(htmlIdentifier).style.gridTemplateColumns = `${columns.join(' ')}`
    }
  }

  /**
   * Modifies an element in the DOM to set grid gap.
   *
   * @param {string} gap - A stirng containin all the row properties for css grid.
   * @param {string} htmlIdentifier - Identifier of the DOM element to manipulate.
   */
  setRowGap (gap, htmlIdentifier) {
    this.#gapValidator.validate(gap)
    if (this.#gridValidator.isString(htmlIdentifier)) {
      document.querySelector(htmlIdentifier).style.gridRowGap = `${gap}`
    }
  }

  /**
   * Modifies an element in the DOM to set grid gap.
   *
   * @param {string} gap - A stirng containin all the row properties for css grid.
   * @param {string} htmlIdentifier - Identifier of the DOM element to manipulate.
   */
  setColumnGap (gap, htmlIdentifier) {
    this.#gapValidator.validate(gap)
    if (this.#gridValidator.isString(htmlIdentifier)) {
      document.querySelector(htmlIdentifier).style.gridColumnGap = `${gap}`
    }
  }
}
