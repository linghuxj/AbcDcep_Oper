<template>
  <wares-from :is-edit="false" :is-show="false" />
</template>

<script>
// import WaresFrom from '../components/WaresFrom'
import WaresFrom from '@/components/Sku-Wrap/index'

export default {
  name: 'Establish',
  components: { WaresFrom }
}
</script>

