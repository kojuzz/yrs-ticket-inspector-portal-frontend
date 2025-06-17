<template>
    <van-nav-bar title="Ticket Inspection" :fixed="true" />
    <div class="pt-[46px]"></div>
    <List :store-name="`ticketInspectionStore`" :query-parameters="{}" />
</template>

<script setup>
import List from "@/components/List.vue";
</script>

<style scoped></style>
