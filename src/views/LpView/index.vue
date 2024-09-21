<template>
  <div class="lp">
    <div class="content">
      <LpHeader />
      <div class="searchBox">
        <img class="searchIcon" src="../../assets//img/searchB.png" alt="" />
        <input v-model="searchValue" type="text" placeholder="请输入名称搜索" />
      </div>
      <div class="lpListBox">
        <div v-if="viewList.length > 0">
          <div v-for="(list, index) in viewList" class="lpList">
            <div :key="index" class="lpName">
              <img :src="realIconLogo(list.lpTokenName)" />
              <span>{{ list.lpTokenName }}</span>
              <div
                class="font-medium text-[14px]"
                @click="goToDetail(list.index)"
              >
                去挖矿
              </div>
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
      searchValue: "",
      filterList: [],
    };
  },
  components: { LpHeader },
  computed: {
    viewList() {
      return this.searchValue ? this.filterList : this.poolList;
    },
  },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.getPoolsCount();
    }
  },
  mounted() {
    const poolList = localStorage.getItem("poolList");
    if (poolList) {
      this.poolList = JSON.parse(poolList);
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
        const poolList = [];
        for (let i = 0; i < this.poolsCount; i++) {
          poolList.push(await this.poolInfoLists(i));
        }
        this.poolList = poolList;

        localStorage.setItem("poolList", JSON.stringify(poolList));
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
        totalBalance: (
          ethers.utils.formatUnits(res.totalBalance, 18) * price
        ).toFixed(6),
        lpTokenName: res.lpTokenName,
        lpToken: res.lpToken,
        index: index,
      };
      return newArr;
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
  watch: {
    searchValue(value) {
      const filterList = this.poolList.filter((list) =>
        list.lpTokenName.toUpperCase().includes(value.toUpperCase())
      );
      this.filterList = filterList;
    },
  },
};
</script>
<style scoped lang="scss">
.lp {
  padding-top: 20px;
}
.searchBox {
  width: 90%;
  height: 50px;
  padding: 20px;
  font-size: 14px;
  margin: 10px auto;
  box-shadow: 0 3px 6px #cfcece;
  background-color: #fff;
  border-radius: 10px;
  text-align: left;
  display: flex;
  align-items: center;
  .searchIcon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
}
.content {
  border-bottom: 1px solid transparent;
}
.lpListBox {
  width: 90%;
  margin: 0 auto 20px auto;
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
      }
      > div {
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
      }
    }
  }
  .nodata {
    margin-top: 100px;
  }
}
</style>
