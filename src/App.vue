<template>
  <div v-if="netWorkError" class="netWorkError">
    {{
      chainId !== "0x38"
        ? $t("connectTip[0]")
        : chainId !== "0x80"
        ? $t("connectTip[1]")
        : ""
    }}
  </div>
  <div v-if="noWallet" class="netWorkError">{{ $t("noWallet") }}</div>
  <div class="contentView">
    <router-view />
  </div>
  <div class="nav z-10">
    <div class="flex flex-col items-center" v-for="(list, index) in navList">
      <router-link v-if="!list.noJump" :key="list.name" :to="list.route">
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
      <div class="box" v-else @click="alertMessage">
        <img class="w-[20px] h-[20px]" :src="list.iconUrl" alt="" />
        <div>{{ list.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { showDialog } from "vant";
export default {
  name: "DaoView",
  data() {
    return {
      activeIndex: 0,
      navList: [
        {
          name: "kol",
          route: `${
            this.$store.state.accountInfoStatus === 1 &&
            this.$store.state.activeAmount * 1
              ? "/kolAdd"
              : "/kol"
          }`,
          active: false,
          text: this.$t("footer.mine"),
          iconUrl: require("./assets/img/dao.png"),
          iconUrlAct: require("./assets/img/daoAct.png"),
        },
        {
          name: "btcSwap",
          route: "/btcSwap",
          text: this.$t("footer.bridge"),
          active: false,
          iconUrl: require("./assets/img/swap.png"),
          iconUrlAct: require("./assets/img/swapAct.png"),
        },
        {
          name: "lpSwap",
          route: "/lpSwap",
          text: this.$t("footer.swap"),
          active: false,
          iconUrl: require("./assets/img/lp.png"),
          iconUrlAct: require("./assets/img/lpAct.png"),
        },
        {
          name: "lp",
          route: "/lp",
          text: this.$t("footer.pool"),
          active: false,
          iconUrl: require("./assets/img/options.png"),
          iconUrlAct: require("./assets/img/optionsAct.png"),
          noJump: true,
        },
        {
          name: "share",
          route: "/share",
          text: this.$t("footer.community"),
          active: false,
          iconUrl: require("./assets/img/share.png"),
          iconUrlAct: require("./assets/img/shareAct.png"),
          noJump: true,
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
    async getChainId(
      networkId,
      networkName,
      rpcUrls,
      nativeCurrency,
      blockExplorerUrls
    ) {
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
          // this.connectWallet();
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
          return this.getChainId(
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
          // this.connectWallet();
        }
      } else if (window.location.hash == "#/btcSwap") {
        console.log("btcSwap");
        this.netWorkError = false;
      }
      //  else if (window.location.hash == "#/kol") {
      //   this.netWorkError = false;
      //   await window.ethereum.request({
      //     method: "wallet_switchEthereumChain",
      //     params: [{ chainId: "0x89" }], // chainId must be in hexadecimal numbers
      //   });
      // }
      else {
        if (chainId !== "0x38") {
          this.netWorkError = true;
          return this.getChainId(
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
          // this.connectWallet();
        }
      }
    },
    alertMessage() {
      showDialog({
        message: `${this.$t("messageTip[0]")}\n ${this.$t("messageTip[1]")}`,
        confirmButtonText: this.$t("sure"),
      }).then(() => {
        // on close
      });
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
#app {
  text-align: center;
  color: #2c3e50;
  max-width: 500px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
}

.nav {
  width: 100%;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #eeeeee;
  padding-top: 10px;
  padding-bottom: Max(constant(safe-area-inset-bottom), 10px);
  /* Older iOS */
  padding-bottom: Max(env(safe-area-inset-bottom), 10px);

  /* Newer iOS */
  a,
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
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

.contentView {
  text-align: center;
  height: calc(100vh - 50px - Max(env(safe-area-inset-bottom), 10px));
  overflow: scroll;
}
</style>
