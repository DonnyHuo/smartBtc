<template>
  <div class="lpDetail">
    <div class="header">
      <span>{{ tokenName }} 地址</span>
      <a :href="`https://bscscan.com/address/${lpInfo.changeToken}`" target="_blank">
        <span>
          {{ shortStr(lpInfo.changeToken) }}
        </span>
      </a>
    </div>
    <div class="staking-wrap">
      <div class="dialog-wrap">
        <div class="wrap-title">
          <router-link to="lpSwap" class="goBack">
            <img src="../../assets/img/goBack1.png" alt="" />
          </router-link>
          <div>
            <div>從Pancakeswap獲取LP</div>
            <a
              :href="`https://pancakeswap.finance/swap?outputCurrency=${lpInfo.lpToken}`"
            >
              <img src="../../assets/img/lpDetailShare.png" alt="" class="goTo" />
            </a>
          </div>
        </div>
        <div class="staking-box">
          <div class="staking-content">
            <div class="selectPicker">
              <img
                class="tokenLogo"
                v-if="tokenName !== '--'"
                :src="
                  require(`../../assets/img/tokenList/brc20-${tokenName.toLowerCase()}.png`)
                "
                onerror='onerror=null;this.src="/img/default.492b60fb.png"'
              />
              <span>{{ lpInfo.disPlayName }}</span>
            </div>
            <div>
              <div class="selectLpInfo">
                <span>LP 地址：</span>
                <a
                  :href="`https://bscscan.com/address/${lpInfo.lpToken}`"
                  target="_blank"
                >
                  {{ lpInfo.lpToken ? shortStr(lpInfo.lpToken) : "--" }}</a
                >
                <div class="copyAddress">
                  <img src="" alt="" />
                </div>
              </div>
            </div>
            <div class="staking-num-box">
              <div class="title">
                <div>輸入要兑换的LP數量</div>
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
              <div class="lp-value-title">预计兑换出:</div>
              <div class="lp-value">{{ exchangeTokens }} {{ tokenName }}</div>
            </div>
          </div>
          <div class="botton-group">
            <div class="btn-wrap">
              <van-button
                :loading="approveLoading"
                v-if="lpAllowance * 1 == 0"
                @click="getLpApprove"
                class="staking-btn"
                >授權 LP
              </van-button>
              <van-button
                :loading="depositLoading"
                v-else
                @click="exchangeLpTokenForTokens"
                class="staking-btn"
                >兑换 LP</van-button
              >
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
import { shortStr, getContract, getWriteContractLoad, realPic } from "@/utils";
import lpExchangeABI from "../../abi/lpExchange.json";
import erc20ABI from "../../abi/erc20.json";
import { showToast } from "vant";

export default {
  name: "LpDetail",
  data() {
    return {
      index: this.$route.query.index,
      lpInfo: this.$route.query,
      lpPrice: "--",
      depositPower: "--",
      lpBalance: "--",
      inputValue: "",
      lpAllowance: "",
      depositLoading: false,
      approveLoading: false,
      t100Address: this.$store.state.t100,
      noLp: false,
      exchangeTokens: "--",
      tokenName: "--",
    };
  },
  created() {
    this.getTokenInfo();
    this.getLpBalance();
    this.getAllowance();
  },
  methods: {
    shortStr,
    realPic,

    async getTokenInfo() {
      const res = await getContract(this.lpInfo.changeToken, erc20ABI, "symbol");
      this.tokenName = res;
    },
    async getLpBalance() {
      const res = await getContract(
        this.lpInfo.lpToken,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      ).catch((err) => console.log(err));
      this.lpBalance = ethers.utils.formatUnits(res, 18) * 1;
      this.noLp = this.lpBalance * 1 == 0;
    },
    async getAllowance() {
      const res = await getContract(
        this.lpInfo.lpToken,
        erc20ABI,
        "allowance",
        this.$store.state.address,
        this.$store.state.lpExchange
      ).catch((err) => console.log(err));
      this.lpAllowance = ethers.utils.formatUnits(res, 18);
    },
    async getLpApprove() {
      this.approveLoading = true;
      await getWriteContractLoad(
        this.lpInfo.lpToken,
        erc20ABI,
        "approve",
        this.$store.state.lpExchange,
        ethers.constants.MaxUint256
      )
        .then((res) => {
          this.approveLoading = false;
          showToast("授权成功");
          this.getAllowance();
        })
        .catch((err) => {
          showToast("授权失败");
          console.log(err);
          this.approveLoading = false;
        });
    },
    changeValue(e) {
      const value = e.target.value;
      this.inputValue = value;
    },
    maxFun() {
      this.inputValue = this.lpBalance;
    },
    async changeTokensView(value) {
      if (value * 1 > 0) {
        const res = await getContract(
          this.$store.state.lpExchange,
          lpExchangeABI,
          "viewExchangeLpTokenForTokens",
          this.lpInfo.pairId,
          ethers.utils.parseUnits(value.toString(), 18)
        );
        this.exchangeTokens = (ethers.utils.formatUnits(res, 18) * 1).toFixed(2);
      } else {
        this.exchangeTokens = 0;
      }
    },
    async exchangeLpTokenForTokens() {
      if (this.inputValue > this.lpBalance) {
        return showToast("余额不足");
      }
      if (this.inputValue * 1 <= 0) {
        return showToast("请输入正确数量的LP");
      }
      this.depositLoading = true;
      await getWriteContractLoad(
        this.$store.state.lpExchange,
        lpExchangeABI,
        "exchangeLpTokenForTokens",
        this.lpInfo.pairId,
        ethers.utils.parseUnits(this.inputValue, 18)
      )
        .then((res) => {
          console.log(res);
          this.depositLoading = false;
          this.inputValue = "";
          showToast("兑换成功");
        })
        .catch((err) => {
          this.depositLoading = false;
          console.log(err);
          showToast("兑换失败");
        });
    },
  },
  watch: {
    inputValue(value) {
      this.changeTokensView(value);
    },
  },
};
</script>
<style lang="scss" scoped>
.lpDetail {
  height: 100vh;
  overflow: auto;
}
.header {
  width: 90%;
  margin: 0 auto;
  font-size: 14px;
  background: #fff;
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  a {
    text-decoration: underline;
  }
}
.staking-wrap {
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
        font-weight: 600;
        .tokenLogo {
          width: 30px;
          height: 30px;
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
          font-weight: 600;
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
          font-weight: 700;
          color: #16172a;
          display: flex;
          justify-content: space-between;
          .get-lp {
            font-weight: 400;
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
          font-weight: 600;
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
        font-weight: 700;
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
        font-weight: 600;
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
  padding-top: 50px;
  img {
    width: 28px;
  }
}
</style>
