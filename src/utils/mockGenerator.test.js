// mockGenerator.test.js - Unit tests for API mapper and mock generation logic.

import { describe, it, expect } from 'vitest';
import { cleanUserData, makeFakeUsers, DEPARTMENTS } from './mockGenerator.js';

describe('mockGenerator Utilities', () => {
  describe('cleanUserData', () => {
    it('correctly maps a standard API user with full name', () => {
      const apiUser = {
        id: 1,
        name: 'Leanne Graham',
        email: 'Sincere@april.biz',
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org',
      };

      const result = cleanUserData(apiUser);

      expect(result).toEqual({
        id: 1,
        firstName: 'Leanne',
        lastName: 'Graham',
        email: 'Sincere@april.biz',
        department: DEPARTMENTS[1 % DEPARTMENTS.length],
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org',
      });
    });

    it('handles single-word name by putting empty string or default for last name', () => {
      const apiUser = {
        id: 2,
        name: 'Madonna',
        email: 'madonna@example.com',
      };

      const result = cleanUserData(apiUser);

      expect(result.firstName).toBe('Madonna');
      expect(result.lastName).toBe('User');
    });

    it('handles multiple names (middle names or multi-word last names)', () => {
      const apiUser = {
        id: 3,
        name: 'John von Neumann',
        email: 'john@princeton.edu',
      };

      const result = cleanUserData(apiUser);

      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('von Neumann');
    });

    it('handles empty or missing name gracefully', () => {
      const apiUser = {
        id: 4,
        email: 'test@example.com',
      };

      const result = cleanUserData(apiUser);

      expect(result.firstName).toBe('Unknown');
      expect(result.lastName).toBe('User');
    });

    it('autogenerates fallback email if email is missing', () => {
      const apiUser = {
        id: 5,
        name: 'Alan Turing',
      };

      const result = cleanUserData(apiUser);

      expect(result.email).toBe('alan.turing@example.com');
    });

    it('assigns departments predictably based on ID', () => {
      const userA = cleanUserData({ id: 10, name: 'User Ten' });
      const userB = cleanUserData({ id: 20, name: 'User Twenty' });

      expect(userA.department).toBe(DEPARTMENTS[10 % DEPARTMENTS.length]);
      expect(userB.department).toBe(DEPARTMENTS[20 % DEPARTMENTS.length]);
    });
  });

  describe('makeFakeUsers', () => {
    it('generates the exact requested number of mock users', () => {
      const count = 15;
      const result = makeFakeUsers(11, count);

      expect(result).toHaveLength(count);
    });

    it('assigns incrementing IDs starting from startId', () => {
      const startId = 50;
      const count = 5;
      const result = makeFakeUsers(startId, count);

      expect(result[0].id).toBe(50);
      expect(result[1].id).toBe(51);
      expect(result[2].id).toBe(52);
      expect(result[3].id).toBe(53);
      expect(result[4].id).toBe(54);
    });

    it('generates plausible email and website fields based on last name', () => {
      const result = makeFakeUsers(11, 2);

      result.forEach(user => {
        expect(user.firstName).toBeDefined();
        expect(user.lastName).toBeDefined();
        expect(user.email).toContain('@');
        expect(user.website).toContain('www.');
        expect(user.phone).toMatch(/^\+1 \(\d{3}\) 555-\d{4}$/);
      });
    });
  });
});