<template>
  <task-from :is-edit="false" />
</template>

<script>
import TaskFrom from './components/TaskFrom'

export default {
  name: 'Compile',
  components: { TaskFrom }
}
</script>

