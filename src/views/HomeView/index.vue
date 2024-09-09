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

    <div class="homeTop">
      <div class="homeTopTitle">
        BRC20 Launchpad <br />
        铭文流动性聚合平台
      </div>
      <img class="homeBg" src="../../assets/img/homeBg.png" alt="" />
      <div class="progress">
        <div>
          <div>
            <img class="icon" src="../../assets/img/core.png" alt="" />
            <span class="name">Core</span>
          </div>
          <div style="width: 80%">
            <van-progress
              stroke-width="8"
              color="#ffc519"
              track-color="#FFF2C9"
              pivot-color="#D9A504"
              pivot-text="已上市"
              text-color="#fff"
              percentage="100"
            />
          </div>
        </div>
        <div>
          <div>
            <img class="icon" src="../../assets/img/piin.png" alt="" />
            <span class="name">piin</span>
          </div>
          <div style="width: 80%">
            <van-progress
              stroke-width="8"
              color="#ffc519"
              track-color="#FFF2C9"
              pivot-color="#D9A504"
              pivot-text="已上市"
              text-color="#fff"
              percentage="100"
            />
          </div>
        </div>
        <div v-if="voting.symbol" class="progressBox">
          <div style="width: 80%">
            <div>
              <img class="icon" src="../../assets/img/tokenList/brc20-sbtc.png" alt="" />
              <span class="name">{{ voting.symbol }}</span>
            </div>
            <div style="width: 75%">
              <van-progress
                stroke-width="8"
                color="#ffc519"
                track-color="#FFF2C9"
                pivot-color="#D9A504"
                :pivot-text="`投票中 ${parseInt((voting.vote_num * 100) / votePassNum)}%`"
                text-color="#fff"
                :percentage="parseInt((voting.vote_num * 100) / votePassNum)"
              />
            </div>
          </div>

          <div class="btnBox">
            <van-button :disabled="voting.voted" @click="vote(voting.project_name)"
              >投票</van-button
            >
          </div>
        </div>
        <router-link to="/voting">
          <van-button class="votingBtn">投票支持</van-button>
        </router-link>
        <!-- <van-progress pivot-text="红色" color="#ee0a24" :percentage="50" /> -->
      </div>
    </div>

    <div class="kolContent">
      <div class="title">
        <p>KOL认证与空投奖励</p>
        <p>发起项目与推广项目</p>
      </div>
      <div class="content">
        拥有活跃的推特账户，并质押至少2100个SBTC，即可提交KOL认证；<br />
        通过KOL认证，即可发起项目投票或选择已上币项目，推广项目以获得代币空投奖励；<br />
        根据推特粉丝数，认证推文的阅读、评论、点赞和转发数，以及实际质押的SBTC数量，综合计算绑定项目的代币空投分配权重。
      </div>
      <div class="btn-group">
        <router-link to="/kol">
          <van-button>KOL认证</van-button>
        </router-link>
        <router-link :to="accountInfo.status === 1 && activeAmount ? '/kolAdd' : '/kol'">
          <van-button>发起项目</van-button>
        </router-link>
        <router-link v-if="adminShow" to="/review">
          <van-button>审核</van-button>
        </router-link>
      </div>
    </div>
    <div class="bridgeContent">
      <div class="title">
        跨链桥Bridge<br />
        SBTC治理与回购
      </div>
      <img class="bridgeBg" src="../../assets/img/bridge.png" alt="" />
      <div class="content">
        BSC链的SBTC
        代币50%发行至跨链桥合约，以供活跃的SBTC铭文账户跨链转移；30%以LP兑换的方式智能合约发行，即奖励给流动性提供者（LP）；18%以空投的方式奖励给参与社区推广建设的KOL；2%发行至启动池合约。<br />
        SmartBTC定期以网站收入和项目空投所得回购SBTC并转入跨链桥合约，不断激活跨链额度直至100%，全部激活后，双向跨链同步生效。<br />
        持有SBTC可参与项目投票，质押SBTC可领取项目空投。
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
              新加坡Token2049会议期间，SmartBTC.io发布2.0版本，SmartBTC继续集成丰富的DeFi应用，逐步向活跃比特币铭文开放服务，SBTC成为市值TOP3主流铭文
            </div>
          </van-step>
          <van-step>
            <div class="time">2025年</div>
            <div class="desc">
              SmartBTC逐步兼容主流BTC
              L2，并由BRC20(铭文)扩展到比特币全生态，BRC852成为主流资产发行协议，SmartBTC.io成为比特币生态底层应用，SBTC成为铭文新龙头
            </div>
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
import kolAbi from "../../abi/kol.json";
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
      voting: "",
      votePassNum: "",
      repMinThreshold: "",
      activeAmount: 0,
      accountInfo: "",
    };
  },
  computed: {
    adminShow() {
      return this.$store.state.adminAddress.includes(
        this.$store.state.address.toLowerCase()
      );
    },
  },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.getBalance();
      this.totalInvitePowers();
      this.totalPoolPowers();
      this.getAPY();
      this.getVotingList();
      this.getMinThreshold();
      this.getInfo();
      this.getActiveAmount();
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

    getVotingList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_voting_list")
        .then(async (res) => {
          this.voting = res.data.data[0];
          this.voting.voted = await this.isVoted(res.data.data[0].project_name);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMinThreshold() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/min_threshold")
        .then((res) => {
          this.repMinThreshold = res.data.data.RepMinThreshold;
          this.votePassNum = res.data.data.vote_pass_nums * 1;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    vote(project_name) {
      if (this.sBtcBalance * 1 < this.repMinThreshold * 1) {
        return showToast("SBTC余额不足");
      }
      this.$axios
        .post("https://smartbtc.io/bridge/kol/vote", {
          address: this.$store.state.address,
          project_name,
        })
        .then((res) => {
          console.log(res);
          if (res.data.message === "success") {
            showToast("投票成功");
            this.getVotingList();
          } else {
            showToast(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async isVoted(project_name) {
      const data = await this.$axios.post("https://smartbtc.io/bridge/kol/is_voted", {
        kol_address: this.$store.state.address,
        project_name,
      });

      return data.data.data;
    },
    async getActiveAmount() {
      const res = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      this.activeAmount = res.toString() * 1;
    },
    getInfo() {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/query_kol", {
          address: this.$store.state.address,
        })
        .then((res) => {
          this.accountInfo = res.data.data;
        })
        .catch((err) => {
          this.accountInfo = "";
          console.log(err);
        });
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
  color: #24232a;
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
  padding-bottom: 20px;
  background-image: url("../../assets/img/homeBg2.png");
  background-repeat: no-repeat;
  background-size: 100%;
  .homeTopTitle {
    font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    padding: 30px 0;
    p {
      margin: 0;
    }
  }
  .homeBg {
    width: 60%;
  }
  .progress {
    margin: 20px;
    > div {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      > div:nth-child(1) {
        width: 20%;
        display: flex;
        align-items: center;
        .icon {
          width: 24px;
        }
        .name {
          padding: 0 10px 0 4px;
        }
      }
    }
  }
  .votingBtn {
    width: 100%;
    margin-top: 20px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
  }
}
.kolContent {
  margin: 20px;
  .kolBg {
    width: 170px;
  }
  .title {
    font-size: 18px;
    padding-top: 20px;
    > p {
      margin-bottom: 10px;
      font-weight: 600;
    }
  }
  .content {
    font-size: 14px;
    line-height: 30px;
    text-align: left;
  }
}
.bridgeContent {
  margin: 20px;
  margin-top: 40px;
  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
  }
  .bridgeBg {
    width: 100%;
    margin: 20px auto;
  }
  .content {
    font-size: 14px;
    line-height: 30px;
    text-align: left;
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
      color: #24232a;
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
.btn-group {
  a {
    display: block;
    margin-top: 20px;
  }
  a:nth-child(2) {
    button {
      background: #ffc519;
      border: none;
      color: #333;
    }
  }
  button {
    width: 100%;
    font-weight: 600;
  }
}
.progressBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btnBox {
    width: 54px;
    button {
      height: 30px;
      border-radius: 10px;
      background: #ffc519;
      border: none;
      color: #333;
      font-weight: 600;
      font-size: 12px;
    }
  }
}
</style>
