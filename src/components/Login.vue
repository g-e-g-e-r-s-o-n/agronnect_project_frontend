<!--<template>-->
<!--  <div>-->
<!--    <input type="email" v-model="email" placeholder="Email">-->
<!--    <input type="password" v-model="password" placeholder="Password">-->
<!--    <button @click="login">Login</button>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      email: '',-->
<!--      password: ''-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    login() {-->
<!--      // Send login request and handle authentication token-->
<!--      // Store token in local storage-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
<template>
  <div class="flex justify-center items-center mt-52">
    <div class="w-full max-w-xs">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            @submit.prevent="login"
      >
        <div class="identity-input mb-4">
          <label for="identity" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
              id="identity"
              class="shadow appearance-none borderrounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Email"
              aria-describedby="emailHelp"
              v-model="state.email"
          />
          <span class="text-xs text-red-700" id="emailHelp"></span>
        </div>

        <div class="password-input mb-6">
          <label
              for="identity"
              class="block text-gray-700 text-sm font-bold mb-2"
          > Password</label
          >

          <input
              aria-describedby="passwordHelp"
              v-model="state.password"

              class="shadow appearance-none borderrounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="*******"
          />

          <span class="text-xs text-red-700" id="passwordHelp"></span>
        </div>

        <div class="flex items-center justify-between">
          <button
              class="bg-blue-600 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
          >
            Log In
          </button>
          <a
              class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/register"
          >
            Don't have an account?
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent, reactive } from "vue";
import router from "@/router";

export default defineComponent({
  setup() {
    const state = reactive({
      user: {},
      email: "",
      password: "",
      visible: localStorage.getItem("visible"),
    });

    function login() {
      const nextUrl = localStorage.getItem('next-url')
      axios.post('http://localhost:8000' + '/api/login', {
        email: state.email,
        password: state.password,
      }).then(response => {
        state.email = "";
        state.password = "";
        localStorage.removeItem('next-url');
        // localStorage.setItem('token', response.data.authorisation.token);
        window.$cookies.set('token', response.data.authorisation.token);
        localStorage.setItem('visible', '1')
        if (nextUrl !== null) {
          router.push(nextUrl)
        }
        else {
          router.push('/')
        }
      }).catch((error) => {
        if (error.response.status === 422) {
          state.email = "";
          state.password = "";
          if (error.response.data.email) {
            alert(error.response.data.email[0])
          }
          else if (error.response.data.password) {
            alert(error.response.data.password[0])
          }
          else if (error.response.data.message) {
            alert(error.response.data.message)
          }
          else {
            console.log(error.response.data)
          }
        }
        else {
          console.log(error.response.status);
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

    logoutBtn()

    return {
      state,
      login,
    };
  },
});
</script>