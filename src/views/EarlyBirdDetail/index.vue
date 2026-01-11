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

    <div class="flex flex-col gap-4 mt-10 px-4 text-[12px] text-[#000]">
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="font-bold text-[14px]">{{ $t("poolDetail.buy") }}</div>
          <div class="text-right mb-1">
            {{ $t("poolDetail.balance") }}：{{ balance }} SOS
          </div>
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
              @blur="validateAmount"
            />
            <span>SOS</span>
          </div>
        </div>
      </div>

      <div class="flex justify-between gap-2">
        <button
          class="flex-1 py-2 rounded-lg bg-[#F6F6F6] font-bold"
          @click="changeAmount(100)"
        >
          100
        </button>
        <button
          class="flex-1 py-2 rounded-lg bg-[#F6F6F6] font-bold"
          @click="changeAmount(200)"
        >
          200
        </button>
        <button
          class="flex-1 py-2 rounded-lg bg-[#F6F6F6] font-bold"
          @click="changeAmount(500)"
        >
          500
        </button>
        <button
          class="flex-1 py-2 rounded-lg bg-[#F6F6F6] font-bold"
          @click="changeAmount(1000)"
        >
          1000
        </button>
      </div>
    </div>
    <div class="mx-4 mt-4">
      <div>
        <van-button
          class="w-full h-[40px] !bg-[#FFCF02] text-[12px] font-bold rounded-xl !border-0"
          @click="handleBuy"
          :loading="buyLoding"
          :disabled="amount * 1 == 0 || this.balance * 1 < this.amount * 1"
        >
          {{ $t("poolDetail.buyToken") }}
        </van-button>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="mx-4 my-6">
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold text-left text-[14px]">
          {{ $t("poolDetail.allOrders") }}
        </div>
        <div class="flex items-center text-[12px] gap-2">
          <span>{{ $t("poolDetail.onlyMe") }}</span>
          <van-switch
            v-model="onlyMe"
            size="16px"
            active-color="#ffc519"
            inactive-color="#dcdee0"
            @change="getRecordList"
          />
        </div>
      </div>
      <van-empty v-if="!orders.length" :description="$t('poolDetail.noData')" />
      <div
        class="bg-white py-4 border-0 border-b border-solid border-[#EFEFEF]"
        v-for="order in orders"
        :key="order.order_id"
      >
        <div class="flex flex-col gap-4 text-[12px]">
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.orders.orderId")
            }}</span>
            <span class="text-black">{{ order.order_id }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.orders.address")
            }}</span>
            <span class="text-black">{{ shortStr(order.address) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.orders.token")
            }}</span>
            <span class="text-black">{{ shortStr(order.token) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.orders.spendAmount")
            }}</span>
            <span class="text-black"
              >{{ (order.a_amount * 10 ** -18).toFixed(0) }} SOS</span
            >
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
          <div class="flex items-center justify-between">
            <span class="text-[rgba(0,0,0,0.5)]">{{
              $t("poolDetail.orders.time")
            }}</span>
            <span class="text-black">{{
              dayjs(order.updated_at).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
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

Decimal.set({ precision: 30 });

import { showToast } from "vant";

export default {
  data() {
    return {
      orders: [],
      poolInfo: "",
      amount: "",
      getAmount: "",
      balance: "",
      address: this.$store.state.address,
      buyLoding: false,
      rate: 0,
      onlyMe: false,
    };
  },
  async created() {
    this.poolInfo = this.$route.query;
    this.getRecordList();
    this.getBalance();
  },
  methods: {
    shortStr,
    dayjs,
    getBNBBalance,
    async getBalance() {
      getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "balanceOf",
        this.address
      ).then((res) => {
        this.balance = truncateTo6Decimals(ethers.utils.formatUnits(res, 18));
      });
    },

    changeAmount(amount) {
      this.amount = amount;
    },
    validateAmount() {
      if (this.amount % 100 !== 0) {
        showToast(this.$t("poolDetail.inputMultipleOf100"));
        this.amount = Math.floor(this.amount / 100) * 100;
      }
    },
    async handleBuy() {
      this.buyLoding = true;

      console.log(
        "321321321",
        ethers.utils.parseUnits(String(this.amount), 18)
      );

      getWriteContract(
        this.$store.state.sBtc,
        erc20ABI,
        "transfer",
        "0x4B67cBb5898fEC8A1dAAa14F778d6438396FF1dA",
        ethers.utils.parseUnits(String(this.amount), 18)
      )
        .then((res) => {
          console.log(res, res);
          this.buyLoding = false;
          this.trade({
            pool_id: Number(this.poolInfo.id),
            address: this.address,
            token: this.poolInfo.contract,
            spent_amount: String(this.amount * 10 ** 18),
            spend_txid: res.hash,
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
      const params = {
        token: this.poolInfo.contract,
      };
      if (this.onlyMe) {
        params.address = this.address;
      }
      this.$axios
        .post(
          "https://smartbtc.io/bridge/kol/project_private_fund_list",
          params
        )
        .then((res) => {
          this.orders = res?.data?.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    trade({ pool_id, address, token, spent_amount, spend_txid }) {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/project_private_fund", {
          pool_id,
          address,
          token,
          spent_amount,
          spend_txid,
        })
        .then((res) => {
          console.log("res", res);
          this.getRecordList();
          this.getBalance();
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
      this.getAmount = value * this.poolInfo.exchangeRate;
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
