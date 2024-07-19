<template>
  <div>
    <div style="display: flex">
      <slot name="triangle-right"><div class="triangle-left"></div></slot>
      <div class="triangle-center">
        {{ content }}
      </div>
      <slot name="triangle-left"><div class="triangle-right"></div></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      default: () => {}
    }
  },
  data() {
    return {}
  }
}
</script>
<style scoped>
.triangle-center {
  height: 24px;
  padding: 0px 10px;
  background-color: #02a7f0;
  color: #fff;
  text-align: center;
  font-size: 12px;
  line-height: 24px;
}
.triangle-left {
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-right: 10px solid #02a7f0;
  border-bottom: 12px solid transparent;
}
.triangle-right {
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-left: 10px solid #02a7f0;
  border-bottom: 12px solid transparent;
}
</style>
