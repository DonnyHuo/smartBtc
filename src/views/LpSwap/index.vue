<template>
  <div class="lpSwap min-h-full">
    <div class="headerBox">
      <span class="title font-medium text-[16px]">
        {{ this.$t("lpSwap.title") }}
      </span>
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
    <div v-if="selectToken.name !== '100T'" class="title">
      {{
        this.$t("lpSwap.desc", {
          name: selectToken?.name,
          total: total / 10000,
        })
      }}
      <!-- 錨定BRC20-{{ selectToken?.name }}，總供應量 {{ total / 10000 }}万 -->
    </div>

    <div v-else class="title">
      {{ this.$t("lpSwap.desc2", { total: total / 100000 }) }}
    </div>
    <div></div>
    <div class="pieBox">
      <!-- <Pie ref="pie" :data="chartConfig.data" :options="chartConfig.options" /> -->
      <canvas ref="myChart"></canvas>
    </div>

    <div v-if="bindAddress && selectToken.name == 'ERC20'" class="mt-[20px]">
      <div class="text-[16px] text-[#111111] font-medium">
        {{ $t("bindText[0]") }}
      </div>
      <div
        class="bg-[#f5f5f5] rounded-[10px] p-[10px] mt-[20px] text-[12px] leading-5"
      >
        <p>{{ $t("bindText[1]") }}: {{ shortStr(bindAddress) }}</p>
        <p>
          {{ $t("bindText[2]") }}
        </p>
      </div>
    </div>

    <div class="contractAddress">
      <div>
        <span>{{ this.$t("lpSwap.address") }}</span>
        <a
          class="address"
          :href="`https://bscscan.com/token/${selectToken.address}#balances`"
          >{{ shortStr(selectToken.address) }}</a
        >
      </div>
      <div>
        <span> {{ this.$t("lpSwap.shares") }}</span>
        <span>
          {{ selectTokenBalance }}
          <span>{{ selectToken.name }}</span>
          ({{ myBalanceRate }}%)</span
        >
      </div>
    </div>

    <div class="line">
      <div class="lineTitle title font-medium text-[16px]">
        {{ this.$t("lpSwap.navTitle") }}
      </div>
      <van-progress :percentage="percentage" stroke-width="8" />
    </div>
    <div v-if="selectPair.length > 0" class="lpList">
      <div>
        <div v-for="(list, index) in selectPair" :key="index">
          <div>
            <div class="listTitle">{{ list?.disPlayName }}</div>
            <div class="rate">
              <span>{{ this.$t("lpSwap.timely") }}</span>
              <span>{{ list?.rate }}%</span>
            </div>
          </div>
          <router-link class="btn" :to="{ path: '/lpSwapDetail', query: list }">
            <span>{{ this.$t("lpSwap.swap") }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <van-action-sheet v-model:show="showCoin" :title="`${$t('lpSwap.select')}`">
      <div class="content">
        <div v-if="exchangeTokens.length > 0">
          <div
            v-for="(list, index) in exchangeTokens"
            :key="index"
            class="coinList"
            @click="onSelectCoin(list)"
          >
            <span
              :class="`${
                list.name == selectToken.name && 'active'
              } flex items-center`"
            >
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
  <van-dialog
    v-model:show="dialogShow"
    :title="$t('bindText[0]')"
    :showConfirmButton="true"
    :showCancelButton="true"
    :confirmButtonText="$t('sure')"
    :cancelButtonText="$t('cancel')"
    @confirm="addrmapBind"
  >
    <div class="text-left p-[20px] text-[14px]">
      <p>
        {{ $t("bindModal[0]") }}:
        <span class="text-[#111]">{{ shortStr($store.state.address) }}</span>
      </p>
      <p>{{ $t("bindModal[1]") }}</p>
      <div
        class="border border-solid border-[#bdbdbd] w-full h-[40px] rounded-[8px] px-[5px] flex items-center justify-between"
      >
        <input class="w-full" type="text" v-model="btcAddress" />
        <button class="w-[40px]" @click="readText">
          {{ $t("btcSwap.paste") }}
        </button>
      </div>
    </div>
  </van-dialog>
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
import { message } from "ant-design-vue";

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
          labels: [
            this.$t("lpSwap.list[0]"),
            this.$t("lpSwap.list[1]"),
            this.$t("lpSwap.list[2]"),
            this.$t("lpSwap.list[3]"),
          ],
          datasets: [
            {
              backgroundColor: [
                "#827eff",
                "#57d7f7",
                "#fbdb5f",
                "#7bffb2",
                "#f079f6",
              ],
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
        name: "--",
        decimals: 0,
        address: "",
      },
      selectPair: [],
      percentage: "",
      chartPie: null,
      total: "",
      selectTokenBalance: "--",
      myBalanceRate: "",
      btcAddress: "",
      dialogShow: false,
      bindAddress: "",
    };
  },
  mounted() {
    const exchangeTokens = JSON.parse(localStorage.getItem("exchangeTokens"));
    const selectToken = JSON.parse(localStorage.getItem("selectToken"));
    if (exchangeTokens && selectToken) {
      this.exchangeTokens = exchangeTokens;
      this.selectToken = selectToken;
    }

    this.chartPie = markRaw(new Chart(this.$refs.myChart, this.chartConfig));

    this.getChangeList();
    if (selectToken.name == "ERC20") {
      this.addrmapQuery();
    }
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

      console.log("getExchangeTokens", getExchangeTokens);

      for (let i = 0; i < getExchangeTokens.length; i++) {
        const tokenInfo = {
          id: i,
          address: getExchangeTokens[i],
          name: await getContract(getExchangeTokens[i], erc20ABI, "symbol"),
          decimals: (
            await getContract(getExchangeTokens[i], erc20ABI, "decimals")
          ).toString(),
          index: await this.getExchangePairs(getExchangeTokens[i]),
        };
        tokensInfo.push(tokenInfo);
      }

      console.log("tokensInfo.length", tokensInfo.length);

      if (tokensInfo.length > 0) {
        tokensInfo.sort((a, b) => (a.id === 1 ? -1 : 0));
        this.selectToken = tokensInfo[0];
        this.exchangeTokens = tokensInfo;
        localStorage.setItem("exchangeTokens", JSON.stringify(tokensInfo));
        localStorage.setItem("selectToken", JSON.stringify(tokensInfo[0]));
      }
    },
    async getExchangePairs(token) {
      const getExchangePairs = await getContract(
        this.$store.state.lpExchange,
        lpExchangeABI,
        "getExchangePairs",
        token
      );
      return getExchangePairs.map((list) => list.toString());
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
      const percent = lpSwap[value.name.toUpperCase()] || [50, 30, 2, 18];
      this.chartConfig.data.datasets[0].data = percent;

      if (value.name == "100T") {
        this.chartConfig.data.labels = [
          this.$t("lpSwap.list1[0]"),
          this.$t("lpSwap.list1[1]"),
          this.$t("lpSwap.list1[2]"),
          this.$t("lpSwap.list1[3]"),
          this.$t("lpSwap.list1[4]"),
        ];
      } else {
        this.chartConfig.data.labels = [
          this.$t("lpSwap.list[0]"),
          this.$t("lpSwap.list[1]"),
          this.$t("lpSwap.list[2]"),
          this.$t("lpSwap.list[3]"),
        ];
      }
      this.chartPie.update();
      const totalSupply = await getContract(
        value.address,
        erc20ABI,
        "totalSupply"
      );
      const total = ethers.utils.formatUnits(totalSupply, value.decimals);
      const balanceOf = await getContract(
        value.address,
        erc20ABI,
        "balanceOf",
        this.$store.state.lpExchange
      );
      const balance = ethers.utils.formatUnits(balanceOf, value.decimals) * 1;
      const lpPercent = percent[1] / 100;
      const percentage = (
        ((total * lpPercent - balance) * 100) /
        (total * lpPercent)
      ).toFixed(4);

      console.log(
        value.name,
        "total",
        total,
        "lpPercent",
        lpPercent,
        "balance",
        balance,
        "percentage",
        percentage
      );
      this.percentage = percentage * 1 > 0 ? percentage : "0.0000";

      console.log("total", total);
      this.total = total;
    },
    async getAddressBalance(value) {
      console.log("value", value);
      const totalSupply = await getContract(
        value.address,
        erc20ABI,
        "totalSupply"
      );
      const total = ethers.utils.formatUnits(totalSupply, value.decimals) * 1;

      const myBalance = await getContract(
        value.address,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      );
      const myBalances =
        ethers.utils.formatUnits(myBalance, value.decimals) * 1;
      this.selectTokenBalance = myBalances.toFixed(4);
      this.myBalanceRate = ((myBalances * 100) / total).toFixed(4);
    },
    addrmapQuery() {
      if (this.$store.state.address) {
        this.$axios
          .post("https://smartbtc.io/bridge/addrmap/query", {
            bsc_addr: this.$store.state.address,
          })
          .then((res) => {
            console.log("res.data.data.btc_addr", res.data.data.btc_addr);
            this.bindAddress = res.data.data.btc_addr;
          })
          .catch(() => {
            this.dialogShow = true;
          });
      }
    },
    addrmapBind() {
      if (this.btcAddress) {
        this.$axios
          .post("https://smartbtc.io/bridge/addrmap/bind", {
            bsc_addr: this.$store.state.address,
            btc_addr: this.btcAddress,
          })
          .then(() => {
            message.success(this.$t("bindSuccess"));
          });
      }
    },
    readText() {
      navigator.clipboard.readText().then((clipboardText) => {
        this.btcAddress = clipboardText;
      });
    },
  },
  watch: {
    async selectToken(value) {
      console.log(value);
      this.getPairs(value.index);
      this.getBalance(value);
      this.getAddressBalance(value);
    },
  },
};
</script>
<style lang="scss">
.lpSwap {
  background-color: #fff;
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

        font-size: 12px;
        color: #333;
        background-color: #ffc519;
      }

      .listTitle {
        font-size: 14px;
        color: #111;
        margin-bottom: 4px;
      }

      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20px;

        &:last-child {
          padding-bottom: 0;
        }

        .rate {
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

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;

      .address {
        text-decoration: underline;
      }
    }
  }

  .content {
    padding: 20px 0;
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
    padding: 20px 0;
  }
}
</style>
