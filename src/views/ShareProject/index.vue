<template>
  <div class="bg-white min-h-full">
    <div
      class="flex items-center justify-between py-[20px] pb-0 gap-5 text-[14px]"
    >
      <div class="flex items-center gap-2">
        <span>{{ $t("newData.marketCap") }}</span>
        <span @click="sortFun">
          <div class="flex flex-col gap-[2px]">
            <div
              class="triangle-up"
              :class="
                sort === 'asc' ? '!border-b-[#000]' : '!border-b-[#757575]'
              "
            ></div>
            <div
              class="triangle-down"
              :class="
                sort === 'desc' ? '!border-t-[#000]' : '!border-t-[#757575]'
              "
            ></div>
          </div>
        </span>
      </div>
      <div>
        <input
          class="border border-solid border-[#999] px-3 py-2 rounded-3xl text-[12px]"
          type="text"
          v-model="searchValue"
          :placeholder="$t('newData.search')"
          @change="searchValueFun"
        />
      </div>
      <!-- <div v-if="page">
        <van-button
          class="!bg-[#FCD434] !border-0 !rounded-xl text-[#000]"
          size="small"
          @click="goTokol"
          >{{ $t("kol.startPro") }}</van-button
        >
      </div> -->
    </div>
    <div v-if="loading" class="h-[400px] flex items-center justify-center">
      <van-loading />
    </div>
    <div v-if="searchList.length">
      <div v-for="(list, index) in searchList">
        <div
          :key="index"
          class="py-[20px] text-left border-0 border-b border-solid border-[#AAAAAA]"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <img
                  class="w-[30px] h-[30px] rounded-full"
                  :src="
                    list.logo_url ||
                    require('../../assets/img/tokenList/brc20-100t.png')
                  "
                  alt=""
                />
                <div>{{ list.symbol }}</div>
              </div>
              <div class="text-[#757575] text-[12px] mt-1">
                {{ $t("newData.marketCap") }}: ${{
                  Number(list.total_supply * list.lastPrice).toFixed(0)
                }}
              </div>
            </div>
            <div>${{ Number(list.lastPrice).toFixed(6) }}</div>
          </div>
          <div class="flex items-center gap-3 my-3 text-[12px]">
            <a
              class="bg-[#f5f5f5] p-1 rounded-[4px] flex items-center gap-1"
              :href="list.twitter_account"
            >
              <img
                class="w-3"
                :src="require('@/assets/img/twiter.png')"
                alt=""
              />
              <span>Twitter</span>
            </a>
            <a
              class="bg-[#f5f5f5] p-1 rounded-[4px] flex items-center gap-1"
              :href="list.tg_account"
            >
              <img
                class="w-3"
                :src="require('@/assets/img/tgBlue.png')"
                alt=""
              />
              <span>{{ $t("shareProject.social.telegram") }}</span>
            </a>
            <div class="bg-[#f5f5f5] p-1 rounded-[4px]">
              {{
                list.project_type === 2
                  ? $t("shareProject.projectTypes.marketMaking")
                  : list.project_type === 0
                  ? $t("shareProject.projectTypes.joint")
                  : $t("shareProject.projectTypes.single")
              }}
            </div>
            <div v-if="!list.details" class="ml-auto">
              <button
                v-if="!page"
                class="flex-shrink-0 bg-[#FCD434] text-black text-[12px] rounded-2xl py-2 px-3"
                @click="copyAddress(list.contract_addr)"
              >
                {{ $t("newData.copy") }}
              </button>
              <button
                v-else
                class="flex-shrink-0 bg-[#FCD434] text-black text-[12px] rounded-2xl py-2 px-3"
                @click="clickItem(list)"
              >
                {{ $t("newData.approve") }}
              </button>
            </div>
          </div>
          <div
            v-if="list.details"
            class="flex items-center justify-between gap-5"
          >
            <div class="text-[#757575] text-[12px] text-left">
              {{ list.details }}
            </div>
            <button
              v-if="!page"
              class="flex-shrink-0 bg-[#FCD434] text-black text-[12px] rounded-2xl py-2 px-3"
              @click="copyAddress(list.contract_addr)"
            >
              {{ $t("newData.copy") }}
            </button>
            <button
              v-else
              class="flex-shrink-0 bg-[#FCD434] text-black text-[12px] rounded-2xl py-2 px-3"
              @click="clickItem(list)"
            >
              {{ $t("newData.approve") }}
            </button>
          </div>
          <div
            v-if="[0, 1].includes(list.project_type)"
            class="text-[14px] flex items-center justify-between mt-2"
          >
            <span>
              <span class="text-[#141414]">{{
                $t("shareProject.fairLaunch")
              }}</span>
              <span class="text-[#757575]">
                1{{ list.display_name?.split("-")[0] }} = {{ list.exchange_rate
                }}{{ list.symbol }}</span
              ></span
            >
            <div class="flex items-center gap-2">
              <button
                class="flex-shrink-0 text-black text-[12px] rounded-2xl py-2 px-3 border border-solid border-[#333]"
                @click="goToDetail(list, 'goToDetail')"
              >
                {{ $t("shareProject.buyNow") }}
              </button>
              <button
                class="flex-shrink-0 text-black text-[12px] rounded-2xl py-2 px-3 border border-solid border-[#333]"
                @click="goToDetail(list, 'earlyBird')"
              >
                {{ $t("shareProject.earlyBird") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!searchList.length && !loading"
      class="h-[400px] flex items-center justify-center"
    >
      {{ $t("newData.noData") }}
    </div>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { showToast } from "vant";

import { copy } from "@/utils/index";

export default {
  name: "shareProject",
  props: ["page", "activeAmount"],
  data() {
    return {
      searchValue: "",
      projectIssuedList: [],
      searchList: [],
      loading: false,
      sort: "desc",
    };
  },
  created() {
    this.getProjectIssuedList();
    console.log("page", this.page);
  },
  methods: {
    goToDetail(list, type) {
      this.$router.push({
        path: type === "goToDetail" ? "/poolDetail" : "/earlyBirdDetail",
        query: {
          id: list.mint_pool_id,
          symbol: list.symbol,
          maxValue: Number(
            ethers.utils.formatUnits(
              type === "goToDetail"
                ? list.mint_process_percent.split(",")[0]
                : list.airdrop_process_percent.split(",")[0],
              18
            )
          ),
          processPercent:
            type === "goToDetail"
              ? list.mint_process_percent.split(",")[1]
              : list.airdrop_process_percent.split(",")[1],
          type: list.project_type,
          contract: list.contract_addr,
          token: list.display_name.split("-")[0],
          createTime: list.mint_pool_create_time,
          exchangeRate: list.exchange_rate,
          coinMintToken: list.coin_mint_token,
          logoUrl: list.logo_url,
        },
      });
    },
    goTokol() {
      if (this.activeAmount) {
        this.router.push("/kolAdd");
      } else {
        showToast(this.$t("kol.desposit"));
      }
    },
    clickItem(item) {
      this.$emit("clickItemFun", item);
    },
    copyAddress(msg) {
      copy(msg);
      showToast(this.$t("copySuccess"));
    },
    searchValueFun(e) {
      this.searchValue = e.target.value;
    },
    getProjectIssuedList() {
      this.loading = true;
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_issued_list")
        .then(async (res) => {
          if (res.data.data.length > 0) {
            this.projectIssuedList = res.data.data;
            this.searchList = this.projectIssuedList;
            // if ([4, 5].includes(this.accountInfo.status)) {
            //   const reserveInfo = this.projectIssuedList.filter(
            //     (list) => list.project_name == this.accountInfo.project_name
            //   );
            //   this.reserveInfo = reserveInfo[0];
            // }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    sortFun() {
      if (this.sort == "desc") {
        this.searchList.sort(
          (a, b) =>
            Number(a.total_supply * a.lastPrice) -
            Number(b.total_supply * b.lastPrice)
        );
        this.sort = "asc";
      } else {
        this.searchList.sort(
          (a, b) =>
            Number(b.total_supply * b.lastPrice) -
            Number(a.total_supply * a.lastPrice)
        );
        this.sort = "desc";
      }
    },
  },
  watch: {
    searchValue(value) {
      if (value !== "") {
        this.searchList = this.projectIssuedList.filter((item) =>
          item.symbol.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.searchList = this.projectIssuedList;
      }
    },
  },
};
</script>
<style lang="scss">
.triangle-up {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid red;
}
.triangle-down {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #000;
}
</style>
