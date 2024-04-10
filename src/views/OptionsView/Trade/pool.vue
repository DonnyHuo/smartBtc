<template>
  <div class="pool">
    <div class="title">流动性池</div>
    <div class="content">
      <div class="titles">
        <span>私池</span>
        <span>可用流动性</span>
      </div>
      <div class="numbers">
        <span>{{ priPoolRate }}%</span>
        <span
          >{{ formatNumber(priPoolInfo.available, 2) }}/{{
            formatNumber(priPoolInfo.balanceOf, 2)
          }}
          {{ selectedCoin.symbol }}</span
        >
      </div>
      <van-progress
        :percentage="isNaN(priPoolRate) ? 0 : priPoolRate"
        color="#ffc519"
        stroke-width="10px"
        :show-pivot="false"
      ></van-progress>
      <div class="titles">
        <span>公池</span>
        <span>可用流动性</span>
      </div>
      <div class="numbers">
        <span>{{ pubPoolRate }}%</span>
        <span
          >{{ formatNumber(pubPoolInfo.availableAmount, 2) }}/{{
            formatNumber(pubPoolInfo.depositedAmount, 2)
          }}
          {{ selectedCoin.symbol }}</span
        >
      </div>
      <van-progress
        :percentage="isNaN(pubPoolRate) ? 0 : pubPoolRate"
        color="#ffc519"
        stroke-width="10px"
        :show-pivot="false"
      ></van-progress>
    </div>
  </div>
</template>
<script>
import liquidityManagerAbi from "../../../abi/liquidityManager.json";
import privatePoolAbi from "../../../abi/privatePool.json";
import erc20Abi from "@/abi/erc20.json";
import publicPoolAbi from "../../../abi/publicPool.json";
import { getContract, formatNumber } from "@/utils";
import { ethers } from "ethers";

export default {
  name: "pool",
  props: ["selectedCoin", "activeTabs"],
  data() {
    return {
      pubPoolInfo: {
        availableAmount: 0,
        depositedAmount: 0,
      },
      priPoolInfo: {
        available: 0,
        balanceOf: 0,
      },
    };
  },
  computed: {
    pubPoolRate() {
      if (this.pubPoolInfo.depositedAmount * 1 === 0) {
        return 0;
      }
      return (
        ((this.pubPoolInfo.availableAmount * 1) /
          (this.pubPoolInfo.depositedAmount * 1)) *
        100
      ).toFixed(2);
    },
    priPoolRate() {
      if (this.priPoolInfo.balanceOf * 1 === 0) {
        return 0;
      }
      return (
        ((this.priPoolInfo.available * 1) / (this.priPoolInfo.balanceOf * 1)) *
        100
      ).toFixed(2);
    },
    selectCoinInfo() {
      return this.$store.state.selectedCoin;
    },
  },
  methods: {
    formatNumber,
    async getLiquidityPool() {
      console.log("selectCoinInfo", this.selectCoinInfo);
      await getContract(
        this.$store.state.LiquidityManagerAddr,
        liquidityManagerAbi,
        "getLiquidityPool",
        this.selectedCoin.address,
        this.activeTabs ? "ETH" : "BTC"
      )
        .then(async (res) => {
          if (res.priPool !== ethers.constants.AddressZero) {
            await this.getLiquidityPriPool(res.priPool);
          }
          if (res.pubPool !== ethers.constants.AddressZero) {
            await this.getLiquidityPubPool(res.pubPool);
          }
        })
        .catch((err) => console.log(err));
    },

    // 私池信息
    async getLiquidityPriPool(priPool) {
      const priTotalLockedLiquidity = await getContract(
        priPool,
        privatePoolAbi,
        "totalLockedLiquidity"
      );

      const realPriTotalLockedLiquidity = ethers.utils.formatUnits(
        priTotalLockedLiquidity,
        this.selectCoinInfo.decimals
      );

      const balance = await getContract(
        this.selectedCoin.address,
        erc20Abi,
        "balanceOf",
        priPool
      );
      const balanceOf = (
        ethers.utils.formatUnits(balance, this.selectCoinInfo.decimals) * 1
      ).toFixed(2);
      const available = (balanceOf - realPriTotalLockedLiquidity).toFixed(2);

      this.priPoolInfo = {
        balanceOf,
        available,
      };
    },
    // 公池信息
    async getLiquidityPubPool(pubPool) {
      await getContract(pubPool, publicPoolAbi, "publicPoolInfo")
        .then((res) => {
          const info = {
            availableAmount: (
              ethers.utils.formatUnits(
                res.availableAmount,
                this.selectCoinInfo.decimals
              ) * 1
            ).toFixed(2),
            depositedAmount: (
              ethers.utils.formatUnits(
                res.depositedAmount,
                this.selectCoinInfo.decimals
              ) * 1
            ).toFixed(2),
            lockedAmount: (
              ethers.utils.formatUnits(res.lockedAmount, this.selectCoinInfo.decimals) * 1
            ).toFixed(2),
          };
          this.pubPoolInfo = info;
        })
        .catch((err) => console.log(err));
    },
  },
  watch: {
    selectedCoin() {
      this.getLiquidityPool();
    },
    activeTabs() {
      this.getLiquidityPool();
    },
  },
};
</script>
<style lang="scss" scoped>
.pool {
  width: 92%;
  margin: 0 auto;
  .title {
    font-size: 20px;
    font-weight: 600;
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
    font-weight: 300;
    > div {
      padding: 4px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .numbers {
      padding: 5px 0;
      color: #333;
      font-weight: 500;
      font-size: 16px;
    }
    .van-progress {
      margin-bottom: 30px;
    }
    .titles {
      font-size: 14px;
    }
  }
}
</style>
