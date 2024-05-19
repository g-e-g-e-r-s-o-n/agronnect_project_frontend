<template>
  <div class="container mx-auto">
<!--    <h1 class="mt-8 text-2xl">Todos</h1>-->
    <div class="mt-3">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6 space-y-4 px-1"
             style="height: 500px">
          <div class="p-8 bg-white shadow-md rounded flex items-center justify-between">
            <div>
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{{ state.todo.title }}</div>
                <p class="text-gray-700 text-base">
                  {{ state.todo.description }}
                </p>
              </div>
              <div class="px-6 pt-4 pb-2">
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Deadline: {{ state.todo.deadline_date }} {{ state.todo.deadline_time }}</span>
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Created: {{ moment(state.todo.created_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
              </div>
            </div>
            <div class="space-x-2">
              <button v-if="state.todo.done"
                      class="bg-transparent hover:bg-green-500 text-green-600 font-semibold hover:text-white py-2 px-4 border border-green-600 hover:border-transparent rounded"
                      title="Done">Completed</button>
              <button v-else
                      class="bg-transparent hover:bg-orange-500 text-orange-600 font-semibold hover:text-white py-2 px-4 border border-orange-600 hover:border-transparent rounded"
                      title="Undone">Not completed</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {defineComponent, reactive} from "vue";
import moment from "moment";
import router from "@/router";
import {useRoute} from "vue-router";

export default defineComponent({
  data() {
    return {
      moment: moment,
      visible: localStorage.getItem("visible"),
    }
  },

  setup() {
    const state = reactive({
      todo: {},
    });
    const route = useRoute()

    function getTodo() {
      axios.get('http://localhost:8000' + '/api/todo/' + route.params.id, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + window.$cookies.get('token')
        }
      }).then((response) => {
        state.todo = response.data.todo[0]
      }).catch((error) => {
        if (error.response.status === 401) {
          window.$cookies.remove('token');
          localStorage.setItem('visible', '0');
          router.push('/login')
        }
        else if (error.response.status === 404) {
          router.push('/404')
        }
        else {
          console.log(error.response.status)
        }
      });
    }

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



    getTodo()

    logoutBtn()

    return {
      state
    };
  },
});
</script>