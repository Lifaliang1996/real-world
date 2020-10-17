module.exports = {
  router: {
    linkActiveClass: 'active',
    extendRoutes (routes, resolve) {
      routes.splice(0)
      routes.push({
        path: '/',
        component: resolve(__dirname, 'pages/layout/'),
        children: [
          {
            name: 'home',
            path: '/',
            component: resolve(__dirname, 'pages/home/')
          },
          {
            name: 'login',
            path: '/login',
            component: resolve(__dirname, 'pages/login-register/')
          },
          {
            name: 'register',
            path: '/register',
            component: resolve(__dirname, 'pages/login-register/')
          },
          {
            name: 'profile',
            path: '/profile/:username',
            component: resolve(__dirname, 'pages/profile/')
          },
          {
            name: 'settings',
            path: '/settings',
            component: resolve(__dirname, 'pages/settings/')
          },
          {
            name: 'editor',
            path: '/editor/:slug?',
            component: resolve(__dirname, 'pages/editor/')
          },
          {
            name: 'article',
            path: '/article/:slug',
            component: resolve(__dirname, 'pages/article/')
          }
        ]
      })
    }
  },
  plugins: ['~/plugins/element-ui', '~/plugins/request', '~/plugins/format']
}
