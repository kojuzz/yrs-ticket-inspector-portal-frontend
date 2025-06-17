<template>
    <van-search
        v-model="search"
        show-action
        label=""
        placeholder="Search Station"
    >
        <template #action>
            <van-button
                type="primary"
                size="small"
                class="mb-1"
                color="#3c57b6"
                @click="onSearch"
            >
                Search
            </van-button>
        </template>
    </van-search>

    <van-pull-refresh
        v-model="refreshing"
        pulling-text="Pull to refresh"
        loosing-text="Release to refresh"
        loading-text="Loading..."
        success-text="Refresh success"
        @refresh="onRefresh"
    >
        <div class="p-3">
            <van-list
                v-model:loading="loading"
                v-model:error="error"
                :finished="finished"
                loading-text="Loading..."
                finished-text="Finished"
                error-text="errorMessage"
                @load="onLoad"
            >
                <TicketInspectionItem v-if="storeName === 'ticketInspectionStore'" :list="list" />
            </van-list>
        </div>
    </van-pull-refresh>
</template>

<script setup>
import { ref } from "vue";
import { useStoreHelper } from "@/helpers/useStoreHelper";
import TicketInspectionItem from "./TicketInspectionItem.vue";

const props = defineProps({ 
    storeName: {
        type: String,
        required: true,
    },
    queryParameters: {
        type: Object,
        required: true,
    },
});

// const storeName = ref(props.storeName);
const listStore = useStoreHelper(props.storeName);
const queryParameters = ref(props.queryParameters);
const search = ref("");
const list = ref([]);
const page = ref(1);
const last_page = ref(null);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const error = ref(false);
const errorMessage = ref(null);

const onLoad = async () => {
    if (refreshing.value) {
        list.value = [];
        page.value = 1;
        last_page.value = null;
        refreshing.value = false;
    }

    queryParameters.value.search = search.value;
    queryParameters.value.page = page.value;

    await listStore.get(queryParameters.value);
    list.value.push(...(listStore.getResponse.data ?? []));
    last_page.value = listStore.getResponse?.meta.last_page ?? null;

    if (page.value >= last_page.value) {
        finished.value = true;
    } else {
        page.value++;
    }

    if (listStore.getErrorMessage) {
        errorMessage.value = listStore.getErrorMessage;
        error.value = true;
    }
    loading.value = false;
};

const onRefresh = () => {
    finished.value = false;
    loading.value = true;
    onLoad();
};

const onSearch = () => {
    finished.value = false;
    loading.value = true;
    refreshing.value = true;
    onLoad();
};
</script>

<style scoped></style>
