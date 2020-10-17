<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  required
                  v-model="newUser.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  required
                  v-model="newUser.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  required
                  v-model="newUser.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  required
                  v-model="newUser.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required
                  minlength="8"
                  v-model="newUser.password"
                />
              </fieldset>
              <button
                type="submit"
                class="btn btn-lg btn-primary pull-xs-right"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from '~/api/user'
import Cookies from 'js-cookie'

export default {
  middleware: 'not-logined',
  name: 'Settings',
  head () {
    return {
      title: 'Settings'
    }
  },
  data () {
    return {
      // 新用户信息
      newUser: {}
    }
  },
  created () {
    const user = this.$store.state.user
    this.newUser = {
      image: user.image,
      username: user.username,
      bio: user.bio,
      email: user.email,
      password: ''
    }
  },
  methods: {
    onSubmit () {
      updateUser(this.newUser)
        .then(() => {
          Cookies.remove('user')
          this.$store.commit('setUser', null)
          alert('修改成功')
          this.$router.push('/login')
        })
        .catch(err => {
          console.log(err)
          alert('修改失败')
        })
    }
  }
}
</script>

<style></style>
