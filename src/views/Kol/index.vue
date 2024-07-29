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
      <div class="list">
        <div>
          <img class="icon" src="../../assets/img/btc.svg" alt="" />
          <span>100T-BTC</span>
        </div>
        <van-button size="small" @click="bindProject('c')">去认领</van-button>
      </div>
      <div class="list">
        <div>
          <img class="icon" src="../../assets/img/tokenList/brc20-merm.png" alt="" />
          <span>100T-MERM</span>
        </div>
        <router-link to="/kolDetail?name=100T-MERM&claim=0">
          <van-button size="small">去认领</van-button>
        </router-link>
      </div>
      <div class="list">
        <div>
          <img class="icon" src="../../assets/img/tokenList/brc20-bnb.png" alt="" />
          <span>100T-BNB</span>
        </div>
        <router-link to="/kolDetail?name=100T-BNB&claim=2">
          <van-button size="small">去认领</van-button>
        </router-link>
      </div>
      <div class="list">
        <div>
          <img class="icon" src="../../assets/img/tokenList/brc20-btcs.png" alt="" />
          <span>100T-BTCS</span>
        </div>
        <router-link to="/kolDetail?name=100T-BTCS&claim=3">
          <van-button size="small">去认领</van-button>
        </router-link>
      </div>
    </div>

    <div v-if="false" class="kolContent">
      <div class="name">
        <div>
          <img class="icon" src="../../assets/img/btc.svg" alt="" />
          <span>BNB-100T</span>
        </div>
        <span v-if="claim === 0">未认领</span>
        <span v-if="claim === 1">已认领</span>
        <span v-if="claim === 2" class="orange">审核中...</span>
        <span v-if="claim === 3" class="green">审核通过</span>
      </div>
      <div class="content">
        <div class="title">认领说明</div>
        <div>
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
      </div>
      <div class="form">
        <div class="list">
          <span>收益地址</span>
          <span>31212321321321321</span>
        </div>
        <div class="list">
          <span>twitter地址</span>
          <span>31212321321321321</span>
        </div>
      </div>
      <div class="sure">
        <van-button v-if="claim === 0">去认领</van-button>
        <van-button v-if="claim === 1">已完成 去提交审核</van-button>
        <van-button v-if="claim === 3">领取收益</van-button>
      </div>
    </div>

    <div
      v-if="accountInfo !== '' && ![0, 1].includes(accountInfo.status) && active === 0"
    >
      <div class="hadProject">已认领项目 {{ accountInfo.project_name }}</div>
    </div>

    <div
      v-if="accountInfo && accountInfo.status !== 0 && active === 1"
      class="votingListBox"
    >
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
        <div class="btnBox">
          <van-button @click="vote(item.project_name)">发起投票</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { shortStr } from "@/utils";
import { showToast } from "vant";

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
    };
  },
  mounted() {
    this.getInfo();
    this.getVotingList();
    this.registerAddress = this.address;
    setInterval(() => {
      this.getInfo();
      this.getVotingList();
    }, 5000);
  },
  methods: {
    shortStr,
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
          showToast();
        })
        .catch((err) => {
          showToast(err.message);
          console.log(err);
        });
    },
    getVotingList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_voting_list")
        .then((res) => {
          this.projectVotingList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    vote(project_name) {
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
  },
  watch: {
    address() {
      this.getInfo();
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
    font-size: 12px;
    font-weight: 400;
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
.hadProject {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
