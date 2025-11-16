/**
 * Jest test file for unitConverter
 * 
 * Run tests with: npm test
 * Run in watch mode: npm run test:watch
 * Run with coverage: npm run test:coverage
 */

import { getStandardUnit } from '../../utils/unitConverter';

describe('getStandardUnit', () => {
  describe('Input validation', () => {
    it('should throw error for invalid amount (NaN)', () => {
      expect(() => getStandardUnit(NaN, 'cups')).toThrow('Amount must be a valid number');
    });

    it('should throw error for non-number amount', () => {
      expect(() => getStandardUnit('2' as any, 'cups')).toThrow('Amount must be a valid number');
    });

    it('should throw error for empty unit string', () => {
      expect(() => getStandardUnit(2, '')).toThrow('Unit must be a non-empty string');
    });

    it('should throw error for whitespace-only unit string', () => {
      expect(() => getStandardUnit(2, '   ')).toThrow('Unit must be a non-empty string');
    });

    it('should throw error for non-string unit', () => {
      expect(() => getStandardUnit(2, null as any)).toThrow('Unit must be a non-empty string');
    });
  });

  describe('Liquid volume conversions (to cups)', () => {
    it('should convert cups to cups (no conversion)', () => {
      const result = getStandardUnit(2, 'cups');
      expect(result).toEqual({ unit: 'cups', amount: 2 });
    });

    it('should handle cup singular and plural', () => {
      expect(getStandardUnit(1, 'cup')).toEqual({ unit: 'cups', amount: 1 });
      expect(getStandardUnit(2, 'cups')).toEqual({ unit: 'cups', amount: 2 });
      expect(getStandardUnit(1.5, 'c')).toEqual({ unit: 'cups', amount: 1.5 });
    });

    it('should convert fluid ounces to cups', () => {
      expect(getStandardUnit(8, 'fluid ounces')).toEqual({ unit: 'cups', amount: 1 });
      expect(getStandardUnit(16, 'fl oz')).toEqual({ unit: 'cups', amount: 2 });
      expect(getStandardUnit(4, 'floz')).toEqual({ unit: 'cups', amount: 0.5 });
    });

    it('should convert tablespoons to cups', () => {
      expect(getStandardUnit(16, 'tablespoons')).toEqual({ unit: 'cups', amount: 1 });
      expect(getStandardUnit(8, 'tbsp')).toEqual({ unit: 'cups', amount: 0.5 });
      expect(getStandardUnit(32, 't')).toEqual({ unit: 'cups', amount: 2 });
      expect(getStandardUnit(1, 'tbs')).toEqual({ unit: 'cups', amount: 1 / 16 });
    });

    it('should convert teaspoons to cups', () => {
      expect(getStandardUnit(48, 'teaspoons')).toEqual({ unit: 'cups', amount: 1 });
      expect(getStandardUnit(24, 'tsp')).toEqual({ unit: 'cups', amount: 0.5 });
      expect(getStandardUnit(96, 'ts')).toEqual({ unit: 'cups', amount: 2 });
    });

    it('should convert pints to cups', () => {
      expect(getStandardUnit(1, 'pint')).toEqual({ unit: 'cups', amount: 2 });
      expect(getStandardUnit(2, 'pints')).toEqual({ unit: 'cups', amount: 4 });
      expect(getStandardUnit(0.5, 'pt')).toEqual({ unit: 'cups', amount: 1 });
    });

    it('should convert quarts to cups', () => {
      expect(getStandardUnit(1, 'quart')).toEqual({ unit: 'cups', amount: 4 });
      expect(getStandardUnit(2, 'quarts')).toEqual({ unit: 'cups', amount: 8 });
      expect(getStandardUnit(0.5, 'qt')).toEqual({ unit: 'cups', amount: 2 });
    });

    it('should convert gallons to cups', () => {
      expect(getStandardUnit(1, 'gallon')).toEqual({ unit: 'cups', amount: 16 });
      expect(getStandardUnit(0.5, 'gallons')).toEqual({ unit: 'cups', amount: 8 });
      expect(getStandardUnit(2, 'gal')).toEqual({ unit: 'cups', amount: 32 });
    });

    it('should convert milliliters to cups', () => {
      const result = getStandardUnit(236.588, 'milliliters');
      expect(result.unit).toBe('cups');
      expect(result.amount).toBeCloseTo(1, 5);
    });

    it('should convert liters to cups', () => {
      const result = getStandardUnit(1, 'liter');
      expect(result.unit).toBe('cups');
      expect(result.amount).toBeCloseTo(4.22675, 5);
    });

    it('should handle case-insensitive liquid units', () => {
      expect(getStandardUnit(16, 'TABLESPOONS')).toEqual({ unit: 'cups', amount: 1 });
      expect(getStandardUnit(8, 'Fl Oz')).toEqual({ unit: 'cups', amount: 1 });
      expect(getStandardUnit(1, 'CUP')).toEqual({ unit: 'cups', amount: 1 });
    });
  });

  describe('Weight conversions (to ounces)', () => {
    it('should convert ounces to ounces (no conversion)', () => {
      const result = getStandardUnit(16, 'ounces');
      expect(result).toEqual({ unit: 'ounces', amount: 16 });
    });

    it('should handle ounce singular and plural', () => {
      expect(getStandardUnit(1, 'ounce')).toEqual({ unit: 'ounces', amount: 1 });
      expect(getStandardUnit(2, 'ounces')).toEqual({ unit: 'ounces', amount: 2 });
      expect(getStandardUnit(8, 'oz')).toEqual({ unit: 'ounces', amount: 8 });
    });

    it('should convert pounds to ounces', () => {
      expect(getStandardUnit(1, 'pound')).toEqual({ unit: 'ounces', amount: 16 });
      expect(getStandardUnit(2, 'pounds')).toEqual({ unit: 'ounces', amount: 32 });
      expect(getStandardUnit(0.5, 'lb')).toEqual({ unit: 'ounces', amount: 8 });
      expect(getStandardUnit(1.5, 'lbs')).toEqual({ unit: 'ounces', amount: 24 });
    });

    it('should convert grams to ounces', () => {
      const result = getStandardUnit(28.3495, 'grams');
      expect(result.unit).toBe('ounces');
      expect(result.amount).toBeCloseTo(1, 5);
    });

    it('should convert kilograms to ounces', () => {
      const result = getStandardUnit(1, 'kilogram');
      expect(result.unit).toBe('ounces');
      expect(result.amount).toBeCloseTo(35.274, 3);
    });

    it('should handle case-insensitive weight units', () => {
      expect(getStandardUnit(16, 'OUNCES')).toEqual({ unit: 'ounces', amount: 16 });
      expect(getStandardUnit(1, 'POUND')).toEqual({ unit: 'ounces', amount: 16 });
      expect(getStandardUnit(100, 'G')).toEqual(getStandardUnit(100, 'grams'));
    });
  });

  describe('Length conversions (to inches)', () => {
    it('should convert inches to inches (no conversion)', () => {
      const result = getStandardUnit(12, 'inches');
      expect(result).toEqual({ unit: 'inches', amount: 12 });
    });

    it('should handle inch singular and plural', () => {
      expect(getStandardUnit(1, 'inch')).toEqual({ unit: 'inches', amount: 1 });
      expect(getStandardUnit(2, 'inches')).toEqual({ unit: 'inches', amount: 2 });
      expect(getStandardUnit(6, 'in')).toEqual({ unit: 'inches', amount: 6 });
    });

    it('should convert feet to inches', () => {
      expect(getStandardUnit(1, 'foot')).toEqual({ unit: 'inches', amount: 12 });
      expect(getStandardUnit(2, 'feet')).toEqual({ unit: 'inches', amount: 24 });
      expect(getStandardUnit(0.5, 'ft')).toEqual({ unit: 'inches', amount: 6 });
    });

    it('should convert centimeters to inches', () => {
      const result = getStandardUnit(2.54, 'centimeters');
      expect(result.unit).toBe('inches');
      expect(result.amount).toBeCloseTo(1, 5);
    });

    it('should convert meters to inches', () => {
      const result = getStandardUnit(1, 'meter');
      expect(result.unit).toBe('inches');
      expect(result.amount).toBeCloseTo(39.3701, 4);
    });

    it('should handle case-insensitive length units', () => {
      expect(getStandardUnit(12, 'INCHES')).toEqual({ unit: 'inches', amount: 12 });
      expect(getStandardUnit(1, 'FOOT')).toEqual({ unit: 'inches', amount: 12 });
      expect(getStandardUnit(100, 'CM')).toEqual(getStandardUnit(100, 'centimeters'));
    });
  });

  describe('Count conversions (to pieces)', () => {
    it('should convert pieces to pieces (no conversion)', () => {
      const result = getStandardUnit(5, 'pieces');
      expect(result).toEqual({ unit: 'pieces', amount: 5 });
    });

    it('should handle various count unit names', () => {
      expect(getStandardUnit(1, 'piece')).toEqual({ unit: 'pieces', amount: 1 });
      expect(getStandardUnit(2, 'pieces')).toEqual({ unit: 'pieces', amount: 2 });
      expect(getStandardUnit(3, 'pc')).toEqual({ unit: 'pieces', amount: 3 });
      expect(getStandardUnit(4, 'pcs')).toEqual({ unit: 'pieces', amount: 4 });
      expect(getStandardUnit(5, 'unit')).toEqual({ unit: 'pieces', amount: 5 });
      expect(getStandardUnit(6, 'units')).toEqual({ unit: 'pieces', amount: 6 });
      expect(getStandardUnit(1, 'whole')).toEqual({ unit: 'pieces', amount: 1 });
      expect(getStandardUnit(2, 'wholes')).toEqual({ unit: 'pieces', amount: 2 });
      expect(getStandardUnit(10, 'count')).toEqual({ unit: 'pieces', amount: 10 });
      expect(getStandardUnit(20, 'item')).toEqual({ unit: 'pieces', amount: 20 });
      expect(getStandardUnit(30, 'items')).toEqual({ unit: 'pieces', amount: 30 });
    });
  });

  describe('Unknown units', () => {
    it('should return original unit and amount for unknown units', () => {
      const result = getStandardUnit(5, 'unknown-unit');
      expect(result).toEqual({ unit: 'unknown-unit', amount: 5 });
    });

    it('should handle custom units', () => {
      const result = getStandardUnit(10, 'bunches');
      expect(result).toEqual({ unit: 'bunches', amount: 10 });
    });

    it('should handle units with special characters', () => {
      const result = getStandardUnit(3, 'large');
      expect(result).toEqual({ unit: 'large', amount: 3 });
    });
  });

  describe('Edge cases', () => {
    it('should handle zero amounts', () => {
      expect(getStandardUnit(0, 'cups')).toEqual({ unit: 'cups', amount: 0 });
      expect(getStandardUnit(0, 'ounces')).toEqual({ unit: 'ounces', amount: 0 });
      expect(getStandardUnit(0, 'inches')).toEqual({ unit: 'inches', amount: 0 });
    });

    it('should handle negative amounts', () => {
      expect(getStandardUnit(-1, 'cups')).toEqual({ unit: 'cups', amount: -1 });
      expect(getStandardUnit(-5, 'ounces')).toEqual({ unit: 'ounces', amount: -5 });
    });

    it('should handle decimal amounts', () => {
      expect(getStandardUnit(1.5, 'cups')).toEqual({ unit: 'cups', amount: 1.5 });
      expect(getStandardUnit(0.25, 'pounds')).toEqual({ unit: 'ounces', amount: 4 });
      expect(getStandardUnit(2.5, 'feet')).toEqual({ unit: 'inches', amount: 30 });
    });

    it('should handle units with extra whitespace', () => {
      expect(getStandardUnit(1, '  cups  ')).toEqual({ unit: 'cups', amount: 1 });
      expect(getStandardUnit(2, '  fluid   ounces  ')).toEqual({ unit: 'cups', amount: 0.25 });
    });

    it('should handle units with periods', () => {
      expect(getStandardUnit(1, 'cups.')).toEqual({ unit: 'cups', amount: 1 });
      expect(getStandardUnit(1, 'fl.oz.')).toEqual({ unit: 'cups', amount: 0.125 });
    });

    it('should handle very large numbers', () => {
      const result = getStandardUnit(1000, 'cups');
      expect(result).toEqual({ unit: 'cups', amount: 1000 });
    });

    it('should handle very small numbers', () => {
      const result = getStandardUnit(0.001, 'cups');
      expect(result).toEqual({ unit: 'cups', amount: 0.001 });
    });
  });

  describe('Real-world conversion examples', () => {
    it('should convert common recipe measurements', () => {
      // 2 tablespoons = 0.125 cups
      expect(getStandardUnit(2, 'tablespoons')).toEqual({ unit: 'cups', amount: 0.125 });
      
      // 1 cup = 1 cup
      expect(getStandardUnit(1, 'cup')).toEqual({ unit: 'cups', amount: 1 });
      
      // 1 pound = 16 ounces
      expect(getStandardUnit(1, 'pound')).toEqual({ unit: 'ounces', amount: 16 });
      
      // 500ml ≈ 2.113 cups
      const mlResult = getStandardUnit(500, 'ml');
      expect(mlResult.unit).toBe('cups');
      expect(mlResult.amount).toBeCloseTo(2.113, 2);
    });
  });
});

