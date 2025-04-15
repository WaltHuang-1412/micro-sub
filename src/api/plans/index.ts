import axios from '@/api/axios'
import type {
  Section,
  SectionWithTasks,
  CreateSectionInput,
  UpdateSectionInput,
  CreateTaskInput,
  UpdateTaskInput,
  Task,
} from './type'
export * from './type'

// ✅ Sections API

export const getSections = () => axios.get<Section[]>('/plans/sections')

export const getSectionsWithTasks = (): Promise<SectionWithTasks[]> =>
  axios.get('/plans/sections-with-tasks')

export const createSection = (request: CreateSectionInput): Promise<Section> =>
  axios.post('/plans/sections', request)

export const updateSection = (id: number, request: UpdateSectionInput) =>
  axios.put(`/plans/sections/${id}`, request)

export const deleteSection = (id: number) =>
  axios.delete(`/plans/sections/${id}`)

export const updateSectionsAndTasksSort = (request: SectionWithTasks[]) =>
  axios.put('/plans/sections-with-tasks', request)

// ✅ Tasks API

export const createTask = (request: CreateTaskInput): Promise<Task> =>
  axios.post('/plans/tasks', request)

export const updateTask = (id: number, request: UpdateTaskInput) =>
  axios.put(`/plans/tasks/${id}`, request)

export const deleteTask = (id: number) => axios.delete(`/plans/tasks/${id}`)
