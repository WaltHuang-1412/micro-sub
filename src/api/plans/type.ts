export interface Section {
  id: number
  title: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  section_id: number
  title: string
  content: string
  is_completed: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SectionWithTasks extends Section {
  tasks: Task[]
}

export interface CreateSectionInput {
  title: string
}

export interface UpdateSectionInput {
  title: string
}

export interface CreateTaskInput {
  title: string
  content: string
  section_id: number
  is_completed?: boolean
}

export interface UpdateTaskInput {
  title?: string
  content?: string
  is_completed?: boolean
}
