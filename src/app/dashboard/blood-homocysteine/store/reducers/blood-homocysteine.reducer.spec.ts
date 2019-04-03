import { reducer, initialState } from './blood-homocysteine.reducer';

describe('[Reducer] BloodHomocysteine', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
