<template>
  <div class="btcSwap">
    <div class="headerBox">
      <img class="homeLogo" src="../../assets/img/homeLogo1.png" alt="" />
      <div class="addressBox">
        <img class="walletIcon" src="../../assets/img/wallet.png" alt="" />
        <div class="address">{{ shortStr(address) }}</div>
      </div>
    </div>
    <div class="titleBox">
      <div class="title">
        <span>跨链</span>
        <span class="btoB">From BTC To BSC</span>
      </div>
      <div class="selectChain" @click="show = true">
        <!-- <img
          class="chainLogo"
          src="../../assets/img/0x56950c545e365d33175ed07cb294f95126df3635.png"
          alt=""
        /> -->
        <span>{{ selectedChain }}</span>
        <img class="down" src="../../assets/img/down.png" alt="" />
      </div>
    </div>
    <div class="swapBox">
      <div class="from">
        <div>
          <div class="tips">先铭刻，再發送</div>
          <input class="inputBox" type="text" :value="selectedCoin.price" disabled />
          <div class="buyOrMining">购买</div>
        </div>
        <div class="selectBox" @click="showCoin = true">
          <span>{{ selectedCoin.name }}</span>
          <img class="down" src="../../assets/img/down.png" alt="" />
        </div>
      </div>
      <div class="swapDownBox">
        <img class="swapDown" src="../../assets/img/swapDown.png" alt="" />
      </div>
      <div class="to">
        <p>接收地址</p>
        <div class="inputBox">
          <input type="text" :value="toAddress" />
          <div @click="readText">粘贴</div>
        </div>
        <!-- <p class="max">Max</p> -->
      </div>
    </div>
    <van-button class="sure" disabled>提交跨链</van-button>
    <div class="swapRecord">
      <div class="title">
        <span>跨鏈記錄</span>
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
              <span>訂單編號</span> <span>{{ list.order_id }}</span>
            </div>
            <div v-if="list.convert_txid">
              <span>交易Hash</span>
              <span>
                <a :href="`https://bscscan.com/tx/${list.convert_txid}`">{{
                  shortStr(list.convert_txid)
                }}</a>
                <img
                  @click="copyAddress(list.convert_txid)"
                  src="../../assets/img/copy.png"
                  alt=""
                  class="copyAddress"
              /></span>
            </div>
            <div>
              <span>From</span> <span>{{ list.from_network }}</span>
            </div>
            <div>
              <span>To</span> <span>{{ list.to_network }}</span>
            </div>
            <div>
              <span>數量</span>
              <span>{{ list.real_amount }} (100T)</span>
            </div>
            <div>
              <span>訂單狀態</span> <span>{{ list.order_state }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading" class="noData">
        <van-loading />
      </div>
      <div class="allData" v-if="allData">{{ allData }}</div>
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
        <div
          v-for="(list, index) in coinList"
          :key="index"
          class="chainList"
          @click="onSelectCoin(list)"
        >
          <span :class="selectedCoin.name == list.name ? 'active' : ''">{{
            list.name
          }}</span>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { shortStr } from "../../utils";
import { showToast } from "vant";

export default {
  name: "btcSwap",
  data() {
    return {
      address: "",
      recordList: [],
      value1: 0,
      value2: "a",
      option1: [
        { text: "SBTC", value: 0 },
        { text: "BNB", value: 1 },
      ],
      option2: [{ text: "选择铭文", value: "a" }],
      toAddress: "",
      actions: [{ name: "SBTC" }, { name: "ODEF" }],
      selectedChain: "SBTC",
      show: false,
      showCoin: false,

      selectedCoin: {
        name: "选择铭文",
        price: "0.00",
      },
      coinList: [
        {
          name: "SBTC1",
          price: "234",
        },
        {
          name: "SBTC2",
          price: "4532",
        },
        {
          name: "SBTC3",
          price: "2300",
        },
      ],
    };
  },
  created() {
    this.checkWallet();
  },
  methods: {
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
      console.log(value);
    },
    onSelectCoin(value) {
      this.selectedCoin = value;
      this.showCoin = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.btcSwap {
  background-color: #fff;
  min-height: 100vh;
  padding: 0 20px;
  .headerBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
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
        color: #111;
        font-weight: 600;
      }
    }
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
      .tips {
        font-size: 14px;
      }
      .inputBox {
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
  padding-bottom: 30px;
}
.chainList {
  padding: 20px 0;
}
.active {
  color: #ffc519;
}
</style>
