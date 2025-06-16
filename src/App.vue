<template>
    <SplashScreen v-if="showSplashScreen" />
    <div v-else>
        <div class="bg-gray-100 min-h-screen pb-10">
            <RouterView />
        </div>
        <van-tabbar v-model="active" v-if="showTabBar" active-color="#1CBC9B">
            <van-tabbar-item icon="home-o" to="/">Home</van-tabbar-item>
            <van-tabbar-item icon="list-switch" to="/ticket-inspection">Ticket Inspection</van-tabbar-item>
            <van-tabbar-item icon="contact-o" to="/profile">Profile</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup>
    import { ref, watch, computed, onMounted } from 'vue';
    import { RouterLink, RouterView, useRoute } from "vue-router";
    import SplashScreen from "./components/SplashScreen.vue";

    const route = useRoute();
    const active = ref(0);
    const showSplashScreen = ref(true);
    const showTabBar = computed( () => route.meta.showTabBar)

    watch(
        () => route.path,
        (newPath) => {
            switch (newPath) {
                case '/': active.value = 0; break;
                case '/ticket-inspection': active.value = 1; break;
                case '/profile': active.value = 2; break;
                default: active.value = null;
            }
        }
    );
    onMounted(() => {
        setTimeout(() => {
            showSplashScreen.value = false;
        }, 1000);
    })
</script>

<style scoped></style>
