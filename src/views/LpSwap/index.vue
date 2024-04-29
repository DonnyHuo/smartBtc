<template>
  <div class="lpSwap">
    <div class="headerBox">
      <span class="title">流动池LP质押发行</span>
      <div class="selectBox" @click="showCoin = true">
        <img
          class="coinLogo"
          src="../../assets/img/0x56950c545e365d33175ed07cb294f95126df3635.png"
          alt=""
        />
        <span>{{ selectToken.name }}</span>
        <img class="down" src="../../assets/img/down.png" alt="" />
      </div>
    </div>
    <div class="title">锚定BRC20-SBTC，总供应量2100万</div>
    <div class="pieBox">
      <Pie :data="chartConfig.data" :options="chartConfig.options" />
    </div>

    <div class="contractAddress">
      <span>合约地址</span>
      <span class="line"> | </span>
      <a :href="`https://testnet.bscscan.com/address/${selectToken.address}`">{{
        shortStr(selectToken.address)
      }}</a>
    </div>

    <div class="line">
      <div class="lineTitle title">流动池LP质押发行进度</div>
      <van-progress :percentage="50" stroke-width="8" />
    </div>
    <div class="lpList">
      <div>
        <div v-for="(list, index) in selectPair" :key="index">
          <div>
            <div class="listTitle">{{ list?.disPlayName }}</div>
            <div>
              <span>实时兑换率 </span>
              <span>{{ list?.rate }}%</span>
            </div>
          </div>
          <router-link class="btn" :to="{ path: '/lpSwapDetail', query: list }">
            <span>去兑换</span>
          </router-link>
        </div>
      </div>
    </div>
    <van-action-sheet v-model:show="showCoin" title="选择代币">
      <div class="content">
        <div v-if="exchangeTokens.length > 0">
          <div
            v-for="(list, index) in exchangeTokens"
            :key="index"
            class="coinList"
            @click="onSelectCoin(list)"
          >
            <span :class="list.name == selectToken.name && 'active'">{{
              list.name
            }}</span>
          </div>
        </div>
        <div class="noCoin" v-else>No Exchange Token</div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

import lpExchangeABI from "../../abi/lpExchange.json";
import erc20ABI from "../../abi/erc20.json";

import { getContract, shortStr } from "@/utils";

export default {
  name: "lpSwap",
  components: {
    Pie,
  },
  data() {
    return {
      chartConfig: {
        data: {
          labels: ["跨链", "LP质押", "启动池", "社区空投"],
          datasets: [
            {
              backgroundColor: ["#827eff", "#57d7f7", "#fbdb5f", "#7bffb2"],
              data: [60, 10, 10, 20],
              borderWidth: 0,
              usePointStyle: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                useBorderRadius: true,
                boxWidth: 20,
                fullWidth: true,
                borderRadius: 2,
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.formattedValue + "%";
                },
              },
            },
          },
        },
      },
      showCoin: false,
      exchangeTokens: [],
      selectToken: {
        name: "--",
        decimals: 0,
        address: "",
      },
      selectPair: [],
    };
  },
  mounted() {
    this.getChangeList();
  },
  methods: {
    shortStr,
    onSelectCoin(list) {
      this.selectToken = list;
      this.showCoin = false;
    },

    async getChangeList() {
      const getExchangeTokens = await getContract(
        this.$store.state.lpExchange,
        lpExchangeABI,
        "getExchangeTokens"
      );
      const tokensInfo = [];

      for (let i = 0; i < getExchangeTokens.length; i++) {
        const tokenInfo = {
          address: getExchangeTokens[i],
          name: await getContract(getExchangeTokens[i], erc20ABI, "name"),
          decimals: await getContract(getExchangeTokens[i], erc20ABI, "decimals"),
          index: await this.getExchangePairs(getExchangeTokens[i]),
        };
        tokensInfo.push(tokenInfo);
      }
      this.selectToken = tokensInfo[0];

      this.exchangeTokens = tokensInfo;
    },
    async getExchangePairs(token) {
      const getExchangePairs = await getContract(
        this.$store.state.lpExchange,
        lpExchangeABI,
        "getExchangePairs",
        token
      );
      return getExchangePairs;
    },

    async getPairs(index) {
      const pairsInfo = [];
      for (let i = 0; i < index.length; i++) {
        const getPairs = await getContract(
          this.$store.state.lpExchange,
          lpExchangeABI,
          "pairs",
          index[i].toString()
        );
        const pairInfo = {
          pairId: index[i].toString(),
          baseTokenIsToken0: getPairs.baseTokenIsToken0,
          changeToken: getPairs.changeToken,
          disPlayName: getPairs.disPlayNmae,
          isOpen: getPairs.isOpen,
          lpToken: getPairs.lpToken,
          pairName: getPairs.pairName,
          rate: getPairs.rate.toString() / 200,
        };
        pairsInfo.push(pairInfo);
      }

      this.selectPair = pairsInfo;
    },
  },
  watch: {
    async selectToken(value) {
      await this.getPairs(value.index);
    },
  },
};
</script>
<style lang="scss">
.lpSwap {
  height: calc(100vh - 50px);
  background-color: #fff;
  overflow: auto;
  padding: 20px;
  text-align: left;
  font-size: 14px;
  .headerBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    .selectBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f5f5f5;
      padding: 5px 10px;
      border-radius: 10px;
      .coinLogo {
        width: 20px;
        height: 20px;
      }
      span {
        padding: 0 5px;
      }
      .down {
        width: 10px;
        height: 10px;
      }
    }
  }
  .line {
    margin: 30px 0;
    .lineTitle {
      padding-bottom: 20px;
    }
  }
  .title {
    font-weight: bold;
    color: #111;
  }
  .lpList {
    background-color: #f5f5f5;
    border-radius: 10px;
    padding: 20px;
    > div {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .btn {
        height: 26px;
        padding: 0 10px;
        line-height: 26px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 12px;
        color: #333;
        background-color: #ffc519;
      }
      .listTitle {
        font-size: 14px;
        color: #111;
        margin-bottom: 4px;
        font-weight: bold;
      }
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:last-child {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
  .pieBox {
    width: 100%;
    height: 300px;
    margin-top: 20px;
  }
  .contractAddress {
    background-color: #f5f5f5;
    margin-top: 20px;
    padding: 10px;
    border-radius: 10px;
    .line {
      color: #cac7c7;
      padding: 0 10px;
    }
  }

  .coinList {
    padding: 20px;
    text-align: center;
    .active {
      color: #ffc519;
    }
  }
}
</style>
