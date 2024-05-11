<template>
  <div class="lp">
    <div class="content">
      <LpHeader />
      <div class="lpListBox">
        <div v-if="poolList.length > 0">
          <div v-for="(list, index) in poolList" class="lpList">
            <div :key="index" class="lpName">
              <img :src="realIconLogo(list.lpTokenName)" />
              <span>{{ list.lpTokenName }}</span>
              <div @click="goToDetail(index)">去質押</div>
            </div>
            <div class="totalBalance">
              <div>管理規模</div>
              <div class="realNumber">$ {{ list.totalBalance }}</div>
            </div>
          </div>
        </div>
        <div class="nodata" v-else>
          <van-loading></van-loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import LpHeader from "./LpHeader.vue";
import { getContract, getOkChainId, realIconLogo } from "../../utils";
import poolABI from "../../abi/pool.json";

export default {
  name: "LpView",
  data() {
    return {
      poolList: [],
      poolsCount: 0,
    };
  },
  components: { LpHeader },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.getPoolsCount();
    }
  },
  methods: {
    realIconLogo,
    goToDetail(index) {
      this.$router.push({ path: "/lpDetail", query: { index } });
    },
    async getPoolsCount() {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getPoolsCount"
      ).catch((err) => console.log(err));
      this.poolsCount = res.toString() * 1;
      if (this.poolsCount) {
        for (let i = 0; i < this.poolsCount; i++) {
          await this.poolInfoLists(i);
        }
      }
    },
    async poolInfoLists(index) {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "poolInfoList",
        index
      ).catch((err) => console.log(err));
      const price = await this.getLpPrice(index);
      const newArr = {
        totalBalance: (ethers.utils.formatUnits(res.totalBalance, 18) * price).toFixed(6),
        lpTokenName: res.lpTokenName,
        lpToken: res.lpToken,
      };
      this.poolList.push(newArr);
    },
    async getLpPrice(index) {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getLpPrice",
        index
      ).catch((err) => console.log(err));
      return ethers.utils.formatUnits(res, this.$store.state.usdtDecimals);
    },
  },
};
</script>
<style scoped lang="scss">
.lp {
  height: 100vh;
  padding-top: 20px;
  overflow: auto;
}
.content {
  border-bottom: 1px solid transparent;
}
.lpListBox {
  width: 90%;
  margin: 0 auto 100px auto;
  .lpList {
    width: 100%;
    background: #fff;
    background-size: 100% 100%;
    box-shadow: 0 3px 6px #cfcece;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    font-size: 12px;
    margin-top: 20px;
    .lpName {
      border-bottom: 1px solid #eeeded;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      > img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        border-radius: 50%;
      }
      > span {
        font-size: 16px;
        font-weight: 600;
      }
      > div {
        font-weight: 600;
        color: #ffc519;
        margin-left: auto;
      }
    }
    .totalBalance {
      padding-top: 20px;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      .realNumber {
        font-weight: 600;
      }
    }
  }
  .nodata {
    margin-top: 100px;
  }
}
</style>
