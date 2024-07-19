<template>
  <div class="main-content">
    <staffForm :isEdit="isEdit" />
  </div>
</template>
<script>
import staffForm from "./components/staff-form";
export default {
  name: "Add",
  components: { staffForm },
  data() {
    return {
      isEdit: false,
    };
  },
};
</script>
<style scoped lang="scss"></style>
