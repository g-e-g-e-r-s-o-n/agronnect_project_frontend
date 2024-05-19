<template>
  <div class="container mx-auto">
    <h1 class="mt-8 text-2xl">The Home Page</h1>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: 'Home',
  setup () {
    const state = reactive({
      visible: localStorage.getItem("visible"),
    });

    function logoutBtn() {
      const visible = localStorage.getItem('visible')
      const logoutBtn = document.getElementById('logoutBtn');
      if (visible === '1') {
        if (logoutBtn.classList.contains('invisible')) {
          logoutBtn.classList.remove('invisible')
        }
      }
      else {
        if (!logoutBtn.classList.contains('invisible')) {
          logoutBtn.classList.add('invisible')
        }
      }
    }

    logoutBtn()

  }
});
</script>
