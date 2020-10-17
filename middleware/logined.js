export default function ({ store, redirect }) {
  if (store.state.user) {
    // 已登录访问 Login-Register，跳转到 Profile
    redirect('/profile')
  }
}