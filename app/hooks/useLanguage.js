/**
 * @file Active language hook.
 * Provides current language ID and a stable setter.
 */
import {useState, useCallback} from 'react';

const LANGUAGE_COOKIE = 'uniinx_language';
const SUPPORTED_LANGUAGES = new Set([
  'english',
  'hindi',
  'telugu',
  'tamil',
  'malayalam',
  'kannada',
  'bengali',
  'odia',
]);

const STOREFRONT_LANGUAGE_CODES = {
  english: 'EN',
  hindi: 'HI',
  telugu: 'TE',
  tamil: 'TA',
  malayalam: 'ML',
  kannada: 'KN',
  bengali: 'BN',
  odia: 'OR',
};

export function getLanguagePreference(request) {
  const cookie = request?.headers?.get?.('Cookie') ?? '';
  const value = cookie
    .split(';')
    .map((part) => part.trim().split('='))
    .find(([key]) => key === LANGUAGE_COOKIE)?.[1];
  return SUPPORTED_LANGUAGES.has(value) ? value : 'english';
}

export function getStorefrontLanguageCode(request) {
  return STOREFRONT_LANGUAGE_CODES[getLanguagePreference(request)] ?? 'EN';
}

export function useLanguage(initial = 'english') {
  const [language, setLanguage] = useState(initial);
  const changeLanguage = useCallback((id) => {
    if (!SUPPORTED_LANGUAGES.has(id)) return;
    setLanguage(id);
    if (typeof document !== 'undefined') {
      document.cookie = `${LANGUAGE_COOKIE}=${id}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(LANGUAGE_COOKIE, id);
  }, []);
  return {language, changeLanguage};
}
