<template>
  <div class="container mx-auto">
    <h1 class="mt-8 text-2xl">Todos</h1>

    <div class="mt-3">
      <div class="grid grid-cols-3 gap-4 mb-10 p-8 shadow-md rounded">
        <div>
          <input type="text" id="todo_id" placeholder="ID" class="p-2 mt-4 border rounded w-full">
        </div>
        <div>
          <input type="text" id="todo_title" placeholder="Title" class="p-2 mt-4 border rounded w-full">
        </div>
        <div class="inline-block">
          <span class="loader mr-3 invisible" id="filter_loader"></span>
          <button class="p-2 mt-4 pl-10 pr-10 bg-transparent hover:bg-blue-500 text-blue-600 font-semibold hover:text-white border border-blue-600 hover:border-transparent rounded" @click="filter()">
            Filter</button>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6 space-y-4 px-1"
             style="height: 500px">
          <div v-for="(todo, index) in state['todos'].todos"
               :key="index"
               class="p-8 bg-white shadow-md rounded flex items-center justify-between">
            <div>
              <router-link :to="{ name: 'Todo', params: { id: todo.id }}" class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{{ todo.id }}</router-link>
              <div class="font-bold text-xl mb-2">{{ todo.title }}</div>
              <input type="text" :id="['input_' + todo.id]"
                     v-model="todo.description"
                     @keydown.enter="updateTodo(todo)"
                     class="p-2 mt-4 border rounded w-full">
              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     :for="['input_' + todo.id]">Description</label>
              <input type="date" :id="['deadline_date_' + todo.id]"
                     v-model="todo.deadline_date"
                     @keydown.enter="updateTodo(todo)"
                     class="p-2 mt-4 border rounded w-full">
              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     :for="['deadline_date_' + todo.id]">Deadline date</label>
              <input type="time" :id="['deadline_time_' + todo.id]"
                     v-model="todo.deadline_time"
                     @keydown.enter="updateTodo(todo)"
                     class="p-2 mt-4 border rounded w-full">
              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     :for="['deadline_time_' + todo.id]">Deadline time</label>
              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Created: {{ moment(todo.created_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
            </div>
            <div class="space-x-2">
              <span class="loader mr-3 invisible" :id="['action_loader_' +todo.id]"></span>
              <button class="bg-transparent hover:bg-red-500 text-red-600 font-semibold hover:text-white py-2 px-4 border border-red-600 hover:border-transparent rounded"
                      @click="removeTodo(todo)"
                      title="Remove todo">&times;</button>
              <button v-if="!todo.done"
                      class="bg-transparent hover:bg-green-500 text-green-600 font-semibold hover:text-white py-2 px-4 border border-green-600 hover:border-transparent rounded"
                      @click="markAsDone(todo)"
                      title="Mark as done">&check;</button>
              <button v-else
                      class="bg-transparent hover:bg-orange-500 text-orange-600 font-semibold hover:text-white py-2 px-4 border border-orange-600 hover:border-transparent rounded"
                      @click="markAsUndone(todo)"
                      title="Mark as undone">&#8630;</button>
            </div>
          </div>
          <div v-if="state.todos.length === 0 || state.todos === 'You dont have any task to do.'"
               class="px-8 py-16 bg-white text-gray-700 shadow-md rounded text-sm">
            You dont have any task to do.
          </div>
        </div>

        <div class="col-span-6">
          <div class="p-8">
            <h2 class="text-xl">Add a todo</h2>
          </div>
          <div class="grid grid-cols-2 gap-4 p-8 bg-white shadow-md rounded">
              <input type="text"
                     v-model="state.todoText"
                     placeholder="Title"
                     class="p-2 mt-4 border rounded w-full">
            <div>
              <div class="inline-block">
                <span class="loader mr-3 invisible" id="add_loader"></span>
                <button class="p-2 mt-4 pl-10 pr-10 bg-transparent hover:bg-green-500 text-green-600 font-semibold hover:text-white border border-green-600 hover:border-transparent rounded" @click="addTodo()">
                  Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent, reactive } from "vue";
import moment from "moment";
import router from "@/router";
// import { ref } from 'vue';

export default defineComponent({
  data() {
    return {
      moment: moment
    }
  },

  setup() {
    const state = reactive({
      todos: [],
      todoText: "",
      visible: localStorage.getItem("visible"),
    });
    // console.log(state.todos)

    function addTodo() {
      document.getElementById('add_loader').classList.remove("invisible")
      axios.post('http://localhost:8000' + '/api/todo', {
        title: state.todoText
      }, {
        headers: {
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          'Authorization': 'Bearer ' + window.$cookies.get('token')
        }
      }).then((response) => {
        document.getElementById('add_loader').classList.add("invisible")
        state.todoText = "";
        getTodos();
      }).catch((error) => {
        document.getElementById('add_loader').classList.add("invisible")
        if (error.response.status === 401) {
          // localStorage.removeItem('token')
          window.$cookies.remove('token');
          localStorage.setItem('visible', '0')
          router.push('/login')
        }
        else if (error.response.status === 422) {
          if (error.response.data.title) {
            alert(error.response.data.title[0])
          }
          else {
            console.log(error.response.data)
          }
        }
        else {
          console.log(error.response.status)
        }
      });
    }

    function updateTodo(todo) {
      document.getElementById('action_loader_' + todo.id).classList.remove("invisible")
      const description_value = document.getElementById("input_"+todo.id).value;
      const deadline_date_value = document.getElementById("deadline_date_"+todo.id).value;
      const deadline_time_value = document.getElementById("deadline_time_"+todo.id).value;
      axios.put('http://localhost:8000' + '/api/todo/' + todo.id, {
        description: description_value,
        deadline_date: deadline_date_value,
        deadline_time: deadline_time_value
      }, {
        headers: {
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          'Authorization': 'Bearer ' + window.$cookies.get('token')
        }
      }).then(() => {
        document.getElementById('action_loader_' + todo.id).classList.add("invisible")
          getTodos()
      }).catch((error) => {
        document.getElementById('action_loader_' + todo.id).classList.add("invisible")
        if (error.response.status === 401) {
          // localStorage.removeItem('token')
          window.$cookies.remove('token')
          localStorage.setItem('visible', '0')
          router.push('/login')
        }
        else if (error.response.status === 422) {
          if (error.response.data.description) {
            alert(error.response.data.description[0])
          }
          else if (error.response.data.deadline_date) {
            alert(error.response.data.deadline_date[0])
          }
          else if (error.response.data.deadline_time) {
            alert(error.response.data.deadline_time[0])
          }
          else {
            console.log(error.response.data)
          }
        }
        else {
          console.log(error.response.status)
        }
      });
    }

    function markAsDone(todo) {
      document.getElementById('action_loader_' + todo.id).classList.remove("invisible")
      axios.post('http://localhost:8000' + '/api/todo/mark-as-done', {
        id: todo.id
      }, {
        headers: {
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          'Authorization': 'Bearer ' + window.$cookies.get('token')
        }
      }).then(() => {
        document.getElementById('action_loader_' + todo.id).classList.add("invisible")
        getTodos()
      }).catch((error) => {
        document.getElementById('action_loader_' + todo.id).classList.add("invisible")
        if (error.response.status === 401) {
          // localStorage.removeItem('token')
          window.$cookies.remove('token')
          localStorage.setItem('visible', '0')
          router.push('/login')
        }
        else {
          console.log(error.response.status)
        }
      });
    }

    function markAsUndone(todo) {
      document.getElementById('action_loader_' + todo.id).classList.remove("invisible")
      axios.post('http://localhost:8000' + '/api/todo/mark-as-undone', {
        id: todo.id
      }, {
        headers: {
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          'Authorization': 'Bearer ' + window.$cookies.get('token')
        }
      }).then(() => {
        document.getElementById('action_loader_' + todo.id).classList.add("invisible")
        getTodos()
      }).catch((error) => {
        document.getElementById('action_loader_' + todo.id).classList.add("invisible")
        if (error.response.status === 401) {
          // localStorage.removeItem('token')
          window.$cookies.remove('token')
          localStorage.setItem('visible', '0')
          router.push('/login')
        }
        else {
          console.log(error.response.status)
        }
      });
    }

    function removeTodo(todo) {
      if (!confirm("Are you sure?")) {
        return;
      }
      document.getElementById('action_loader_' + todo.id).classList.remove("invisible")
      axios.delete('http://localhost:8000' + '/api/todo/'+todo.id, {
        headers: {
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          'Authorization': 'Bearer ' + window.$cookies.get('token')
        }
      }).then(() => {
        document.getElementById('action_loader_' + todo.id).classList.add("invisible")
        getTodos()
      }).catch((error) => {
        document.getElementById('action_loader_' + todo.id).classList.add("invisible")
        if (error.response.status === 401) {
          // localStorage.removeItem('token');
          window.$cookies.remove('token')
          localStorage.setItem('visible', '0')
          router.push('/login');
        }
        else {
          console.log(error.response.status)
        }
      });
    }

    function getTodos() {
      axios.get('http://localhost:8000' + '/api/todos', {
        headers: {
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          'Authorization': 'Bearer ' + window.$cookies.get('token')
        }
      }).then((response) => {
          if (response.data.status === 'success' && response.data.todos.length > 0) {
            state.todos = response.data;
          }
          else {
            state.todos = "You dont have any task to do.";
          }
        }).catch((error) => {
        if (error.response.status === 401) {
          // localStorage.removeItem('token');
          window.$cookies.remove('token')
          localStorage.setItem('visible', '0')
          router.push('/login');
        }
        else {
          console.log(error.response.status)
        }
      });
    }


    function filter() {
      const filter_id = document.getElementById("todo_id").value
      const filter_title = document.getElementById("todo_title").value
      document.getElementById('filter_loader').classList.remove("invisible")
      axios.get('http://localhost:8000' + '/api/todos' + '?id=' + filter_id + '&title=' + filter_title , {
        headers: {
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          'Authorization': 'Bearer ' + window.$cookies.get('token')
        },
      }).then((response) => {
        document.getElementById('filter_loader').classList.add("invisible")
        if (response.data.status === 'success' && response.data.todos.length > 0) {
          state.todos = response.data;
        }
        else {
          state.todos = "You dont have any task to do.";
        }
      }).catch((error) => {
        document.getElementById('filter_loader').classList.add("invisible")
        if (error.response.status === 401) {
          // localStorage.removeItem('token');
          window.$cookies.remove('token')
          localStorage.setItem('visible', '0')
          router.push('/login');
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

    getTodos()

    logoutBtn()

    return {
      state,
      addTodo,
      updateTodo,
      markAsDone,
      markAsUndone,
      removeTodo,
      filter,
    };
  },
});
</script>
