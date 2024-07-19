<template>
  <div>
    <coupon-form :is-edit="false" />
  </div>
</template>
<script>
import CouponForm from './components/CouponForm.vue'
export default {
  name: 'Addcoupon',
  components: { CouponForm },
  data() {
    return {
      
    }
  }
}
</script>
<style scoped>

</style>
