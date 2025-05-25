<template>
  <div class="flex flex-col gap-4 p-4 bg-[#F8FCFF] text-black text-[14px]">
    <div class="flex items-center justify-between">
      <div>{{ reserveInfo?.name }}</div>
      <div>{{ reserveBalance }} {{ reserveInfo?.symbol }}</div>
    </div>
    <div class="flex items-center justify-between">
      <div>
        {{ $t("home.revenueCollected") }}： {{ viewCanWithdrawValue }}
        {{ reserveInfo?.symbol }}
      </div>
      <van-button
        size="small"
        :loading="withdrawLoading"
        @click="withdraw()"
        :disabled="!(viewCanWithdrawValue * 1)"
      >
        {{ $t("home.receiveBenefits") }}</van-button
      >
    </div>
    <div class="flex items-center justify-between">
      <div>{{ $t("home.crossChainProgress") }}</div>
      <div>{{ crossProgressValue }} %</div>
    </div>
    <div class="flex items-center justify-between">
      <div>{{ $t("home.LpProgress") }}</div>
      <div>{{ lpExProgressValue }} %</div>
    </div>
    <div v-if="kolProgressValue" class="flex items-center justify-between">
      <div>{{ $t("home.KOLProgress") }}</div>
      <div>{{ kolProgressValue }} %</div>
    </div>
    <div class="text-[12px] text-black text-left leading-6">
      {{ $t("home.progressDesc") }}
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";

import erc20ABI from "../abi/erc20.json";
import kolAbi from "../abi/kol.json";
import { getContract, getWriteContract } from "../utils/contract";

export default {
  name: "myProject",
  data() {
    return {
      accountInfo: "",
      crossProgressValue: "",
      lpExProgressValue: "",
      kolProgressValue: "",
      reserveInfo: {},
    };
  },
  created() {
    this.getInfo();
    this.getProjectIssuedList();
  },
  methods: {
    getInfo() {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/query_kol", {
          address: this.$store.state.address,
        })
        .then((res) => {
          this.accountInfo = res.data.data;
          this.$store.commit("setAccountInfoStatus", this.accountInfo.status);
        })
        .catch((err) => {
          this.accountInfo = "";
          console.log(err);
        });
    },
    getProjectIssuedList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_issued_list")
        .then(async (res) => {
          if (res.data.data.length > 0) {
            this.projectIssuedList = res.data.data;
            if ([4, 5].includes(this.accountInfo.status)) {
              const reserveInfo = this.projectIssuedList.filter(
                (list) => list.project_name == this.accountInfo.project_name
              );
              this.reserveInfo = reserveInfo[0];
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getReserveBalance() {
      const decimals = await getContract(
        this.reserveInfo.contract_addr,
        erc20ABI,
        "decimals"
      );
      const balanceOf = await getContract(
        this.reserveInfo.contract_addr,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      );
      this.reserveBalance = (
        ethers.utils.formatUnits(balanceOf, decimals) * 1
      ).toFixed(2);
    },
    async getWithdraw() {
      const tokenId = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getTokenRatiosIndexByProjectName",
        this.accountInfo.project_name
      );

      this.tokenId = tokenId.toString();

      const viewCanWithdrawValue = await getWriteContract(
        this.$store.state.kolAddress,
        kolAbi,
        "viewCanWithdrawValue",
        tokenId.toString()
      );

      this.viewCanWithdrawValue = (
        ethers.utils.formatUnits(viewCanWithdrawValue, 18) * 1
      ).toFixed(2);

      const crossProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getCrossProgress",
        tokenId.toString()
      );
      console.log("crossProgress", crossProgress);

      const lpExProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getLpExProgress",
        tokenId.toString()
      );
      this.crossProgressValue = ((crossProgress.toString() * 1) / 100).toFixed(
        2
      );
      this.lpExProgressValue = ((lpExProgress.toString() * 1) / 100).toFixed(2);

      if (this.reserveInfo.name !== "SOS") {
        const kolProgress = await getContract(
          this.$store.state.kolAddress,
          kolAbi,
          "getKolProgress",
          tokenId.toString()
        );
        this.kolProgressValue = ((kolProgress.toString() * 1) / 100).toFixed(2);
      } else {
        this.kolProgressValue = "";
      }
    },
  },
  watch: {
    reserveInfo(value) {
      value && this.getWithdraw();
      value && this.getReserveBalance();
    },
  },
};
</script>
