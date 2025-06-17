<template>
    <van-nav-bar title="Profile" :fixed="true" />
    <div class="pt-[46px]"></div>
    <van-pull-refresh
        v-model="refreshing"
        pulling-text="Pull to refresh"
        loosing-text="Release to refresh"
        loading-text="Loading..."
        success-text="Refresh success"
        @refresh="onRefresh"
    >

        <div
            v-if="profile != null"
            class="bg-theme rounded-b-lg shadow-sm p-3 flex justify-start items-center"
        >
            <img
                src="@/assets/image/user.png"
                alt=""
                class="w-14 h-14 p-1 bg-gray-100 rounded-lg"
            />
            <div class="ml-3">
                <h6 class="text-sm text-white">{{ profile.name }}</h6>
                <p class="text-xs text-white">{{ profile.email }}</p>
            </div>
        </div>

        <div v-if="profile != null" class="p-3">
            <van-cell-group inset class="mb-3 mx-0">
                    <van-cell is-link to="/change-password">
                        <template #title>
                            <div class="flex items-center">
                                <van-icon name="shield-o" class="text-lg mr-1" />
                                <span>Change Password</span>
                            </div>
                        </template>
                    </van-cell>
            </van-cell-group>

            <van-button
                type="default"
                plain
                block
                class="rounded-lg border-none"
                :loading="logoutBtnLoading"
                loading-text="Loading..."
                @click="onLogout"
            >
                Logout
            </van-button>
        </div>
    </van-pull-refresh>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProfileStore } from "@/stores/profileStore";
import { useLogoutStore } from "@/stores/logoutStore";
import { showSuccessToast, showConfirmDialog } from "vant";

const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();
const logoutStore = useLogoutStore();
const profile = ref(null);
const refreshing = ref(false);
const logoutBtnLoading = ref(false);

const fetchProfile = async () => {
    await profileStore.get();
    profile.value = profileStore.getResponse?.data;
    refreshing.value = false;
};

onMounted(() => {
    fetchProfile();
});

const onLogout = async () => {
    logoutBtnLoading.value = true;

    showConfirmDialog({
        title: "Logout",
        message: "Are you sure you want to logout?",
        cancelButtonText: "Cancel",
        confirmButtonText: "Confirm",
        confirmButtonColor: "#3c57b6",
    })
        .then(async () => {
            await logoutStore.store();
            if (logoutStore.getErrorMessage == null) {
                ls.remove("__access-token");
                showSuccessToast(logoutStore.getResponse?.message);
                logoutBtnLoading.value = false;
                router.push("/login");
            }
        })
        .catch(() => {
            logoutBtnLoading.value = false;
        });
};

const onRefresh = () => {
    fetchProfile();
    refreshing.value = false;
};
</script>

<style scoped></style>
