<template>
    <van-cell-group
        inset
        class="mb-3 mx-0"
        v-for="item in list"
        :key="item.slug"
    >
        <van-cell :to="`/route/${item.slug}?${queryString}`">
            <template #icon>
                <img :src="item.icon" alt="" class="w-8 h-8 mr-2 mt-1" />
            </template>
            <template #title>
                <van-text-ellipsis :content="item.title" />
            </template>
            <template #label>
                <span>{{ item.text }}</span>
            </template>
        </van-cell>
    </van-cell-group>
</template>

<script setup>
    import { ref, onMounted } from "vue";

    const props = defineProps({
        list: {
            type: Array,
            required: true,
        },
        queryParameters: {
            type: Object,
            required: true,
        },
    });
    const list = ref(props.list);
    const queryParameters = ref(props.queryParameters);
    const queryString = new URLSearchParams(queryParameters.value).toString();
</script>

<style scoped></style>
