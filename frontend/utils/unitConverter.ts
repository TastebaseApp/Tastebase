/**
 * Unit Converter Utility
 * Converts various units to standard imperial units for ingredients
 */

/**
 * Standard units:
 * - Liquid: cups
 * - Weight: ounces
 * - Length: inches
 * - Count: pieces
 * - Unknown: unknown
 */

type ConversionResult = {
  unit: string;
  amount: number;
};

type UnitFamily = 'liquid' | 'weight' | 'length' | 'count' | 'unknown';

/**
 * Normalizes a unit string for comparison (lowercase, trimmed, handles common variations)
 */
function normalizeUnit(unit: string): string {
  return unit.toLowerCase().trim().replace(/\./g, '').replace(/\s+/g, ' ');
}

/**
 * Determines which family a unit belongs to
 */
function determineUnitFamily(unit: string): UnitFamily {
  const normalized = normalizeUnit(unit);

  // Liquid volume units
  const liquidUnits = [
    'cup', 'cups', 'c',
    'fluid ounce', 'fluid ounces', 'fl oz', 'floz',
    'tablespoon', 'tablespoons', 'tbsp', 't', 'tbs',
    'teaspoon', 'teaspoons', 'tsp', 'ts',
    'pint', 'pints', 'pt', 'pts',
    'quart', 'quarts', 'qt', 'qts',
    'gallon', 'gallons', 'gal', 'gals',
    'milliliter', 'millilitre', 'milliliters', 'millilitres', 'ml',
    'liter', 'litre', 'liters', 'litres', 'l'
  ];

  // Weight units
  const weightUnits = [
    'ounce', 'ounces', 'oz',
    'pound', 'pounds', 'lb', 'lbs',
    'gram', 'grams', 'g',
    'kilogram', 'kilograms', 'kg'
  ];

  // Length units
  const lengthUnits = [
    'inch', 'inches', 'in',
    'foot', 'feet', 'ft',
    'centimeter', 'centimetre', 'centimeters', 'centimetres', 'cm',
    'meter', 'metre', 'meters', 'metres', 'm'
  ];

  // Count units
  const countUnits = [
    'piece', 'pieces', 'pc', 'pcs',
    'unit', 'units',
    'whole', 'wholes',
    'count', 'counts',
    'item', 'items'
  ];

  if (liquidUnits.includes(normalized)) {
    return 'liquid';
  }
  if (weightUnits.includes(normalized)) {
    return 'weight';
  }
  if (lengthUnits.includes(normalized)) {
    return 'length';
  }
  if (countUnits.includes(normalized)) {
    return 'count';
  }

  return 'unknown';
}

/**
 * Converts liquid volume units to cups
 * Standard unit: cups
 */
function convertLiquidVolume(amount: number, unit: string): ConversionResult {
  const normalized = normalizeUnit(unit);
  let cups: number;

  // Convert to cups
  switch (normalized) {
    case 'cup':
    case 'cups':
    case 'c':
      cups = amount;
      break;

    case 'fluid ounce':
    case 'fluid ounces':
    case 'fl oz':
    case 'floz':
      cups = amount / 8; // 8 fl oz = 1 cup
      break;

    case 'tablespoon':
    case 'tablespoons':
    case 'tbsp':
    case 't':
    case 'tbs':
      cups = amount / 16; // 16 tbsp = 1 cup
      break;

    case 'teaspoon':
    case 'teaspoons':
    case 'tsp':
    case 'ts':
      cups = amount / 48; // 48 tsp = 1 cup
      break;

    case 'pint':
    case 'pints':
    case 'pt':
    case 'pts':
      cups = amount * 2; // 1 pint = 2 cups
      break;

    case 'quart':
    case 'quarts':
    case 'qt':
    case 'qts':
      cups = amount * 4; // 1 quart = 4 cups
      break;

    case 'gallon':
    case 'gallons':
    case 'gal':
    case 'gals':
      cups = amount * 16; // 1 gallon = 16 cups
      break;

    case 'milliliter':
    case 'millilitre':
    case 'milliliters':
    case 'millilitres':
    case 'ml':
      cups = amount / 236.588; // 1 cup = 236.588 ml
      break;

    case 'liter':
    case 'litre':
    case 'liters':
    case 'litres':
    case 'l':
      cups = amount * 4.22675; // 1 liter = 4.22675 cups
      break;

    default:
      // Unknown unit, return original
      return { unit, amount };
  }

  return {
    unit: 'cups',
    amount: cups
  };
}

/**
 * Converts weight units to ounces
 * Standard unit: ounces
 */
function convertWeight(amount: number, unit: string): ConversionResult {
  const normalized = normalizeUnit(unit);
  let ounces: number;

  // Convert to ounces
  switch (normalized) {
    case 'ounce':
    case 'ounces':
    case 'oz':
      ounces = amount;
      break;

    case 'pound':
    case 'pounds':
    case 'lb':
    case 'lbs':
      ounces = amount * 16; // 1 lb = 16 oz
      break;

    case 'gram':
    case 'grams':
    case 'g':
      ounces = amount / 28.3495; // 1 oz = 28.3495 g
      break;

    case 'kilogram':
    case 'kilograms':
    case 'kg':
      ounces = amount * 35.274; // 1 kg = 35.274 oz
      break;

    default:
      // Unknown unit, return original
      return { unit, amount };
  }

  return {
    unit: 'ounces',
    amount: ounces
  };
}

/**
 * Converts length units to inches
 * Standard unit: inches
 */
function convertLength(amount: number, unit: string): ConversionResult {
  const normalized = normalizeUnit(unit);
  let inches: number;

  // Convert to inches
  switch (normalized) {
    case 'inch':
    case 'inches':
    case 'in':
      inches = amount;
      break;

    case 'foot':
    case 'feet':
    case 'ft':
      inches = amount * 12; // 1 ft = 12 in
      break;

    case 'centimeter':
    case 'centimetre':
    case 'centimeters':
    case 'centimetres':
    case 'cm':
      inches = amount / 2.54; // 1 in = 2.54 cm
      break;

    case 'meter':
    case 'metre':
    case 'meters':
    case 'metres':
    case 'm':
      inches = amount * 39.3701; // 1 m = 39.3701 in
      break;

    default:
      // Unknown unit, return original
      return { unit, amount };
  }

  return {
    unit: 'inches',
    amount: inches
  };
}

/**
 * Converts count units to pieces
 * Standard unit: pieces
 */
function convertCount(amount: number, unit: string): ConversionResult {

  return {
    unit: 'pieces',
    amount: amount
  };
}

/**
 * Converts an amount and unit to the standard unit for that unit family
 * @param amount - The numeric amount to convert
 * @param unit - The unit string (e.g., "tablespoons", "oz", "ml")
 * @returns An object with the converted amount and standard unit name
 * 
 * @example
 * getStandardUnit(2, "tablespoons") // { unit: "cups", amount: 0.125 }
 * getStandardUnit(16, "oz") // { unit: "ounces", amount: 16 }
 * getStandardUnit(500, "ml") // { unit: "cups", amount: 2.113 }
 */
export function getStandardUnit(amount: number, unit: string): ConversionResult {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Amount must be a valid number');
  }

  if (typeof unit !== 'string' || !unit.trim()) {
    throw new Error('Unit must be a non-empty string');
  }

  const family = determineUnitFamily(unit);

  switch (family) {
    case 'liquid':
      return convertLiquidVolume(amount, unit);
    
    case 'weight':
      return convertWeight(amount, unit);
    
    case 'length':
      return convertLength(amount, unit);
    
    case 'count':
      return convertCount(amount, unit);
    
    case 'unknown':
    default:
      // Return original if unit family cannot be determined
      return { unit, amount };
  }
}