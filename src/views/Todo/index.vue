<template>
  <div class="todo">
    <div class="todo__header">
      <button @click="openAddSectionDialog">Add New Section</button>
      <button @click="addTaskToFirstSection">Add Task to First Section</button>
    </div>
    <div class="todo__content">
      <div class="section-list">
        <div
          v-for="(section, sectionIndex) in sectionList"
          :key="sectionIndex"
          class="section-item"
        >
          <div class="section-header">
            <h2 @dblclick="openEditSectionDialog(sectionIndex)">
              {{ section.name }}
            </h2>
            <el-icon class="delete-icon" @click="deleteSection(sectionIndex)">
              <CircleClose />
            </el-icon>
          </div>
          <div
            :ref="(el) => (sectionRefs[sectionIndex] = el)"
            class="task-list"
          >
            <div
              v-for="(task, taskIndex) in section.taskList"
              :key="taskIndex"
              class="task-item"
            >
              <div class="task-header">
                <h3>{{ task.title }}</h3>
                <el-icon
                  class="delete-icon"
                  @click="deleteTask(sectionIndex, taskIndex)"
                >
                  <CircleClose />
                </el-icon>
              </div>
              <p>{{ task.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="isDialogVisible"
      title="Section Dialog"
      width="30%"
      :append-to-body="true"
    >
      <el-form :model="dialogForm">
        <el-form-item label="Section Name" prop="sectionName">
          <el-input
            v-model="dialogForm.sectionName"
            placeholder="Enter section name"
          ></el-input>
          <el-button @click="closeDialog">Cancel</el-button>
          <el-button type="primary" @click="saveSection(dialogForm)"
            >Save</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useDraggable } from 'vue-draggable-plus'
import { CircleClose } from '@element-plus/icons-vue'

// Data
const sectionList = ref([
  {
    name: 'Section 1',
    taskList: [
      { title: 'Task 1', content: 'This is the first task' },
      { title: 'Task 2', content: 'This is the second task' },
    ],
  },
])

const sectionRefs = ref([])
const isDialogVisible = ref(false)
const dialogForm = ref({ sectionName: '' })
const editingSectionIndex = ref(null)

// Methods
const initializeDraggable = (section, index) => {
  nextTick(() => {
    const el = sectionRefs.value[index]
    if (!el) {
      console.error(`Element for section index ${index} is undefined`)
      return
    }
    const { start } = useDraggable(el, {
      animation: 150,
      group: 'tasks',
      modelValue: section.taskList,
      onUpdate: () => {
        console.log(`${section.name} updated`)
      },
      onAdd: () => {
        console.log(`Task added to ${section.name}`)
      },
      remove: () => {
        console.log(`Task removed from ${section.name}`)
      },
    })
    start()
  })
}

const init = () => {
  sectionList.value.forEach((section, index) => {
    initializeDraggable(section, index)
  })
}

const openAddSectionDialog = () => {
  dialogForm.value = { sectionName: '' }
  editingSectionIndex.value = null
  isDialogVisible.value = true
}

const openEditSectionDialog = (sectionIndex) => {
  dialogForm.value = { sectionName: sectionList.value[sectionIndex].name }
  editingSectionIndex.value = sectionIndex
  isDialogVisible.value = true
}

const saveSection = (form) => {
  if (editingSectionIndex.value === null) {
    // 新增區塊
    const newSection = {
      name: form.sectionName,
      taskList: [],
    }
    sectionList.value.push(newSection)
    initializeDraggable(newSection, sectionList.value.length - 1)
  } else {
    // 編輯區塊
    sectionList.value[editingSectionIndex.value].name = form.sectionName
  }
  closeDialog()
}

const closeDialog = () => {
  isDialogVisible.value = false
}

const addTaskToFirstSection = () => {
  if (sectionList.value.length === 0) {
    console.warn('No sections available to add a task.')
    return
  }
  const newTask = {
    title: `Task ${sectionList.value[0].taskList.length + 1}`,
    content: 'This is a dynamically added task',
  }
  sectionList.value[0].taskList.push(newTask)
}

const deleteSection = (sectionIndex) => {
  sectionList.value.splice(sectionIndex, 1)
}

const deleteTask = (sectionIndex, taskIndex) => {
  sectionList.value[sectionIndex].taskList.splice(taskIndex, 1)
}

// Lifecycle
onMounted(() => {
  init()
})
</script>

<style lang="scss">
/* 整體容器樣式 */
.todo {
  padding: 20px;
  background: #f9f9f9;
  width: 100%;
  height: 100%;

  &__header {
    width: 100%;
    height: 100px;
    padding: 10px 0;
    display: flex;
    gap: 10px;
  }
  &__content {
    width: 100%;
    height: calc(100% - 100px);
  }
}

/* 區塊列表容器 */
.section-list {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  overflow-x: scroll;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 單個區塊標題 */
.section-item {
  flex: 0 0 auto;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: left;
  width: 200px;
  height: 100%;
  display: inline-block;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-icon {
  cursor: pointer;
  color: #ff4d4f;
  transition: color 0.3s ease;
  width: 20px;
}

.delete-icon:hover {
  color: #ff7875;
}

h2 {
  height: 50px;
  margin: 0;
}

/* 任務列表容器 */
.task-list {
  border: 1px solid #ddd;
  padding: 10px;
  background: #f7f7f7;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: calc(100% - 50px);
  overflow-y: auto;
}

/* 單個任務項目 */
.task-item {
  padding: 10px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: grab;
  transition: background 0.3s ease;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-item:hover {
  background: #e0e0e0;
}

.task-item h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.task-item p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}
</style>
