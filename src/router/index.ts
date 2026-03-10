import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/wLotery/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/mega-sena',
      name: 'mega-sena',
      component: () => import('@/pages/DashboardPage.vue'),
      props: { lottery: 'megasena' as const },
    },
    {
      path: '/lotofacil',
      name: 'lotofacil',
      component: () => import('@/pages/DashboardPage.vue'),
      props: { lottery: 'lotofacil' as const },
    },
    {
      path: '/meus-jogos',
      name: 'meus-jogos',
      component: () => import('@/pages/MeusJogosPage.vue'),
    },
    {
      path: '/historico',
      name: 'historico',
      component: () => import('@/pages/HistoricoPage.vue'),
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: () => import('@/pages/ConfigPage.vue'),
    },
  ],
})

export default router
