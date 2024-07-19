<template>
  <edit-store :is-edit="true" />
</template>

<script>
import EditStore from "../components/DraftEditStore.vue";

export default {
  name: "Compile",
  components: { EditStore },
};
</script>
