<template>
  <div>
    <div class="tabs">
      <router-link to="trade" :class="$route.name == 'trade' ? 'active' : ''"
        >交易</router-link
      >
      <router-link to="pool" :class="$route.name == 'pool' ? 'active' : ''"
        >流动性</router-link
      >
    </div>
    <router-view class="view"></router-view>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.tabs {
  position: fixed;
  width: 100%;
  padding: 15px 20px;
  text-align: left;
  background-color: #fff;
  border-bottom: 1px solid #e5e4e4;
  display: flex;
  align-items: center;
  z-index: 1111111;
  font-size: 14px;
  > a {
    margin-right: 20px;
    color: #999;
    font-weight: 600;
  }
  .active {
    color: #ffc519;
    border-bottom: 2px solid #ffc519;
  }
}
.view {
  padding-top: 60px;
}
</style>
