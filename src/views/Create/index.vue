<template>
  <div class="bg-white p-4 min-h-full">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
        <img class="w-8 h-8" src="../../assets/img/logo.png" alt="" />
        <span class="font-[600] text-black">KOLPump.Fun</span>
      </div>

      <van-dropdown-menu :overlay="false">
        <van-dropdown-item
          v-model="value1"
          :options="option1"
          @change="changeLan"
        />
      </van-dropdown-menu>
    </div>
    <!-- <div @click="connectWallet">
      {{ address ? shortStr(address) : "链接钱包" }}
    </div> -->
    <div>
      <div class="mt-[40px] mb-[20px]">
        <img src="../../assets/img/title.png" alt="" />
      </div>
      <div class="text-[14px] font-[600]">
        你的影响力(KOL指数)有多大，你占项目代币的比例就有多大
      </div>
      <div class="mt-[40px]">
        <img src="../../assets/img/homeBg3.png" alt="" />
      </div>
    </div>
    <div>
      <Kol />
      <div class="flex items-center gap-5">
        <img class="w-[30px]" src="../../assets/img/2.png" alt="" />
        <span class="text-[26px] text-[#1989FA] font-bold">SOS质押</span>
      </div>
      <div>
        <div v-if="activeAmount * 1 > 0">
          <Withdraw :updateActiveAmount="getActiveAmount" />
          <van-button class="w-full !mt-3" @click="goVoting"
            >投票列表</van-button
          >
        </div>
        <div v-else>
          <Deposit :updateActiveAmount="getActiveAmount" />
        </div>
      </div>
      <div class="flex items-center gap-5 mt-10">
        <img class="w-[30px]" src="../../assets/img/3.png" alt="" />
        <span class="text-[26px] text-[#1989FA] font-bold">成为项目方</span>
      </div>
      <div class="mt-10">
        <div v-if="accountInfo.status == 2">待审核</div>
        <div v-if="[4, 5].includes(accountInfo.status)" class="reserve">
          <MyProject />
        </div>

        <div v-if="accountInfo.status == 1">
          <van-tabs v-model:active="active">
            <van-tab title="创建项目">
              <div class="mt-[20px]">
                <CreateProject />
              </div>
            </van-tab>
            <van-tab title="认领项目"><ClaimList /></van-tab>
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
      <div class="text-[12px] mt-4">©2025 KOLPump.Fun</div>
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
      option1: [
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
      this.$store.commit("setLan", value);
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
