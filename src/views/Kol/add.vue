<template>
  <div class="kolContent">
    <div class="header">KOL认证 — 推荐新项目</div>
    <div class="form">
      <div class="list">
        <span>铭文BRC20</span>
        <input type="text" v-model="name" />
      </div>
      <div class="list">
        <span>币种symbol</span>
        <input type="text" v-model="symbol" />
      </div>
      <div class="list">
        <span>代币总量</span>
        <input type="text" v-model="totalSupply" />
      </div>
      <div class="listBox">
        <div class="title">BSC链初始发行分配比例</div>
        <div class="listDiv">
          <div class="listS">
            <span>跨链</span>
            <div class="inputBox">
              <input type="text" v-model="percents[0]" placeholder=">=50" /> %
            </div>
          </div>
          <div class="listS">
            <span>流动性发行</span>
            <div class="inputBox">
              <input type="text" v-model="percents[1]" placeholder=">=10" /> %
            </div>
          </div>
        </div>
        <div class="listDiv">
          <div class="listS">
            <span>启动池</span>
            <div class="inputBox">
              <input type="text" v-model="percents[2]" placeholder="1-3" /> %
            </div>
          </div>
          <div class="listS">
            <span>社区KOL空投奖励</span>
            <div class="inputBox">
              <input type="text" v-model="percents[3]" placeholder="<=20" /> %
            </div>
          </div>
        </div>
      </div>
      <div class="sure">
        <van-button @click="newProject">提交初审</van-button>
      </div>
      <div class="desc">
        说明：项目初审通过后，将进入社区投票阶段，有效投票期7天，持有SBTC社区会员可参与投票推荐，满100票获取上市权益，自动部署相关合约。
      </div>
    </div>
  </div>
</template>
<script>
import { showToast } from "vant";

export default {
  name: "kolAdd",
  data() {
    return {
      active: 0,
      name: "",
      symbol: "",
      totalSupply: "",
      percents: ["", "", "", ""],
    };
  },
  methods: {
    changeTabs(number) {
      this.active = number;
    },
    newProject() {
      const project_info = {
        name: this.name,
        symbol: this.symbol,
        total_supply: this.totalSupply,
        percents: this.percents.map((list) => list * 100),
      };
      this.$axios
        .post("https://smartbtc.io/bridge/kol/new_project", {
          kol_address: this.$store.state.address,
          project_info,
        })
        .then((res) => {
          showToast("申请成功");
          setTimeout(() => {
            this.$router.push("/kol");
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          showToast(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.kolContent {
  background-color: #f1f1f1;
  height: 100vh;
  padding-bottom: 100px;
  overflow: auto;
}
.header {
  height: 50px;
  line-height: 50px;
  font-weight: bold;
  font-size: 14px;
  background-color: #fff;
}
.form {
  width: 90%;
  margin: 20px auto;
  padding: 20px 0;
  border-radius: 10px;
  background-color: #fff;
  font-size: 12px;
  font-weight: bold;
}
.list {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span:first-child {
    color: #111;
    font-weight: 600;
  }
}
.listBox {
  font-size: 12px;
  .title {
    margin-top: 20px;
    font-weight: 600;
    color: #111;
    text-align: left;
    padding-left: 20px;
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
      > span {
        width: 80px;
      }
      .inputBox {
        width: 80px;
      }
      input {
        width: 80%;
        height: 26px;
        padding: 0 10px;
      }
    }
  }
}
input {
  width: 70%;
  border: 1px solid #999;
  border-radius: 10px;
  height: 32px;
  padding: 0 15px;
  background-color: transparent;
}
.sure {
  margin-top: 30px;
  button {
    width: 90%;
    height: 35px;
    line-height: 30px;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    font-size: 12px;
  }
}
.tabs {
  background: #f5f5f5;
  width: 90%;
  height: 40px;
  margin: 10px auto 20px auto;
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
.desc {
  text-align: left;
  font-size: 12px;
  color: #999;
  line-height: 20px;
  font-weight: 400;
  padding: 20px;
}
</style>
