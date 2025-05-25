import copyMessage from "copy-to-clipboard";

// import { useClipboard } from "@vueuse/core";

export const copy = async (msg) => {
  copyMessage(msg);
  // const { copy, isSupported } = useClipboard();
  // if (isSupported) {
  //   try {
  //     await copy(msg);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // } else {
  //   console.log("不支持copy");
  // }
};

export const shortStr = (address, first = 7, last = 5) => {
  return address && address.slice(0, first) + "..." + address.slice(-last);
};

export const formatNumber = (num, digits) => {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};

export const formatNum = (number) => {
  return String(number).replace(/^(.*\..{4}).*$/, "$1");
};

export const realIconLogo = (name) => {
  if (name) {
    try {
      return require(`@/assets/img/tokenList/brc20-${name
        .split("-")[1]
        .toLowerCase()}.png`);
    } catch {
      return require("@/assets/img/default.png");
    }
  } else {
    return require("@/assets/img/default.png");
  }
};

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}
export function truncateTo6Decimals(num) {
  const parsedNum = typeof num === "string" ? parseFloat(num) : num;
  return Math.trunc(parsedNum * 1e6) / 1e6;
}

export {
  getContract,
  getWriteContract,
  getContractLoad,
  getWriteContractLoad,
  getBlockNumber,
  getOkChainId,
  getChainId,
  connectWallet,
  getBNBBalance,
} from "./contract";
