<template>
  <div class="px-[20px] bg-white min-h-full">
    <shareList />
  </div>
</template>
<script>
import shareList from "./index.vue";

export default {
  name: "share",
  components: { shareList },
  data() {
    return {};
  },
};
</script>
