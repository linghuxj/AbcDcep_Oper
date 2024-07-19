<template>
  <turntable-details />
</template>

<script>

import TurntableDetails from '../components/TurntableDetails'

export default {
  name: 'Details',
  components: { TurntableDetails },
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
