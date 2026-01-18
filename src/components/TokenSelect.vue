<template>
  <div class="token-select relative" ref="selectRef">
    <div
      class="border border-solid border-[#000] rounded-[4px] h-[40px] flex items-center justify-between px-4 text-[14px] cursor-pointer"
      @click="toggleList"
    >
      <div class="flex items-center gap-2">
        <span class="font-medium">{{ modelValue.mint_base_token }}</span>
        <span class="text-[#666]">
          1 {{ modelValue.mint_base_token }} = {{ modelValue.exchange_rate }} {{ $t("tokenSelect.token") }}
        </span>
      </div>
      <span
        class="rounded-full bg-[#FFBB00] w-[24px] h-[24px] flex items-center justify-center transition-transform duration-200"
        :class="{ 'rotate-180': showList }"
      >
        <img class="w-[10px]" src="../assets/img/arrowDown.png" alt="" />
      </span>
    </div>

    <transition name="dropdown">
      <div
        v-if="showList"
        class="absolute top-[44px] left-0 w-full bg-white border border-solid border-[#333] rounded-[4px] shadow-lg z-10 overflow-hidden"
      >
        <div
          v-for="(item, index) in options"
          :key="index"
          class="h-[44px] flex items-center justify-between px-4 text-[14px] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
          :class="{ 'bg-[#FFF8E1]': item.mint_base_token === modelValue.mint_base_token }"
          @click="selectItem(item)"
        >
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ item.mint_base_token }}</span>
            <span class="text-[#666]">
              1 {{ item.mint_base_token }} = {{ item.exchange_rate }} {{ $t("tokenSelect.token") }}
            </span>
          </div>
          <img
            v-if="item.mint_base_token === modelValue.mint_base_token"
            class="w-[16px]"
            src="../assets/img/selected.png"
            alt=""
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "TokenSelect",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showList: false,
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggleList() {
      this.showList = !this.showList;
    },
    selectItem(item) {
      this.$emit("update:modelValue", item);
      this.showList = false;
    },
    handleClickOutside(event) {
      if (this.$refs.selectRef && !this.$refs.selectRef.contains(event.target)) {
        this.showList = false;
      }
    },
  },
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

