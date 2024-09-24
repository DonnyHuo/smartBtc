<template>
  <div class="info">
    <div class="title">{{ $t("options.info.title") }}</div>
    <div class="content">
      <div>
        <span>Ticker Root</span>
        <span
          >{{ activeTabs ? "ETH" : "BTC" }}USD/{{ selectedCoin.symbol }}</span
        >
      </div>
      <div>
        <span>{{ $t("options.info.desc[0]") }}</span>
        <span>{{ $t("options.info.desc[1]") }}</span>
      </div>
      <div>
        <span>{{ $t("options.info.desc[2]") }}</span> <span>1‰</span>
      </div>
      <div>
        <span>{{ $t("options.info.desc[3]") }}</span> <span>1‰</span>
      </div>
      <div>
        <span>{{ $t("options.info.desc[4]") }}</span>
        <span>{{ $t("options.info.desc[5]") }}</span>
      </div>
      <div>
        <span>{{ $t("options.info.desc[6]") }}</span>
        <span>{{ $t("options.info.desc[7]") }}</span>
      </div>
      <div>
        <span>{{ $t("options.info.desc[8]") }}</span>
        <span>{{ balanceOf }} {{ selectedCoin.symbol }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import perpetualOptionsAbi from "@/abi/perpetualOptions.json";
import erc20Abi from "@/abi/erc20.json";
import { getContract } from "@/utils";
import { ethers } from "ethers";

export default {
  name: "info",
  props: ["selectedCoin", "activeTabs"],
  data() {
    return {
      balanceOf: 0,
    };
  },
  computed: {
    selectedCoinInfo() {
      return this.$store.state.selectedCoin.decimals;
    },
  },
  methods: {
    async getAddress() {
      const riskFundAddr = await getContract(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "riskFundAddr"
      );
      await this.getBalance(riskFundAddr);
    },
    async getBalance(riskFundAddr) {
      const balance = await getContract(
        this.selectedCoin.address,
        erc20Abi,
        "balanceOf",
        riskFundAddr
      );
      const balanceOf = ethers.utils.formatUnits(
        balance,
        this.selectedCoinInfo
      );
      this.balanceOf = (balanceOf * 1).toFixed(2);
    },
  },
  watch: {
    selectedCoin() {
      this.getAddress();
    },
    activeTabs() {
      this.getAddress();
    },
  },
};
</script>
<style lang="scss" scoped>
.info {
  width: 92%;
  margin: 10px auto;

  .title {
    font-size: 20px;

    text-align: left;
    margin-top: 30px;
  }
  .content {
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    margin-top: 10px;
    color: #666;
    font-size: 14px;

    > div {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span:last-child {
        color: #111;
      }
    }
  }
}
</style>
