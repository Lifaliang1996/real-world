<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 v-if="isLogin" class="text-xs-center">Sign in</h1>
          <h1 v-else class="text-xs-center">Sign up</h1>

          <p v-if="isLogin" class="text-xs-center">
            <nuxt-link to="/register">Need an account?</nuxt-link>
          </p>
          <p v-else class="text-xs-center">
            <nuxt-link to="/login">Have an account?</nuxt-link>
          </p>

          <!-- 错误提示 -->
          <ul class="error-messages">
            <template v-for="(msg, field) in errors">
              <li v-for="item in msg" :key="field + item">
                {{ field }} {{ item }}
              </li>
            </template>
          </ul>

          <form @submit.prevent>
            <fieldset v-if="!isLogin" class="form-group">
              <input
                v-model="user.username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                minlength="8"
                required
              />
            </fieldset>

            <!-- 登录或注册按钮 -->
            <button
              v-if="isLogin"
              @click="onLogin"
              class="btn btn-lg btn-primary pull-xs-right"
            >
              Sign in
            </button>
            <button
              v-else
              @click="onRegister"
              class="btn btn-lg btn-primary pull-xs-right"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'logined',
  name: 'LoginRegister',
  data () {
    return {
      user: {
        username: '',
        email: '',
        password: ''
      },
      errors: {}
    }
  },
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    }
  },
  methods: {
    onSubmit () {
      this.isLogin ? this.onLogin() : this.onRegister()
    },
    // 登录
    onLogin () {
      login({ user: this.user })
        .then(res => {
          const user = res.data.user
          this.$store.commit('setUser', user)

          // 保存用户信息 Cookie
          Cookie.set('user', user)

          this.$router.push('/')
        })
        .catch(err => {
          this.errors = err.response.data.errors
        })
    },
    // 注册
    onRegister () {
      register({ user: this.user })
        .then(res => {
          const data = res.data
          this.$router.push('/login')
        })
        .catch(err => {
          this.errors = err.response.data.errors
        })
    }
  }
}
</script>

<style></style>
