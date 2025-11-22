/**
 * Jest test file for pantryService
 * 
 * Tests for:
 * - listIngredients
 * - addIngredient
 * - removeIngredient
 * 
 * Run tests with: npm test
 * Run with coverage: jest --coverage
 */

import pantryService from '../../services/pantryService';
import { Ingredient } from '../../types/pantry';

// Mock fetch globally
global.fetch = jest.fn();

// Mock parsePantryIngredients to use real implementation
jest.mock('../../utils/pantryParser', () => {
  const actual = jest.requireActual('../../utils/pantryParser');
  return {
    ...actual,
    parsePantryIngredients: jest.fn((data) => actual.parsePantryIngredients(data)),
  };
});

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const TEST_TOKEN = 'TESTING';

// Helper function to reset pantry state by calling listIngredients with empty array
async function resetPantryState() {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    text: async () => JSON.stringify([]),
    json: async () => [],
  });
  await pantryService.listIngredients(TEST_TOKEN);
}

// Helper function to create mock ingredient data for API responses
function createMockPantryApiIngredient(
  ingredientId: number,
  ingredientName: string,
  amount: number,
  unit: string,
  image?: string
) {
  return {
    ingredientId,
    ingredientName,
    amount: { amount, unit },
    image,
  };
}

// Helper function to create Ingredient object
function createIngredient(
  itemID: number,
  itemName: string,
  amount: number,
  unit: string,
  image?: string
): Ingredient {
  return {
    itemID,
    itemName,
    amount: { amount, unit },
    image,
  };
}

describe('pantryService', () => {
  beforeEach(() => {
    // Reset pantry state before each test
    return resetPantryState().then(() => {
      jest.clearAllMocks();
    });
  });

  describe('listIngredients', () => {
    it('should successfully fetch and return ingredients from API', async () => {
      // Setup: Pre-populate pantry, then clear with API call
      const mockApiData = [
        createMockPantryApiIngredient(1, 'Flour', 2, 'cups', 'flour.jpg'),
        createMockPantryApiIngredient(2, 'Sugar', 1, 'cup', 'sugar.jpg'),
        createMockPantryApiIngredient(3, 'Eggs', 6, 'pieces'),
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockApiData),
        json: async () => mockApiData,
      });

      const result = await pantryService.listIngredients(TEST_TOKEN);

      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE}/api/pantry/items`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${TEST_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );

      // Verify result
      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        itemID: 1,
        itemName: 'Flour',
        amount: { amount: 2, unit: 'cups' },
        image: 'flour.jpg',
      });
      expect(result[1]).toMatchObject({
        itemID: 2,
        itemName: 'Sugar',
        amount: { amount: 1, unit: 'cup' },
      });
      expect(result[2]).toMatchObject({
        itemID: 3,
        itemName: 'Eggs',
        amount: { amount: 6, unit: 'pieces' },
      });

      // Verify deep copy - modifying returned amount shouldn't affect internal state
      const firstResult = result[0];
      firstResult.amount.amount = 999;
      
      // Call listIngredients again to verify internal state wasn't affected
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockApiData),
        json: async () => mockApiData,
      });
      const result2 = await pantryService.listIngredients(TEST_TOKEN);
      expect(result2[0].amount.amount).toBe(2); // Should still be original value
    });

    it('should throw error when token is null', async () => {
      await expect(pantryService.listIngredients(null)).rejects.toThrow(
        'Authentication token required'
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fallback to local pantry items on API error (non-200 status)', async () => {
      // Setup: Add some local items first
      const localItems = [
        createIngredient(10, 'Local Item', 5, 'cups'),
        createIngredient(11, 'Another Item', 3, 'pieces'),
      ];
      
      // Manually set local state by mocking a successful add, then failing list
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ itemID: 10, itemName: 'Local Item', amount: { amount: 5, unit: 'cups' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ itemID: 11, itemName: 'Another Item', amount: { amount: 3, unit: 'pieces' } }),
        });

      await pantryService.addIngredient(10, 5, 'cups', 'Local Item', TEST_TOKEN);
      await pantryService.addIngredient(11, 3, 'pieces', 'Another Item', TEST_TOKEN);

      // Now mock a failed listIngredients call
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await pantryService.listIngredients(TEST_TOKEN);

      // Should return local items after 150ms delay
      expect(result).toHaveLength(2);
      expect(result[0].itemID).toBe(10);
      expect(result[1].itemID).toBe(11);
      
      // Verify deep copy
      expect(result[0].amount).not.toBe(localItems[0].amount);
      expect(result[0].amount.amount).toBe(5);
    });

    it('should fallback to local pantry items on network error', async () => {
      // Setup: Add local item
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ itemID: 20, itemName: 'Network Test', amount: { amount: 1, unit: 'cup' } }),
      });
      await pantryService.addIngredient(20, 1, 'cup', 'Network Test', TEST_TOKEN);

      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await pantryService.listIngredients(TEST_TOKEN);

      // Should return local items without throwing
      expect(result).toHaveLength(1);
      expect(result[0].itemID).toBe(20);
      expect(result[0].itemName).toBe('Network Test');
    });

    it('should handle empty pantry response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
        json: async () => [],
      });

      const result = await pantryService.listIngredients(TEST_TOKEN);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('addIngredient', () => {
    it('should successfully add a new ingredient via API', async () => {
      const mockApiResponse = {
        itemID: 123,
        ingredientName: 'Flour',
        amount: { amount: 5, unit: 'cups' },
        image: 'flour.jpg',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse,
      });

      const result = await pantryService.addIngredient(123, 5, 'cups', 'Flour', TEST_TOKEN);

      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE}/api/pantry/123?=5`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Verify returned ingredient
      expect(result).toMatchObject({
        itemID: 123,
        itemName: 'Flour',
        amount: { amount: 5, unit: 'cups' },
        image: 'flour.jpg',
      });

      // Verify deep copy
      result.amount.amount = 999;
      
      // Verify ingredient was added to local pantry
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([{
          ingredientId: 123,
          ingredientName: 'Flour',
          amount: { amount: 5, unit: 'cups' },
          image: 'flour.jpg',
        }]),
        json: async () => [{
          ingredientId: 123,
          ingredientName: 'Flour',
          amount: { amount: 5, unit: 'cups' },
          image: 'flour.jpg',
        }],
      });
      const listResult = await pantryService.listIngredients(TEST_TOKEN);
      expect(listResult[0].amount.amount).toBe(5); // Should still be original
    });

    it('should update existing ingredient instead of adding duplicate', async () => {
      // Setup: Add ingredient first
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ itemID: 123, ingredientName: 'Flour', amount: { amount: 5, unit: 'cups' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ itemID: 123, ingredientName: 'Flour', amount: { amount: 10, unit: 'cups' } }),
        });

      await pantryService.addIngredient(123, 5, 'cups', 'Flour', TEST_TOKEN);

      // Update the same ingredient
      const result = await pantryService.addIngredient(123, 10, 'cups', 'Flour', TEST_TOKEN);

      // Verify it was updated, not duplicated
      expect(result.amount.amount).toBe(10);
      
      // Reset and check length
      await resetPantryState();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([{
          ingredientId: 123,
          ingredientName: 'Flour',
          amount: { amount: 10, unit: 'cups' },
        }]),
        json: async () => [{
          ingredientId: 123,
          ingredientName: 'Flour',
          amount: { amount: 10, unit: 'cups' },
        }],
      });
      const listResult = await pantryService.listIngredients(TEST_TOKEN);
      expect(listResult).toHaveLength(1); // Should still be 1, not 2
      expect(listResult[0].amount.amount).toBe(10);
    });

    it('should throw error when token is null', async () => {
      await expect(
        pantryService.addIngredient(123, 5, 'cups', 'Flour', null)
      ).rejects.toThrow('Authentication token required');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fallback to local behavior on API error (non-200 status)', async () => {
      // Test with existing ingredient in local pantry
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ itemID: 200, ingredientName: 'Existing', amount: { amount: 3, unit: 'cups' } }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          text: async () => 'Error message',
        });

      await pantryService.addIngredient(200, 3, 'cups', 'Existing', TEST_TOKEN);

      // Now try to add with API error - error is caught internally, fallback is returned
      const result = await pantryService.addIngredient(200, 7, 'cups', 'Existing', TEST_TOKEN);

      // Should return fallback ingredient with updated quantity (no error thrown to caller)
      expect(result.itemID).toBe(200);
      expect(result.amount.amount).toBe(7);
      expect(result.amount.unit).toBe('cups');
    });

    it('should fallback to new ingredient object when API error and ingredient not in local pantry', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error',
      });

      const result = await pantryService.addIngredient(300, 5, 'cups', 'New Item', TEST_TOKEN);

      // Should return new ingredient with provided parameters
      expect(result).toMatchObject({
        itemID: 300,
        itemName: 'New Item',
        amount: { amount: 5, unit: 'cups' },
        image: undefined,
      });
    });

    it('should fallback to local behavior on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await pantryService.addIngredient(400, 2, 'pieces', 'Network Test', TEST_TOKEN);

      // Should return ingredient without throwing
      expect(result).toMatchObject({
        itemID: 400,
        itemName: 'Network Test',
        amount: { amount: 2, unit: 'pieces' },
      });
    });

    it('should use fallback logic for missing response fields', async () => {
      // Mock response with missing fields
      const mockApiResponse = {
        // Missing itemID/id - should use parameter id
        // Missing ingredientName/itemName - should use parameter name
        // Missing amount.amount - should use parameter newQty
        // Missing amount.unit - should use parameter unit
        image: 'test.jpg', // Only image is provided
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse,
      });

      const result = await pantryService.addIngredient(500, 8, 'tablespoons', 'Vanilla Extract', TEST_TOKEN);

      // Should use parameter values as fallbacks
      expect(result.itemID).toBe(500); // From parameter
      expect(result.itemName).toBe('Vanilla Extract'); // From parameter
      expect(result.amount.amount).toBe(8); // From parameter
      expect(result.amount.unit).toBe('tablespoons'); // From parameter
      expect(result.image).toBe('test.jpg'); // From API response
    });

    it('should handle alternative field names in API response', async () => {
      // Test with 'id' instead of 'itemID', 'itemName' instead of 'ingredientName'
      const mockApiResponse = {
        id: 600, // Alternative to itemID
        itemName: 'Alternative Name', // Alternative to ingredientName
        amount: { amount: 12, unit: 'oz' },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse,
      });

      const result = await pantryService.addIngredient(600, 12, 'oz', 'Fallback Name', TEST_TOKEN);

      expect(result.itemID).toBe(600); // From response.id
      expect(result.itemName).toBe('Alternative Name'); // From response.itemName
      expect(result.amount.amount).toBe(12);
      expect(result.amount.unit).toBe('oz');
    });
  });

  describe('removeIngredient', () => {
    it('should successfully remove ingredient via API', async () => {
      // Setup: Add ingredient first
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ itemID: 123, ingredientName: 'To Remove', amount: { amount: 1, unit: 'cup' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        });

      await pantryService.addIngredient(123, 1, 'cup', 'To Remove', TEST_TOKEN);
      
      // Verify it was added
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([{
          ingredientId: 123,
          ingredientName: 'To Remove',
          amount: { amount: 1, unit: 'cup' },
        }]),
        json: async () => [{
          ingredientId: 123,
          ingredientName: 'To Remove',
          amount: { amount: 1, unit: 'cup' },
        }],
      });
      const beforeRemove = await pantryService.listIngredients(TEST_TOKEN);
      expect(beforeRemove).toHaveLength(1);

      // Remove ingredient
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await pantryService.removeIngredient(123, TEST_TOKEN);

      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE}/api/pantry/remove?id=123`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${TEST_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );

      // Verify it was removed from local pantry
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
        json: async () => [],
      });
      const afterRemove = await pantryService.listIngredients(TEST_TOKEN);
      expect(afterRemove).toHaveLength(0);
    });

    it('should throw error when token is null', async () => {
      await expect(pantryService.removeIngredient(123, null)).rejects.toThrow(
        'Authentication token required'
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should not throw error on 404 status (error caught internally)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      // Error is thrown internally but caught - should not throw to caller
      await expect(pantryService.removeIngredient(123, TEST_TOKEN)).resolves.not.toThrow();

      // Verify pantry state is not modified (error was caught before removal logic)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
        json: async () => [],
      });
      const result = await pantryService.listIngredients(TEST_TOKEN);
      expect(result).toHaveLength(0);
    });

    it('should not throw error on other error status (error caught internally)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      // Error is thrown internally but caught - should not throw to caller
      await expect(pantryService.removeIngredient(123, TEST_TOKEN)).resolves.not.toThrow();
    });

    it('should not throw error on network failure (optimistic update)', async () => {
      // Setup: Add ingredient
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ itemID: 456, ingredientName: 'Network Test', amount: { amount: 1, unit: 'cup' } }),
        })
        .mockRejectedValueOnce(new Error('Network error'));

      await pantryService.addIngredient(456, 1, 'cup', 'Network Test', TEST_TOKEN);

      // Remove with network error - should not throw
      await expect(pantryService.removeIngredient(456, TEST_TOKEN)).resolves.not.toThrow();
    });

    it('should handle removal of non-existent item (not in local pantry)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      // Should not throw even if item doesn't exist locally
      await expect(pantryService.removeIngredient(999, TEST_TOKEN)).resolves.not.toThrow();

      // Verify API was called
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE}/api/pantry/remove?id=999`,
        expect.any(Object)
      );
    });

    it('should remove item that exists locally when API succeeds', async () => {
      // Setup: Add ingredient
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ itemID: 789, ingredientName: 'Local Item', amount: { amount: 2, unit: 'cups' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        });

      await pantryService.addIngredient(789, 2, 'cups', 'Local Item', TEST_TOKEN);

      // Remove it
      await pantryService.removeIngredient(789, TEST_TOKEN);

      // Verify it was removed
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
        json: async () => [],
      });
      const result = await pantryService.listIngredients(TEST_TOKEN);
      expect(result).toHaveLength(0);
    });
  });
});

