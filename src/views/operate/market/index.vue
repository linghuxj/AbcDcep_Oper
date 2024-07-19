<template>
  <div class="issueBox">
    <div class="issued-by" @click="handlePublish">
      <el-row>
        <el-col :span="8">
          <el-image
            style="width: 80px; height: 80px"
            src="/img/icon_img.png"
            fit="fit"></el-image>
        </el-col>
        <el-col :span="16">
          <div class="issued-tit">新人礼</div>
          <div class="issued-col">新人注册，可获得奖励</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    handlePublish() {
      this.$router.push(`/operate/gift`)
    }
  }
}
</script>
<style lang="scss" scoped>
.issueBox {
  background-color: white;
  margin: 20px;
  padding: 30px;
  display: flex;
  // justify-content: space-around;
  align-items: center;
  .issued-by {
    width: 355px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215, 215, 215, 1);
    border-radius: 0px;
    background: inherit;
    box-sizing: border-box;
    background-color: rgba(24, 144, 255, 0.0980392156862745);
  }
  .el-col {
    margin-bottom: 0;
    .issued-tit {
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
      font-weight: 700;
      font-style: normal;
      color: rgba(0, 0, 0, 0.847058823529412);
      height: 40px;
      line-height: 50px;
    }
    .issued-col {
      font-size: 11px;
      color: rgba(0, 0, 0, 0.847058823529412);
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
