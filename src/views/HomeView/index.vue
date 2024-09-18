<template>
  <div class="home">
    <div class="homeLogoBox">
      <img class="homeLogo" src="../../assets/img/homeLogo1.png" alt="" />

      <div>
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
        <div style="text-align: right; padding-top: 10px">
          <span>{{ sBtcBalance }} SBTC</span>
          <a
            :href="`https://pancakeswap.finance/swap?outputCurrency=${$store.state.sBtc}`"
            target="_blank"
          >
            <span style="padding-left: 10px; font-size: 12px; color: #1989fa"
              >購買</span
            >
          </a>
        </div>
      </div>
    </div>

    <div class="homeTop">
      <div class="homeTopTitle">
        BRC20 Launchpad <br />
        銘文流動性聚合平台
      </div>
      <img class="homeBg m-auto" src="../../assets/img/homeBg.png" alt="" />
      <div class="progress">
        <div>
          <div>
            <img class="icon" src="../../assets/img/core.png" alt="" />
            <span class="name">Core</span>
          </div>
          <div style="width: 80%">
            <van-progress
              stroke-width="8"
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
              pivot-text="已上市"
              percentage="100"
            />
          </div>
        </div>
        <div v-if="voting" class="progressBox">
          <div>
            <img
              class="icon"
              src="../../assets/img/tokenList/brc20-sbtc.png"
              alt=""
            />
            <span class="name">{{ voting.symbol }}</span>
          </div>
          <div class="progressBox" style="width: 80%">
            <div style="width: calc(100% - 64px)">
              <van-progress
                stroke-width="8"
                :pivot-text="`投票中 ${parseInt(
                  (voting.vote_num * 100) / votePassNum
                )}%`"
                text-color="#fff"
                pivot-color="#D9A504"
                color="#ffc519"
                track-color="#FFF2C9"
                :percentage="parseInt((voting.vote_num * 100) / votePassNum)"
              />
            </div>
            <div class="btnBox">
              <van-button
                :disabled="voting.voted"
                @click="vote(voting.project_name)"
                >投票</van-button
              >
            </div>
          </div>
        </div>
        <router-link to="/voting">
          <van-button class="votingBtn">項目詳情</van-button>
        </router-link>
        <!-- <van-progress pivot-text="红色" color="#ee0a24" :percentage="50" /> -->
      </div>
    </div>

    <div class="kolContent">
      <div class="title">
        <p>KOL認證與空投獎勵</p>
        <p>發起项目與推廣項目</p>
      </div>
      <div class="content">
        擁有活躍的Twitter等社交帳戶，並質押至少2100個SBTC，即可提交KOL認證；<br />
        通過KOL認證，即可發起項目投票或選擇上幣項目，推廣項目以獲得代幣空投獎勵；<br />
        根據推特粉絲數，認證推文的閱讀、評論、按讚和轉發數，以及實際質押的SBTC數量，並參考Telegram、Discord帳戶粉絲數和活躍度，綜合計算綁定項目的代幣空投分配權重。
      </div>

      <div v-if="[4, 5].includes(accountInfo.status)" class="reserve">
        <div class="weight">我的項目</div>
        <div>
          <div>{{ reserveInfo?.name }}</div>
          <div>{{ reserveBalance }} {{ reserveInfo?.symbol }}</div>
        </div>
        <div>
          <div>
            待收取收益： {{ viewCanWithdrawValue }} {{ reserveInfo?.symbol }}
          </div>
          <van-button
            size="small"
            :loading="withdrawLoading"
            @click="withdraw()"
            :disabled="!(viewCanWithdrawValue * 1)"
            >領取收益</van-button
          >
        </div>
        <div>
          <div>跨鏈進度</div>
          <div>{{ crossProgressValue }} %</div>
        </div>
        <div>
          <div>LP兌換發行進度</div>
          <div>{{ lpExProgressValue }} %</div>
        </div>
        <div>
          <div>KOL獎勵發行進度</div>
          <div>{{ kolProgressValue }} %</div>
        </div>
        <div class="desc">
          備註：每發生一筆新的跨鍊或LP兌換，均將根據當筆數量對應比例觸發一次新的社區空投，認證KOL將根據增加的分配權重得到對應的項目代幣空投獎勵，可隨時領取。
        </div>
      </div>

      <div v-else class="btn-group">
        <router-link to="/kol">
          <van-button type="primary">KOL認證</van-button>
        </router-link>
        <router-link
          :to="accountInfo.status === 1 && activeAmount ? '/kolAdd' : '/kol'"
        >
          <van-button>發起项目</van-button>
        </router-link>
        <router-link v-if="adminShow" to="/review">
          <van-button>审核</van-button>
        </router-link>
      </div>
      <div v-if="activeAmount * 1" class="mt-10">
        <div class="flex item-center justify-between">
          <div>質押數量: {{ activeAmount }} SBTC</div>
          <van-button
            class="activeBtn"
            size="small"
            :disabled="!(activeAmount * 1)"
            :loading="quitKolLoading"
            @click="quitKol(item)"
            >解除質押</van-button
          >
        </div>
        <p class="desc" style="width: 60%">
          解除SBTC質押，將即時終止KOL資格，且不可申請複效，謹慎操作。
        </p>
      </div>
    </div>
    <div class="bridgeContent">
      <div class="title">
        跨鏈橋Bridge<br />
        SBTC治理與回購
      </div>
      <div class="text-grey font-[400] text-[14px] mt-2">
        持有SBTC项目投票，質押SBTC项目空投。
      </div>
      <img class="bridgeBg" src="../../assets/img/bridge.png" alt="" />
      <div class="content">
        BSC鏈的SBTC
        代幣50%發行至跨鏈橋合約，以供活躍的SBTC銘文帳戶跨鏈轉移；30%以LP兌換的方式智能合約發行，即獎勵給流動性提供者（LP）；18%以空投的方式獎勵給參與社區推廣建設的KOL；2%發行至啟動池合約。
        <br />
        SmartBTC定期以網站收入和项目空投所得回購SBTC並轉入跨鏈橋合約，不斷啟動跨鏈額度直至100%，全部啟動後，雙向跨鏈同步生效。
      </div>
    </div>

    <div class="contant">
      <div class="title">
        <div>技術路線圖</div>
        <div
          class="text-grey font-[400] text-[14px] mb-4 mt-2 leading-5 w-4/5 m-auto"
        >
          BTC公平發行資產，跨鏈BSC整合豐富DeFi應用，逐步相容主流BTC L2 ......
        </div>
      </div>
      <div class="contantList">
        <van-steps
          direction="vertical"
          :active="-1"
          :inactive-icon="require('../../assets/img/point.png')"
        >
          <van-step>
            <div class="time">2023年3月9日</div>
            <div class="desc">
              Ordinals協定首個帶有BTC字元的銘文SBTC部署發布
            </div>
          </van-step>
          <van-step>
            <div class="time">2023年5月12日</div>
            <div class="desc">
              總量2100萬，單次500的SBTC被全部Mint近2000個地址參與
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年1月13日</div>
            <div class="desc">
              多家知名華人WEB3品牌共同舉辦的香港比特幣生態高峰會，共同發表SmartBTC
              一專注於比特幣生態的VC DAO
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年4月15日</div>
            <div class="desc">
              收購擁有超1萬錢包地址的CoinDAO，社區代幣100T可10:1置換為BSC鏈挖礦獎勵代幣100T，遷移加入SmartBTCdao,並為BRC852新資產提供基礎流動性
              <div>
                <router-link to="swap">
                  <van-button>去行權</van-button>
                </router-link>
              </div>
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年4月26日</div>
            <div class="desc">
              主網SmartBTC.io
              正式發布，開通第一個跨鏈資產SBTC，提供SWAP交易，推出流動池LP質押挖礦，上線以比特幣為指數銘文為權利金的永續選擇權
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
              香港Bitcoin Asia大會，SmartBTC正式發布錨定BRC20的新資產發行協議 --
              BRC852協議，為比特幣生態注入新的想像空間
            </div>
          </van-step>
          <van-step>
            <div class="time">2024年下半年</div>
            <div class="desc">
              新加坡Token2049會議期間，SmartBTC.io發布2.0版本，SmartBTC繼續整合豐富的DeFi應用，逐步向活躍比特幣銘文開放服務，SBTC成為市值TOP3主流銘文
            </div>
          </van-step>
          <van-step>
            <div class="time">2025年</div>
            <div class="desc">
              SmartBTC逐步相容主流BTC
              L2，並由BRC20(銘文)擴展到比特幣全生態，BRC852成為主流資產發行協議，SmartBTC.io成為比特幣生態底層應用，SBTC成為銘文新龍頭
            </div>
          </van-step>
        </van-steps>
      </div>
    </div>
    <div class="footer">
      <div class="iconBox">
        <a href="https://t.me/SmartBTCdao" target="_blank">
          <img class="linkLogo" src="../../assets/img/telgram.png" alt="" />
        </a>
        <a href="https://twitter.com/SmartBTCdao" target="_blank">
          <img class="linkLogo" src="../../assets/img/twiter.png" alt="" />
        </a>
        <a href="https://discord.com/invite/YHx7DXgm" target="_blank">
          <img class="linkLogo" src="../../assets/img/discord.png" alt="" />
        </a>
      </div>
      <div>© 2024 SmartBTC.io</div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import {
  shortStr,
  getContract,
  copy,
  getOkChainId,
  getWriteContract,
  getWriteContractLoad,
} from "../../utils";
import erc20ABI from "../../abi/erc20.json";
import inviteABI from "../../abi/invite.json";
import poolABI from "../../abi/pool.json";
import kolAbi from "../../abi/kol.json";
import { showToast, showConfirmDialog } from "vant";

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
      viewCanWithdrawValue: "",
      reserveInfo: {},
      timer: null,
      withdrawLoading: false,
      crossProgressValue: "",
      lpExProgressValue: "",
      kolProgressValue: "",
      quitKolLoading: false,
      reserveBalance: 0,
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
    if (this.$store.state.address) {
      this.getBalance();
      this.totalInvitePowers();
      this.totalPoolPowers();
      this.getAPY();
      this.getVotingList();
      this.getMinThreshold();
      this.getInfo();
      this.getActiveAmount();
      this.getProjectIssuedList();
    }
    this.timer = setInterval(() => {
      this.getProjectIssuedList();
      this.getVotingList();
      this.getBalance();
      this.getInfo();
      this.getMinThreshold();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    copyAddress(msg) {
      copy(msg);
      showToast("複製成功");
    },
    shortStr,
    async getBalance() {
      if (this.$store.state.address) {
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
        this.balance = (
          ethers.utils.formatUnits(balanceOf, decimals) * 1
        ).toFixed(2);

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
        ).toFixed(2);
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
        ethers.utils.formatUnits(
          MTokenAddress,
          this.$store.state.usdtDecimals
        ) *
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
      const data = await this.$axios.post(
        "https://smartbtc.io/bridge/kol/is_voted",
        {
          kol_address: this.$store.state.address,
          project_name,
        }
      );

      return data.data.data;
    },
    async getActiveAmount() {
      const res = await getContract(
        this.$store.state.pledgeAddress,
        kolAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      this.activeAmount = (ethers.utils.formatUnits(res, 18) * 1).toFixed(2);
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
    getProjectIssuedList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_issued_list")
        .then(async (res) => {
          this.projectIssuedList = res.data.data;

          const reserveInfo = this.projectIssuedList.filter(
            (list) => list.project_name == this.accountInfo.project_name
          );
          this.reserveInfo = reserveInfo[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getReserveBalance() {
      const decimals = await getContract(
        this.reserveInfo.contract_addr,
        erc20ABI,
        "decimals"
      );
      const balanceOf = await getContract(
        this.reserveInfo.contract_addr,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      );
      this.reserveBalance = (
        ethers.utils.formatUnits(balanceOf, decimals) * 1
      ).toFixed(2);
    },
    async getWithdraw() {
      const tokenId = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getTokenRatiosIndexByProjectName",
        this.accountInfo.project_name
      );

      this.tokenId = tokenId.toString();

      const viewCanWithdrawValue = await getWriteContract(
        this.$store.state.kolAddress,
        kolAbi,
        "viewCanWithdrawValue",
        tokenId.toString()
      );

      this.viewCanWithdrawValue = (
        ethers.utils.formatUnits(viewCanWithdrawValue, 18) * 1
      ).toFixed(2);

      const crossProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getCrossProgress",
        tokenId.toString()
      );

      const lpExProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getLpExProgress",
        tokenId.toString()
      );

      const kolProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getKolProgress",
        tokenId.toString()
      );

      this.crossProgressValue = ((crossProgress.toString() * 1) / 100).toFixed(
        2
      );
      this.lpExProgressValue = ((lpExProgress.toString() * 1) / 100).toFixed(2);
      this.kolProgressValue = ((kolProgress.toString() * 1) / 100).toFixed(2);
    },
    async withdraw() {
      this.withdrawLoading = true;
      await getWriteContractLoad(
        "0xf6250E66a044c152c6294B934A0e02067F9b65C7",
        kolAbi,
        "withdrawKolAirdrop",
        this.tokenId
      )
        .then((res) => {
          this.withdrawLoading = false;
          showToast("领取成功");
        })
        .catch((err) => {
          this.withdrawLoading = false;
          console.log(err);
        });
    },
    async quitKol() {
      showConfirmDialog({
        title: "解除质押",
        message: "解除质押即终止KOL资格。",
      })
        .then(async () => {
          this.quitKolLoading = true;

          const tokenId = await getContract(
            this.$store.state.kolAddress,
            kolAbi,
            "getTokenRatiosIndexByProjectName",
            this.accountInfo.project_name
          );

          getWriteContractLoad(
            this.$store.state.pledgeAddress,
            kolAbi,
            "quitKol",
            tokenId.toString()
          )
            .then((res) => {
              this.quitKolLoading = false;
              showToast("退出KOL成功");
              this.getActiveAmount();
            })
            .catch(() => {
              this.quitKolLoading = false;
            });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  watch: {
    reserveInfo(value) {
      value && this.getWithdraw();
      value && this.getReserveBalance();
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
  align-items: start;
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
.nav_title {
  font-size: 14px;
  color: #919090;
  padding-top: 10px;
  font-weight: 500;
  line-height: 20px;
}
.headerInfo {
  margin: 20px;
  .titleBox {
    padding: 20px;
    .title {
      font-size: 18px;
      font-weight: 600;
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
    width: 30%;
    margin-top: 20px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    border-radius: 10px;
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
.reserve {
  margin-top: 20px;
  font-size: 14px;
  background-color: #f8fcff;
  border-radius: 10px;
  padding: 20px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }

  button {
    height: 30px;
    border-radius: 5px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    font-size: 12px;
  }
  .weight {
    font-weight: 600;
    font-size: 16px;
    margin-top: 0 !important;
    padding-bottom: 10px;
  }
  .right {
    text-align: right;
  }
}

.desc {
  text-align: left;
  font-size: 12px;
  color: #999;
  line-height: 20px;
}
.activeBtn {
  height: 30px;
  border-radius: 5px;
  background: #ffc519;
  border: none;
  color: #333;
  font-weight: 600;
  font-size: 12px;
}
</style>
