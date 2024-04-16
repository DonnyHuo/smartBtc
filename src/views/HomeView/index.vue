<template>
  <div class="home">
    <div class="homeLogoBox">
      <img class="homeLogo" src="../../assets/img/homeLogo1.png" alt="" />
      <div class="addressBox">
        <img class="walletIcon" src="../../assets/img/wallet.png" alt="" />
        <div class="address">{{ shortStr($store.state.address) }}</div>
        <img
          class="copy"
          src="../../assets/img/copy.png"
          @click="copyAddress($store.state.address)"
          alt=""
        />
      </div>
    </div>
    <!-- <div class="wallet">
      <div class="addressAndBalance">
        <span>100T 合约地址</span>
        <div class="tokenAddress">
          <a :href="link">{{ shortStr($store.state.t100) }}</a>
          <img
            @click="copyAddress($store.state.t100)"
            src="../../assets/img/copy.png"
            alt=""
            class="copyAddress"
          />
        </div>
      </div>
    </div> -->
    <div class="headerInfo">
      <div class="titleBox">
        <div class="title">专注比特币生态的VC DAO</div>
        <div class="nav_title">DAO治理代币 - SBTC | 质押挖矿代币 - 100T</div>
      </div>
      <div class="power">
        <div>
          <div><span>SBTC余额</span></div>
          <div class="data-num">{{ sBtcBalance }}</div>
          <a
            :href="`https://pancakeswap.finance/swap?outputCurrency=${$store.state.sBtc}`"
          >
            <van-button>SWAP</van-button>
          </a>
        </div>
        <div>
          <div><span>100T余额</span></div>
          <div class="data-num">{{ balance }}</div>
          <a
            :href="`https://pancakeswap.finance/swap?outputCurrency=${$store.state.t100}`"
          >
            <van-button>SWAP</van-button>
          </a>
        </div>

        <div>
          <div><span> 質押算力 </span></div>
          <div class="data-num">{{ poolPowers }} H/S</div>
          <router-link to="lp" class="">
            <van-button>去質押</van-button>
          </router-link>
        </div>
        <div>
          <div><span> 邀請算力 </span></div>
          <div class="data-num">{{ invitePowers }} H/S</div>
          <router-link to="share?showPoster=true">
            <van-button>去邀請</van-button>
          </router-link>
        </div>
        <div class="apy">
          <span>挖矿APY</span>
          <span>{{ apy }}%</span>
          <router-link to="withdraw">
            <van-button>去领取</van-button>
          </router-link>
        </div>
        <div class="apy">
          <span>CoinDAO</span>
          <span>10 : 1</span>
          <router-link to="swap">
            <van-button>去行权</van-button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="contant">
      <div class="title">
        <div>技术路线图</div>
        <div>BTC公平发行资产，跨链BSC集成丰富DeFi应用，逐步兼容主流BTC L2 ......</div>
      </div>
      <div class="contantList">
        <van-steps
          direction="vertical"
          :active="-1"
          :inactive-icon="require('../../assets/img/point.png')"
        >
          <van-step>
            <div class="time">2023年3月9日</div>
            <div class="desc">Ordinals协议首个带BTC字符的铭文SBTC部署发布</div>
          </van-step>
          <van-step>
            <div class="time">2023年5月12日</div>
            <div class="desc">总量2100万，单次500的SBTC被全部Mint 近2000个地址参与</div>
          </van-step>

          <van-step>
            <div class="time">2023年7月20日</div>
            <div class="desc">OKX发布BRC20-S协议，首个支持多铭文质押的 100T部署发布</div>
          </van-step>
          <van-step>
            <div class="time">2024年1月13日</div>
            <div class="desc">
              多家知名华人WEB3品牌共同举办的香港比特币生态 峰会，联合发布SmartBTC ——
              专注于比特币生态 的VC DAO
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年4月</div>
            <div class="desc">
              比特币减半前夕，主网SmartBTC.io 正式发布，推出
              流动池LP质押挖矿，上线以比特币为指数，铭文为权
              利金的永续期权，并正式确定SBTC作为DAO治理代币
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年4月15日</div>
            <div class="desc">
              收购拥有超1万钱包地址的CoinDAO，社区代币100T
              可10：1置换为铭文100T，迁移加入SmartBTC DAO
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年</div>
            <div class="desc">
              SmartBTC继续集成丰富的DeFi应用，逐步向活跃比特币铭文开放服务，SBTC成为市值TOP3主流铭文
            </div>
          </van-step>
          <van-step>
            <div class="time">2025年</div>
            <div class="desc">
              SmartBTC逐步兼容主流BTC L2，并由铭文扩展到
              比特币全生态，成为比特币生态的底层应用，SBTC 成为铭文新龙头
            </div>
          </van-step>
        </van-steps>
      </div>
    </div>

    <div class="tips">
      <p>BTC~BSC跨链桥即将上线</p>
      <p>可在推特@SmartBTCdao申请内测</p>
    </div>
    <div class="footer">
      <div class="iconBox">
        <a href="https://twitter.com/SmartBTCdao">
          <img class="linkLogo" src="../../assets/img/telgram.png" alt="" />
        </a>
        <a href="https://twitter.com/SmartBTCdao">
          <img class="linkLogo" src="../../assets/img/twiter.png" alt="" />
        </a>
        <a href="https://twitter.com/SmartBTCdao">
          <img class="linkLogo" src="../../assets/img/wechat.png" alt="" />
        </a>
      </div>
      <div>© 2024 SmartBTC.io</div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { shortStr, getContract, copy, getOkChainId } from "../../utils";
import erc20ABI from "../../abi/erc20.json";
import inviteABI from "../../abi/invite.json";
import poolABI from "../../abi/pool.json";
import { showToast } from "vant";

export default {
  name: "HomeView",
  data() {
    return {
      balance: "--",
      sBtcBalance: "--",
      invitePowers: "--",
      poolPowers: "--",
      apy: "--",
      link: `https://bscscan.com/address/${this.$store.state.address}`,
    };
  },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.getBalance();
      this.totalInvitePowers();
      this.totalPoolPowers();
      this.getAPY();
    }
  },
  methods: {
    copyAddress(msg) {
      copy(msg);
      showToast("複製成功");
    },
    shortStr,
    async getBalance() {
      if (this.$store.state.t100 && this.$store.state.address) {
        const balanceOf = await getContract(
          this.$store.state.t100,
          erc20ABI,
          "balanceOf",
          this.$store.state.address
        ).catch((err) => console.log(err));
        const decimals = await getContract(
          this.$store.state.t100,
          erc20ABI,
          "decimals"
        ).catch((err) => console.log(err));
        this.balance = (ethers.utils.formatUnits(balanceOf, decimals) * 1).toFixed(6);

        const sBtcBalance = await getContract(
          this.$store.state.sBtc,
          erc20ABI,
          "balanceOf",
          this.$store.state.address
        );
        const sBtcDecimals = await getContract(
          this.$store.state.sBtc,
          erc20ABI,
          "decimals"
        );
        this.sBtcBalance = (
          ethers.utils.formatUnits(sBtcBalance, sBtcDecimals) * 1
        ).toFixed(6);
      }
    },

    async totalInvitePowers() {
      const invitePower = await getContract(
        this.$store.state.inviteAddress,
        inviteABI,
        "getInvitePower",
        this.$store.state.address
      ).catch((err) => console.log(err));
      this.invitePowers = (invitePower.toString() * 1).toFixed(2);
    },
    async totalPoolPowers() {
      const poolPower = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getUserBalance",
        this.$store.state.address
      ).catch((err) => console.log(err));
      this.poolPowers = (
        ethers.utils.formatUnits(poolPower, this.$store.state.usdtDecimals) * 1
      ).toFixed(2);
    },

    async getAPY() {
      const apy = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "perBlockAndLpRewardPools"
      ).catch((err) => console.log(err));
      const MTokenAddress = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getMTokenPrice"
      ).catch((err) => console.log(err));
      this.apy = (
        ethers.utils.formatUnits(apy, 8) *
        24 *
        60 *
        20 *
        365 *
        ethers.utils.formatUnits(MTokenAddress, this.$store.state.usdtDecimals) *
        100
      ).toFixed(2);
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  height: calc(100vh - 50px);
  font-size: 14px;
  overflow: auto;
  background-color: #fff;
}
.homeLogoBox {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;

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
    .copy {
      width: 15px;
      margin-left: 2px;
    }
  }
}

.wallet {
  background: #fff;
  color: #111;
  padding: 10px 20px;
  font-weight: 600;
  border-bottom: 1px solid #eeeeee;
  > div {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tokenAddress {
      display: flex;
      align-items: center;
      a {
        text-decoration: underline;
      }
    }
    .copyAddress {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
  }
}
.headerInfo {
  background: #f8fcff;
  margin: 20px;
  border-radius: 10px;
  .titleBox {
    padding: 20px;
    .title {
      font-size: 18px;
      font-weight: 600;
    }
    .nav_title {
      font-size: 14px;
      color: #919090;
      padding-top: 10px;
      font-weight: 500;
    }
  }
  .power {
    margin: 20px;
    margin-top: 0;
    padding: 20px 0;
    font-weight: 600;
    border-top: 1px solid rgba(187, 227, 255, 0.5);
    > div {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .van-button {
        height: 30px;
        padding: 4px 10px;
        border-radius: 4px;
        background: #ffc519;
        border: none;
        color: #333;
        font-weight: 600;
        font-size: 12px;
      }
    }
  }
}

.contant {
  background-size: 100% 100%;
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  background: #f8fcff;
  border-radius: 10px;
  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
    > div:nth-child(2) {
      width: 80%;
      margin: 0 auto;
      color: #919090;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 40px;
    }
  }
  .contantList {
    text-align: left;
    .van-steps {
      background-color: transparent;
    }
    .time {
      font-size: 14px;
      color: #999;
    }
    .desc {
      font-size: 14px;
      line-height: 22px;
      color: #111;
      font-weight: 500;
    }
    .--van-step-circle-size {
      width: 10px;
    }
    ::v-deep .van-step__line {
      background-color: #ffc519;
    }
    ::v-deep .van-step__circle {
      background-color: #ffc519;
    }
  }
  .apy {
    padding: 20px 0;
    font-weight: 600;
  }
  .loading {
    position: relative;
    img {
      margin: 0 auto;
      width: 60%;
    }
    .loading1 {
      position: absolute;
      bottom: 20px;
      left: 60%;
      transform: translate(-50%);
    }
  }
  button {
    height: 30px;
    padding: 4px 10px;
    border-radius: 4px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    font-size: 12px;
    .van-button__text {
      p {
        color: #333;
        font-weight: 600;
        font-size: 12px;
      }
    }
  }
  .addressCopy {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    a {
      text-decoration: underline;
    }
  }
  .copy {
    width: 15px;
    height: 15px;
    margin-left: 4px;
  }
  .hecoBuy {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.tips {
  background-color: #fff;
  color: #ff6719;
  font-size: 18px;
  font-weight: 600;
  p {
    margin: 0;
  }
}
.footer {
  padding: 40px 30px 30px 30px;
  background-color: #fff;
  font-size: 16px;
  color: #111;
  font-weight: 500;
  .iconBox {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 20px;

    .linkLogo {
      width: 30px;
    }
  }

  > div:last-child {
    font-size: 12px;
    color: #333;
    padding-top: 10px;
  }
}
</style>
