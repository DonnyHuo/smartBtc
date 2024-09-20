<template>
  <div class="header">
    <img @click="goBack" src="../assets/img/goBack.png" alt="" />
    <div>{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    title: String,
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  position: fixed;
  height: 50px;
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Poppins-Medium;
  font-size: 16px;
  z-index: 111;

  img {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 20px;
  }
}
</style>
