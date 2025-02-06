import i18n from "@/locales/i18n.ts";
import { Snackbar } from "@varlet/ui";

const t = i18n.global.t;

export function copyToClipboard(
  text,
  successCallback = () => {
    Snackbar.success(t("global.copy-success"));
  },
  errorCallback = error => {
    Snackbar.error(t("global.copy-fail", [error.message]));
  }
) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      successCallback();
    })
    .catch(error => {
      errorCallback(error);
    });
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 不区分大小写的string比较
export function stringEqualIgnoreCase(str1, str2) {
  return str1.toLowerCase() === str2.toLowerCase();
}

export function stringIndexOfIgnoreCase(str, searchStr) {
  return str.toLowerCase().indexOf(searchStr.toLowerCase()) != -1;
}
