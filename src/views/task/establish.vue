<template>
  <task-from :is-edit="true" />
</template>

<script>
import TaskFrom from './components/TaskFrom'

export default {
  name: 'Establish',
  components: { TaskFrom }
}
</script>

