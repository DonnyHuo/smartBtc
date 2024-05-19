<template>
  <div class="btcSwap">
    <div class="headerBox">
      <img class="homeLogo" src="../../assets/img/homeLogo1.png" alt="" />
      <div class="addressBox">
        <img class="walletIcon" src="../../assets/img/wallet.png" alt="" />
        <div class="address">{{ shortStr(address) }}</div>
      </div>
    </div>
    <div class="btcSwapContent">
      <div class="titleBox">
        <div class="title">
          <span>跨链</span>
          <span class="btoB">From BTC To BSC</span>
        </div>
        <div class="selectChain" @click="show = true">
          <span>{{ selectedChain }}</span>
          <img class="down" src="../../assets/img/down.png" alt="" />
        </div>
      </div>
      <div class="swapBox">
        <div class="from">
          <div class="fromLeft">
            <div class="tips">先铭刻，再發送</div>
            <input class="inputBox" type="text" v-model="selectedCoin.amount" disabled />
            <div class="buyOrMining">
              <a
                href="https://www.okx.com/zh-hans/web3/marketplace/inscription/ordinals/token/SBTC"
                >购买</a
              >
            </div>
          </div>
          <div class="selectBox" @click="showCoin = true">
            <span
              >{{ selectedCoin.tokenName }} {{ selectedCoin.inscriptionNumber && "#"
              }}{{ selectedCoin.inscriptionNumber }}</span
            >
            <img class="down" src="../../assets/img/down.png" alt="" />
          </div>
        </div>
        <div class="swapDownBox">
          <img class="swapDown" src="../../assets/img/swapDown.png" alt="" />
        </div>
        <div class="to">
          <p>接收地址</p>
          <div class="inputBox">
            <input type="text" v-model="toAddress" />
            <div @click="readText">粘贴</div>
          </div>
          <!-- <p class="max">Max</p> -->
        </div>
      </div>
      <van-button
        class="sure"
        :loading="postLoading"
        :disabled="!(selectedCoin.amount * 1 > 0 && isAddress(this.toAddress))"
        @click="postSwap"
        >提交跨链</van-button
      >
      <div class="swapRecord">
        <div class="title">
          <span>跨鏈記錄</span>
          <img
            v-if="!showLoading"
            @click="getRecordList"
            class="refresh-btn"
            src="../../assets/img/refresh.png"
            alt=""
          />
          <van-loading v-else color="#333" size="20"></van-loading>
        </div>
        <div v-if="recordList.length > 0">
          <div v-for="(list, index) in recordList">
            <div class="swapRecordList" :key="index">
              <div v-if="list.brc20_txid">
                <span>交易Hash</span>
                <span>
                  <a :href="`https://www.oklink.com/zh-hans/btc/tx/${list.brc20_txid}`">{{
                    shortStr(list.brc20_txid)
                  }}</a>
                  <img
                    @click="copyAddress(list.brc20_txid)"
                    src="../../assets/img/copy.png"
                    alt=""
                    class="copyAddress"
                /></span>
              </div>
              <div>
                <span>From ({{ list.from_net }})</span>
                <span>{{ shortStr(list.from_net_address) }}</span>
              </div>
              <div>
                <span>To ({{ list.to_net }})</span>
                <span>{{ shortStr(list.to_net_address) }}</span>
              </div>
              <div>
                <span>數量</span>
                <span>{{ list.amount }} {{ list.symbol }}</span>
              </div>
              <div>
                <span>訂單狀態</span> <span>{{ getStatus(list.order_state) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="allData" v-else>{{ allData }}</div>
      </div>
    </div>
    <van-action-sheet v-model:show="show" title="选择铭文">
      <div class="content">
        <div
          v-for="(list, index) in actions"
          :key="index"
          class="chainList"
          @click="onSelect(list.name)"
        >
          <span :class="selectedChain == list.name ? 'active' : ''">{{ list.name }}</span>
        </div>
      </div>
    </van-action-sheet>

    <van-action-sheet v-model:show="showCoin" title="选择铭文">
      <div class="content">
        <div v-if="coinList.length > 0">
          <div
            v-for="(list, index) in coinList"
            :key="index"
            class="coinList"
            @click="onSelectCoin(list)"
          >
            <span
              :class="
                selectedCoin.inscriptionNumber == list.inscriptionNumber ? 'active' : ''
              "
            >
              <!--  -->
              <span>{{ list.token }}#{{ list.inscriptionNumber }}</span>

              <span>{{ list.amount }}</span>
            </span>
          </div>
        </div>
        <div class="noCoin" v-else>没有可以发送的 {{ selectedChain }} 铭文</div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { shortStr, copy } from "../../utils";
import { showToast } from "vant";
import { toHandlers } from "vue";

export default {
  name: "btcSwap",
  data() {
    return {
      address: "",
      recordList: [],
      value1: 0,
      value2: "a",
      option2: [{ text: "选择铭文", value: "a" }],
      toAddress: "",
      actions: [],
      selectedChain: "",
      show: false,
      showCoin: false,

      selectedCoin: { tokenName: "选择铭文", amount: 0 },
      coinList: [],
      allData: "已載入全部數據",
      showLoading: false,
      postLoading: false,
    };
  },
  created() {
    this.checkWallet();
  },
  methods: {
    isAddress(address) {
      return ethers.utils.isAddress(address);
    },
    copyAddress(msg) {
      copy(msg);
      showToast("複製成功");
    },
    shortStr,
    async checkWallet() {
      if (typeof window.okxwallet !== "undefined") {
        console.log("OKX is installed!");
        this.connectWallet();
      }
    },
    async connectWallet() {
      try {
        let accounts = await window.okxwallet.bitcoin.requestAccounts();
        this.address = accounts[0];

        if (accounts[0]) {
          this.getAccounts();
          this.getInscriptions();
          this.getBalance();
          this.getRecordList();
          this.getTokenList();
        } else {
          showToast("请连接BTC钱包!");
        }
      } catch (e) {
        console.log("connect failed");
      }
    },
    async getAccounts() {
      const accounts = await window.okxwallet.bitcoin.getAccounts();
      console.log("accounts", accounts);
    },
    async getBalance() {
      const balance = await window.okxwallet.bitcoin.getBalance();
      console.log("balance", balance);
    },
    async getInscriptions() {
      const inscriptions = await window.okxwallet.bitcoin.getInscriptions();
      console.log("inscriptions", inscriptions);
    },
    readText() {
      navigator.clipboard.readText().then((clipboardText) => {
        this.toAddress = clipboardText;
      });
    },
    onSelect(value) {
      this.selectedChain = value;
      this.show = false;
      this.getBTCBalance(value);
    },
    onSelectCoin(value) {
      this.selectedCoin = value;
      this.showCoin = false;
    },
    getTokenList() {
      this.$axios({
        method: "GET",
        url: "https://smartbtc.io/bridge/brc20/token_list",
      })
        .then((res) => {
          const newData =
            res.data.data &&
            res.data.data.map((list) => {
              return {
                name: list.symbol,
              };
            });
          this.actions = newData;
          this.selectedChain = newData[0].name;
          this.getBTCBalance(newData[0].name);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getBTCBalance(name) {
      if (this.address && this.selectedChain) {
        console.log("111");

        this.$axios({
          method: "GET",
          headers: {
            "Ok-Access-Key": "1d048c1a-578e-44f3-aa80-ff5415a66860",
          },
          url: `https://www.oklink.com/api/v5/explorer/btc/address-balance-details?address=${this.address}&token=${name}&page=1&limit=50`,
        })
          .then((res) => {
            if (res.data.data[0]?.transferBalanceList.length > 0) {
              const tokenList = res.data.data[0]?.transferBalanceList.map((list) => {
                return {
                  tokenName: res.data.data[0].token,
                  tokenType: res.data.data[0].tokenType,
                  balance: res.data.data[0].balance,
                  availableBalance: res.data.data[0].availableBalance,
                  transferBalance: res.data.data[0].transferBalance,
                  inscriptionId: list.inscriptionId,
                  inscriptionNumber: list.inscriptionNumber,
                  amount: list.amount,
                };
              });
              this.selectedCoin = tokenList[0];
              this.coinList = tokenList;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getStatus(status) {
      switch (status) {
        case 0:
          return "新建";
        case 1:
          return "進行中";
        case 2:
          return "已完成";
        case 3:
          return "失敗";
        default:
          return "進行中";
      }
    },

    // 获取跨链记录
    getRecordList() {
      this.showLoading = true;
      this.$axios({
        method: "POST",
        url: "https://smartbtc.io/bridge/brc20/bridge_record",
        data: {
          address: this.address,
        },
      })
        .then((res) => {
          this.showLoading = false;
          this.recordList = res.data.data;
        })
        .catch((err) => {
          this.showLoading = false;
          console.log(err);
        });
    },

    // 提交跨链请求
    async postSwap() {
      if (this.selectedCoin.amount * 1 <= 0) {
        return showToast("请选择要发送的铭文");
      }
      if (!ethers.utils.isAddress(this.toAddress)) {
        return showToast("请填写正确的接受地址");
      }
      try {
        this.postLoading = true;

        let txid = await okxwallet.bitcoin.sendInscription(
          "bc1pwzegscnhe6jxy4wvgg2tzsm3h7856djc7a044kg77gxdve534udsqced3x", // 写死 boss的btc地址
          this.selectedCoin.inscriptionId
        );
        console.log("txid", txid);
        this.noticeService(txid);
      } catch (e) {
        console.log(e);
      }
    },
    noticeService(txid) {
      this.$axios({
        method: "POST",
        url: "https://smartbtc.io/bridge/brc20/bridge",
        data: {
          symbol: this.selectedChain,
          from_net_address: this.address,
          to_net_address: this.toAddress,
          amount: this.selectedCoin.amount,
          brc20_txid: txid,
        },
      })
        .then((res) => {
          if (res.data.data.order_id) {
            this.postLoading = false;
            this.getRecordList();
          } else {
            this.noticeService(txid);
          }
        })
        .catch((err) => {
          this.postLoading = false;
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.btcSwap {
  background-color: #fff;
  .headerBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px 0;
    background: #fff;
    .homeLogo {
      height: 30px;
    }
    .addressBox {
      display: flex;
      align-items: center;
      .walletIcon {
        width: 20px;
        margin-right: 4px;
      }
      .address {
        font-size: 14px;
        color: #111;
      }
    }
  }
  .btcSwapContent {
    padding: 20px;
    height: 100vh;
    overflow: auto;
  }
  .titleBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .title {
    margin: 20px 0;
    font-weight: 600;
    font-size: 16px;
    color: #111;
    display: flex;
    align-items: center;
    font-size: 18px;
    .btoB {
      margin-left: 10px;
      font-size: 12px;
      color: #999;
    }
  }
  .selectChain {
    padding: 6px 10px;
    border: 1px solid #d4d2d2;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-weight: 600;
      font-size: 14px;
      color: #111;
    }
    .chainLogo {
      width: 30px;
    }
    .down {
      width: 10px;
      margin-left: 5px;
    }
  }
  .swapBox {
    position: relative;
    .from {
      background-color: #f8fcff;
      padding: 20px;
      border-radius: 6px;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .fromLeft {
        width: 50%;
      }
      .tips {
        font-size: 14px;
      }
      .inputBox {
        width: 100%;
        height: 30px;
        background-color: transparent;
        margin: 20px 0;
      }
      .buyOrMining {
        font-size: 12px;
        color: rgb(115, 143, 234);
      }
    }
    .selectBox {
      display: flex;
      align-items: center;
      span {
        font-weight: 600;
        font-size: 14px;
        color: #111;
      }
      .chainLogo {
        width: 30px;
        margin-left: 2px;
      }
      .down {
        width: 10px;
        margin-left: 5px;
      }
    }
    .swapDownBox {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 4px solid #fff;
      background-color: #f8fcff;
      .swapDown {
        width: 20px;
      }
    }
    .to {
      background-color: #f8fcff;
      padding: 20px;
      border-radius: 6px;
      margin-top: 5px;
      text-align: left;
      font-size: 14px;
      .max {
        color: rgb(115, 143, 234);
      }
      .inputBox {
        height: 50px;
        padding: 0 2cap;
        background-color: #fff;
        border-radius: 10px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        input {
          width: 80%;
          background-color: transparent;
        }
      }
    }
  }
  .sure {
    margin-top: 30px;
    width: 100%;
    border-radius: 20px;
    height: 46px;
    border: none;
    background-color: #ffc519;
    font-weight: 500;
  }
  .swapRecord {
    margin-top: 30px;
    margin-bottom: 20px;

    .title {
      text-align: left;
      color: #16172a;
      font-size: 18px;
      font-weight: 700;
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
      > div {
        height: 40px;
        font-size: 14px;
        font-weight: 600;
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
::v-deep .van-action-sheet__header {
  padding-bottom: 20px;
}
.chainList {
  padding: 20px;
}
.coinList {
  padding: 20px;
  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.active {
  color: #ffc519;
}
.noCoin {
  color: #999;
  font-size: 12px;
  padding-bottom: 30px;
}
</style>
