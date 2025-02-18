<template>
  <div class="home">
    <div class="homeLogoBox">
      <div>
        <img class="homeLogo" src="../../assets/img/homeLogo1.png" alt="" />
      </div>

      <div class="flex flex-col items-end">
        <div
          class="addressBox"
          v-if="$store.state.address"
          @click="copyAddress($store.state.address)"
        >
          <img class="walletIcon" src="../../assets/img/wallet.png" alt="" />
          <div class="address">{{ shortStr($store.state.address) }}</div>
          <img
            v-if="$store.state.address"
            class="copy"
            src="../../assets/img/copy.png"
            alt=""
          />
        </div>
        <div v-else @click="connectWallet()">{{ $t("connectWallet") }}</div>
        <div
          style="text-align: right; padding-top: 5px"
          class="flex item-center justify-between"
        >
          <span v-if="$store.state.address">{{ sBtcBalance }} BRC20 </span>
          <a
            v-if="$store.state.address"
            :href="`https://pancakeswap.finance/swap?outputCurrency=${$store.state.sBtc}`"
            target="_blank"
          >
            <span style="padding-left: 10px; font-size: 12px; color: #1989fa">{{
              $t("home.buy")
            }}</span>
          </a>
          <van-dropdown-menu :overlay="false">
            <van-dropdown-item
              v-model="value1"
              :options="option1"
              @change="changeLan"
            />
          </van-dropdown-menu>
        </div>
      </div>
    </div>

    <div class="homeTop">
      <div class="homeTopTitle font-medium">
        {{ $t("home.title[0]") }}<br />
        {{ $t("home.title[1]") }}
      </div>
      <img class="homeBg m-auto" src="../../assets/img/homeBg.png" alt="" />
      <div class="progress">
        <div class="flex items-center gap-4">
          <div>
            <img class="icon" src="../../assets/img/pizza.png" alt="" />
            <span class="name">pizzaπ</span>
          </div>
          <div class="flex items-center gap-1">
            <span>{{
              shortStr("2oSanm2VM5mCs9bvcjvmCK2ZU4wWXmXwNENmyMUdpump")
            }}</span>
            <img
              class="w-[15px]"
              src="../../assets/img/copy.png"
              alt=""
              @click="
                copyAddress('2oSanm2VM5mCs9bvcjvmCK2ZU4wWXmXwNENmyMUdpump')
              "
            />
          </div>
        </div>
        <div>
          <div>
            <img
              class="icon"
              src="../../assets/img/tokenList/brc20-sats.png"
              alt=""
            />
            <span class="name">sats</span>
          </div>
          <div style="width: 80%">
            <van-progress
              stroke-width="8"
              :pivot-text="`${$t('home.onMarket')}`"
              percentage="100"
            />
          </div>
        </div>
        <div>
          <div>
            <img
              class="icon"
              src="../../assets/img/tokenList/brc20-ordi.png"
              alt=""
            />
            <span class="name">ordi</span>
          </div>
          <div style="width: 80%">
            <van-progress
              stroke-width="8"
              :pivot-text="`${$t('home.onMarket')}`"
              text-color="#fff"
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
                :pivot-text="`${$t('home.voting')} ${parseInt(
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
                :disabled="
                  voting.voted || voting.vote_num * 1 == votePassNum * 1
                "
                @click="vote(voting.project_name)"
                >{{ $t("home.vote") }}</van-button
              >
            </div>
          </div>
        </div>
        <router-link to="/voting">
          <van-button class="votingBtn">{{
            $t("home.projectDetail")
          }}</van-button>
        </router-link>
        <!-- <van-progress pivot-text="红色" color="#ee0a24" :percentage="50" /> -->
      </div>
    </div>

    <div class="kolContent">
      <div class="title font-medium">
        <p>{{ $t("home.title2[0]") }}</p>
        <p>{{ $t("home.title2[1]") }}</p>
      </div>
      <div class="content">
        {{ $t("home.desc2[0]") }}<br />
        {{ $t("home.desc2[1]") }}<br />
        {{ $t("home.desc2[2]") }}
      </div>

      <div v-if="[4, 5].includes(accountInfo.status)" class="reserve">
        <div class="weight">{{ $t("home.myProject") }}</div>
        <div>
          <div>{{ reserveInfo?.name }}</div>
          <div>{{ reserveBalance }} {{ reserveInfo?.symbol }}</div>
        </div>
        <div>
          <div>
            {{ $t("home.revenueCollected") }}： {{ viewCanWithdrawValue }}
            {{ reserveInfo?.symbol }}
          </div>
          <van-button
            size="small"
            :loading="withdrawLoading"
            @click="withdraw()"
            :disabled="!(viewCanWithdrawValue * 1)"
          >
            {{ $t("home.receiveBenefits") }}</van-button
          >
        </div>
        <div>
          <div>{{ $t("home.crossChainProgress") }}</div>
          <div>{{ crossProgressValue }} %</div>
        </div>
        <div>
          <div>{{ $t("home.LpProgress") }}</div>
          <div>{{ lpExProgressValue }} %</div>
        </div>
        <div v-if="kolProgressValue">
          <div>{{ $t("home.KOLProgress") }}</div>
          <div>{{ kolProgressValue }} %</div>
        </div>
        <div class="desc">
          {{ $t("home.progressDesc") }}
        </div>
      </div>

      <div v-else class="btn-group">
        <router-link to="/kol">
          <van-button type="primary">{{ $t("home.kolBtn") }}</van-button>
        </router-link>
        <router-link
          :to="
            accountInfo.status === 1 && activeAmount * 1 ? '/kolAdd' : '/kol'
          "
        >
          <van-button>{{ $t("home.startProject") }}</van-button>
        </router-link>
        <router-link v-if="adminShow" to="/review">
          <van-button>{{ $t("home.review") }}</van-button>
        </router-link>
        <router-link v-if="adminShow" to="/manage">
          <van-button>LP提取</van-button>
        </router-link>
      </div>
      <div v-if="activeAmount * 1 > 0" class="mt-10">
        <div class="flex item-center justify-between">
          <div>{{ $t("home.dispositNumber") }}: {{ activeAmount }} ERC20</div>
          <van-button
            class="activeBtn"
            size="small"
            :disabled="!(activeAmount * 1)"
            :loading="quitKolLoading"
            @click="quitKol(item)"
            >{{ $t("home.liftDisposit") }}</van-button
          >
        </div>
        <p class="desc" style="width: 60%">
          {{ $t("home.dispositDesc") }}
        </p>
      </div>
    </div>
    <div class="bridgeContent">
      <div class="title font-medium">
        {{ $t("home.title3[0]") }}<br />
        {{ $t("home.title3[1]") }}
      </div>
      <div class="text-grey font-medium text-[14px] mt-2">
        {{ $t("home.navTitle3") }}
      </div>
      <img
        class="bridgeBg"
        :src="
          require($i18n.locale == 'zh'
            ? '../../assets/img/bridge.png'
            : '../../assets/img/bridgeEn.png')
        "
        alt=""
      />
      <div class="content">
        {{ $t("home.desc3[0]") }}<br />
        {{ $t("home.desc3[1]") }}
      </div>
    </div>

    <div class="px-[20px] my-2 mt-10 text-left leading-6">
      <div class="title font-medium text-center w-3/4 m-auto text-[18px]">
        {{ $t("kolAdd.descTitle") }}
      </div>
      <div
        class="text-grey font-medium text-[14px] mt-2 pb-5 text-center leading-5"
      >
        <div v-if="$i18n.locale == 'zh'">
          <div>{{ $t("kolAdd.descNavTitle[0]") }}</div>
          <div>{{ $t("kolAdd.descNavTitle[1]") }}</div>
        </div>
        <div v-if="$i18n.locale == 'en'">
          <div>{{ $t("kolAdd.descNavTitle[2]") }}</div>
        </div>
      </div>
      <div class="text-[14px]">
        <div class="pb-2">
          {{ $t("kolAdd.descTips[0]") }}
        </div>
        <div class="pb-2">{{ $t("kolAdd.descTips[1]") }}</div>
        <div class="pb-2">
          {{ $t("kolAdd.descTips[2]") }}
        </div>
      </div>
    </div>

    <div class="contant">
      <div class="title">
        <div class="font-medium">{{ $t("home.title4") }}</div>
        <div
          class="text-grey font-medium text-[14px] mb-4 mt-2 leading-6 w-4/5 m-auto"
        >
          {{ $t("home.navTitle4") }}
        </div>
      </div>
      <div class="contantList">
        <van-steps
          direction="vertical"
          :active="-1"
          :inactive-icon="require('../../assets/img/point.png')"
        >
          <van-step>
            <div class="time">{{ $t("home.desc4[0].time") }}</div>
            <div class="desc">
              {{ $t("home.desc4[0].desc") }}
            </div>
          </van-step>
          <van-step>
            <div class="time">{{ $t("home.desc4[1].time") }}</div>
            <div class="desc">
              {{ $t("home.desc4[1].desc") }}
            </div>
          </van-step>
          <van-step>
            <div class="time">{{ $t("home.desc4[2].time") }}</div>
            <div class="desc">
              {{ $t("home.desc4[2].desc") }}
            </div>
          </van-step>
          <van-step>
            <div class="time">{{ $t("home.desc4[3].time") }}</div>
            <div class="desc">
              {{ $t("home.desc4[3].desc") }}
              <div>
                <router-link to="swap">
                  <van-button>{{ $t("home.toExerciseRights") }}</van-button>
                </router-link>
              </div>
            </div>
          </van-step>
          <van-step>
            <div class="time">{{ $t("home.desc4[4].time") }}</div>
            <div class="desc">
              {{ $t("home.desc4[4].desc") }}
              <div>
                <router-link to="options">
                  <van-button>{{ $t("home.options") }}</van-button>
                </router-link>
              </div>
            </div>
          </van-step>
          <van-step>
            <div class="time">{{ $t("home.desc4[5].time") }}</div>
            <div class="desc">
              {{ $t("home.desc4[5].desc") }}
            </div>
          </van-step>
          <van-step>
            <div class="time">{{ $t("home.desc4[6].time") }}</div>
            <div class="desc">
              {{ $t("home.desc4[6].desc") }}
            </div>
          </van-step>
          <van-step>
            <div class="time">{{ $t("home.desc4[7].time") }}</div>
            <div class="desc">
              {{ $t("home.desc4[7].desc") }}
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
  connectWallet,
  getWriteContract,
  getWriteContractLoad,
} from "../../utils";
import erc20ABI from "../../abi/erc20.json";
import inviteABI from "../../abi/invite.json";
import poolABI from "../../abi/pool.json";
import kolAbi from "../../abi/kol.json";
import depositAbi from "../../abi/deposit.json";
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
      option1: [
        { text: "繁体中文", value: "zh" },
        { text: "English", value: "en" },
      ],
      value1: this.$store.state.lang,
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
    console.log("this.$store.state.address", this.$store.state.address);
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
      this.timer = setInterval(() => {
        this.getProjectIssuedList();
        this.getVotingList();
        this.getBalance();
        this.getInfo();
        this.getMinThreshold();
        this.getActiveAmount();
      }, 5000);
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    changeLan(value) {
      console.log("value", value);
      this.$store.commit("setLan", value);
      location.reload();
    },
    copyAddress(msg) {
      copy(msg);
      showToast("複製成功");
    },
    shortStr,
    connectWallet,
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
          if (res.data.data.length > 0) {
            this.voting = res.data.data[0];
            this.voting.voted = await this.isVoted(
              res.data.data[0].project_name
            );
          }
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
        return showToast("ERC20余额不足");
      }
      if (!this.$store.state.address) {
        return;
      }

      this.$axios
        .post("https://smartbtc.io/bridge/kol/vote", {
          address: this.$store.state.address,
          project_name,
        })
        .then((res) => {
          console.log(res);
          if (res.data.message === "success") {
            showToast(this.$t("home.voteSuccess"));
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
        depositAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      this.activeAmount = (ethers.utils.formatUnits(res, 18) * 1).toFixed(2);
      this.$store.commit(
        "setActiveAmount",
        (ethers.utils.formatUnits(res, 18) * 1).toFixed(2)
      );
    },
    getInfo() {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/query_kol", {
          address: this.$store.state.address,
        })
        .then((res) => {
          this.accountInfo = res.data.data;
          this.$store.commit("setAccountInfoStatus", accountInfo.status);
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
          if (res.data.data.length > 0) {
            this.projectIssuedList = res.data.data;
            if ([4, 5].includes(this.accountInfo.status)) {
              const reserveInfo = this.projectIssuedList.filter(
                (list) => list.project_name == this.accountInfo.project_name
              );
              this.reserveInfo = reserveInfo[0];
            }
          }
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
      console.log("crossProgress", crossProgress);

      const lpExProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getLpExProgress",
        tokenId.toString()
      );
      this.crossProgressValue = ((crossProgress.toString() * 1) / 100).toFixed(
        2
      );
      this.lpExProgressValue = ((lpExProgress.toString() * 1) / 100).toFixed(2);

      if (this.reserveInfo.name !== "ERC20") {
        const kolProgress = await getContract(
          this.$store.state.kolAddress,
          kolAbi,
          "getKolProgress",
          tokenId.toString()
        );
        this.kolProgressValue = ((kolProgress.toString() * 1) / 100).toFixed(2);
      } else {
        this.kolProgressValue = "";
      }
    },
    async withdraw() {
      this.withdrawLoading = true;
      await getWriteContractLoad(
        this.$store.state.kolAddress,
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
        title: `${this.$t("home.unstake")}`,
        message: `${this.$t("home.unstakeDesc")}`,
        confirmButtonText: this.$t("sure"),
        cancelButtonText: this.$t("cancel"),
      })
        .then(async () => {
          this.quitKolLoading = true;

          const tokenId = await getContract(
            this.$store.state.kolAddress,
            kolAbi,
            "getTokenRatiosIndexByProjectName",
            this.accountInfo.project_name
          );
          console.log("tokenId.toString()", tokenId.toString());

          getWriteContractLoad(
            this.$store.state.kolAddress,
            kolAbi,
            "quitKol",
            tokenId.toString()
          )
            .then((res) => {
              console.log(res);
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
  font-size: 14px;

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
    justify-content: flex-end;
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

  line-height: 20px;
}
.headerInfo {
  margin: 20px;
  .titleBox {
    padding: 20px;
    .title {
      font-size: 18px;
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
    margin-top: 20px;
    background: #ffc519;
    border: none;
    color: #333;

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

    font-size: 12px;
    .van-button__text {
      p {
        color: #333;

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

  p {
    margin: 0;
  }
}
.footer {
  padding: 10px 30px 30px;
  background-color: #fff;
  font-size: 16px;
  color: #111;

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

    font-size: 12px;
  }
  .weight {
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

  font-size: 12px;
}
::v-deep .van-dropdown-menu {
  .van-dropdown-menu__bar {
    box-shadow: none;
    height: 20px;
    .van-dropdown-menu__item {
      height: 20px;
    }
  }
  .van-dropdown-item {
    width: 160px;
    right: 0;
    left: auto;
    .van-popup {
      border: 1px solid #f5f5f5;
      border-radius: 10px;
    }
  }
}
</style>
