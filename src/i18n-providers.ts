import { APP_BASE_HREF } from '@angular/common';
import { CompilerOptions, LOCALE_ID, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';

/**
 * Returns the current lang for the application
 * using the existing base path
 * or the browser lang if there is no base path
 * @returns {string}
 */
export function getLang(): string | null {

  if(typeof window === 'undefined' || typeof window.navigator === 'undefined') {
    return null;
  }

  //use, if set base_href ua or ru
  //const basePath = window.location.pathname.replace('/', '').split('/');
  //let lang: string = basePath.length ? basePath[0] : '';
  let lang = localStorage.getItem('lang');

  if(!lang) {
    lang = window.navigator['languages'] ? window.navigator['languages'][0] : null;
    lang = lang || window.navigator.language || window.navigator['browserLanguage'] || window.navigator['userLanguage'];

    if(lang.indexOf('-') !== -1) {
      lang = lang.split('-')[0];
    }

    if(lang.indexOf('_') !== -1) {
      lang = lang.split('_')[0];
    }
  }
  return lang.match(/^(ua|ru)$/) ? lang : 'ua';
}

/**
 * Lazy-load the translations in JIT
 * or does nothing in AOT
 * @param isAot a parameter to know if the app is using AOT or not
 * @returns {any}
 */
export function getTranslationProviders(isAot: boolean): Promise<any> {
  if(isAot) {
    return Promise.resolve([]);
  }
  const locale = getLang();
  const PROVIDERS = [
    {provide: LOCALE_ID, useValue: locale}
  ];

  //use, if set base_href ua or ru
  /**if(locale) {
    document.querySelector('base').href = `/${locale}`;
    PROVIDERS.push({provide: APP_BASE_HREF, useValue: `/${locale}`});
  }**/

  // No locale or ukrainian
  if(!locale || locale === 'ua') {
    return Promise.resolve(PROVIDERS);
  }

  return getTranslationsWithSystemJs(locale)
    .then((translations: string) => [
      {provide: TRANSLATIONS, useValue: translations},
      {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
      ...PROVIDERS
    ])
    .catch(() => PROVIDERS); // ignore if file not found
}
//System.import() is deprecated and will be removed soon. Use import() instead.
function getTranslationsWithSystemJs(locale: string) {
  //return System.import(`raw-loader!./i18n/messages.${locale}.xlf`);
  return import(`raw-loader!./i18n/messages.${locale}.xlf`);
}
