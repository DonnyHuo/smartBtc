<template>
  <div class="withdraw-wrap-box">
    <Header :title="`${$t('withdraw.title')}`" />
    <div class="withdraw-wrap">
      <div class="warehouse-top">
        <div class="store-view">
          <div class="balance-name">100T</div>
          <div class="pay-text">
            <span class="name">{{ pendingRewards }}</span>
          </div>
          <div class="pay-usdt">
            ≈ $ <span class="name">{{ price }}</span>
          </div>
        </div>
        <div class="btn-view">
          <van-button
            :loading="pendingRewardsLoading"
            color="#ffc519"
            :class="`wallte-btn ${pendingRewards * 1 == 0 && 'disabled'}`"
            :disabled="pendingRewards * 1 == 0"
            @click="rewardFun"
            >{{ $t("withdraw.btn") }}</van-button
          >
        </div>
      </div>
      <div class="warehouse-records">
        <div class="name">
          <span>{{ $t("withdraw.history") }}</span>
          <img
            v-if="showLoading"
            @click="refreshData"
            class="refresh-btn"
            src="../../assets/img/refresh.png"
            alt=""
          />
          <van-loading v-else color="#333" size="20"></van-loading>
        </div>
        <div v-if="recordList.length > 0">
          <div v-for="(list, index) in recordList">
            <div :key="index">
              <div v-if="list.depositList.length > 0">
                <div v-for="(item, ind) in list.depositList">
                  <div class="depositList" :key="ind">
                    <div>
                      <span>{{ $t("withdraw.desc[0]") }}</span>
                      <span> {{ item.userDepositPrice }}</span>
                    </div>
                    <div>
                      <span>{{ $t("withdraw.desc[1]") }}</span>
                      <span>{{ item.startBlockNumber }}</span>
                    </div>
                    <div>
                      <span>{{ $t("withdraw.desc[2]") }}</span>
                      <span>{{ item.endBlockNumber }}</span>
                    </div>
                    <div>
                      <span>{{ $t("withdraw.desc[3]") }}</span>
                      <van-button
                        :loading="item.withdrawLoading"
                        class="minBtn"
                        size="small"
                        color="#ffc519"
                        :disabled="!(item.operateType == '1' && item.isRansom)"
                        @click="withdraw(index, ind)"
                        >{{ $t("withdraw.desc[3]") }}</van-button
                      >
                    </div>
                    <div>
                      <span>{{ $t("withdraw.desc[4]") }}</span>
                      <span> {{ item.pendingHarvestEarn }}</span>
                    </div>
                    <div>
                      <span>{{ $t("withdraw.desc[5]") }}</span>
                      <van-button
                        :loading="item.loading"
                        class="minBtn"
                        size="small"
                        color="#ffc519"
                        @click="harvestCurrentEarn(index, ind)"
                        >{{ $t("withdraw.desc[5]") }}</van-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="noData">
          <van-loading />
        </div>
        <div class="allData" v-if="allData">{{ allData }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";

import Header from "../../components/Header.vue";
import {
  getOkChainId,
  getContract,
  getWriteContractLoad,
  getBlockNumber,
} from "../../utils";
import poolABI from "../../abi/pool.json";
import { showToast } from "vant";

export default {
  name: "withdraw",
  data() {
    return {
      pendingRewards: "--",
      MTokenPrice: "--",
      price: "--",
      poolsCount: 0,
      recordList: [],
      rotate: false,
      allData: "",
      pendingRewardsLoading: false,
      showLoading: true,
    };
  },
  components: { Header },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.pendingReward();
      this.getPoolsCount();
    }
  },
  methods: {
    async pendingReward() {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "pendingReward",
        this.$store.state.address
      ).catch((err) => console.log(err));
      this.pendingRewards = (ethers.utils.formatUnits(res, 8) * 1).toFixed(8);
      this.getMTokenPrice();
    },
    async getMTokenPrice() {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getMTokenPrice"
      ).catch((err) => console.log(err));
      this.MTokenPrice = ethers.utils.formatUnits(
        res,
        this.$store.state.usdtDecimals
      );
      this.price = (this.pendingRewards * 1 * this.MTokenPrice * 1).toFixed(6);
    },
    async rewardFun() {
      const overrides = {
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("5", "gwei"),
      };
      this.pendingRewardsLoading = true;
      const res = await getWriteContractLoad(
        this.$store.state.poolAddress,
        poolABI,
        "withdrawEarnExtern",
        overrides
      )
        .then(() => {
          showToast(this.$t("withdraw.withdrawSuccess"));
          this.pendingReward();
          this.getPoolsCount();
        })
        .catch((err) => console.log(err));
      this.pendingRewardsLoading = false;
    },
    async getPoolsCount() {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getPoolsCount"
      ).catch((err) => console.log(err));
      this.poolsCount = res.toString() * 1;
      const recordLists = [];
      if (this.poolsCount) {
        for (let i = 0; i < this.poolsCount; i++) {
          const obj = await this.getDepositRecordListExternal(i);
          recordLists.push(obj);
        }
        this.recordList = recordLists;
      }
    },

    async getDepositRecordListExternal(index) {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getDepositRecordListExternal",
        this.$store.state.address,
        index
      ).catch((err) => console.log(err));

      const getList = async () => {
        return Promise.all(
          res &&
            res.map(async (list, depositRecordId) => {
              const res = await this.pendingHarvestEarn(index, depositRecordId);
              const pendingHarvestEarn = (
                ethers.utils.formatUnits(res, 8) * 1
              ).toFixed(8);
              const nowBlock = await getBlockNumber();
              return {
                userDepositPrice: (
                  ethers.utils.formatUnits(
                    list.userDepositPrice,
                    this.$store.state.usdtDecimals
                  ) * 1
                ).toFixed(2),
                endBlockNumber: list.endBlockNumber.toString(),
                isRansom: list.endBlockNumber.toString() * 1 < nowBlock,
                startBlockNumber: list.startBlockNumber.toString(),
                operateType: list.operateType.toString(),
                depositId: depositRecordId,
                pendingHarvestEarn,
              };
            })
        );
      };

      const newObj = {
        depositList: await getList(),
      };

      this.allData = this.$t("withdraw.allData");
      return newObj;
    },

    async poolInfoLists(index) {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "poolInfoList",
        index
      ).catch((err) => console.log(err));
      return res;
    },
    async pendingHarvestEarn(index, depositRecordId) {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "pendingHarvestEarn",
        this.$store.state.address,
        index,
        depositRecordId
      ).catch((err) => console.log(err));
      return res;
    },
    async harvestCurrentEarn(index, depositRecordId) {
      this.recordList[index].depositList[depositRecordId].loading = true;
      await getWriteContractLoad(
        this.$store.state.poolAddress,
        poolABI,
        "harvestCurrentEarn",
        index,
        depositRecordId
      )
        .then(() => {
          this.recordList[index].depositList[depositRecordId].loading = false;
          showToast(this.$("withdraw.ChargeSuccess"));
          this.pendingReward();
          this.getPoolsCount();
        })
        .catch((err) => {
          this.recordList[index].depositList[depositRecordId].loading = false;
          console.log(err);
        });
    },
    async withdraw(index, depositRecordId) {
      this.recordList[index].depositList[
        depositRecordId
      ].withdrawLoading = true;
      await getWriteContractLoad(
        this.$store.state.poolAddress,
        poolABI,
        "withdraw",
        index,
        depositRecordId
      )
        .then(() => {
          this.recordList[index].depositList[
            depositRecordId
          ].withdrawLoading = false;
          showToast(this.$("withdraw.redemptionSuccess"));
          this.pendingReward();
          this.getPoolsCount();
        })
        .catch((err) => {
          this.recordList[index].depositList[depositRecordId].loading = false;
          console.log(err);
        });
    },
    refreshData() {
      this.showLoading = false;
      this.pendingReward();
      this.getPoolsCount();
      setTimeout(() => {
        this.showLoading = true;
      }, 2000);
    },
  },
};
</script>
<style scoped lang="scss">
.withdraw-wrap-box {
  max-height: 100vh;
}
.withdraw-wrap {
  color: #2c3e50;
  list-style: none;
  font-style: normal;

  width: 90%;
  margin: 20px auto 100px auto;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 3px 6px #cfcece;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  margin-top: 80px;
  .balance-name {
    color: #818086;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
  }
  .pay-text {
    margin-top: 15px;
    font-size: 22px;
    display: flex;
    align-items: center;
  }
  .pay-usdt {
    font-size: 14px;
  }
  .wallte-btn {
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #fff;
    background-color: #ffc519;
    background-size: 100% 100%;
    cursor: pointer;
    border-radius: 10px;
    margin: 30px 0 10px 0;
    border: none;
    outline: none;
  }
  .disabled {
    background-color: #a1a0a0;
  }
  .warehouse-records {
    margin-top: 30px;
    .name {
      color: #16172a;
      font-size: 18px;

      padding-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eae9e9;
      > img {
        width: 20px;
        height: 20px;
      }
    }
    .notice-all {
      text-align: center;
      color: #818086;
      font-size: 12px;
      margin-top: 40px;
    }
  }
  .noData {
    text-align: center;
    color: #818086;
    font-size: 12px;
    padding: 40px 0;
  }
  .lpTokenName {
    padding-bottom: 10px;

    font-size: 14px;
  }
  .depositList {
    border-bottom: 1px solid #eae9e9;
    padding: 10px 0;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      font-size: 12px;
    }
  }
  .minBtn {
    height: 24px;
  }
  .allData {
    padding: 40px 0;
    font-size: 12px;
    text-align: center;
  }
}
</style>
