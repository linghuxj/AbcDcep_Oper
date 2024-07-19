<template>
  <DiscountForm :is-edit="true" />
</template>

<script>
import DiscountForm from '../components/DiscountForm.vue'

export default {
  name: 'Compile',
  components: { DiscountForm }
}
</script>
