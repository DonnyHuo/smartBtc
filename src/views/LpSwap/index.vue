<template>
  <div class="lpSwap">
    <div class="headerBox">
      <span class="title">流动池LP质押发行</span>
      <div class="selectBox" @click="showCoin = true">
        <img
          v-if="selectToken?.name !== '--'"
          class="coinLogo"
          :src="
            require(`../../assets/img/tokenList/brc20-${selectToken?.name.toLowerCase()}.png`)
          "
          alt=""
        />
        <span>{{ selectToken.name }}</span>
        <img class="down" src="../../assets/img/down.png" alt="" />
      </div>
    </div>
    <div class="title">锚定BRC20-SBTC，总供应量2100万</div>
    <div class="pieBox">
      <!-- <Pie ref="pie" :data="chartConfig.data" :options="chartConfig.options" /> -->
      <canvas ref="myChart"></canvas>
    </div>

    <div class="contractAddress">
      <span>合约地址</span>
      <a
        class="address"
        :href="`https://testnet.bscscan.com/token/${selectToken.address}#balances`"
        >{{ shortStr(selectToken.address) }}</a
      >
    </div>

    <div class="line">
      <div class="lineTitle title">流动池LP质押发行进度</div>
      <van-progress :percentage="percentage" stroke-width="8" />
    </div>
    <div v-if="selectPair.length > 0" class="lpList">
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
            <span :class="list.name == selectToken.name && 'active'">
              <img
                class="listLogo"
                :src="
                  require(`../../assets/img/tokenList/brc20-${list?.name.toLowerCase()}.png`)
                "
                alt=""
              />
              <span>{{ list.name }}</span>
            </span>
          </div>
        </div>
        <div class="noCoin" v-else>No Exchange Token</div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
import { markRaw } from "vue";

import lpExchangeABI from "../../abi/lpExchange.json";
import erc20ABI from "../../abi/erc20.json";

import { getContract, shortStr } from "@/utils";
import { ethers } from "ethers";

import lpSwap from "../../config/lpSwap.json";

export default {
  name: "lpSwap",
  // components: {
  //   Pie,
  // },
  data() {
    return {
      chartConfig: {
        type: "pie",
        data: {
          labels: ["跨链", "LP质押", "启动池", "社区空投"],
          datasets: [
            {
              backgroundColor: ["#827eff", "#57d7f7", "#fbdb5f", "#7bffb2"],
              data: [],
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
        name: "100t",
        decimals: 0,
        address: "",
      },
      selectPair: [],
      percentage: "",
      chartPie: null,
    };
  },
  mounted() {
    this.chartPie = markRaw(new Chart(this.$refs.myChart, this.chartConfig));

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
          name: await getContract(getExchangeTokens[i], erc20ABI, "symbol"),
          decimals: await getContract(getExchangeTokens[i], erc20ABI, "decimals"),
          index: await this.getExchangePairs(getExchangeTokens[i]),
        };
        tokensInfo.push(tokenInfo);
      }
      if (tokensInfo.length > 0) {
        this.selectToken = tokensInfo[0];
        this.exchangeTokens = tokensInfo;
      }
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

    async getBalance(value) {
      console.log("value", value);
      this.chartConfig.data.datasets[0].data = lpSwap[value.name.toUpperCase()].percent;
      this.chartPie.update();
      const totalSupply = await getContract(value.address, erc20ABI, "totalSupply");
      const total = ethers.utils.formatUnits(totalSupply, value.decimals);
      const balanceOf = await getContract(
        value.address,
        erc20ABI,
        "balanceOf",
        this.$store.state.lpExchange
      );
      const balance = ethers.utils.formatUnits(balanceOf, value.decimals);
      const lpPercent = lpSwap[value.name.toUpperCase()].percent[1] / 100;
      const percentage = (
        ((total * lpPercent - balance) * 100) /
        (total * lpPercent)
      ).toFixed(2);
      this.percentage = percentage;
    },
  },
  watch: {
    async selectToken(value) {
      await this.getPairs(value.index);
      await this.getBalance(value);
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
        border-radius: 50%;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    .address {
      text-decoration: underline;
    }
  }

  .coinList {
    padding: 10px 20px;
    text-align: center;
    font-size: 16px;
    .active {
      color: #ffc519;
    }
    .listLogo {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .noCoin {
    text-align: center;
    padding: 40px 0;
  }
}
</style>
