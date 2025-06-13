<template>
    <van-cell-group
        inset
        class="mb-3 mx-0"
        v-for="item in list"
        :key="item.slug"
    >
        <van-cell :to="`/station/${item.slug}`">
            <template #icon>
                <img :src="item.icon" alt="" class="w-8 h-8 m-1" />
            </template>
            <template #title>
                <van-text-ellipsis :content="item.title" />
            </template>
            <template #label>
                <van-text-ellipsis :content="item.description" />
            </template>
        </van-cell>
    </van-cell-group>
</template>

<script setup>
    const props = defineProps({
        list: {
            type: Array,
            required: true,
        },
    });
</script>

<style scoped></style>
