import { createSlug, createMonumentUrl, extractIdFromUrl } from './slug';

describe('Slug utilities', () => {
  describe('createSlug', () => {
    test('should convert Vietnamese text to slug', () => {
      expect(createSlug('Tháp Eiffel - Biểu tượng thép của Paris')).toBe('thap-eiffel-bieu-tuong-thep-cua-paris');
      expect(createSlug('Chùa Angkor Wat')).toBe('chua-angkor-wat');
      expect(createSlug('Đền Bayon')).toBe('den-bayon');
    });

    test('should handle empty or null input', () => {
      expect(createSlug('')).toBe('');
      expect(createSlug(null)).toBe('');
      expect(createSlug(undefined)).toBe('');
    });

    test('should remove special characters', () => {
      expect(createSlug('Test!@#$%^&*()_+')).toBe('test');
      expect(createSlug('Test   with   spaces')).toBe('test-with-spaces');
    });
  });

  describe('createMonumentUrl', () => {
    test('should create URL with slug', () => {
      expect(createMonumentUrl(1, 'Tháp Eiffel')).toBe('/monuments/1-thap-eiffel');
      expect(createMonumentUrl(2, 'Angkor Wat')).toBe('/monuments/2-angkor-wat');
    });

    test('should handle empty title', () => {
      expect(createMonumentUrl(1, '')).toBe('/monuments/1');
      expect(createMonumentUrl(1, null)).toBe('/monuments/1');
    });
  });

  describe('extractIdFromUrl', () => {
    test('should extract ID from URL with slug', () => {
      expect(extractIdFromUrl('/monuments/123-thap-eiffel')).toBe(123);
      expect(extractIdFromUrl('/monuments/456-angkor-wat')).toBe(456);
    });

    test('should extract ID from URL without slug', () => {
      expect(extractIdFromUrl('/monuments/123')).toBe(123);
    });

    test('should return null for invalid URLs', () => {
      expect(extractIdFromUrl('/invalid/url')).toBe(null);
      expect(extractIdFromUrl('')).toBe(null);
    });
  });
});
