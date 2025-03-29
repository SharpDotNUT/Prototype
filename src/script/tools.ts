import i18n from '@/locales/i18n'
import { Snackbar } from '@varlet/ui'

const t = i18n.global.t

export function copyToClipboard(
  text: string,
  successCallback = () => {
    Snackbar.success(t('global.copy-success'))
  },
  errorCallback = (error: Error) => {
    Snackbar.error(t('global.copy-fail', [error.message]))
  }
) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      successCallback()
    })
    .catch((error) => {
      errorCallback(error)
    })
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 不区分大小写的string比较
export function stringEqualIgnoreCase(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase()
}

export function stringIndexOfIgnoreCase(str: string, searchStr: string) {
  return str.toLowerCase().indexOf(searchStr.toLowerCase()) != -1
}
