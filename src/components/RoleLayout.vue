<template>
  <div>
    <!-- Dynamic AppBar -->
    <component :is="currentAppBar" />
    <div class="layout">
      <!-- Dynamic Sidebar -->
      <component :is="currentSidebar" />
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { defineProps } from 'vue'

defineProps({
  role: {
    type: String,
    required: true,
  },
})

// Dynamic AppBar mapping
const currentAppBar = computed(() => {
  const appBars = {
    student: () => import('@/components/AppbarStudent.vue'),
    // Add other roles as needed
  }
  return appBars[role] || null
})

// Dynamic Sidebar mapping
const currentSidebar = computed(() => {
  const sidebars = {
    student: () => import('@/components/SidebarStudent.vue'),
    // Add other roles as needed
  }
  return sidebars[role] || null
})
</script>

<style>
.layout {
  display: flex;
}
main {
  flex: 1;
  padding: 16px;
}
</style>
