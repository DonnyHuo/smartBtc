<template>
  <div class="kolContent">
    <div class="header">添加项目</div>
    <div class="form">
      <div class="list">
        <span>币种名称</span>
        <input type="text" v-model="name" />
      </div>
      <div class="list">
        <span>币种symbol</span>
        <input type="text" v-model="symbol" />
      </div>
      <div class="list">
        <span>发行数量</span>
        <input type="text" v-model="totalSupply" />
      </div>
      <div class="listBox">
        <div class="title">发行比例</div>
        <div class="listDiv">
          <div class="listS">
            <span>跨链</span>
            <div class="inputBox"><input type="text" v-model="percents[0]" /> %</div>
          </div>
          <div class="listS">
            <span>流动性发行</span>
            <div class="inputBox"><input type="text" v-model="percents[1]" /> %</div>
          </div>
        </div>
        <div class="listDiv">
          <div class="listS">
            <span>启动池</span>
            <div class="inputBox"><input type="text" v-model="percents[2]" /> %</div>
          </div>
          <div class="listS">
            <span>社区空头</span>
            <div class="inputBox"><input type="text" v-model="percents[3]" /> %</div>
          </div>
        </div>
      </div>
      <div class="sure">
        <van-button @click="newProject">添加项目</van-button>
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
  background-color: #fff;
  height: 100vh;
  padding-bottom: 100px;
  overflow: auto;
}
.header {
  height: 50px;
  line-height: 50px;
  font-weight: bold;
  font-size: 14px;
}
.form {
  width: 90%;
  margin: 20px auto;
  padding: 20px 0;
  border-radius: 10px;
  background-color: #f5f5f5;
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
</style>
