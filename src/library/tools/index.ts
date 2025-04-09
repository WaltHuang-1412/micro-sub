import { format } from 'date-fns'
import { isNumber } from 'lodash'

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatIsAutomatic(value: boolean) {
  if (value) {
    return ''
  }
}

export const copyText = (value: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const input = document.createElement('input')
      let isSuccessful = false
      document.body.appendChild(input)
      input.value = value
      input.select()

      if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(value)
      } else {
        isSuccessful = document.execCommand('copy')
      }
      input.remove()
      if (isSuccessful) {
        resolve()
      } else {
        throw new Error('copy command was unsuccessful')
      }
    } catch (error) {
      console.log('error :>> ', error)
      reject()
    }
  })
}

export const downloadFile = (name: string, file: string) => {
  const link = document.createElement('a')
  link.setAttribute('download', name)
  link.href = file
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export const formatTimestampToDate = (value: number) => {
  if (isNumber(value)) {
    return format(new Date(value * 1000), 'yyyy/MM/dd HH:mm:ss')
  } else {
    return ''
  }
}

export function debounce(func: (event?: HTMLElement) => void, delay = 600) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (event?: HTMLElement) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      func(event)
    }, delay)
  }
}
