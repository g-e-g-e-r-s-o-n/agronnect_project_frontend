<template>
  <nav class="bg-green-600 text-white flex items-center justify-between flex-wrap p-6">

    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">

        <router-link to="/"
                     class="block mt-4 lg:inline-block lg:mt-0 px-16 py-4 text-lg transition-colors hover:bg-green-500 duration-300 mr-4">Home</router-link>
        <router-link to="/todos"
                     class="block mt-4 lg:inline-block lg:mt-0 px-16 py-4 text-lg transition-colors hover:bg-green-500 duration-300 mr-4">Todos</router-link>
      </div>
      <div>
<!--        <p v-if="state.token !== null"-->
<!--           class="hover:text-sky-500 dark:hover:text-sky-400"></p>-->
        <button
            class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            :class="{'invisible': state.visible !== '1'}" id="logoutBtn" @click.prevent="logOut">Log out</button>
      </div>
    </div>
  </nav>
  <router-view />
</template>
<script>
import axios from "axios";
import {defineComponent, reactive} from "vue";

export default defineComponent({

  setup() {
    const state = reactive({
      visible: localStorage.getItem("visible"),
    });

    function logOut() {
      if (confirm("Are you sure you want to log out?")) {
        axios.post('http://localhost:8000' + '/api/logout', {}, {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.$cookies.get('token')
          }
        }).then((response) => {
          window.$cookies.remove('token');
          localStorage.setItem('visible', '0')
          this.$router.push('/login');
        }).catch((error) => {
            if (error.response.status === 401) {
              window.$cookies.remove('token');
              localStorage.setItem('visible', '0')
              this.$router.push('/login');
            }
            else {
              console.log(error.response.status)
            }
        });

      }
    }

    return {
      state,
      logOut
    };
  }
});
</script>