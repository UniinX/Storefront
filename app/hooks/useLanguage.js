/**
 * @file Active language hook.
 * Provides current language ID and a stable setter.
 */
import { useState, useCallback } from 'react';

export function useLanguage(initial = 'english') {
  const [language, setLanguage] = useState(initial);
  const changeLanguage = useCallback((id) => setLanguage(id), []);
  return { language, changeLanguage };
}
