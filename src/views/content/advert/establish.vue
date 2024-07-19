<template>
  <advert-form :is-edit="false" />
</template>

<script>
import AdvertForm from '../components/AdvertForm'

export default {
  name: 'Establish',
  components: { AdvertForm }
}
</script>

