<template>
  <div class="total-tvl-box">
    <div class="total-tvl">
      <div class="tvl-title">
        <img src="../../assets/img/up.png" />
        <div class="tvl-title-name">總流動性質押</div>
      </div>
      <div class="total-num">$ {{ poolsTotalPower }}</div>
    </div>
    <div class="total-tvl">
      <div class="tvl-title">
        <img src="../../assets/img/upAPY.png" />
        <div class="tvl-title-name">實时APY</div>
      </div>
      <div class="total-num">{{ apy }}%</div>
    </div>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { getContract, getOkChainId } from "../../utils";
import poolABI from "../../abi/pool.json";

export default {
  name: "",
  data() {
    return {
      poolsTotalPower: "--",
      apy: "--",
    };
  },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.poolsTotalPowers();
      this.getAPY();
    }
  },
  methods: {
    async poolsTotalPowers() {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "poolsTotalPowers"
      ).catch((err) => console.log(err));
      this.poolsTotalPower = (
        ethers.utils.formatUnits(res, this.$store.state.usdtDecimals) * 1
      ).toFixed(6);
    },
    async getAPY() {
      const apy = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "perBlockAndLpRewardPools"
      ).catch((err) => console.log(err));
      const MTokenAddress = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getMTokenPrice"
      ).catch((err) => console.log(err));
      this.apy = (
        ethers.utils.formatUnits(apy, 8) *
        24 *
        60 *
        20 *
        365 *
        ethers.utils.formatUnits(MTokenAddress, this.$store.state.usdtDecimals) *
        100
      ).toFixed(2);
    },
  },
};
</script>
<style lang="scss" scoped>
.total-tvl-box {
  background: #fff;
  width: 90%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 6px #cfcece;
  padding: 20px;
  .total-tvl {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tvl-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      height: 30px;
      > img {
        width: 16px;
        margin-right: 10px;
      }
    }
    .total-num {
      font-weight: 600;
    }
  }
}
</style>
