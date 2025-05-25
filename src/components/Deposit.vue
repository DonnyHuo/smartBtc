<template>
  <div class="mt-6">
    <div class="text-left">{{ $t("kol.balance") }}：{{ sBtcBalance }} SOS</div>
    <div
      class="w-full flex items-center justify-between border border-solid border-[#A1A1A1] px-4 h-[40px] rounded-[4px] mt-3"
    >
      <input
        v-model="depositAmount"
        type="text"
        :placeholder="`${$t('kol.inputNumber')} >= ${activeItem.value} SOS`"
        @change="changeDepositAmount"
        class="w-full"
      />

      <button size="small" class="flex-shrink-0" @click="maxFun">
        {{ $t("kol.max") }}
      </button>
    </div>
    <div class="flex flex-col gap-2 mt-4">
      <div
        v-for="(item, index) in selectItems"
        :key="index"
        class="flex items-center px-4 pr-16 border border-solid border-[#A1A1A1] rounded-[4px] h-[36px] justify-between text-[14px] relative"
        @click="changeSelect(item)"
      >
        <span>{{ item.name }}</span>
        <span>质押数 ≥ {{ item.value }} SOS</span>

        <img
          v-if="item.name == activeItem.name"
          src="../assets/img/selected.png"
          class="w-[16px] absolute right-4 top-2"
          alt=""
        />
      </div>
    </div>
    <van-button
      v-if="!allowance"
      :loading="approveLoading"
      class="h-[40px] !mt-[20px] w-full !bg-[#FFC519] !border-0"
      @click="approveActive()"
      >{{ $t("kol.approve") }}</van-button
    >
    <van-button
      v-else
      :loading="activeLoading"
      class="h-[40px] !mt-[20px] w-full !bg-[#FFC519] !border-0"
      @click="userDeposit()"
      >{{ $t("kol.desposit") }}</van-button
    >
  </div>
</template>
<script>
import { ethers } from "ethers";
import { showToast } from "vant";

import depositAbi from "../abi/deposit.json";
import erc20ABI from "../abi/erc20.json";
import { getContract, getWriteContractLoad } from "../utils/contract";

export default {
  name: "deposit",
  props: ["updateActiveAmount"],
  data() {
    return {
      sBtcBalance: 0,
      approveLoading: false,
      depositAmount: "",
      sBtcDecimals: "",
      allowance: 0,
      minDeposit: 2100,
      activeLoading: false,
      activeItem: {
        name: "联合KOL",
        value: 1,
      },
      selectItems: [
        {
          name: "联合KOL",
          value: 1,
        },
        {
          name: "单一KOL模式",
          value: 10000,
        },
        {
          name: "铭文做市",
          value: 2100,
        },
      ],
    };
  },
  created() {
    this.getBalance();
    this.getActiveAmount();
  },
  methods: {
    changeSelect(item) {
      this.activeItem = item;
    },
    async getBalance() {
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      this.sBtcDecimals = decimals.toString();
      const balance = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      );
      this.sBtcBalance = ethers.utils.formatUnits(balance, decimals) * 1;
    },

    async getActiveAmount() {
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      const res = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      this.activeAmount = ethers.utils.formatUnits(res, decimals) * 1;

      const allowance = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "allowance",
        this.$store.state.address,
        this.$store.state.pledgeAddress
      );
      this.allowance = allowance.toString() * 1;
    },

    approveActive() {
      this.approveLoading = true;
      getWriteContractLoad(
        this.$store.state.sBtc,
        erc20ABI,
        "approve",
        this.$store.state.pledgeAddress,
        ethers.constants.MaxUint256
      )
        .then((res) => {
          console.log(res);
          this.approveLoading = false;
          this.getActiveAmount();
        })
        .catch((err) => {
          console.log(err);
          this.approveLoading = false;
        });
    },
    maxFun() {
      this.depositAmount = this.sBtcBalance;
    },

    changeDepositAmount(e) {
      this.depositAmount = e.target.value;
    },

    async minDepositFun() {
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      const minDeposit = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "minDeposit"
      );
      this.minDeposit = ethers.utils.formatUnits(minDeposit, decimals) * 1;
    },
    userDeposit() {
      if (this.depositAmount * 1 < this.activeItem.value * 1) {
        return showToast(
          `${this.$t("kol.tips[4]", { name: this.activeItem.value })}`
        );
      }
      if (this.depositAmount * 1 > this.sBtcBalance * 1) {
        return showToast(this.$t("noBalance"));
      }

      this.activeLoading = true;

      console.log(
        this.$store.state.pledgeAddress,
        depositAbi,
        ethers.utils.parseUnits(
          this.depositAmount.toString(),
          this.sBtcDecimals
        )
      );

      getWriteContractLoad(
        this.$store.state.pledgeAddress,
        depositAbi,
        "userDeposit",
        ethers.utils.parseUnits(
          this.depositAmount.toString(),
          this.sBtcDecimals
        )
      )
        .then((res) => {
          console.log("res", res);
          this.activeLoading = false;
          this.activeModal = false;
          showToast(this.$t("stakeSuccess"));
          this.getActiveAmount();
          this.updateActiveAmount();
        })
        .catch(() => {
          this.activeLoading = false;
        });
    },
  },
};
</script>
