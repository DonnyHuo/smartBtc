<template>
  <div class="kolContent">
    <div class="header">
      <span>认领 100T-BNB</span>
    </div>
    <div class="name">
      <div>
        <img class="icon" src="../../assets/img/btc.svg" alt="" />
        <span>{{ name }}</span>
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
        <p>7.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx</p>
      </div>
    </div>
    <div v-if="!claim" class="form">
      <div class="list">
        <span>收益地址</span>
        <input type="text" />
      </div>
      <div class="list">
        <span>twitter地址</span>
        <input type="text" />
      </div>
    </div>
    <div v-else class="form">
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
</template>
<script>
export default {
  name: "kolDetails",
  data() {
    return {
      active: 0,
      claim: 0,
      name: "",
    };
  },
  mounted() {
    this.claim = this.$route.query.claim * 1 || 0;
    this.name = this.$route.query.name;
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
  height: 100vh;
  background-color: #fff;
  padding: 0 5%;
  padding-bottom: 100px;
  overflow: auto;
}
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
</style>
