<template>
  <div class="bg-white min-h-full p-[20px]">
    <div class="flex justify-end">
      <div
        v-if="address"
        class="flex items-center gap-1"
        @click="copyAddress($store.state.address)"
      >
        <span class="text-[14px]">{{ shortStr(address) }}</span>
        <img class="w-[14px] h-[14px]" src="../../assets/img/copy.png" alt="" />
      </div>
      <van-button v-else size="small" class="" @click="connectWallet"
        >链接钱包</van-button
      >
    </div>
    <div class="text-left text-[16px] font-medium">Lp兑换合约</div>
    <div
      class="text-left text-[14px] flex items-center justify-between mt-[20px] py-[10px] text-[#333] font-medium"
    >
      Lp余额领取
    </div>
    <div class="bg-[#f5f5f5] px-[10px] py-[10px] rounded-xl">
      <div v-for="(item, index) in exchangePairs">
        <div :key="index" class="flex items-center justify-between py-[10px]">
          <div class="text-[14px] text-[#111]">
            {{ item.disPlayName }}
          </div>
          <span>{{ Number(item.lpTokenBalance || 0).toFixed(2) }}</span>
          <van-button
            size="small"
            class="!bg-[#ffc519] !text-[#333] !h-[25px] !border-none"
            @click="claimFun(item)"
            :loading="loadingIndex == item.id"
            >提取</van-button
          >
        </div>
      </div>
    </div>

    <!-- <van-action-sheet v-model:show="showCoin" :title="`${$t('lpSwap.select')}`">
      <div class="content">
        <div v-if="exchangeTokens.length > 0">
          <div
            v-for="(list, index) in selectToken"
            :key="index"
            class="py-[10px] px-[20px]"
            @click="onSelectCoin(list)"
          >
            <span
              :class="`${
                list.name == selectToken.name && 'text-[#ffc519]'
              } flex items-center gap-1`"
            >
              <img
                class="w-[20px] h-[20px]"
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
    </van-action-sheet> -->
  </div>
</template>
<script>
import {
  connectWallet,
  shortStr,
  copy,
  getContract,
  getWriteContractLoad,
} from "@/utils";
import { showToast } from "vant";
import lpExchangeABI from "../../abi/lpExchange.json";
import erc20Abi from "../../abi/erc20.json";
import { message } from "ant-design-vue";
import { ethers } from "ethers";

export default {
  name: "manage",
  data() {
    return {
      showCoin: false,
      address: this.$store.state.address,
      selectPair: {},
      exchangePairs: [],
      loadingIndex: -1,
      owner: "",
    };
  },
  mounted() {
    this.getChangeList();
    this.getOwner();
  },
  methods: {
    connectWallet,
    shortStr,
    onSelect(item) {
      this.show = false;
      this.showItem = item.name;
    },
    claimFun() {
      console.log("321321");
    },
    copyAddress(msg) {
      copy(msg);
      showToast("複製成功");
    },
    onSelectCoin(list) {
      this.selectToken = list;
      this.showCoin = false;
    },

    async getOwner() {
      const owner = await getContract(
        this.$store.state.lpExchange,
        lpExchangeABI,
        "owner"
      );
      this.owner = owner;
    },

    async getChangeList() {
      const getPairs = await getContract(
        this.$store.state.lpExchange,
        lpExchangeABI,
        "getPairsCount"
      );

      const getPairsCount = getPairs.toString();
      console.log("getPairsCount", getPairsCount);
      const pairsInfo = [];

      for (let i = 0; i < getPairsCount; i++) {
        const getPairs = await getContract(
          this.$store.state.lpExchange,
          lpExchangeABI,
          "pairs",
          i
        );
        const pairInfo = {
          id: i,
          baseTokenIsToken0: getPairs.baseTokenIsToken0,
          changeToken: getPairs.changeToken,
          disPlayName: getPairs.disPlayNmae,
          isOpen: getPairs.isOpen,
          lpToken: getPairs.lpToken,
          pairName: getPairs.pairName,
          rate: getPairs.rate.toString(),
          lpTokenBalance: await this.getBalance(getPairs.lpToken),
        };
        pairsInfo.push(pairInfo);
      }
      console.log("pairsInfo", pairsInfo);

      if (pairsInfo?.length > 0) {
        this.selectPair = pairsInfo[0];
        this.exchangePairs = pairsInfo;
      }
    },

    async getBalance(lpToken) {
      const getPairs = await getContract(
        lpToken,
        erc20Abi,
        "balanceOf",
        this.$store.state.lpExchange
      );
      return ethers.utils.formatUnits(getPairs, 18);
    },
    async claimFun(list) {
      if (this.owner.toLocaleLowerCase() !== this.address.toLocaleLowerCase()) {
        return message.error("你不是owner");
      }
      this.loadingIndex = list.id;
      await getWriteContractLoad(
        this.$store.state.lpExchange,
        lpExchangeABI,
        "withdrawLpToken",
        list.id
      )
        .then((res) => {
          console.log(res);
          this.loadingIndex = -1;
          message.success("提取成功");
        })
        .catch((err) => {
          console.log(err);
          this.loadingIndex = -1;
        });
    },
  },
};
</script>
