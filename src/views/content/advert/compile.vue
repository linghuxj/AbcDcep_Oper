<template>
  <advert-form :is-edit="true" />
</template>

<script>
import AdvertForm from '../components/AdvertForm'

export default {
  name: 'Compile',
  components: { AdvertForm }
}
</script>

