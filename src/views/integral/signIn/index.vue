<template>
  <div class="main-content">
    <div class="main-title">
      <div>签到赚米粒参数</div>
      <!-- 开关 -->
      <div>
        <span class="edit-switch">编辑开关</span>
        <el-switch v-model="isEdit" active-color="#409eff"> </el-switch>
      </div>
    </div>

    <label class="item-tips">
      注：数值只能输入自然数，第7天概率总和不能超过100%
    </label>
    <div class="item">
      <label>第1天</label>
      <input
        type="number"
        v-model="ruleMes.bonus1"
        :disabled="!isEdit"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        maxlength="10"
      />
      <span>米粒</span>
    </div>
    <div class="item">
      <label>第2天</label>
      <input
        type="number"
        v-model="ruleMes.bonus2"
        :disabled="!isEdit"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        maxlength="10"
      />
      <span>米粒</span>
    </div>
    <div class="item">
      <label>第3天</label>
      <input
        type="number"
        v-model="ruleMes.bonus3"
        :disabled="!isEdit"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        maxlength="10"
      />
      <span>米粒</span>
    </div>
    <div class="item">
      <label>第4天</label>
      <input
        type="number"
        v-model="ruleMes.bonus4"
        :disabled="!isEdit"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        maxlength="10"
      />
      <span>米粒</span>
    </div>
    <div class="item">
      <label>第5天</label>
      <input
        type="number"
        v-model="ruleMes.bonus5"
        :disabled="!isEdit"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        maxlength="10"
      />
      <span>米粒</span>
    </div>
    <div class="item">
      <label>第6天</label>
      <input
        type="number"
        v-model="ruleMes.bonus6"
        :disabled="!isEdit"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        maxlength="10"
      />
      <span>米粒</span>
    </div>
    <div class="item">
      <label>第7天</label>
      <div class="bonusList">
        <div
          v-for="(item, index) in ruleMes.bonusList"
          :key="index"
          class="bonusItem"
        >
          <input
            type="number"
            v-model="item.bonus"
            :disabled="!isEdit"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            maxlength="10"
          />
          <span>米粒</span>
          <input
            type="number"
            v-model="item.probability"
            :disabled="!isEdit"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            maxlength="10"
          />%
          <i
            class="el-icon-circle-plus"
            style="margin-right: 20px"
            @click="addBonus()"
          ></i>
          <i
            class="el-icon-remove"
            v-if="index != 0"
            @click="reduceBonus(index)"
          ></i>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="btn" v-if="isEdit">
      <el-button class="btn-cancle" @click="to_cancle()">取消</el-button>
      <el-button type="primary" @click="to_save()">保存</el-button>
    </div>
  </div>
</template>
<script>
import { getRule, createRule, updateRule } from "@/api/integral/index";
export default {
  data() {
    return {
      isEdit: false,
      isAdd: false,
      ruleMes: {
        bonus1: null,
        bonus2: null,
        bonus3: null,
        bonus4: null,
        bonus5: null,
        bonus6: null,
        bonusList: [{ bonus: null, probability: null }],
      },
    };
  },
  created() {
    this.getRule();
  },
  methods: {
    // 查询
    getRule() {
      getRule().then((res) => {
        if (res.data.data === null) {
          this.isAdd = true;
        } else {
          this.ruleMes = res.data.data;
          this.isAdd = false;
        }
      });
    },
    // 新增
    addBonus() {
      let obj = { bonus: null, probability: null };
      this.ruleMes.bonusList.push(obj);
    },
    // 减少
    reduceBonus(index) {
      this.ruleMes.bonusList.splice(index, 1);
    },
    // 保存
    saveRule() {
      if (
        !this.ruleMes.bonus1 ||
        this.ruleMes.bonus1 === "" ||
        !this.ruleMes.bonus2 ||
        this.ruleMes.bonus2 === "" ||
        !this.ruleMes.bonus3 ||
        this.ruleMes.bonus3 === "" ||
        !this.ruleMes.bonus4 ||
        this.ruleMes.bonus4 === "" ||
        !this.ruleMes.bonus5 ||
        this.ruleMes.bonus5 === "" ||
        !this.ruleMes.bonus6 ||
        this.ruleMes.bonus6 === ""
      ) {
        this.$message("请输入数值");
        return;
      }
      let ratio = 0;
      this.ruleMes.bonusList.map((item) => {
        console.debug("item", item);
        if (!item.bonus && !item.probability) {
          this.$message("请输入数值");
          return;
        }
        ratio += parseInt(item.probability);
      });
      console.debug("ratio", ratio);
      if (ratio < 100 || ratio > 100) {
        this.$message("第7天概率总和要为100%");
        return;
      }
      this.$confirm("是否保存当前修改参数?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          if (this.isAdd) {
            createRule(this.ruleMes)
              .then((res) => {
                this.$message("新增成功");
                this.isEdit = false;
              })
              .catch(() => {});
          } else {
            updateRule(this.ruleMes).then((res) => {
              this.$message("修改成功");
              this.isEdit = false;
            });
          }
          const loading = this.$loading({
            lock: true,
            text: "加载中~",
          });
          setTimeout(() => {
            loading.close();
          }, 500);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已关闭",
          });
        });
    },
    // 取消
    to_cancle() {
      this.$confirm("是否取消当前修改?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          this.isEdit = false;
          this.getRule();
          const loading = this.$loading({
            lock: true,
            text: "加载中~",
          });
          setTimeout(() => {
            loading.close();
          }, 500);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    to_save() {
      this.saveRule();
    },
  },
};
</script>
<style scoped>
.main-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background-color: #f2f2f2;
  padding: 5px;
  margin-top: 10px;
}
.edit-switch {
  font-size: 12px;
  margin-right: 10px;
}
.item {
  margin: 30px 0px;
  display: flex;
  flex-direction: row;
}
.item-tips {
  font-size: 12px;
  color: red;
  margin-top: 20px;
}
.item label {
  margin-right: 30px;
}
.item span {
  margin-left: 30px;
  margin-right: 30px;
}
.btn {
  width: 100%;
  text-align: center;
  margin-top: 30px;
}
.btn-cancle {
  margin-right: 30px;
}
.bonusList {
  display: flex;
  flex-direction: column;
}
.bonusItem {
  margin-bottom: 20px;
}
</style>
