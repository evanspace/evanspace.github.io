
import zhCN from '../locale/lang/zh-CN'
import { localeContextKey } from '../locale'

import * as lodash from 'lodash-es'

const buildTranslator = ( locale ) => ( path: string, option?: any ) => translate( path, option, unref( locale ) )

const translate = ( path = '', option, locale ) => lodash.get( locale, path, path ).replace( /\{(\w+)\}/g, ( _, key ) => {
  let _a
  return `${ ( _a = option == null ? void 0 : option[ key ] ) != null ? _a : `{${ key }}` }`
} )

export const useLocale = ( localeOverrides? ) => {
  const locale = localeOverrides || inject( localeContextKey, ref() )
  const _locale = computed( () => locale.value || zhCN )
  const lang = computed(() => unref( locale )?.name )
  return {
    lang,
    locale,
    t: buildTranslator( _locale )
  }
}