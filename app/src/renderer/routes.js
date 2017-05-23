export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/home')
  },
  {
    path: '*',
    redirect: '/'
  }
]
