import { createRouter, createWebHistory } from 'vue-router'
import { useGeneralStore } from '@/stores/generalStore'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue'),
            meta: { showTabBar: true, requiresAuth: true }
        },
        {
            path: '/ticket-inspection',
            name: 'ticket-inspection',
            component: () => import('../views/TicketInspectionView.vue'),
            meta: { showTabBar: true, requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { showTabBar: true, requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: { showTabBar: false }
        },
        {
            path: '/change-password',
            name: 'change-password',
            component: () => import('../views/ChangePasswordView.vue'),
            meta: { showTabBar: false, requiresAuth: true }
        },
        {
            path: '/two-step-verification',
            name: 'two-step-verification',
            component: () => import('../views/TwoStepVerificationView.vue'),
            meta: { showTabBar: false }
        },
    ],
})

router.beforeEach(async (to, from, next) => {
    const generalStore = useGeneralStore();
    generalStore.setIsAuthenticated(ls.get('__access-token') ? true : false);
    if(to.meta.requiresAuth && !generalStore.getIsAuthenticated) {
        next({path: '/login'});
    }
    else {
        next();
    }
});

export default router
