
import { Snackbar } from "@varlet/ui";

/**
 *
 * @param {String} url 要打开的 URL
 */
export const open = (url) => {
  window.open(url, "_blank");
};

export const isNeedToTip = () => {
  if (
    localStorage.getItem("yunhan-songPlayer-tip") ||
    localStorage.getItem("yunhan-songPlayer-tip") === "true"
  ) {
    return false;
  } else {
    return true;
  }
};