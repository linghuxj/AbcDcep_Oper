<template>
  <div>
    <aside>
      {{ content }}
      <slot name="aleft" style="float: right;"></slot>
    </aside>
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
aside {
  background: #ccc;
  padding: 5px 20px;
  margin-bottom: 20px;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: space-between;
}
.aside-left {
  float: right;
}
</style>
