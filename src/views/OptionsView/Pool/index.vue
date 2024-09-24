<template>
  <div class="pools">
    <div class="title max-w-[80%] m-auto">
      {{ $t("options.marketMaker.title") }}
    </div>
    <router-link to="/public">
      <div class="contentList">
        <img src="../../../assets/img/public-pool.png" alt="" />
        <div>
          <div class="listTitle">{{ $t("options.marketMaker.desc[0]") }}</div>
          <div>{{ $t("options.marketMaker.desc[1]") }}</div>
        </div>
      </div>
    </router-link>
    <router-link to="/private">
      <div class="contentList">
        <img src="../../../assets/img/private-pool.png" alt="" />
        <div>
          <div class="listTitle">{{ $t("options.marketMaker.desc[2]") }}</div>
          <div>{{ $t("options.marketMaker.desc[3]") }}</div>
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

      padding-bottom: 10px;
      color: #333;
    }
  }
}
</style>
