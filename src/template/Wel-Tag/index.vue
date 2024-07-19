<template>
  <div class="tag-center">
    <div class="tag-circular-big" :class="[`tag-circular-${type}`]"></div>
    <div class="tag-circular-small" :class="[`tag-cir-${type}`]"></div>
    <div class="tag-wrap" :class="[`tag-${type}`]">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WelTag',
  props: {
    type: {
      type: String,
      default: 'default'
    }
  }
}
</script>
<style scoped lang="scss">
.tag-center {
  position: relative;
  box-sizing: border-box;
  width: 90px;
  height: 90px;
  opacity: 0.8;
  .tag-circular-big {
    width: 85px;
    height: 85px;
    border: 7px solid #69bbc6;
    border-radius: 50%;
    position: absolute;
    margin: auto; /*以下五个属性为水平垂直居中的方法*/
    left: 5px;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0.8;
    box-sizing: border-box;
  }
  .tag-circular-primary {
    color: #fff;
    border: 7px solid #409eff;
  }
  .tag-circular-success {
    color: #fff;
    border: 7px solid #67c23a;
  }
  .tag-circular-info {
    color: #fff;
    border: 7px solid #909399;
  }
  .tag-circular-warning {
    color: #fff;
    border: 7px solid #e6a23c;
  }
  .tag-circular-danger {
    color: #fff;
    border: 7px solid #f56c6c;
  }
  .tag-circular-small {
    width: 65px;
    height: 65px;
    border: 3px dotted #9ddbe8;
    border-radius: 50%;
    position: absolute;
    margin: auto; /*以下五个属性为水平垂直居中的方法*/
    left: 5px;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0.8;
    box-sizing: border-box;
  }
  .tag-cir-primary {
    color: #fff;
    border: 3px dotted #409eff;
  }
  .tag-cir-success {
    color: #fff;
    border: 3px dotted #67c23a;
  }
  .tag-cir-info {
    color: #fff;
    border: 3px dotted #909399;
  }
  .tag-cir-warning {
    color: #fff;
    border: 3px dotted #e6a23c;
  }
  .tag-cir-danger {
    color: #fff;
    border: 3px dotted #f56c6c;
  }
  .tag-wrap {
    position: absolute;
    width: 90px;
    height: 30px;
    line-height: 30px;
    top: 30px;
    bottom: 0;
    background-color: #69bbc6;
    transform: skew(30deg, -30deg);
    border-radius: 3px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    opacity: 0.8;
  }
  .tag-primary {
    background-color: #409eff;
  }
  .tag-success {
    background-color: #67c23a;
  }
  .tag-info {
    background-color: #909399;
  }
  .tag-warning {
    background-color: #e6a23c;
  }
  .tag-danger {
    background-color: #f56c6c;
  }
}
</style>
