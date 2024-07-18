<template>
  <div class="kolContent">
    <div class="header">
      <span>KOL</span>
      <router-link to="/kolAdd" class="addBtn">新增项目</router-link>
    </div>
    <div class="listBox">
      <div class="list">
        <div>
          <img class="icon" src="../../assets/img/btc.svg" alt="" />
          <span>100T-BTC</span>
        </div>
        <router-link to="/kolDetail?name=100T-BTC&claim=1">
          <van-button size="small">去认领</van-button>
        </router-link>
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
  </div>
</template>
<script>
export default {
  name: "kol",
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
  // background-color: #fff;
  min-height: 100vh;
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
  .addBtn {
    font-size: 12px;
    position: absolute;
    right: 5%;
    top: 2px;
  }
}
.listBox {
  padding: 20px;
}
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
</style>
