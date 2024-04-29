<template>
  <div v-if="netWorkError" class="netWorkError">
    {{
      chainId !== "0x38"
        ? "請選擇幣安智能鏈"
        : chainId !== "0x80"
        ? "請選擇火币智能鏈"
        : ""
    }}
  </div>
  <div v-if="noWallet" class="netWorkError">未偵測到錢包</div>
  <router-view />
  <div class="nav">
    <router-link v-for="(list, index) in navList" :key="list.name" :to="list.route">
      <img
        v-if="
          list.name == $route.name ||
          (list.name == 'options' && ['trade', 'pool'].includes($route.name))
        "
        :src="list.iconUrlAct"
        alt=""
      />
      <img v-else :src="list.iconUrl" alt="" />
      <div>{{ list.text }}</div>
    </router-link>
  </div>
</template>

<script>
import { ethers } from "ethers";

export default {
  name: "DaoView",
  data() {
    return {
      activeIndex: 0,
      navList: [
        {
          name: "home",
          route: "/",
          active: false,
          text: "我的",
          iconUrl: require("./assets/img/dao.png"),
          iconUrlAct: require("./assets/img/daoAct.png"),
        },
        {
          name: "btcSwap",
          route: "/btcSwap",
          text: "跨鏈橋",
          active: false,
          iconUrl: require("./assets/img/swap.png"),
          iconUrlAct: require("./assets/img/swapAct.png"),
        },
        {
          name: "lpSwap",
          route: "/lpSwap",
          text: "LP质押",
          active: false,
          iconUrl: require("./assets/img/lp.png"),
          iconUrlAct: require("./assets/img/lpAct.png"),
        },
        {
          name: "lp",
          route: "/lp",
          text: "启动池",
          active: false,
          iconUrl: require("./assets/img/options.png"),
          iconUrlAct: require("./assets/img/optionsAct.png"),
        },
        {
          name: "share",
          route: "/share",
          text: "分享",
          active: false,
          iconUrl: require("./assets/img/share.png"),
          iconUrlAct: require("./assets/img/shareAct.png"),
        },
      ],
      netWorkError: false,
      noWallet: false,
      chainId: "",
    };
  },
  created() {
    console.log(this.$route);
    if (!window.ethereum) {
      this.noWallet = true;
      return;
    }
    this.checkNetWork();
    ethereum.on("chainChanged", () => {
      window.location.reload();
    });
    ethereum.on("accountsChanged", (accounts) => {
      this.$store.commit("setAddress", accounts[0]);
      window.location.reload();
    });
  },
  methods: {
    async connectWallet() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []).catch((err) => {
        alert(err.info.error.message);
      });
      if (accounts) {
        this.$store.commit("setAddress", accounts[0]);
      }
    },
    async getChainId(networkId, networkName, rpcUrls, nativeCurrency, blockExplorerUrls) {
      await window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: networkId,
              chainName: networkName,
              rpcUrls,
              nativeCurrency,
              blockExplorerUrls,
            },
          ],
        })
        .catch((error) => {
          console.log(error);
        });
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: networkId,
            },
          ],
        })
        .then(() => {
          // this.connectWallet()
        })
        .catch((e) => {
          console.log("wallet_switchEthereumChain error: ", e);
          return;
        })
        .finally(() => {});
    },
    async checkNetWork() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      this.chainId = chainId;
      this.$store.commit("setChainId", chainId);
      console.log("window.location.hash", window.location.hash);
      if (window.location.hash == "#/swap") {
        if (chainId !== "0x80") {
          this.netWorkError = true;
          this.getChainId(
            "0x80",
            "Huobi ECO Chain Mainnet",
            ["https://http-mainnet.hecochain.com"],
            {
              decimals: 18,
              name: "HT",
              symbol: "HT",
            },
            ["https://hecoscan.io"]
          );
        } else {
          this.netWorkError = false;
          this.connectWallet();
        }
      } else if (window.location.hash == "#/btcSwap") {
        console.log("btcSwap");
      } else if (
        window.location.hash == "#/lpSwap" ||
        window.location.hash.includes("#/lpSwapDetail")
      ) {
        console.log("lpSwap");
        this.getChainId(
          "0x61",
          "BNB Smart Chain Testnet",
          ["https://bsc-testnet.blockpi.network/v1/rpc/public"],
          {
            decimals: 18,
            name: "Staked BNB",
            symbol: "tBNB",
          },
          ["https://testnet.bscscan.com"]
        );
      } else {
        if (chainId !== "0x38") {
          this.netWorkError = true;
          this.getChainId(
            "0x38",
            "BNB Smart Chain Mainnet",
            ["https://bsc-dataseed.bnbchain.org"],
            {
              decimals: 18,
              name: "Staked BNB",
              symbol: "BNB",
            },
            ["https://bscscan.com"]
          );
        } else {
          this.netWorkError = false;
          this.connectWallet();
        }
      }
    },
  },
  watch: {
    $route: function () {
      if (window.ethereum) {
        this.checkNetWork();
      } else {
        this.noWallet = true;
      }
    },
    "$store.state.chainId": function () {
      this.$router.go(0);
    },
  },
};
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  min-height: 100vh;
}
#app {
  font-family: Poppins-Regular !important;
  text-align: center;
  color: #2c3e50;
  position: relative;
  height: 100vh;
  margin: 0 auto;
  max-width: 500px;
  background-color: #f1f1f1;
  overflow: hidden;
}

.nav {
  width: 100%;
  height: 60px;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #eeeeee;
  a {
    width: 20%;
    font-size: 12px;
    color: #2c3e50;
    text-decoration: none;
    background-color: transparent;
    > div {
      padding-top: 6px;
    }

    &:visited,
    &:active,
    &:link,
    &:hover {
      background-color: transparent;
    }
    &.router-link-active {
      color: #ffc519;
      font-weight: bold;
    }
    & > img {
      width: 20px;
      height: 20px;
    }
  }
}

.netWorkError {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  color: rgb(173, 0, 0);
  background: rgb(255, 225, 225);
}
</style>
