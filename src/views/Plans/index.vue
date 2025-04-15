<template>
  <div class="todo">
    <div class="todo__header">
      <button @click="openAddSectionDialog">Add New Section</button>
      <!-- <button @click="addTaskToFirstSection">Add Task to First Section</button> -->
    </div>
    <div class="todo__content">
      <div class="section-list">
        <div
          v-for="(section, sectionIndex) in sectionList"
          :key="sectionIndex"
          class="section-item"
        >
          <el-icon
            class="section-item__delete-icon"
            @click="handleDeleteSection(sectionIndex)"
          >
            <CircleClose />
          </el-icon>
          <div class="section-header">
            <h2 @dblclick="openEditSectionDialog(sectionIndex)">
              {{ section.title }}
            </h2>

            <!-- section-item 內 -->
            <el-button
              size="small"
              type="success"
              @click="openAddTaskDialog(sectionIndex)"
            >
              ＋ 任務
            </el-button>
          </div>
          <div
            :ref="(el) => (sectionRefs[sectionIndex] = el as HTMLElement)"
            class="task-list"
          >
            <div
              v-for="(task, taskIndex) in section.tasks"
              :key="taskIndex"
              class="task-item"
            >
              <el-icon
                class="task-item__delete-icon"
                @click="handleDeleteTask(sectionIndex, taskIndex)"
              >
                <CircleClose />
              </el-icon>
              <div class="task-item__header">
                <h3>{{ task.title }}</h3>
              </div>
              <div class="task-item__content">
                <p>{{ task.content }}</p>
              </div>
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
      <el-form :model="dialogForm" @submit.prevent>
        <el-form-item label="Section Name" prop="sectionName">
          <el-input
            v-model="dialogForm.sectionName"
            placeholder="Enter section name"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="saveSection(dialogForm)"
          >Save</el-button
        >
      </template>
    </el-dialog>
    <!-- ✨ Add Task Dialog -->
    <el-dialog
      v-model="isTaskDialogVisible"
      title="新增任務"
      width="30%"
      :append-to-body="true"
    >
      <el-form :model="taskDialogForm" @submit.prevent>
        <el-form-item label="標題" prop="title">
          <el-input v-model="taskDialogForm.title" placeholder="輸入任務標題" />
        </el-form-item>
        <el-form-item label="內容" prop="content">
          <el-input
            type="textarea"
            v-model="taskDialogForm.content"
            placeholder="輸入任務內容"
            :autosize="{ minRows: 2, maxRows: 8 }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeTaskDialog">取消</el-button>
        <el-button type="primary" @click="saveTask">儲存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useDraggable } from 'vue-draggable-plus'
import { CircleClose } from '@element-plus/icons-vue'
import {
  getSectionsWithTasks,
  updateSectionsAndTasksSort,
  createSection,
  createTask,
  deleteSection,
  deleteTask,
} from '@/api/plans'
import type { SectionWithTasks, Task } from '@/api/plans'
import { debounce } from 'lodash'
import { ElMessageBox } from 'element-plus'

const sectionList = ref<SectionWithTasks[]>([])
const sectionRefs = ref<(HTMLElement | null)[]>([])
const isDialogVisible = ref(false)
const dialogForm = ref<{ sectionName: string }>({ sectionName: '' })
const editingSectionIndex = ref<number | null>(null)

// 初始化拖曳
const initializeDraggable = (section: SectionWithTasks, index: number) => {
  nextTick(() => {
    const el = sectionRefs.value[index]
    if (!el) return
    const { start } = useDraggable(el, sectionList.value[index].tasks as any, {
      group: { name: 'tasks' },
      onEnd: () => {
        console.log(`${section.title} updated`)
        debouncedUpdateSort()
      },
    })
    start()
  })
}

// 初始化資料
const init = async () => {
  try {
    sectionList.value = await getSectionsWithTasks()
    sectionList.value.forEach((section, index) => {
      initializeDraggable(section, index)
    })
  } catch (err) {
    console.error('讀取 plans 失敗', err)
  }
}

const openAddSectionDialog = () => {
  dialogForm.value = { sectionName: '' }
  editingSectionIndex.value = null
  isDialogVisible.value = true
}

const openEditSectionDialog = (sectionIndex: number) => {
  dialogForm.value = { sectionName: sectionList.value[sectionIndex].title }
  editingSectionIndex.value = sectionIndex
  isDialogVisible.value = true
}

const saveSection = async (form: { sectionName: string }) => {
  try {
    if (editingSectionIndex.value === null) {
      const response = await createSection({ title: form.sectionName })
      const newSection: SectionWithTasks = { ...response, tasks: [] }
      sectionList.value.push(newSection)
      initializeDraggable(newSection, sectionList.value.length - 1)
    } else {
      sectionList.value[editingSectionIndex.value].title = form.sectionName
      // ❗可擴充：呼叫 updateSection API
    }
    closeDialog()
  } catch (err) {
    console.error('儲存 section 失敗', err)
  }
}

const closeDialog = () => {
  isDialogVisible.value = false
}

const addTaskToFirstSection = async () => {
  if (!sectionList.value.length) return
  const first = sectionList.value[0]
  const task = await createTask({
    section_id: first.id,
    title: `Task ${first.tasks.length + 1}`,
    content: 'New task',
  })
  first.tasks.push(task as unknown as Task)
}

const handleDeleteSection = async (sectionIndex: number) => {
  const section = sectionList.value[sectionIndex]

  try {
    await ElMessageBox.confirm(
      `你確定要刪除區塊「${section.title}」嗎？此操作無法復原。`,
      '刪除確認',
      {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    await deleteSection(section.id)
    sectionList.value.splice(sectionIndex, 1)
  } catch {
    // 使用者取消操作，不需處理
  }
}

const handleDeleteTask = async (sectionIndex: number, taskIndex: number) => {
  const task = sectionList.value[sectionIndex].tasks[taskIndex]

  try {
    await ElMessageBox.confirm(
      `你確定要刪除任務「${task.title}」嗎？`,
      '刪除確認',
      {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    await deleteTask(task.id)
    sectionList.value[sectionIndex].tasks.splice(taskIndex, 1)
  } catch {
    // 取消
  }
}

// 對話框
const isTaskDialogVisible = ref(false)
const taskDialogForm = ref({
  title: '',
  content: '',
})
const activeSectionIndex = ref<number | null>(null)

const openAddTaskDialog = (sectionIndex: number) => {
  taskDialogForm.value = { title: '', content: '' }
  activeSectionIndex.value = sectionIndex
  isTaskDialogVisible.value = true
}

const closeTaskDialog = () => {
  isTaskDialogVisible.value = false
  activeSectionIndex.value = null
}

const saveTask = async () => {
  if (activeSectionIndex.value === null) return
  const section = sectionList.value[activeSectionIndex.value]
  try {
    const newTask: Task = await createTask({
      section_id: section.id,
      title: taskDialogForm.value.title,
      content: taskDialogForm.value.content,
    })
    section.tasks.push(newTask)
    closeTaskDialog()
  } catch (err) {
    console.error('新增任務失敗', err)
  }
}

// 宣告 debounce 函式
const debouncedUpdateSort = debounce(async () => {
  try {
    await updateSectionsAndTasksSort(sectionList.value)
    console.log('✅ 排序已更新')
  } catch (err) {
    console.error('排序更新失敗', err)
  }
}, 800)

onMounted(init)
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
    height: 60px;
    padding: 10px 0;
    display: flex;
    gap: 10px;
  }
  &__content {
    width: 100%;
    height: calc(100% - 60px);
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
  padding: 10px;
  width: 200px;
  height: 100%;
  display: inline-block;
  position: relative;
  background-color: #f0f0f0;
  &__delete-icon {
    cursor: pointer;
    color: #ff4d4f;
    transition: color 0.3s ease;
    width: 20px;
    position: absolute;
    right: -10px;
    top: -10px;
  }

  &__delete-icon:hover {
    color: #ff7875;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  position: relative;
  height: 100px;
  width: 100%;

  &__header {
    height: 30%;
    width: 100%;
  }

  &__content {
    height: 70%;
    width: 100%;
  }

  &:hover {
    background: #e0e0e0;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    word-break: break-all;
  }

  p {
    margin: 5px 0 0;
    font-size: 14px;
    color: #666;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    word-break: break-all;
  }

  &__delete-icon {
    cursor: pointer;
    color: #ff4d4f;
    transition: color 0.3s ease;
    width: 20px;
    position: absolute;
    right: -10px;
    top: -10px;
  }

  &__delete-icon:hover {
    color: #ff7875;
  }
}
</style>
