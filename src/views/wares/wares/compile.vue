<template>
  <wares-from :is-edit="true" :is-show="false" />
</template>

<script>
// import WaresFrom from '../components/WaresFrom'
import WaresFrom from '@/components/Sku-Wrap/index'

export default {
  name: 'Compile',
  components: { WaresFrom }
}
</script>

