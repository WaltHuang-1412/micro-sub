<template>
  <transition name="fade" mode="out-in">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </transition>
</template>

<style lang="scss">
@import '@/styles/_reboot';
@import '@/styles/transition';
@import '@/styles/element-plus';
</style>
