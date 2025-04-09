<template>
  <div>
    <h1>To-Do List</h1>
    <input
      v-model="newTask"
      placeholder="Add a new task"
      @keyup.enter="addTask"
    />
    <button @click="addTask">Add</button>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <span>{{ task }}</span>
        <button @click="removeTask(index)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  components: {},
})
</script>
