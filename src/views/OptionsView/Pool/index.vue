<template>
  <div class="pools">
    <div class="title">添加池子，坐享做市商收益</div>
    <router-link to="/public">
      <div class="contentList">
        <img src="../../../assets/img/public-pool.png" alt="" />
        <div>
          <div class="listTitle">公池</div>
          <div>通过提供储备流动性赚取溢价，向所有代币开放。</div>
        </div>
      </div>
    </router-link>
    <router-link to="/private">
      <div class="contentList">
        <img src="../../../assets/img/private-pool.png" alt="" />
        <div>
          <div class="listTitle">私池</div>
          <div>提供流动性以卖出永续期权，仅向专业做市商开放。</div>
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "options",
};
</script>
<style lang="scss" scoped>
.pools {
  .title {
    font-size: 20px;
    font-weight: 600;
    padding: 20px 0;
  }
  .contentList {
    width: 90%;
    margin: 20px auto;
    background-color: #fff;
    display: flex;
    align-items: center;
    text-align: left;
    padding: 20px 10px 20px 20px;
    color: #999;
    border-radius: 10px;
    font-size: 14px;
    line-height: 20px;
    > img {
      width: 40px;
      margin-right: 20px;
    }
    .listTitle {
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 10px;
      color: #333;
    }
  }
}
</style>
