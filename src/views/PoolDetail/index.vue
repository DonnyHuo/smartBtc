<template>
  <div class="min-h-screen bg-white border border-solid border-transparent">
    <!-- 币种信息卡片 -->
    <div class="bg-white rounded-xl shadow-md mx-4 mt-4">
      <img
        :src="
          poolInfo.logoUrl ||
          require('../../assets/img/tokenList/brc20-100t.png')
        "
        alt="coin"
        class="w-full object-contain mb-4"
      />
    </div>

    <div class="mx-4 text-left">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xl font-bold">{{ poolInfo.symbol }}</span>
        <span class="bg-[#F3F300] text-xs text-black rounded px-2 py-0.5">{{
          getStatus(poolInfo.type)
        }}</span>
      </div>
      <div class="text-xs text-gray-500 mb-1">
        {{ poolInfo.details }}
      </div>
      <div class="text-xs text-gray-400">
        {{ $t("poolDetail.createTime") }} {{ poolInfo.createTime }}
      </div>
      <div class="w-full mt-4">
        <div class="flex justify-end text-xs text-gray-500 mb-1 gap-2">
          <span>{{ $t("poolDetail.launchProgress") }}</span>
          <span class="text-[#000] font-bold text-[14px]"
            >{{
              Number(poolInfo.processPercent) < 0.01
                ? "<0.01"
                : Number(poolInfo.processPercent).toFixed(4)
            }}%</span
          >
        </div>
        <van-progress
          class="mt-4"
          :percentage="Number(poolInfo.processPercent).toFixed(4)"
          color="#0000F3"
        />
      </div>
    </div>

    <!-- 抢购/赎回切换 -->
    <div
      class="flex justify-center gap-4 mt-6 bg-[#F6F6F6] w-2/3 h-[40px] rounded-[12px] m-auto"
    >
      <button
        :class="[
          'px-4 py-2 rounded-[12px] font-bold w-1/2 text-[12px]',
          activeTab === 'buy'
            ? 'bg-[#ffc519] text-black'
            : 'bg-transparent text-gray-500',
        ]"
        @click="activeTab = 'buy'"
      >
        {{ $t("poolDetail.buy") }}
      </button>
      <button
        :class="[
          'px-4 py-2 rounded-[12px] font-bold w-1/2 text-[12px]',
          activeTab === 'redeem'
            ? 'bg-[#ffc519] text-black'
            : 'bg-transparent text-gray-500',
        ]"
        @click="activeTab = 'redeem'"
      >
        {{ $t("poolDetail.redeem") }}
      </button>
    </div>

    <div class="flex flex-col gap-4 mt-4 px-4 text-[12px] text-[#000]">
      <div
        v-if="activeTab === 'buy'"
        class="flex items-center justify-between bg-[#F6F6F6] p-3 rounded-[8px]"
      >
        <div>{{ $t("poolDetail.equalLaunch") }}</div>
        <div>
          1 {{ poolInfo.token }} = {{ poolInfo.exchangeRate }}
          {{ poolInfo.symbol }}
        </div>
      </div>

      <div
        v-else
        class="flex items-center justify-center bg-[#F6F6F6] p-3 rounded-[8px] font-bold"
      >
        {{ $t("poolDetail.redeemNote") }}
      </div>
      <div>
        <div v-if="activeTab === 'buy'" class="text-right mb-1 px-3">
          {{ $t("poolDetail.balance") }}：{{ BNBBalance }} {{ poolInfo.token }}
        </div>
        <div v-else class="text-right mb-1 px-3">
          {{ $t("poolDetail.redeemAmount") }}：{{
            stakeBalance * poolInfo.exchangeRate
          }}
          {{ poolInfo.symbol }}
        </div>
        <div
          class="flex items-center justify-between bg-[#F6F6F6] p-3 rounded-[8px]"
        >
          <div>{{ $t("poolDetail.payment") }}</div>
          <div class="flex items-center gap-2">
            <input
              type="text"
              class="bg-transparent w-[100px] text-right"
              :placeholder="$t('poolDetail.inputAmount')"
              v-model="amount"
            />
            <span v-if="activeTab === 'buy'">{{ poolInfo.token }}</span>
            <span v-else>{{ poolInfo.symbol }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-between gap-2">
        <button
          class="flex-1 py-2 rounded-lg bg-[#F6F6F6] font-bold"
          @click="changeAmount(0.1)"
        >
          10%
        </button>
        <button
          class="flex-1 py-2 rounded-lg bg-[#F6F6F6] font-bold"
          @click="changeAmount(0.5)"
        >
          50%
        </button>
        <button
          class="flex-1 py-2 rounded-lg bg-[#F6F6F6] font-bold"
          @click="changeAmount(0.8)"
        >
          80%
        </button>
        <button
          class="flex-1 py-2 rounded-lg bg-[#F6F6F6] font-bold"
          @click="changeAmount(1)"
        >
          {{ $t("poolDetail.allIn") }}
        </button>
      </div>
      <div
        class="flex items-center justify-between bg-[#F6F6F6] p-3 rounded-[8px]"
      >
        <div>{{ $t("poolDetail.expectedAmount") }}</div>
        <div class="flex items-center gap-2">
          <input
            type="text"
            class="bg-transparent w-[100px] text-right"
            :placeholder="$t('poolDetail.amount')"
            :value="getAmount"
            disabled
          />
          <span v-if="activeTab === 'buy'">{{ poolInfo.symbol }}</span>
          <span v-else>{{ poolInfo.token }}</span>
        </div>
      </div>
    </div>
    <div class="mx-4 mt-4">
      <div v-if="activeTab === 'buy'">
        <div v-if="poolInfo.token === 'BNB'">
          <van-button
            class="w-full h-[40px] !bg-[#FFCF02] text-[12px] font-bold rounded-xl !border-0"
            @click="handleBuy"
            :loading="buyLoding"
            :disabled="amount * 1 == 0 || this.BNBBalance * 1 < this.amount * 1"
          >
            {{ $t("poolDetail.buyToken") }}
          </van-button>
        </div>
        <div v-else>
          <van-button
            v-if="allowance == 0"
            class="w-full h-[40px] !bg-[#FFCF02] text-[12px] font-bold rounded-xl !border-0"
            @click="approveFun"
            :loading="approveLoding"
            >{{ $t("poolDetail.approve") }}</van-button
          >
          <van-button
            v-else
            class="w-full h-[40px] !bg-[#FFCF02] text-[12px] font-bold rounded-xl !border-0"
            @click="handleBuy"
            :loading="buyLoding"
            :disabled="amount * 1 == 0 || this.BNBBalance * 1 < this.amount * 1"
          >
            {{ $t("poolDetail.buyToken") }}
          </van-button>
        </div>
      </div>
      <div v-else>
        <van-button
          v-if="allowance == 0"
          class="w-full h-[40px] !bg-[#FFCF02] text-[12px] font-bold rounded-xl !border-0"
          @click="approveFun"
          :loading="approveLoding"
          >{{ $t("poolDetail.approve") }}</van-button
        >
        <van-button
          v-else
          class="w-full h-[40px] !bg-[#FFCF02] text-[12px] font-bold rounded-xl !border-0"
          @click="handleWithdraw"
          :loading="withdrawLoding"
          :disabled="
            amount * 1 == 0 ||
            this.stakeBalance * this.poolInfo.exchangeRate < this.amount * 1
          "
        >
          {{ $t("poolDetail.earlyRedeem") }}
        </van-button>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="mx-4 mt-6">
      <div v-if="orders.length" class="font-bold mb-2 text-left text-[14px]">
        {{ $t("poolDetail.myOrders") }}
      </div>
      <div
        class="bg-white py-4 border-0 border-b border-solid border-[#EFEFEF]"
        v-for="order in orders"
        :key="order.order_id"
      >
        <div class="flex justify-between text-black text-[14px]">
          <span>{{ poolInfo.symbol }} / {{ poolInfo.token }}</span>
          <span class="text-[12px] text-[rgba(0,0,0,0.5)]">{{
            dayjs(order.created_at).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
        </div>
        <div class="flex flex-col gap-2 text-[12px]">
          <div class="flex items-center justify-between h-[30px]">
            <span class="text-[12px] text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.marketPrice")
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.type")
            }}</span>
            <span class="text-[12px] text-black">{{
              order.order_type ? $t("poolDetail.redeem") : $t("poolDetail.buy")
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.amount")
            }}</span>
            <span class="text-[12px] text-black">
              <span v-if="order.order_type"
                >{{ order.a_amount }} {{ poolInfo.token }}</span
              >
              <span v-else>{{ order.b_amount }} {{ poolInfo.symbol }}</span>
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.price")
            }}</span>
            <span v-if="order.order_type" class="text-[12px] text-black"
              >1 {{ poolInfo.symbol }} ➡️ {{ order.a_amount / order.b_amount }}
              {{ poolInfo.token }}
            </span>
            <span v-else class="text-[12px] text-black"
              >1 {{ poolInfo.token }} ➡️ {{ order.b_amount / order.a_amount }}
              {{ poolInfo.symbol }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.status")
            }}</span>
            <span class="text-[12px] text-[#00D832]">{{
              getOrderStatus(order.order_state)
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.orders.txId")
            }}</span>
            <a
              :href="`https://bscscan.com/tx/${order.spend_txid}`"
              target="_blank"
              class="text-black underline"
            >
              {{ shortStr(order.spend_txid) }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getContract,
  getWriteContractLoad,
  getWriteContract,
  getBNBBalance,
  truncateTo6Decimals,
  shortStr,
} from "@/utils";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { ethers } from "ethers";

import erc20ABI from "../../abi/erc20.json";
import tokenShopAbi from "../../abi/tokenShop.json";

Decimal.set({ precision: 30 });

export default {
  data() {
    return {
      activeTab: "buy",
      orders: [],
      poolInfo: "",
      amount: "",
      getAmount: "",
      BNBBalance: "",
      address: this.$store.state.address,
      buyLoding: false,
      stakeBalance: "",
      withdrawLoding: false,
      allowance: 0,
      approveLoding: false,
      rate: 0,
    };
  },
  async created() {
    this.poolInfo = this.$route.query;
    this.getRecordList();
    this.getBalance();
    this.getUserContributions();
    if (
      (this.activeTab === "buy" && this.poolInfo.token !== "BNB") ||
      this.activeTab === "redeem"
    ) {
      this.getAllowance();
    }
  },
  methods: {
    dayjs,
    getBNBBalance,
    shortStr,
    async getBalance() {
      if (this.poolInfo.token == "BNB") {
        this.BNBBalance = truncateTo6Decimals(
          await this.getBNBBalance(this.address)
        );
      } else if (this.poolInfo.token == "USDT") {
        getContract(
          "0x55d398326f99059ff775485246999027b3197955",
          erc20ABI,
          "balanceOf",
          this.address
        ).then((res) => {
          this.BNBBalance = truncateTo6Decimals(
            ethers.utils.formatUnits(res, 18)
          );
        });
      } else if (this.poolInfo.token == "SOS") {
        getContract(
          "0x1d887F723F77b2F8C99BED8B94F4e3BA71BAF70e",
          erc20ABI,
          "balanceOf",
          this.address
        ).then((res) => {
          this.BNBBalance = truncateTo6Decimals(
            ethers.utils.formatUnits(res, 18)
          );
        });
      }
    },
    async getAllowance() {
      getContract(
        this.activeTab === "buy"
          ? this.poolInfo.coinMintToken
          : this.poolInfo.contract,
        erc20ABI,
        "allowance",
        this.address,
        this.$store.state.tokenShop
      ).then((res) => {
        console.log("res32321321", res);
        this.allowance = Number(res.toString());
      });
    },

    async approveFun() {
      this.approveLoding = true;
      getWriteContractLoad(
        this.activeTab === "buy"
          ? this.poolInfo.coinMintToken
          : this.poolInfo.contract,
        erc20ABI,
        "approve",
        this.$store.state.tokenShop,
        ethers.constants.MaxUint256
      )
        .then((res) => {
          console.log(res, res);
          this.approveLoding = false;
          this.getAllowance();
        })
        .catch((err) => {
          console.log(err);
          this.approveLoding = false;
        });
    },

    async handleWithdraw() {
      this.withdrawLoding = true;

      console.log("handleWithdraw", this.stakeBalance, this.rate);
      const overrides = {
        gasLimit: 100000,
        gasPrice: ethers.utils.parseUnits("5", "gwei"),
      };
      getWriteContract(
        this.$store.state.tokenShop,
        tokenShopAbi,
        "withdraw",
        this.poolInfo.id,
        ethers.utils.parseUnits(
          new Decimal(this.stakeBalance).times(this.rate).toString(),
          18
        ),
        overrides
      )
        .then((res) => {
          this.withdrawLoding = false;
          this.trade({
            pool_id: Number(this.poolInfo.id),
            address: this.address,
            a_amount: new Decimal(this.stakeBalance)
              .times(this.rate)
              .times(0.96)
              .toString(),
            b_amount: String(this.amount),
            spend_txid: res.hash,
            order_type: 1,
          });
        })
        .catch((err) => {
          this.withdrawLoding = false;
          console.log(err);
        })
        .finally(() => {
          this.withdrawLoding = false;
        });
    },
    getUserContributions() {
      getContract(
        this.$store.state.tokenShop,
        tokenShopAbi,
        "userContributions",
        this.poolInfo.id,
        this.address
      ).then((res) => {
        this.stakeBalance = Number(ethers.utils.formatUnits(res, 18)).toFixed(
          6
        );

        console.log("stakeBalance", this.stakeBalance);
      });
    },
    changeAmount(rate) {
      this.rate = rate;
      if (this.activeTab === "buy") {
        this.amount = new Decimal(this.BNBBalance).times(rate).toString();
      } else {
        this.amount = new Decimal(
          this.stakeBalance * this.poolInfo.exchangeRate
        )
          .times(rate)
          .toString();
      }
    },
    async handleBuy() {
      let parmas;
      if (this.poolInfo.token == "BNB") {
        parmas = [
          this.$store.state.tokenShop,
          tokenShopAbi,
          "swap",
          this.poolInfo.id,
          ethers.utils.parseUnits(this.amount, 18),
          { value: ethers.utils.parseEther(this.amount) },
        ];
      } else {
        parmas = [
          this.$store.state.tokenShop,
          tokenShopAbi,
          "swap",
          this.poolInfo.id,
          ethers.utils.parseUnits(this.amount, 18),
        ];
      }

      this.buyLoding = true;
      getWriteContract(...parmas)
        .then((res) => {
          console.log(res, res);
          this.buyLoding = false;
          this.trade({
            pool_id: Number(this.poolInfo.id),
            address: this.address,
            a_amount: String(this.amount),
            b_amount: String(this.amount * this.poolInfo.exchangeRate),
            spend_txid: res.hash,
            order_type: 0,
          });
        })
        .catch((err) => {
          console.log(err);
          this.buyLoding = false;
        });
    },
    getStatus(type) {
      switch (type) {
        case "0":
          return this.$t("poolDetail.projectTypes.joint");
        case "1":
          return this.$t("poolDetail.projectTypes.single");
        case "2":
          return this.$t("poolDetail.projectTypes.marketMaking");
      }
    },
    getRecordList() {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/meme_orders", {
          address: this.$store.state.address,
        })
        .then((res) => {
          this.orders = res?.data?.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    trade({ pool_id, address, a_amount, b_amount, spend_txid, order_type }) {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/meme_trade", {
          pool_id,
          address,
          a_amount,
          b_amount,
          spend_txid,
          order_type,
        })
        .then((res) => {
          console.log("res", res);
          this.getRecordList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOrderStatus(status) {
      switch (status) {
        case 0:
          return this.$t("poolDetail.statusTypes.new");
        case 1:
          return this.$t("poolDetail.statusTypes.processing");
        case 2:
          return this.$t("poolDetail.statusTypes.completed");
      }
    },
  },
  watch: {
    amount(value) {
      if (this.activeTab === "buy") {
        this.getAmount = value * this.poolInfo.exchangeRate;
      } else {
        this.getAmount = ((value * 0.96) / this.poolInfo.exchangeRate).toFixed(
          6
        );
      }
    },
    activeTab() {
      this.amount = "";
      if (
        (this.activeTab === "buy" && this.poolInfo.token !== "BNB") ||
        this.activeTab === "redeem"
      ) {
        this.getAllowance();
      }
    },
  },
};
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: #ffc519;
}
</style>
