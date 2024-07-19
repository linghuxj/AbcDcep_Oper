<template>
  <wares-details :is-show="false" />
</template>

<script>

import WaresDetails from '../components/WaresDetails'

export default {
  name: 'Details',
  components: { WaresDetails },
  data() {
    return {
      
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
  // components: { TaskDetails }
}
</script>
<style lang="scss" scoped>

</style>
