<template>
  <div class="mt-12">
    <div class="text-left flex flex-col gap-3">
      <div>{{ $t("home.dispositNumber") }}</div>
      <div class="bg-[#F6F6F6] h-[40px] flex items-center px-4 gap-2">
        <span class="text-[20px]">{{ activeAmount }}</span>
        <span>SOS</span>
      </div>
      <div class="text-[#D90007] text-[12px]">
        {{ $t("home.dispositDesc") }}
      </div>
      <van-button
        class="w-full h-[40px] !border-0 !bg-[#FFCF02]"
        :disabled="!(activeAmount * 1)"
        :loading="quitKolLoading"
        @click="quitKol(item)"
        >{{ $t("home.liftDisposit") }}</van-button
      >
    </div>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { showToast, showConfirmDialog } from "vant";

import depositAbi from "../abi/deposit.json";
import kolAbi from "../abi/kol.json";
import { getContract, getWriteContractLoad } from "../utils/contract";

export default {
  name: "deposite",
  props: ["updateActiveAmount"],
  data() {
    return {
      activeAmount: "--",
      sBtcBalance: "--",
      quitKolLoading: false,
      accountInfo: "",
    };
  },
  created() {
    this.getActiveAmount();
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/query_kol", {
          address: this.$store.state.address,
        })
        .then((res) => {
          this.accountInfo = res.data.data;
        })
        .catch((err) => {
          this.accountInfo = "";
          console.log(err);
        });
    },
    async getActiveAmount() {
      const res = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      this.activeAmount = (ethers.utils.formatUnits(res, 18) * 1).toFixed(2);
      this.$store.commit(
        "setActiveAmount",
        (ethers.utils.formatUnits(res, 18) * 1).toFixed(2)
      );
    },
    async quitKol() {
      showConfirmDialog({
        title: `${this.$t("home.unstake")}`,
        message: `${this.$t("home.unstakeDesc")}`,
        confirmButtonText: this.$t("sure"),
        cancelButtonText: this.$t("cancel"),
      })
        .then(async () => {
          this.quitKolLoading = true;

          const tokenId = await getContract(
            this.$store.state.kolAddress,
            kolAbi,
            "getTokenRatiosIndexByProjectName",
            this.accountInfo.project_name
          );
          console.log("tokenId.toString()", tokenId.toString());

          getWriteContractLoad(
            this.$store.state.kolAddress,
            kolAbi,
            "quitKol",
            tokenId.toString()
          )
            .then((res) => {
              console.log(res);
              this.quitKolLoading = false;
              showToast("退出KOL成功");
              this.getActiveAmount();
              this.updateActiveAmount();
            })
            .catch(() => {
              this.quitKolLoading = false;
            });
        })
        .catch(() => {
          this.quitKolLoading = false;
        });
    },
  },
};
</script>
