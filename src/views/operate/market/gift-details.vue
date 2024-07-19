<template>
  <gift-details />
</template>

<script>

import GiftDetails from '../components/GiftDetails'

export default {
  name: 'Details',
  components: { GiftDetails },
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
