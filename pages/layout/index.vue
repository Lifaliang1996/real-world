<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/">Real World</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <nuxt-link class="nav-link" exact to="/">Home</nuxt-link>
          </li>

          <!-- 已登录 -->
          <template v-if="user">
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/editor">
                <i class="ion-compose"></i>&nbsp;New Post
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/settings">
                <i class="ion-gear-a"></i>&nbsp;Settings
              </nuxt-link>
            </li>
            <li class="nav-item">
              <span @click="logOut" class="nav-link" style="cursor: pointer;">Log Out</span
              >
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                exact
                :to="{ name: 'profile', params: { username: user.username } }"
              >
                <img class="user-pic" :src="user.image" />
                {{ user.username }}
              </nuxt-link>
            </li>
          </template>
          <!-- 已登录 -->

          <!-- 未登录 -->
          <template v-else>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
            </li>
          </template>
          <!-- 未登录 -->
        </ul>
      </div>
    </nav>

    <n-child />

    <footer>
      <div class="container">
        <a href="/" class="logo-font">Real World</a>
        <span class="attribution">
          An interactive learning project from
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookie from 'js-cookie'

export default {
  name: 'Layout',
  computed: {
    ...mapState(['user'])
  },
  methods: {
    logOut () {
      this.$store.commit('setUser', null)
      Cookie.remove('user')
      this.$router.push('/')
    }
  }
}
</script>

<style></style>
