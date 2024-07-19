<template>
  <div class="main-content">
    <staffForm :isEdit="isEdit" />
  </div>
</template>
<script>
import staffForm from "./components/staff-form";
export default {
  name: "Edit",
  components: { staffForm },
  data() {
    return {
      isEdit: true,
    };
  },
};
</script>
<style scoped lang="scss"></style>
