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
    <!-- <div class="headerInfo headerInfo1">
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
      </div>
    </div> -->
    <!-- <div class="headerInfo">
      <div class="titleBox">
        <div class="title">BRC852新资产发行协议</div>
        <div class="nav_title">
          赋予锚定的BRC20资产不可撤销的流动性和丰富的DeFi应用让比特币铭文焕发新生命.....
        </div>
      </div>
      <div class="powerLists">
        <div>
          <span>锚定主流BRC20资产<br />从BTC到BSC跨链发行BRC852</span>
          <router-link to="btcSwap" class="">
            <van-button>去跨链</van-button>
          </router-link>
        </div>
        <div>
          <span>流动池LP质押发行<br />提供流动性以获取BRC852新资产</span>
          <router-link to="lpSwap">
            <van-button>去兑换</van-button>
          </router-link>
        </div>
        <div class="apy">
          <span>依托BRC852 - 100T启动池<br />经部署即刻拥有流动性</span>
          <router-link to="lp">
            <van-button>去挖矿</van-button>
          </router-link>
        </div>
        <div class="apy">
          <span>向BRC20社区Builders<br />(Twitter、Telegram)空投BRC852</span>
          <a href="https://twitter.com/SmartBTCdao" target="_blank">
            <van-button>推特申报</van-button>
          </a>
        </div>
      </div>
    </div> -->
    <div class="homeTop">
      <div class="homeTopTitle">
        <p>BRC20 Launchpad</p>
        <p>铭文流动性聚合平台</p>
        <p>跨链桥Bridge</p>
      </div>
      <img class="homeBg" src="../../assets/img/homeBg.png" alt="" />
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
            <div class="desc">总量2100万，单次500的SBTC被全部Mint近2000个地址参与</div>
          </van-step>
          <van-step>
            <div class="time">2024年1月13日</div>
            <div class="desc">
              多家知名华人WEB3品牌共同举办的香港比特币生态峰会，联合发布SmartBTC
              一专注于比特币生态的VC DAO
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年4月15日</div>
            <div class="desc">
              收购拥有超1万钱包地址的CoinDAO，社区代币100T可10:1置换为BSC链挖矿奖励代币100T，迁移加入SmartBTCdao,并为BRC852新资产提供基础流动性
              <div>
                <router-link to="swap">
                  <van-button>去行权</van-button>
                </router-link>
              </div>
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年4月26日</div>
            <div class="desc">
              主网SmartBTC.io
              正式发布，开通第一个跨链资产SBTC，提供SWAP交易，推出流动池LP质押挖矿，上线以比特币为指数铭文为权利金的永续期权
              <div>
                <router-link to="options">
                  <van-button>期权</van-button>
                </router-link>
              </div>
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年5月10日</div>
            <div class="desc">
              香港Bitcoin Asia大会，SmartBTC正式发布锚定BRC20的新资产发行协议 --
              BRC852协议，为比特币生态注入新的想象空间
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年下半年</div>
            <div class="desc">
              SmartBTC继续集成丰富的DeFi应用，逐步向活跃比特币铭文开放服务，SBTC成为市值TOP3主流铭文
            </div>
          </van-step>
          <van-step>
            <div class="time">2025年</div>
            <div class="desc">
              SmartBTC逐步兼容主流BTC
              L2，并由BRC20(铭文)扩展到比特币全生态，BRC852成为主流资产发行协议，SmartBTC.io成为比特币生态底层应用，SBTC成为铭文新龙头
            </div>
          </van-step>
          <van-step>
            <router-link to="kol">
              <van-button>KOL申请</van-button>
            </router-link>
          </van-step>
        </van-steps>
      </div>
    </div>
    <div class="footer">
      <div class="iconBox">
        <a href="https://t.me/SmartBTCdao">
          <img class="linkLogo" src="../../assets/img/telgram.png" alt="" />
        </a>
        <a href="https://twitter.com/SmartBTCdao">
          <img class="linkLogo" src="../../assets/img/twiter.png" alt="" />
        </a>
        <img class="linkLogo" src="../../assets/img/discord.png" alt="" />
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
  margin: 20px;
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
      line-height: 20px;
    }
  }
  .powerLists {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      background: #f8fcff;
      padding: 10px;
      border-radius: 10px;

      > span:first-child {
        width: 70%;
        text-align: left;
        line-height: 20px;
      }
      .van-button {
        height: 30px;
        line-height: 30px;
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

.headerInfo1 {
  padding: 0;
  margin: 10px 20px;
  .power {
    border-top: none;
    padding: 10px;
    margin: 0;
    background-color: #f8fcff;
    border-radius: 10px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      .van-button {
        height: 30px;
        line-height: 30px;
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
.homeTop {
  padding-bottom: 50px;
  background-image: url("../../assets/img/homeBg2.png");
  background-repeat: no-repeat;
  background-size: 100%;
  .homeTopTitle {
    font-size: 25px;
    line-height: 40px;
    font-weight: 500;
    padding: 30px 0;
    p {
      margin: 0;
    }
  }
  .homeBg {
    width: 60%;
  }
}
.contant {
  background-size: 100% 100%;
  background-color: #fff;
  padding: 10px 0;
  margin: 20px;
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
      margin-bottom: 20px;
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
    line-height: 30px;
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
  padding: 10px 30px 30px;
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
