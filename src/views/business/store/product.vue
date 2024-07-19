<template>
  <wares-from :is-edit="true" :is-product="true" />
</template>

<script>
// import WaresFrom from '@/views/wares/components/WaresFrom.vue'
import WaresFrom from '@/components/Sku-Wrap/index'

export default {
  name: 'Product',
  components: { WaresFrom }
}
</script>
