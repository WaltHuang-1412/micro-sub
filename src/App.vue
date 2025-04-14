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
#app {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-auto-columns: 200px 1fr;
  grid-template-areas: 'navbar sub';

  &__navbar-slot {
    grid-area: navbar;
    overflow: auto;
  }
  &__sub-slot {
    grid-area: sub;
    overflow: auto;
  }

  .single-spa-container,
  .navbar {
    width: 100%;
    height: 100%;
  }
}
</style>
