<template>
  <div></div>
</template>
<script>
import { http } from "@/http/request";
export default {
  name: "request",
  data() {
    return {};
  },
  mounted() {
    // this.getInfo();
  },
  methods: {
    async getInfo() {
      const query = `query MyQuery {
        transfers {
          blockNumber
        }
      }`;
      const res = await http(query);
      console.log("res", res);
    },
  },
};
</script>
