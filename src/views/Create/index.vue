<template>
  <div class="bg-white p-4 min-h-full">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
        <img class="w-8 h-8" src="../../assets/img/logo.png" alt="" />
        <span class="font-[600] text-black">KOLPump.Fun</span>
      </div>

      <van-popover
        v-model:show="showPopover"
        placement="bottom-end"
        :actions="actions"
        @select="changeLan"
      >
        <template #reference>
          <van-button class="!h-[30px]" type="default">{{
            value1 == "zh" ? "繁体中文" : "English"
          }}</van-button>
        </template>
      </van-popover>

      <!-- <van-dropdown-menu :overlay="false">
        <van-dropdown-item
          v-model="value1"
          :options="option1"
          @change="changeLan"
        />
      </van-dropdown-menu> -->
    </div>
    <!-- <div @click="connectWallet">
      {{ address ? shortStr(address) : "链接钱包" }}
    </div> -->
    <div>
      <div class="mt-[40px] mb-[20px]">
        <div class="">
          <span
            class="text-[30px] font-[600] bg-gradient-to-r from-[#FB8018] to-[#FEC02E] bg-clip-text text-transparent"
            >{{ $t("create.title") }}</span
          >
        </div>
      </div>
      <div class="text-[14px] font-[600]">
        {{ $t("home.influence") }}
      </div>
      <div class="mt-[40px]">
        <img src="../../assets/img/homeBg3.png" alt="" />
      </div>
    </div>
    <div>
      <Kol />
      <div class="flex items-center gap-5">
        <img
          class="w-[30px]"
          :src="
            activeAmount * 1 > 0
              ? require('../../assets/img/success.png')
              : require('../../assets/img/2.png')
          "
          alt=""
        />
        <span
          class="text-[26px] font-bold"
          :class="activeAmount * 1 > 0 ? 'text-[#E8AD00]' : 'text-[#1989FA]'"
          >{{ $t("home.stakeSOS") }}</span
        >
      </div>
      <div>
        <div v-if="activeAmount * 1 > 0">
          <Withdraw :updateActiveAmount="getActiveAmount" />
          <van-button class="w-full !mt-3" @click="goVoting">{{
            $t("home.voteList")
          }}</van-button>
        </div>
        <div v-else>
          <Deposit :updateActiveAmount="getActiveAmount" />
        </div>
      </div>
      <div class="flex items-center gap-5 mt-10">
        <img
          class="w-[30px]"
          :src="
            [4, 5].includes(accountInfo.status)
              ? require('../../assets/img/success.png')
              : require('../../assets/img/3.png')
          "
          alt=""
        />
        <span
          class="text-[26px] font-bold"
          :class="
            [4, 5].includes(accountInfo.status)
              ? 'text-[#E8AD00]'
              : 'text-[#1989FA]'
          "
          >{{ $t("home.becomeProject") }}</span
        >
      </div>
      <div class="mt-10">
        <div v-if="accountInfo.status == 2">{{ $t("home.pendingReview") }}</div>
        <div v-if="[4, 5].includes(accountInfo.status)" class="reserve">
          <MyProject />
        </div>
        <div v-else>
          <van-tabs v-model:active="active">
            <van-tab :title="$t('home.createProject')">
              <div class="mt-[20px]">
                <CreateProject />
              </div>
            </van-tab>
            <van-tab :title="$t('home.claimProject')"><ClaimList /></van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <div class="flex items-center justify-around">
        <a href="https://t.me/SmartBTCdao" target="_blank">
          <img class="w-[30px]" src="../../assets/img/telgram.png" alt="" />
        </a>
        <a href="https://twitter.com/SmartBTCdao" target="_blank">
          <img class="w-[30px]" src="../../assets/img/twiter.png" alt="" />
        </a>
        <a href="https://discord.com/invite/YHx7DXgm" target="_blank">
          <img class="w-[30px]" src="../../assets/img/discord.png" alt="" />
        </a>
      </div>
      <div class="text-[12px] mt-4">{{ $t("create.copyright") }}</div>
    </div>
  </div>
</template>
<script>
import { ethers } from "ethers";

import { shortStr } from "@/utils";

import depositAbi from "../../abi/deposit.json";
import ClaimList from "../../components/ClaimList.vue";
import CreateProject from "../../components/CreateProject.vue";
import Deposit from "../../components/Deposit.vue";
import Kol from "../../components/Kol.vue";
import MyProject from "../../components/MyProject.vue";
import Withdraw from "../../components/Withdraw.vue";
import { getContract, connectWallet } from "../../utils/contract";

export default {
  name: "Create",
  data() {
    return {
      showPopover: false,
      actions: [
        { text: "繁体中文", value: "zh" },
        { text: "English", value: "en" },
      ],
      value1: this.$store.state.lang,
      accountInfo: "",
      activeAmount: 0,
      address: this.$store.state.address,
    };
  },
  components: {
    CreateProject,
    MyProject,
    Deposit,
    Withdraw,
    Kol,
    ClaimList,
  },

  created() {
    this.getInfo();
    this.getActiveAmount();
  },
  methods: {
    goVoting() {
      this.$router.push("/voting");
    },
    shortStr,
    connectWallet,
    changeLan(value) {
      console.log("value", value);
      this.$store.commit("setLan", value.value);
      location.reload();
    },
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
  },
};
</script>
