export default function ({ store, redirect }) {
  if (!store.state.user) {
    // 未登录用户访问 Editor/Profile/Settings，跳转到 Login
    redirect('/login')
  }
}
