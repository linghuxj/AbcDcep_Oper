<template>
  <DiscountForm :is-edit="false" />
</template>

<script>
import DiscountForm from '../components/DiscountForm.vue'

export default {
  name: 'Compile',
  components: { DiscountForm }
}
</script>
