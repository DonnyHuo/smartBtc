<template>
  <div class="mt-6">
    <div class="text-left">{{ $t("kol.balance") }}：{{ sBtcBalance }} SOS</div>
    <div
      class="w-full flex items-center justify-between border border-solid border-[#A1A1A1] px-4 h-[40px] rounded-[4px] mt-3"
    >
      <input
        v-model="depositAmount"
        type="text"
        :placeholder="`${$t('kol.inputNumber')} >= ${minDeposit} SOS`"
        @change="changeDepositAmount"
        class="w-full placeholder:text-[12px]"
      />

      <button size="small" class="flex-shrink-0" @click="maxFun">
        {{ $t("kol.max") }}
      </button>
    </div>
    <div class="text-left text-[12px] text-red-500 mt-2">
      * {{ $t("deposit.stakeNote") }}
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
      minDeposit: 100,
      activeLoading: false,
      activeItem: {
        name: "联合KOL",
        value: 100,
      },
      selectItems: [
        {
          name: this.$t("deposit.kolTypes.joint"),
          value: 100,
        },
        {
          name: this.$t("deposit.kolTypes.single"),
          value: 10000,
        },
        {
          name: this.$t("deposit.kolTypes.marketMaking"),
          value: 2100,
        },
      ],
      activeType: "joint",
    };
  },
  created() {
    this.getBalance();
    this.getAllowance();
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

    async getAllowance() {
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
          showToast(this.$t("deposit.approveSuccess"));
          this.getAllowance();
        })
        .catch((err) => {
          console.log(err);
          this.approveLoading = false;
          showToast(this.$t("deposit.approveFailed"));
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
      // 检测是否完成KOL认证
      if (this.$store.state.accountInfoStatus !== 1) {
        return showToast(this.$t("deposit.kolCertificationRequired"));
      }
      if (this.depositAmount * 1 < this.minDeposit * 1) {
        return showToast(
          `${this.$t("kol.tips[4]", { minDeposit: this.minDeposit })}`
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
          // 刷新余额
          this.getBalance();
          // 更新父组件和 store 中的质押金额
          this.updateActiveAmount();
        })
        .catch(() => {
          this.activeLoading = false;
        });
    },
  },
};
</script>
