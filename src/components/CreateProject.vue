<template>
  <div>
    <div
      class="h-[40px] border border-solid border-[#E2E2E2] bg-[#FCFCFC] flex items-center mx-[20px] rounded-lg p-1 text-[12px]"
    >
      <div
        class="w-1/2 h-full flex items-center justify-center"
        :class="
          activeIndex === 0
            ? 'bg-[#FEE540] rounded-[4px] border border-black border-solid'
            : ''
        "
        @click="changeActiveIndex(0)"
      >
        {{ $t("newData.inscriptionMarketMaker") }}
      </div>
      <div
        class="w-1/2 h-full flex items-center justify-center"
        :class="
          activeIndex === 1
            ? 'bg-[#FEE540] rounded-[4px] border border-black border-solid'
            : ''
        "
        @click="changeActiveIndex(1)"
      >
        {{ $t("newData.memeTokenLaunch") }}
      </div>
    </div>

    <div v-if="!activeIndex" class="text-left px-[20px]">
      <div class="flex items-center justify-between mt-[20px] gap-2">
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("newData.token") }}
          </div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeOne.brc20_name"
              :placeholder="$t('newData.sameNameAsInscription')"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("newData.totalSupply") }}
          </div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeOne.brc20_supply"
              :placeholder="$t('newData.equalAmountToInscription')"
            />
          </div>
        </div>
      </div>

      <div v-if="!activeIndex" class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.deployInscriptionId") }}
        </div>
        <div>
          <input
            class="w-full text-[12px]"
            type="text"
            v-model="typeOne.brc20_id"
          />
        </div>
      </div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.tokenRatio") }}
        </div>
        <div class="flex items-center gap-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{
              $t("newData.inscriptionCrossChain")
            }}</span>
            <div v-if="activeIndex === 1">
              <input
                class="w-[60px] !h-[30px] text-[12px]"
                type="text"
                v-model="typeOne.percents[0]"
                placeholder=">=50"
              />
            </div>
            <div v-else>50%</div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.kolRewards") }}</span>

            <div v-if="activeIndex === 1">
              <input
                class="w-[60px] !h-[30px]"
                type="text"
                v-model="typeOne.percents[3]"
                placeholder="<=20"
              />
            </div>
            <div v-else>20%</div>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.lpAddition") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] disabled:bg-[#f5f5f5] text-[12px] text-right"
                type="text"
                :value="typeOne.percents[1]"
                placeholder="< 30"
                disabled
              />
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.launchPool") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px] text-right"
                type="text"
                v-model="typeOne.percents[2]"
                placeholder="> 0"
                @change="changeStartPool"
              />
              %
            </div>
          </div>
        </div>
      </div>
      <div
        class="!text-black text-[12px] mt-[20px] border-0 border-b border-t border-solid border-[#E8E8E8] py-2"
      >
        {{ $t("newData.launchPoolNote") }}
      </div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.tokenDescription") }}
        </div>
        <div>
          <input
            class="w-full text-[12px]"
            type="text"
            v-model="typeOne.details"
            :placeholder="$t('newData.description')"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-left px-[20px]">
      <div class="flex items-center justify-between mt-[20px] gap-2">
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("newData.token") }}
          </div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeTwo.brc20_name"
              :placeholder="$t('newData.sameNameAsInscription')"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("newData.totalSupply") }}
          </div>
          <div>
            <input
              class="w-full disabled:bg-[#f5f5f5] text-[12px]"
              type="text"
              v-model="typeTwo.brc20_supply"
              :placeholder="$t('newData.sameNameAsInscription')"
              disabled
            />
          </div>
        </div>
      </div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.tokenRatio") }}
        </div>
        <div class="flex items-center gap-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{
              $t("newData.inscriptionCrossChain")
            }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px]"
                type="text"
                v-model="typeTwo.percents[0]"
              />
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.kolRewards") }}</span>

            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px]"
                type="text"
                v-model="typeTwo.percents[3]"
              />
              %
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.lpAddition") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px]"
                type="text"
                v-model="typeTwo.percents[1]"
              />
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.launchPool") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px]"
                type="text"
                v-model="typeTwo.percents[2]"
              />
              %
            </div>
          </div>
        </div>
      </div>
      <div
        class="!text-black text-[12px] mt-[20px] border-0 border-b border-t border-solid border-[#E8E8E8] py-2"
      >
        {{ $t("newData.launchPoolNote") }}
      </div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.tokenDescription") }}
        </div>
        <div>
          <input
            class="w-full text-[12px]"
            type="text"
            v-model="typeTwo.details"
            :placeholder="$t('newData.description')"
          />
        </div>
      </div>
    </div>

    <div class="w-full px-[20px] text-center my-[20px]">
      <van-button
        class="!bg-[#ffc519] w-full !text-black !border-0"
        @click="newProject"
        >{{ $t("kolAdd.submit") }}</van-button
      >
    </div>
  </div>
</template>
<script>
import { showToast, showConfirmDialog } from "vant";

import { copy } from "@/utils";

export default {
  name: "creatProject",
  data() {
    return {
      activeIndex: 0,
      typeOne: {
        brc20_name: "",
        brc20_id: "",
        brc20_supply: "",
        symbol: "",
        totalSupply: "",
        details: "",
        percents: ["50", "", "", "20"]
      },
      typeTwo: {
        brc20_name: "",
        brc20_id: "",
        brc20_supply: 1000000000,
        symbol: "",
        totalSupply: "",
        details: "",
        percents: ["", "", "", ""]
      }
    };
  },
  methods: {
    changeActiveIndex(index) {
      this.activeIndex = index;
    },
    copyAddress(msg) {
      copy(msg);
      showToast(this.$t("copySuccess"));
    },
    changeStartPool(value) {
      console.log("value", value.target.value);
      this.typeOne.percents[1] = 30 - value.target.value;
    },
    newProject() {
      let project_info = "";
      if (!this.activeIndex) {
        project_info = {
          brc20_name: this.typeOne.brc20_name,
          brc20_id: this.typeOne.brc20_id,
          brc20_supply: this.typeOne.brc20_supply,
          symbol: this.typeOne.brc20_name,
          total_supply: this.typeOne.brc20_supply,
          details: this.typeOne.details,
          percents: this.typeOne.percents.map((list) => list * 100),
          project_type: 1
        };
      } else {
        project_info = {
          brc20_name: this.typeTwo.brc20_name,
          brc20_supply: this.typeTwo.brc20_supply,
          symbol: this.typeTwo.brc20_name,
          total_supply: this.typeTwo.brc20_supply,
          details: this.typeTwo.details,
          percents: this.typeTwo.percents.map((list) => list * 100),
          project_type: 0
        };
      }

      if (
        project_info.brc20_name &&
        project_info.brc20_supply &&
        project_info.symbol &&
        project_info.total_supply &&
        project_info.percents.every((list) => list !== "")
      ) {
        showConfirmDialog({
          title: `${this.$t("kolAdd.tips[1]", {
            name: project_info.name
          })}`,
          message: this.$t("kolAdd.tips[2]"),
          confirmButtonText: this.$t("sure"),
          cancelButtonText: this.$t("cancel")
        })
          .then(() => {
            this.$axios
              .post("https://smartbtc.io/bridge/kol/new_project", {
                kol_address: this.$store.state.address,
                project_info
              })
              .then((res) => {
                showToast(this.$t("kolAdd.success"));
                setTimeout(() => {
                  this.$router.push("/kol");
                }, 1000);
              })
              .catch((err) => {
                console.log(err);
                showToast(err);
              });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        showToast(this.$t("kolAdd.error"));
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.kolContent {
  font-size: 12px;
}
.header {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  background-color: #fff;
}
.form {
  padding: 20px 0;
  border-radius: 10px;
  background-color: #fff;
  text-align: left;
}
.list {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span:first-child {
    color: #111;
  }
}
.listBox {
  .title {
    margin-top: 20px;
    color: #111;
    text-align: left;
    padding-left: 20px;
  }
  .listDiv {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(80%, 1fr));
    padding: 0 20px;
    margin-top: 10px;

    .listS {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #666;
      padding: 0 10px;
      .inputBox {
        width: 80px;
      }
      input {
        width: 80%;
        height: 26px;
        padding: 0 10px;
        font-size: 12px;
      }
    }
  }
}
input {
  border: 1px solid #a1a1a1;
  border-radius: 4px;
  height: 40px;
  padding: 0 10px;
  background-color: transparent;
}
.sure {
  margin-top: 10px;
  text-align: center;
  button {
    width: 90%;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
  }
}
.desc {
  text-align: left;
  font-size: 12px;
  color: #999;
  line-height: 20px;
  padding: 20px;
}
</style>
