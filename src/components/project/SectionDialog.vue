<template>
  <el-dialog>
    <el-form>
      <el-form-item label="Section Name">
        <el-input placeholder="Enter section name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="saveSection">Save</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElDialog, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
</script>
