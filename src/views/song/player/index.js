
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

export function fetchData(
  songMetaData,
  data,
  songURL,
  picURL,
  selectedAlbum,
  selectedSong
) {
  Snackbar.loading("正在获取歌曲信息");
  fetch(
    "https://api.injahow.cn/meting/?type=song&&id=" +
      songMetaData[selectedAlbum.value].songs[selectedSong.value].id
  )
    .then((response) => response.json())
    .then((_data) => {
      data.value = _data;
      songURL.value = _data[0].url;
      Snackbar.success("歌曲信息获取成功");
      console.log(_data);
      fetch(_data[0].pic, {
      }).then((response) => {
        const url = new URL(response.url);
        url.searchParams.set("param", "");
        picURL.value = url.toString();
      });
    })
    .catch((error) => {
      console.error(error);
      Snackbar.error("歌曲信息获取失败");
    });
}