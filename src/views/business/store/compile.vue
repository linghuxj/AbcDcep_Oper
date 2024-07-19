<template>
  <edit-store :is-edit="true" />
</template>

<script>
import EditStore from '../components/EditStore.vue'

export default {
  name: 'Compile',
  components: { EditStore }
}
</script>

