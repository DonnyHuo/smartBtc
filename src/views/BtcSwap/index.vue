<template>
  <div>btc swap</div>
</template>
<script>
import { showToast } from "vant";

// import { BtcWallet } from "@okxweb3/coin-bitcoin";
export default {
  name: "btcSwap",
  data() {
    return {};
  },
  mounted() {
    this.get();
  },
  methods: {
    async get() {
      if (typeof window.okxwallet !== "undefined") {
        return showToast("OKX is installed!");
      } else {
        const result = await window.okxwallet.bitcoin.connect();
        console.log("result", result);
      }
    },
  },
};
</script>
<style lang="scss"></style>
