<template>
    <van-nav-bar title="Station" :fixed="true" />
    <div class="pt-[46px]"></div>
    <List :store-name="`stationStore`" :query-parameters="{}" />
</template>

<script setup>
import List from "@/components/List.vue";
</script>

<style scoped></style>
