<template>
    <van-nav-bar title="Route" :fixed="true" />
    <div class="pt-[46px]"></div>
    <List :store-name="`routeStore`" :query-parameters="{
        origin_station_slug: route.query.origin_station_slug ?? '',
        destination_station_slug: route.query.destination_station_slug ?? '',
    }" />
</template>

<script setup>
    import List from "@/components/List.vue";
    import {useRoute} from "vue-router";

    const route = useRoute();
</script>

<style scoped></style>
