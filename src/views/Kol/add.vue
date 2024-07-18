<template>
  <div class="kolContent">
    <div class="header">添加项目</div>
    <div class="tabs">
      <div :class="active === 0 && 'active'" @click="changeTabs(0)">申请</div>
      <div :class="active === 1 && 'active'" @click="changeTabs(1)">申请记录</div>
    </div>
    <div v-if="!active" class="form">
      <div class="list">
        <span>币种名称</span>
        <input type="text" />
      </div>
      <div class="list">
        <span>币种symbol</span>
        <input type="text" />
      </div>
      <div class="list">
        <span>发行数量</span>
        <input type="text" />
      </div>
      <div class="listBox">
        <div class="title">发行比例</div>
        <div class="listDiv">
          <div class="listS">
            <span>跨链</span>
            <div class="inputBox"><input type="text" /> %</div>
          </div>
          <div class="listS">
            <span>流动性发行</span>
            <div class="inputBox"><input type="text" /> %</div>
          </div>
        </div>
        <div class="listDiv">
          <div class="listS">
            <span>启动池</span>
            <div class="inputBox"><input type="text" /> %</div>
          </div>
          <div class="listS">
            <span>社区空头</span>
            <div class="inputBox"><input type="text" /> %</div>
          </div>
        </div>
      </div>
      <div class="list">
        <span>合约地址</span>
        <input type="text" />
      </div>
      <div class="sure">
        <van-button>KOL申请</van-button>
      </div>
    </div>
    <div v-else class="form">
      <div class="list">
        <span>币种名称</span>
        <span>BNB</span>
      </div>
      <div class="list">
        <span>币种symbol</span>
        <span>BNB</span>
      </div>
      <div class="list">
        <span>发行数量</span>
        <span>10000000</span>
      </div>
      <div class="listBox">
        <div class="title">发行比例</div>
        <div class="listDiv">
          <div class="listS">
            <span>跨链</span>
            <div class="inputBox">20 %</div>
          </div>
          <div class="listS">
            <span>流动性发行</span>
            <div class="inputBox">30 %</div>
          </div>
        </div>
        <div class="listDiv">
          <div class="listS">
            <span>启动池</span>
            <div class="inputBox">40 %</div>
          </div>
          <div class="listS">
            <span>社区空头</span>
            <div class="inputBox">10 %</div>
          </div>
        </div>
      </div>
      <div class="list">
        <span>合约地址</span>
        <span>0x321312g32131283213daw</span>
      </div>
      <div class="list">
        <span>审核进度</span>
        <span>审核中</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "kolAdd",
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    changeTabs(number) {
      this.active = number;
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
  font-size: 16px;
}
.form {
  width: 90%;
  margin: 20px auto;
  padding: 20px 0;
  border-radius: 10px;
  background-color: #fafafa;
  font-size: 12px;
  font-weight: bold;
}
.list {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span:first-child {
    color: #666;
  }
}
.listBox {
  font-size: 12px;
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
  .title {
    font-size: 12px;
    text-align: left;
    padding-left: 20px;
    color: #666;
  }
}
input {
  width: 70%;
  border: 1px solid #d0cfcf;
  border-radius: 10px;
  height: 32px;
  padding: 0 15px;
  background-color: transparent;
}
.sure {
  margin-top: 30px;
  button {
    width: 90%;
    height: 44px;
    line-height: 30px;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    font-size: 14px;
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
  font-size: 14px;
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
