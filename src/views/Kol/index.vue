<template>
  <div class="kolIndex">
    <div class="header">
      <span>KOL</span>
      <router-link v-if="accountInfo.status === 1" to="/kolAdd" class="addBtn"
        >新增项目</router-link
      >
    </div>
    <div v-if="accountInfo && accountInfo.status !== 0" class="tabs">
      <div :class="active === 0 && 'active'" @click="changeTabs(0)">认领</div>
      <div :class="active === 1 && 'active'" @click="changeTabs(1)">投票</div>
    </div>
    <div v-if="!accountInfo" class="kolRequest">
      <div>
        <span>收益地址</span>
        <input type="text" v-model="registerAddress" />
      </div>
      <div>
        <span>X地址</span>
        <input type="text" v-model="xAddress" />
      </div>
      <van-button @click="register">KOL认证</van-button>
    </div>
    <div v-if="accountInfo.status === 0" class="kolRequest">
      <div>
        <span>收益地址</span>
        <span>{{ shortStr(accountInfo.address) }}</span>
      </div>
      <div>
        <span>X地址</span>
        <span>{{ accountInfo.twitter_account }}</span>
      </div>
      <van-button disabled>KOL审核中...</van-button>
    </div>

    <div v-if="accountInfo.status === 1 && active === 0" class="listBoxs">
      <div v-if="projectIssuedList.length">
        <div v-for="(item, index) in projectIssuedList" class="list" :key="index">
          <div>
            <img class="icon" src="../../assets/img/default.png" alt="" />
            <span>{{ item.project_name }}</span>
          </div>
          <van-button size="small" @click="openModel(item)">去认领</van-button>
        </div>
      </div>

      <div v-else class="noData">
        <div>
          <img src="../../assets/img/noData.png" />
          <div>暂无数据</div>
        </div>
      </div>
    </div>
    <div
      v-if="accountInfo !== '' && ![0, 1].includes(accountInfo.status) && active === 0"
    >
      <div class="hadPro">
        <div class="hadProList">
          <div>
            <img class="icon" src="../../assets/img/default.png" alt="" />
            <span>{{ accountInfo.project_name }}</span>
          </div>
          <van-button size="small" disabled>{{
            accountInfo.status > 2 ? "认领完成" : "已认领 , 审核中..."
          }}</van-button>
        </div>
        <div v-if="accountInfo.status > 2" class="reserve">
          <div>待收取收益： {{ viewCanWithdrawValue }} {{ reserveInfo?.symbol }}</div>
          <van-button size="small" :loading="withdrawLoading" @click="withdraw()"
            >领取收益</van-button
          >
        </div>
      </div>
    </div>

    <div
      v-if="accountInfo && accountInfo.status !== 0 && active === 1"
      class="votingListBox"
    >
      <div v-if="projectVotingList.length">
        <div v-for="(item, index) in projectVotingList" :key="index" class="votingList">
          <div>
            <span>项目名称</span>
            <span>{{ item.project_name }}</span>
          </div>
          <div>
            <span>币种名称</span>
            <span>{{ item.name }}</span>
          </div>
          <div>
            <span>币种Symbol</span>
            <span>{{ item.symbol }}</span>
          </div>

          <div>
            <span>发行数量</span>
            <span>{{ item.total_supply }}</span>
          </div>
          <div class="listBox">
            <div class="title">发行比例</div>
            <div class="listDiv">
              <div class="listS">
                <span>跨链</span>
                <span>{{ item.cross_percent / 100 }}%</span>
              </div>
              <div class="listS">
                <span>流动性发行</span>
                <span>{{ item.le_percent / 100 }}%</span>
              </div>
            </div>
            <div class="listDiv">
              <div class="listS">
                <span>启动池</span>
                <span>{{ item.lm_percent / 100 }}%</span>
              </div>
              <div class="listS">
                <span>社区空头</span>
                <span>{{ item.kol_percent / 100 }}%</span>
              </div>
            </div>
          </div>
          <div>
            <span>结束时间</span>
            <span>{{
              formatDate(new Date(item.vote_end_time), "yyyy-MM-dd hh:mm")
            }}</span>
          </div>
          <div class="btnBox">
            <van-button :disabled="item.isVoted" @click="vote(item.project_name)"
              >发起投票</van-button
            >
          </div>
        </div>
      </div>
      <div v-else class="noData">
        <div>
          <img src="../../assets/img/noData.png" />
          <div>暂无数据</div>
        </div>
      </div>
    </div>

    <van-action-sheet class="model" v-model:show="model" title="认领说明">
      <div class="content">
        <div class="contentDesc">
          <p>1.必须发推特满足xxxx必须发推特满足xxxx</p>
          <p>2.必须发推特满足xxxx必须发推特满足xxxx</p>
          <p>3.必须发推特满足xxxx必须发推特满足xxxx</p>
          <p>4.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx</p>
          <p>
            5.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx
          </p>
          <p>
            6.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx
          </p>
          <p>
            7.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx
          </p>
        </div>
        <van-button
          :loading="reserveLoading"
          class="modelBtn"
          size="small"
          @click="bindProject(selectedItem.project_name)"
          >已完成说明 去认领</van-button
        >
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { showToast } from "vant";
import erc20ABI from "../../abi/erc20.json";
import { ethers } from "ethers";
import {
  formatDate,
  shortStr,
  getContract,
  getWriteContract,
  getWriteContractLoad,
} from "@/utils";
import kolAbi from "../../abi/kol.json";

export default {
  name: "kol",
  data() {
    return {
      active: 0,
      kol: 2,
      claim: 3,
      address: this.$store.state.address,
      registerAddress: "",
      xAddress: "",
      accountInfo: "",
      projectVotingList: [],
      timer: null,
      projectIssuedList: [],
      repMinThreshold: "",
      sBtcBalance: "",
      reserveInfo: {},
      model: false,
      reserveLoading: false,
      selectedItem: {},
      viewCanWithdrawValue: "",
      tokenId: "",
      withdrawLoading: false,
    };
  },
  mounted() {
    this.getInfo();
    this.getVotingList();
    this.getProjectIssuedList();
    this.getMinThreshold();
    this.registerAddress = this.address;
    this.timer = setInterval(() => {
      this.getInfo();
      this.getVotingList();
      this.getProjectIssuedList();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    shortStr,
    formatDate,
    changeTabs(number) {
      this.active = number;
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
      this.$axios
        .post("https://smartbtc.io/bridge/kol/register", {
          address: this.registerAddress,
          twitter_account: this.xAddress,
        })
        .then((res) => {
          showToast("已提交认证申请");
          this.getInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    bindProject(project_name) {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/bind_project", {
          kol_address: this.$store.state.address,
          project_name: project_name,
        })
        .then((res) => {
          showToast("认领成功");
          this.model = false;
        })
        .catch((err) => {
          showToast(err.message);
          console.log(err);
        });
    },
    getVotingList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_voting_list")
        .then(async (res) => {
          const data = res.data.data;
          if (data.length > 0) {
            this.getSBtcBalance();
          }
          for (let i = 0; i < data.length; i++) {
            const isVoted = await this.isVoted(data[i].project_name);
            data[i].voted = isVoted;
          }
          this.projectVotingList = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    vote(project_name) {
      console.log(
        "this.sBtcBalance * 1 < this.repMinThreshold",
        this.sBtcBalance * 1,
        this.repMinThreshold
      );
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
          } else {
            showToast(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProjectIssuedList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_issued_list")
        .then((res) => {
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
    async getSBtcBalance() {
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
      this.sBtcBalance = ethers.utils.formatUnits(sBtcBalance, sBtcDecimals);
    },
    getMinThreshold() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/min_threshold")
        .then((res) => {
          this.repMinThreshold = res.data.data.RepMinThreshold;
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
    openModel(item) {
      this.model = true;
      this.selectedItem = item;
    },
    async getWithdraw() {
      const tokenId = await getContract(
        "0xf6250E66a044c152c6294B934A0e02067F9b65C7",
        kolAbi,
        "getTokenRatiosIndexByProjectName",
        this.accountInfo.project_name
      );

      this.tokenId = tokenId.toString();

      const viewCanWithdrawValue = await getWriteContract(
        "0xf6250E66a044c152c6294B934A0e02067F9b65C7",
        kolAbi,
        "viewCanWithdrawValue",
        tokenId.toString()
      );
      this.viewCanWithdrawValue = ethers.utils.formatUnits(viewCanWithdrawValue, 18) * 1;
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
  },

  watch: {
    address() {
      this.getInfo();
    },
    reserveInfo(value) {
      value && this.getWithdraw();
    },
  },
};
</script>
<style lang="scss" scoped>
.kolIndex {
  // background-color: #fff;
  height: 100vh;
  padding-bottom: 100px;
  overflow: auto;
}
.header {
  background-color: #fff;
  padding: 0 5%;
  height: 50px;
  line-height: 50px;
  font-weight: bold;
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
  font-weight: bold;
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
    font-weight: bold;
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
    font-weight: 600;
    font-size: 12px;
  }
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
      width: 70%;
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
    font-weight: 600;
    font-size: 12px;
    margin-top: 30px;
  }
}

.kolContent {
  height: 100vh;
  background-color: #fff;
  padding: 0 5%;
  padding-bottom: 100px;
  overflow: auto;
  .header {
    height: 50px;
    line-height: 50px;
    font-weight: bold;
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
    font-weight: bold;
  }
  .content {
    text-align: left;
    font-size: 14px;
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
    font-weight: bold;
    font-size: 14px;
  }
  .orange {
    color: orange;
  }
  .green {
    color: green;
  }
}
.votingList {
  background-color: #fff;
  border-radius: 10px;
  margin: 5%;
  padding: 20px;
  font-size: 14px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .listBox {
    display: block;
    .title {
      margin-top: 20px;
    }
    .listDiv {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .listS {
        width: 50%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding: 0 20px;
        color: #666;
      }
    }
    .title {
      text-align: left;
      color: #111;
    }
  }
  .btnBox {
    margin-top: 30px;
    margin-bottom: 0;
    justify-content: center;
    button {
      width: 50%;
      height: 40px;
      border-radius: 10px;
      background: #ffc519;
      border: none;
      color: #333;
      font-weight: 600;
      font-size: 12px;
    }
  }
}
.hadPro {
  font-size: 14px;
  background-color: #fff;
  margin: 0 5%;
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
      font-weight: 600;
      font-size: 12px;
    }
  }
  .reserve {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    button {
      height: 30px;
      border-radius: 5px;
      background: #ffc519;
      border: none;
      color: #333;
      font-weight: 600;
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
  .contentDesc {
    padding: 20px;
    text-align: left;
  }
  button {
    height: 36px;
    line-height: 30px;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>
