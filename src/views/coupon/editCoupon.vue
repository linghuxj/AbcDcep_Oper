<template>
  <div>
    <coupon-form :is-edit="true" />
  </div>
</template>
<script>
import CouponForm from './components/CouponForm.vue'
export default {
  name: 'EditConpou',
  components: { CouponForm },
  data() {
    return {
      
    }
  },
  created() {
  }
}
</script>
<style scoped>

</style>
