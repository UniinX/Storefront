/** @file Tests for useLanguage hook. */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from './useLanguage.js';

describe('useLanguage', () => {
  it('defaults to "english"', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('english');
  });

  it('respects a custom initial value', () => {
    const { result } = renderHook(() => useLanguage('hindi'));
    expect(result.current.language).toBe('hindi');
  });

  it('changeLanguage updates the language', () => {
    const { result } = renderHook(() => useLanguage());
    act(() => result.current.changeLanguage('tamil'));
    expect(result.current.language).toBe('tamil');
  });
});
