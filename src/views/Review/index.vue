<template>
  <div class="kolContent">
    <div class="header">审核KOL</div>
    <div class="tabs">申请列表</div>
    <div>
      <div class="form">
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
        <div class="list">
          <span>合约地址</span>
          <span>0x321312g32131283213daw</span>
        </div>
        <div class="list">
          <span>twitter地址</span>
          <span>https://twitter.com/home</span>
        </div>
        <div class="list btnBox">
          <van-button>审核通过</van-button>
          <van-button>审核不通过</van-button>
        </div>
      </div>
      <div class="form">
        <div class="list">
          <span>币种名称</span>
          <span>Ether</span>
        </div>
        <div class="list">
          <span>币种symbol</span>
          <span>ETH</span>
        </div>
        <div class="list">
          <span>发行数量</span>
          <span>2000000</span>
        </div>
        <div class="list">
          <span>合约地址</span>
          <span>0xdewqqw32131283213daw</span>
        </div>
        <div class="list">
          <span>twitter地址</span>
          <span>https://twitter.com</span>
        </div>
        <div class="list btnBox">
          <van-button>审核通过</van-button>
          <van-button>审核不通过</van-button>
        </div>
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
  background-color: #fff;
  min-height: 100vh;
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
  background-color: #f8fcff;
  font-size: 14px;
  font-weight: bold;
}
.list {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    width: 40%;
    height: 40px;
    line-height: 30px;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    font-size: 14px;
  }
}
.btnBox {
  margin-top: 20px;
}

.tabs {
  color: #333;
  text-align: left;
  padding: 0 8% 0 8%;
  font-weight: bold;
}
</style>
