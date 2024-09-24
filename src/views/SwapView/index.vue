<template>
  <div class="daoView">
    <div class="dao">
      <div class="staking-content">
        <div class="balance">
          <span>{{ $t("hecoSwap.balance") }} </span>
          <span>{{ hecoBalance }}</span>
        </div>
        <div class="staking-input-box no-lp">
          <input
            :placeholder="`${$t('hecoSwap.placeHolder', { number: 100 })}`"
            oninput="value=value.match(/^\d+(?:\.\d{0,18})?/)"
            class="input-border"
            :value="inputValue"
            @input="changeValue"
          />
          <div class="icon-box">
            <div
              @click="maxFun"
              width="25px"
              height="23px"
              fontsize="15px"
              class="max"
            >
              {{ $t("hecoSwap.max") }}
            </div>
          </div>
        </div>
        <div class="botton-group">
          <div class="btn-wrap">
            <van-button
              :loading="approveLoading"
              v-if="allowance * 1 == 0"
              @click="approveFun"
              class="staking-btn"
            >
              {{ $t("hecoSwap.approve") }}
            </van-button>
            <van-button
              v-else
              :loading="swapLoading"
              :disabled="!inputValue"
              @click="swapFun"
              class="staking-btn"
              >{{ $t("hecoSwap.submit") }}</van-button
            >
          </div>
        </div>
      </div>

      <div class="swapWait">
        <div class="font-medium max-w-[50%] text-left">
          {{ $t("hecoSwap.bridgeAmount") }}：{{ waitBridge }}
        </div>
        <van-button
          :disabled="!(waitBridge * 1) || hasNoCompleteOrder"
          :loading="swapSureLoading"
          size="small"
          @click="swapSure"
          class="swap-btn"
        >
          {{ $t("hecoSwap.bridge") }}</van-button
        >
      </div>
      <div class="tips">
        {{ $t("hecoSwap.tips") }}
      </div>
      <div class="swapRecord">
        <div class="title">
          <span class="font-medium"> {{ $t("hecoSwap.history") }}</span>
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
            <div class="swapRecordList" :key="index">
              <div>
                <span class="font-medium">{{ $t("hecoSwap.number") }}</span>
                <span>{{ list.order_id }}</span>
              </div>
              <div v-if="list.convert_txid">
                <span class="font-medium">{{ $t("hecoSwap.hash") }}</span>
                <div class="flex items-center">
                  <a
                    class="leading-8"
                    :href="`https://bscscan.com/tx/${list.convert_txid}`"
                    >{{ shortStr(list.convert_txid) }}</a
                  >
                  <img
                    @click="copyAddress(list.convert_txid)"
                    src="../../assets/img/copy.png"
                    alt=""
                    class="copyAddress"
                  />
                </div>
              </div>
              <div>
                <span class="font-medium">From</span>
                <span>{{ list.from_network }}</span>
              </div>
              <div>
                <span class="font-medium">To</span>
                <span>{{ list.to_network }}</span>
              </div>
              <div>
                <span class="font-medium">{{ $t("hecoSwap.amount") }}</span>
                <span>{{ list.real_amount }} (100T)</span>
              </div>
              <div>
                <span class="font-medium">{{
                  $t("hecoSwap.orderStatus")
                }}</span>
                <span>{{ list.order_state }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="loading" class="noData">
          <van-loading />
        </div>
        <div class="allData" v-if="allData">{{ allData }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import {
  getContract,
  getChainId,
  getWriteContractLoad,
  shortStr,
  copy,
} from "../../utils";
import hecoContract from "../../abi/hecoContract.json";
import erc20ABI from "../../abi/erc20.json";
import { showToast } from "vant";

export default {
  name: "SwapView",
  data() {
    return {
      hecoBrigeAddress: this.$store.state.hecoBrigeAddress,
      hecoT100: this.$store.state.hecoT100,
      hecoBalance: "--",
      inputValue: "",
      allowance: "",
      approveLoading: false,
      swapSureLoading: false,
      swapLoading: false,
      waitBridge: "",
      recordList: [],
      allData: "",
      hasNoCompleteOrder: false,
      loading: true,
      showLoading: true,
      icon: require("../../assets/img/refresh.png"),
    };
  },
  async created() {
    if ((await getChainId()) == "0x80") {
      this.getHecoBalance();
      this.getAllowance();
      this.getWaitBridgeList();
      this.getRecordList();
    }
  },
  methods: {
    shortStr,
    changeValue(e) {
      this.inputValue = e.target.value;
    },
    maxFun() {
      this.inputValue = this.hecoBalance;
    },
    async getHecoBalance() {
      const balance = await getContract(
        this.hecoT100,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      );
      const decimals = await getContract(this.hecoT100, erc20ABI, "decimals");
      this.hecoBalance = (
        ethers.utils.formatUnits(balance, decimals) * 1
      ).toFixed(6);
    },
    async getAllowance() {
      const res = await getContract(
        this.hecoT100,
        erc20ABI,
        "allowance",
        this.$store.state.address,
        this.hecoBrigeAddress
      ).catch((err) => console.log(err));
      this.allowance = ethers.utils.formatUnits(res, 18);
    },
    async approveFun() {
      this.approveLoading = true;
      const res = await getWriteContractLoad(
        this.hecoT100,
        erc20ABI,
        "approve",
        this.hecoBrigeAddress,
        ethers.constants.MaxUint256
      )
        .then(() => {
          showToast(this.$t("hecoSwap.approveSuccess"));
          this.getAllowance();
        })
        .catch((err) => console.log(err));
      this.approveLoading = false;
    },
    async swapFun() {
      if (this.inputValue * 1 < 100) {
        return showToast(this.$t("hecoSwap.min", { number: 100 }));
      }
      if (this.inputValue * 1 > this.hecoBalance * 1) {
        return showToast(this.$t("btcSwap.noBalance"));
      }
      this.swapLoading = true;
      await getWriteContractLoad(
        this.hecoBrigeAddress,
        hecoContract,
        "bridgeToBsc",
        ethers.utils.parseUnits(this.inputValue, 18)
      )
        .then(() => {
          setTimeout(() => {
            showToast(this.$t("hecoSwap.submitSucccess"));
            this.getWaitBridgeList();
          }, 2000);
        })
        .catch((err) => console.log(err));
      this.swapLoading = false;
    },

    async getWaitBridgeList() {
      await getContract(
        this.hecoBrigeAddress,
        hecoContract,
        "getUserRecord",
        this.$store.state.address
      )
        .then((res) => {
          this.waitBridge = ethers.utils.formatUnits(res.waitBridgeAmount, 18);
        })
        .catch((err) => console.log(err));
    },

    swapSure() {
      this.swapSureLoading = true;
      this.$axios({
        method: "POST",
        url: "https://smartbtc.io/bridge/bridge_heco_bsc",
        data: {
          address: this.$store.state.address,
        },
      })
        .then((res) => {
          if (res) {
            if (res.data.order_id) {
              setTimeout(() => {
                showToast(res.data.order_id);
                this.swapSureLoading = false;
                this.waitBridge = 0;
                this.getRecordList();
              }, 2000);
            } else {
              showToast(res.data.message);
            }
          }
        })
        .catch((err) => {
          this.swapSureLoading = false;
          console.log(err);
        });
    },

    getStatus(status) {
      switch (status) {
        case 0:
          return this.$t("btcSwap.status[1]");
        case 1:
          return this.$t("btcSwap.status[1]");
        case 2:
          return this.$t("btcSwap.status[2]");
        default:
          return this.$t("btcSwap.status[1]");
      }
    },
    getRecordList() {
      this.loading = true;
      this.$axios({
        method: "POST",
        url: "https://smartbtc.io/bridge/bridge_record",
        data: {
          address: this.$store.state.address,
        },
      })
        .then((res) => {
          let newArr = [];
          newArr = res.data.data.map((list) => {
            list.real_amount = ethers.utils.formatUnits(list.real_amount, 8);
            list.from_network = list.from_network.toUpperCase();
            list.to_network = list.to_network.toUpperCase();
            list.updated_at = list.updated_at;
            list.order_state = this.getStatus(list.order_state);
            if (list.order_state < 2) {
              this.hasNoCompleteOrder = true;
            }
            return list;
          });
          this.recordList = newArr;
          this.allData = this.$t("btcSwap.allData");
        })
        .catch((err) => {
          this.allData = this.$t("btcSwap.allData");
          console.log(err);
        });
      this.loading = false;
    },
    copyAddress(msg) {
      copy(msg);
      showToast(this.$t("copySuccess"));
    },
    refreshData() {
      this.showLoading = false;
      this.getRecordList();
      setTimeout(() => {
        this.showLoading = true;
      }, 2000);
    },
  },
};
</script>
<style lang="scss" scoped>
.daoView {
}
.dao {
  padding: 20px;
  background-color: #fff;
  padding: 20px;
  width: 90%;
  margin: 20px auto;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: 0 3px 10px #cfcece;
  .staking-content {
    padding: 20px 20px 10px 20px;
    margin: 0 auto;
    border: 1px solid #e3e3e3;
    border-radius: 15px;
    text-align: left;
    .balance {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .staking-input-box {
      display: flex;
      border-radius: 15px;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      margin: 10px 0;
      background-color: #f0f0f0;
      height: 50px;
      padding: 0 10px 0 20px;
      .input-border {
        background-color: #f0f0f0;
        background-size: 100% 100%;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        width: 60%;
        border: none;
        margin-right: 6px;
        font-size: 14px;
      }
      .icon-box {
        background: #ffc519;
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 12px;
      }
    }
  }
  .botton-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
    .btn-wrap {
      width: 40%;
      color: #000;

      margin: 0 auto;
      opacity: 1;
      color: #a2a2a2;
      border-radius: 15px;
      button {
        width: 100%;
        height: 40px;
        background: #ffc519;
        border-radius: 10px;
        color: #333;
        border: none;
        outline: none;
      }
    }
  }
  .swapWait {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .swap-btn {
      background: #ffc519;
      border-radius: 5px;
      color: #333;
      border: none;
      outline: none;
    }
  }
  .tips {
    padding-top: 20px;
    text-align: left;
    font-size: 14px;
    color: #666;
    line-height: 20px;
  }
  .swapRecord {
    margin-top: 30px;
    border-top: 1px solid #e3e3e3;
    padding-top: 20px;
    margin-bottom: 20px;

    .title {
      text-align: left;
      color: #16172a;
      font-size: 18px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 20px;
        height: 20px;
      }
    }
    .noData,
    .allData {
      padding: 40px 0;
      font-size: 12px;
      text-align: center;
    }
    .swapRecordList {
      border-bottom: 1px solid #f5f5f5;
      padding: 20px 0;
      color: #666;
      > div {
        height: 40px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          display: flex;
          align-items: center;
        }
        a {
          text-decoration: underline;
        }
        .copyAddress {
          width: 20px;
          height: 20px;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
