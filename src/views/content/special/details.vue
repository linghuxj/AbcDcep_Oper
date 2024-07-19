<template>
  <special-details />
</template>

<script>
import SpecialDetails from "../components/SpecialDetails.vue";

export default {
  name: "Details",
  components: { SpecialDetails },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
  },
};
</script>
<style lang="scss" scoped></style>
