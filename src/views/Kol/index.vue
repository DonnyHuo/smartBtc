<template>
  <div class="kolIndex">
    <div class="header font-medium">
      <span v-if="!accountInfo.status">{{ $t("kol.title[0]") }}</span>
      <div v-else>
        <span v-if="!activeAmount">{{ $t("kol.title[1]") }}</span>
        <span v-if="activeAmount">{{ $t("kol.title[2]") }}</span>
      </div>
    </div>
    <div v-if="!accountInfo" class="kolRequest">
      <div>
        <span><span class="must">*</span>{{ $t("kol.revenueAddress") }}</span>
        <input disabled type="text" :value="shortStr(address)" />
      </div>
      <div>
        <span><span class="must">*</span>{{ $t("kol.twitter") }}</span>
        <input type="text" v-model="xAddress" placeholder="https://x.com/xxx" />
      </div>
      <div>
        <span>{{ $t("kol.telegram") }}</span>
        <input type="text" v-model="tgAddress" placeholder="https://t.me/xxx" />
      </div>
      <div>
        <span>{{ $t("kol.discord") }}</span>
        <input
          type="text"
          v-model="disAddress"
          placeholder="https://discord.com/xxx"
        />
      </div>

      <van-button @click="register">{{ $t("kol.submit") }}</van-button>
    </div>
    <div v-if="accountInfo.status === 0" class="kolRequest">
      <div>
        <span>{{ $t("kol.revenueAddress") }}</span>
        <span>{{ shortStr(accountInfo.address) }}</span>
      </div>
      <div>
        <span>{{ $t("kol.twitter") }}</span>
        <span>{{ accountInfo.twitter_account }}</span>
      </div>
      <van-button disabled>{{ $t("kol.kolReview") }}</van-button>
    </div>
    <div v-if="accountInfo.status === 1" class="activeBtnBox">
      <van-button
        v-if="!activeAmount"
        class="activeBtn"
        size="small"
        @click="openActiveModal(item)"
        >{{ $t("kol.desposit") }}</van-button
      >

      <div v-if="!activeAmount" class="desc mt-10">
        {{ $t("kol.desc[0]") }}
      </div>
    </div>

    <div v-if="accountInfo.status === 1" class="listBoxs">
      <ShareProject
        class="rounded-xl"
        page="noShare"
        :activeAmount="activeAmount"
        @clickItemFun="clickItemFun"
      />
    </div>
    <div v-if="accountInfo !== '' && ![0, 1].includes(accountInfo.status)">
      <div class="hadPro">
        <div class="hadProList">
          <div class="flex items-center">
            <img class="icon" src="../../assets/img/default.png" alt="" />
            <span>{{ accountInfo?.project_name?.split("100T-")[1] }}</span>
          </div>
          <div class="tips">{{ getStatus(accountInfo.status) }}</div>
        </div>
      </div>
    </div>

    <van-action-sheet
      class="model"
      v-model:show="model"
      :title="`${$t('kol.claimRule')}`"
    >
      <div class="content">
        <div class="contentDesc">
          <p>{{ $t("kol.contentDesc[0]") }}</p>
          <p>{{ $t("kol.contentDesc[1]") }}</p>
          <p>{{ $t("kol.contentDesc[2]") }}</p>
          <p>{{ $t("kol.contentDesc[3]") }}</p>
          <p>{{ $t("kol.contentDesc[4]") }}</p>
          <div class="text-left" @click="copyAddress(tweet)">
            <span class="text-black font-medium">
              <span class="text-red-600">*</span>
              {{ tweet }}
            </span>
            <img
              class="w-[16px] inline-block"
              src="../../assets/img/copy.png"
              alt=""
            />
          </div>
          <div class="text-left mt-2 text-[#999] text-sm">
            {{ $t("kol.tweetTips") }}
          </div>
        </div>

        <van-checkbox v-model="checked" class="m-[20px] mt-0 text-left">{{
          $t("kol.sure")
        }}</van-checkbox>

        <van-button
          :loading="reserveLoading"
          class="modelBtn !leading-5 min-w-[200px]"
          size="small"
          :disabled="!checked"
          @click="bindProject(selectedItem.project_name)"
          >{{ $t("kol.claim") }}</van-button
        >
      </div>
    </van-action-sheet>

    <van-action-sheet
      class="model"
      v-model:show="activeModal"
      :title="`${$t('kol.desposit')} SOS`"
    >
      <div class="content">
        <div class="balanceBox">
          {{ $t("kol.balance") }}：{{ sBtcBalance }} SOS
        </div>
        <div class="inputBox">
          <input
            v-model="depositAmount"
            type="text"
            :placeholder="`${$t('kol.inputNumber')} >= ${minDeposit} SOS`"
            @change="changeDepositAmount"
          />
          <button size="small" @click="maxFun">{{ $t("kol.max") }}</button>
        </div>
        <van-button
          v-if="!allowance"
          :loading="approveLoading"
          class="modelBtn !mt-[20px] min-w-[200px]"
          size="small"
          @click="approveActive()"
          >{{ $t("kol.approve") }}</van-button
        >
        <van-button
          v-else
          :loading="activeLoading"
          class="modelBtn !mt-[20px] min-w-[200px]"
          size="small"
          @click="userDeposit()"
          >{{ $t("kol.desposit") }}</van-button
        >
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import {
  formatDate,
  shortStr,
  getContract,
  getWriteContract,
  getWriteContractLoad,
  copy,
  realIconLogo,
} from "@/utils";
import { ethers } from "ethers";
import { showToast } from "vant";
import { showConfirmDialog } from "vant";

import ShareProject from "@/views/ShareProject";

import depositAbi from "../../abi/deposit.json";
import erc20ABI from "../../abi/erc20.json";
import kolAbi from "../../abi/kol.json";

export default {
  name: "kol",
  data() {
    return {
      kol: 2,
      claim: 3,
      address: this.$store.state.address,
      xAddress: "",
      tgAddress: "",
      disAddress: "",
      accountInfo: "",
      projectVotingList: [],
      timer: null,
      projectIssuedList: [],
      reserveInfo: {},
      model: false,
      reserveLoading: false,
      selectedItem: {},
      tokenId: "",
      activeModal: false,
      activeAmount: 0,
      activeLoading: false,
      approveLoading: false,
      allowance: 0,
      sBtcBalance: 0,
      depositAmount: "",
      sBtcDecimals: "18",
      minDeposit: "",
      searchValue: "",
      searchList: "",
      checked: false,
    };
  },
  components: { ShareProject },
  mounted() {
    this.getInfo();
    this.getProjectIssuedList();
    this.getActiveAmount();
    this.getBalance();

    this.timer = setInterval(() => {
      this.getInfo();
      this.getProjectIssuedList();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  },
  computed: {
    // tweet() {
    //   return `我的錢包${shortStr(
    //     this.$store.state.address
    //   )}已經質押SBTC，正在SmartBTC.io平台提交KOL認證，參與推廣${
    //     this.selectedItem.name
    //   }銘文，請大家幫忙點讚、轉發這則推文，助力${
    //     this.selectedItem.name
    //   }銘文上SmartBTC熱門！`;
    // },
    tweet() {
      return this.$t("kol.tweet", {
        address: this.shortStr(this.$store.state.address),
        name: this.selectedItem.name,
      });
    },
  },
  methods: {
    clickItemFun(item) {
      if (this.activeAmount) {
        this.openModel(item);
      } else {
        showToast(this.$t("kol.desposit"));
      }
    },
    shortStr,
    formatDate,
    realIconLogo,
    copyAddress(msg) {
      copy(msg);
      showToast(this.$t("copySuccess"));
    },
    getStatus(status) {
      switch (status) {
        case 1:
          return this.$t("kol.status[0]");
        case 2:
          return this.$t("kol.status[1]");
        case 3:
          return this.$t("kol.status[2]");
        case 4:
          return this.$t("kol.status[3]");
        case 5:
          return this.$t("kol.status[4]");
        case 6:
          return this.$t("kol.status[5]");
        case 7:
          return this.$t("kol.status[6]");
        case 8:
          return this.$t("kol.status[7]");
        default:
          return "";
      }
    },
    /**
     * 0: 认证未审核,
     * 1: 认证通过，未认领项目
     * 2.已认领项目,未生效
     * 3.待执行合约设置kol
     * 4.项目kol已生效
     * 5.项目kol设置执行失败
     * 6.项目kol设置为失效
     * 7.认证审核未通过
     */
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
    register() {
      if (!ethers.utils.isAddress(this.address)) {
        return showToast(this.$t("kol.tips[0]"));
      }
      if (this.xAddress == "") {
        return showToast(this.$t("kol.tips[1]"));
      }
      this.$axios
        .post("https://smartbtc.io/bridge/kol/register", {
          address: this.address,
          twitter_account: this.xAddress,
          tg_account: this.tgAddress,
          discord_account: this.disAddress,
        })
        .then((res) => {
          showToast(this.$t("kol.tips[5]"));
          this.getInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    bindProject(project_name) {
      showConfirmDialog({
        title: `${this.$t("kol.tips[2]", { name: project_name })}`,
        message: `${this.$t("kol.tips[3]")}`,
        confirmButtonText: this.$t("sure"),
        cancelButtonText: this.$t("cancel"),
      })
        .then(() => {
          this.$axios
            .post("https://smartbtc.io/bridge/kol/bind_project", {
              kol_address: this.$store.state.address,
              project_name: project_name,
            })
            .then((res) => {
              showToast(this.$t("kol.claimSuccess"));
              this.model = false;
            })
            .catch((err) => {
              showToast(err.message);
              console.log(err);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    getProjectIssuedList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_issued_list")
        .then((res) => {
          this.projectIssuedList = res.data.data;
          this.searchList = this.projectIssuedList;

          const reserveInfo = this.projectIssuedList.filter(
            (list) => list.project_name == this.accountInfo.project_name
          );
          this.reserveInfo = reserveInfo[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },

    openModel(item) {
      this.model = true;
      this.selectedItem = item;
    },

    async getBalance() {
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      this.sBtcDecimals = decimals.toString();
      const balance = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      );
      this.sBtcBalance = ethers.utils.formatUnits(balance, decimals) * 1;
    },

    async getActiveAmount() {
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      const res = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      this.activeAmount = ethers.utils.formatUnits(res, decimals) * 1;

      const allowance = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "allowance",
        this.$store.state.address,
        this.$store.state.pledgeAddress
      );
      this.allowance = allowance.toString() * 1;
    },

    approveActive() {
      this.approveLoading = true;
      getWriteContractLoad(
        this.$store.state.sBtc,
        erc20ABI,
        "approve",
        this.$store.state.pledgeAddress,
        ethers.constants.MaxUint256
      )
        .then((res) => {
          console.log(res);
          this.approveLoading = false;
          this.getActiveAmount();
        })
        .catch((err) => {
          console.log(err);
          this.approveLoading = false;
        });
    },
    maxFun() {
      this.depositAmount = this.sBtcBalance;
    },

    changeDepositAmount(e) {
      this.depositAmount = e.target.value;
    },

    async minDepositFun() {
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      const minDeposit = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "minDeposit"
      );
      this.minDeposit = ethers.utils.formatUnits(minDeposit, decimals) * 1;
    },
    userDeposit() {
      if (this.depositAmount * 1 < this.minDeposit * 1) {
        return showToast(
          `${this.$t("kol.tips[4]", { minDeposit: this.minDeposit })}`
        );
      }
      if (this.depositAmount * 1 > this.sBtcBalance * 1) {
        return showToast(this.$t("noBalance"));
      }

      this.activeLoading = true;

      console.log(
        this.$store.state.pledgeAddress,
        depositAbi,
        ethers.utils.parseUnits(
          this.depositAmount.toString(),
          this.sBtcDecimals
        )
      );

      getWriteContractLoad(
        this.$store.state.pledgeAddress,
        depositAbi,
        "userDeposit",
        ethers.utils.parseUnits(
          this.depositAmount.toString(),
          this.sBtcDecimals
        )
      )
        .then((res) => {
          console.log("res", res);
          this.activeLoading = false;
          this.activeModal = false;
          showToast(this.$t("stakeSuccess"));
          this.getActiveAmount();
        })
        .catch(() => {
          this.activeLoading = false;
        });
    },

    openActiveModal(item) {
      this.activeModal = true;
      this.selectedItem = item;
    },
    searchValueFun(e) {
      this.searchValue = e.target.value;
    },
  },

  watch: {
    address() {
      this.getInfo();
    },
    searchValue(value) {
      if (value !== "") {
        this.searchList = this.projectIssuedList.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.searchList = this.projectIssuedList;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.kolIndex {
  // background-color: #fff;
  // height: 100vh;
  // padding-bottom: 100px;
}
.header {
  background-color: #fff;
  padding: 0 5%;
  height: 50px;
  line-height: 50px;

  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .addBtn {
    font-size: 12px;
    position: absolute;
    right: 5%;
    top: 2px;
  }
}
.tabs {
  background: #fff;
  width: 90%;
  height: 40px;
  margin: 10px auto 10px auto;
  border-radius: 10px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  padding: 5px;
  > div {
    width: 50%;
    border-radius: 10px;
    padding: 8px;
  }
  .active {
    background-color: #ffc519;
  }
}
.listBoxs {
  padding: 20px;
  .list {
    box-shadow: 0 3px 10px #cfcece;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;

    .icon {
      width: 25px;
      margin-right: 10px;
    }
  }
  button {
    height: 30px;
    border-radius: 5px;
    background: #ffc519;
    border: none;
    color: #333;

    font-size: 12px;
  }
}

.activeBtn {
  margin-right: 4px;
}
.kolRequest {
  width: 90%;
  margin: 20px auto;
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 10px;
  font-size: 14px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    input {
      width: 68%;
      height: 40px;
      border: 1px solid #c8c7c7;
      border-radius: 10px;
      padding: 5px 10px;
    }
  }

  button {
    width: 50%;
    height: 40px;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;

    font-size: 12px;
    margin-top: 30px;
  }
}
.mt-10 {
  margin-top: 10px;
}
.mt-20 {
  margin-top: 20px;
}
.desc {
  font-size: 12px;
  color: #999;
  text-align: left;
  line-height: 20px;
}

.kolContent {
  background-color: #fff;
  padding: 0 5%;

  .header {
    height: 50px;
    line-height: 50px;

    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    .addBtn {
      font-size: 12px;
      position: absolute;
      right: 5%;
      top: 2px;
    }
  }
  .name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
    font-size: 18px;
    > span {
      font-size: 12px;
    }
    .icon {
      width: 25px;
      margin-right: 10px;
    }
  }
  .title {
    font-size: 14px;
    padding-bottom: 20px;
  }
  .content {
    text-align: left;
    font-size: 12px;
  }
  .form {
    border: 1px solid #e1dede;
    padding: 20px;
    border-radius: 10px;
    margin-top: 40px;
  }
  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding: 10px 0;
    input {
      width: 70%;
      border: 1px solid #d0cfcf;
      border-radius: 10px;
      height: 36px;
      padding: 0 15px;
      background-color: transparent;
    }
  }
  .sure {
    margin-top: 30px;
  }
  button {
    width: 100%;
    height: 40px;
    line-height: 30px;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;

    font-size: 14px;
  }
  .orange {
    color: orange;
  }
  .green {
    color: green;
  }
}
.hadPro {
  font-size: 14px;
  background-color: #fff;
  margin: 20px 5%;
  border-radius: 10px;
  padding: 20px;
  .hadProList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      width: 30px;
      margin-right: 10px;
    }
    button {
      height: 30px;
      border-radius: 5px;
      background: #ffc519;
      border: none;
      color: #333;

      font-size: 12px;
    }
  }
}
.noData {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
  img {
    width: 70px;
    margin-bottom: 20px;
  }
}
.content {
  font-size: 14px;
  padding: 0 20px;
  text-align: center;
  .contentDesc {
    padding: 20px;
    text-align: left;
    line-height: 24px;
    font-size: 14px;
    > p {
      padding-bottom: 10px;
    }
  }
  .inputBox {
    width: 80%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input {
      width: 80%;
      height: 36px;
      padding: 10px;
      border: 1px solid #999;
      border-radius: 10px;
      margin-right: 10px;
      font-size: 14px;
    }
    button {
      width: 20%;
      border-radius: 5px;
      font-size: 14px;
    }
  }
  .balanceBox {
    width: 80%;
    margin: 0 auto;
    text-align: left;
    font-size: 12px;
    margin-bottom: 4px;
  }
  button {
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;

    font-size: 14px;
    line-height: 30px;
  }
  > button {
    height: 36px;
    margin-bottom: 20px;
  }
}
.activeBtnBox {
  font-size: 12px;
  padding: 10px 20px;
  .activeBtnDesc {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    line-height: 20px;
    margin-bottom: 10px;
  }
  > span {
    padding-right: 10px;
  }
  button {
    border-radius: 5px;
    background: #ffc519;
    border: none;
    color: #333;

    font-size: 12px;
    line-height: 28px;
  }
  .inputSearch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    .searchBox {
      width: calc(100% - 120px);
      height: 36px;
      background-color: transparent;
      border: 1px solid #999;
      border-radius: 10px;
      padding: 10px;
      font-size: 12px;
    }
  }
}
.tips {
  font-size: 12px;
  color: #999;
}
.must {
  color: rgb(235, 58, 58);
  padding-right: 2px;
}
</style>
