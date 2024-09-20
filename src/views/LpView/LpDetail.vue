<template>
  <div class="lpDetail">
    <LpHeader />
    <div class="staking-wrap">
      <div class="dialog-wrap">
        <div class="wrap-title">
          <router-link to="lp" class="goBack">
            <img src="../../assets/img/goBack1.png" alt="" />
          </router-link>
          <div>
            <div>從Pancakeswap獲取LP</div>
            <a
              :href="`https://pancakeswap.finance/v2/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82`"
            >
              <img
                src="../../assets/img/lpDetailShare.png"
                alt=""
                class="goTo"
              />
            </a>
          </div>
        </div>
        <div class="staking-box">
          <div class="staking-content">
            <div class="selectPicker">
              <img :src="realIconLogo(lpInfo.lpTokenName)" />
              <span>{{ lpInfo.lpTokenName }}</span>
            </div>
            <div>
              <div class="selectLpInfo">
                <span>LP 地址：</span>
                <a :href="`https://bscscan.com/address/${lpInfo.lpToken}`">
                  {{ lpInfo.lpToken ? shortStr(lpInfo.lpToken) : "--" }}</a
                >
                <div class="copyAddress">
                  <img src="" alt="" />
                </div>
              </div>
              <div class="selectLpInfo">
                <span>最小質押算力：</span>
                <div>{{ lpInfo.minDepositLimit || "--" }} H/S</div>
              </div>
            </div>
            <div class="staking-num-box">
              <div class="title">
                <div>輸入要質押的LP數量</div>
                <div v-if="noLp" class="get-lp">請先獲取 LP</div>
              </div>
            </div>
            <div class="staking-input-box no-lp">
              <input
                placeholder="本次輸入需 ≥ 0"
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
                  最大
                </div>
              </div>
            </div>
            <div class="lp-usdt-box">
              <div class="lp-value-title">餘額:</div>
              <div class="lp-value">{{ lpBalance }} LP</div>
            </div>
            <div class="lp-usdt-box">
              <div class="lp-value-title">當前1LP價值:</div>
              <div class="lp-value">{{ lpPrice }} USDT</div>
            </div>
            <div class="lp-usdt-box">
              <div class="lp-value-title">預計獲得質押算力:</div>
              <div class="lp-value">{{ depositPower }} H/S</div>
            </div>
          </div>
          <div class="botton-group">
            <div class="btn-wrap">
              <van-button
                :loading="approveLoading"
                v-if="lpAllowance * 1 == 0"
                @click="getLpApprove"
                class="staking-btn"
                >授權LP
              </van-button>
              <van-button
                :loading="depositLoading"
                v-else
                @click="depositFun"
                class="staking-btn"
                >質押LP</van-button
              >
            </div>
            <a href="#/withdraw" class="btn-wrap">
              <van-button class="cancle-btn">贖回 </van-button>
            </a>
          </div>
          <div class="notice">
            <p>質押滿7天后可贖回；</p>
            <p>不贖回算力則持續生效，持續收益。</p>
          </div>
          <div class="shareValue">
            <span
              >100T 合約地址：
              <a :href="`https://bscscan.com/address/${$store.state.t100}`">{{
                shortStr($store.state.t100)
              }}</a></span
            >
            <div>
              <img src="" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="outLink">
      <a href="https://t.me/SmartBTCdao">
        <img src="../../assets/img/telegram.png" alt="" />
      </a>
      <a href="https://twitter.com/SmartBTCdao">
        <img src="../../assets/img/twitter.png" alt="" class="twitter" />
      </a>
      <img src="../../assets/img/email.png" alt="" />
    </div>
  </div>
</template>
<script>
import { ethers } from "ethers";
import {
  shortStr,
  getContract,
  getWriteContractLoad,
  getOkChainId,
  realIconLogo,
} from "@/utils";
import LpHeader from "./LpHeader.vue";
import poolABI from "../../abi/pool.json";
import erc20ABI from "../../abi/erc20.json";
import { showToast } from "vant";

export default {
  name: "LpDetail",
  components: { LpHeader },
  data() {
    return {
      index: this.$route.query.index,
      lpInfo: {},
      lpPrice: "--",
      depositPower: "--",
      lpBalance: "--",
      inputValue: "",
      lpAllowance: "",
      depositLoading: false,
      approveLoading: false,
      t100Address: this.$store.state.t100,
      noLp: false,
    };
  },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.poolInfoLists();
    }
  },
  methods: {
    shortStr,
    realIconLogo,
    async poolInfoLists() {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "poolInfoList",
        this.index
      ).catch((err) => console.log(err));
      console.log(res);
      const price = await this.getLpPrice();
      const newIObj = {
        totalBalance: ethers.utils.formatUnits(res.totalBalance, 18) * price,
        lpToken: res.lpToken,
        lpTokenName: res.lpTokenName,
        minDepositLimit: (
          ethers.utils.formatUnits(
            res.minDepositLimit,
            this.$store.state.usdtDecimals
          ) * 1
        ).toFixed(2),
      };
      this.lpInfo = newIObj;
      this.getLpBalance();
      this.getAllowance();
    },
    async getLpPrice() {
      const res = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getLpPrice",
        this.index
      ).catch((err) => console.log(err));
      this.lpPrice = (
        ethers.utils.formatUnits(res, this.$store.state.usdtDecimals) * 1
      ).toFixed(6);
    },
    async getLpBalance() {
      const res = await getContract(
        this.lpInfo.lpToken,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      ).catch((err) => console.log(err));
      this.lpBalance = ethers.utils.formatUnits(res, 18);
      this.noLp = this.lpBalance * 1 == 0;
    },
    async getAllowance() {
      const res = await getContract(
        this.lpInfo.lpToken,
        erc20ABI,
        "allowance",
        this.$store.state.address,
        this.$store.state.poolAddress
      ).catch((err) => console.log(err));
      this.lpAllowance = ethers.utils.formatUnits(res, 18);
    },
    async getLpApprove() {
      this.approveLoading = true;
      const res = await getWriteContractLoad(
        this.lpInfo.lpToken,
        erc20ABI,
        "approve",
        this.$store.state.poolAddress,
        ethers.constants.MaxUint256
      ).catch((err) => console.log(err));
      console.log(res);
      this.approveLoading = false;
      showToast("授权成功");
      this.getAllowance();
    },
    changeValue(e) {
      const value = e.target.value;
      this.inputValue = value;
      this.depositPower = (value * this.lpPrice * 1).toFixed(6);
      this.noLp = value * 1 > this.lpBalance * 1;
    },
    maxFun() {
      this.inputValue = this.lpBalance;
      this.depositPower = this.lpBalance * this.lpPrice;
    },
    async depositFun() {
      if (this.depositPower >= this.lpInfo.minDepositLimit) {
        if (this.inputValue * 1 > this.lpBalance * 1) {
          return showToast(`LP不足`);
        }
        this.depositLoading = true;
        const overrides = {
          gasLimit: 500000,
          gasPrice: ethers.utils.parseUnits("5", "gwei"),
        };
        const res = await getWriteContractLoad(
          this.$store.state.poolAddress,
          poolABI,
          "deposit",
          this.index,
          ethers.utils.parseUnits(this.inputValue, 18),
          overrides
        ).catch((err) => console.log(err));
        if (res) {
          showToast("質押成功");
        }
        this.depositLoading = false;
        this.inputValue = "";
      } else {
        showToast(`最小質押算力为 ${this.lpInfo.minDepositLimit} H/S`);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.lpDetail {
  height: calc(100vh - 60px);
  padding-top: 20px;
  overflow: auto;
}
.staking-wrap {
  min-height: 60vh;
  background-size: 100% 100%;
  width: 90%;
  margin: 0 auto 20px auto;
  box-sizing: border-box;
  border: 1px solid #f5f5f5;
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  .wrap-title {
    width: 100%;
    padding: 15px 20px;
    box-sizing: border-box;
    color: #fff;
    background: #ffc519;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    img {
      width: 16px;
    }
    div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .goBack {
      margin-right: 10px;
      margin-left: 0;
    }
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      img {
        height: 16px;
      }
    }
  }
  .staking-box {
    margin-top: 20px;
    padding-bottom: 20px;
    .staking-content {
      width: 90%;
      padding: 20px 20px 10px 20px;
      margin: 0 auto;
      border: 1px solid #e3e3e3;
      border-radius: 15px;
      font-size: 12px;
      text-align: left;
      .selectPicker {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        font-size: 16px;

        > img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
      .selectLpInfo {
        line-height: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        color: #16172a;
        > a {
          color: #ffc519;

          text-decoration: underline;
        }
      }
      .staking-num-box {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .title {
          width: 100%;
          font-size: 12px;

          color: #16172a;
          display: flex;
          justify-content: space-between;
          .get-lp {
            color: #ed8080;
          }
        }
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
        }
      }
      .lp-usdt-box {
        height: 24px;
        display: flex;
        align-items: center;
        .lp-value {
          margin-left: 10px;
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
        .cancle-btn {
          background-color: #fff;
          border: 1px solid #999;
        }
      }
    }
    .notice {
      padding: 0 20px;
      box-sizing: border-box;
      color: #a2a2a2;
      font-size: 10px;
      line-height: 18px;
      word-wrap: break-word;
      white-space: pre-wrap;
      text-align: left;
    }
    .shareValue {
      font-size: 13px;
      display: flex;
      align-items: center;
      padding: 10px 20px 0 20px;
      a {
        color: #ffc519;
        text-decoration: underline;
      }
      img {
        width: 15px;
        margin-left: 5px;
        margin-top: 3px;
      }
    }
  }
}
.outLink {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 30px;
  img {
    width: 28px;
  }
}
</style>
