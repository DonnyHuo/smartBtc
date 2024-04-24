import { useClipboard } from "@vueuse/core";

export const copy = async (msg) => {
  const { copy, isSupported } = useClipboard();
  if (isSupported) {
    try {
      await copy(msg);
      console.log('copied')
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log('不支持copy')
  }
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

export const realPic = (address) => {
  if (address) {
    try {
      return require(`@/assets/img/${address.toLowerCase()}.png`);
    } catch {
      return require("@/assets/img/default.png");
    }
  } else {
    return require("@/assets/img/default.png");
  }
};

export {
  getContract,
  getWriteContract,
  getContractLoad,
  getWriteContractLoad,
  getBlockNumber,
  getOkChainId,
  getChainId,
} from "./contract";
