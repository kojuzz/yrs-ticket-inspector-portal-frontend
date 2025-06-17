<template>
    <van-nav-bar
        title="Login"
        :fixed="true"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="pt-[46px]"></div>
    <div class="p-3">
        <van-form @submit="onSubmit">
            <div class="bg-white rounded-lg">
                <div class="flex justify-center items-center py-3">
                    <img
                        src="@/assets/image/login.png"
                        alt="YRS"
                        class="w-5/12"
                    />
                </div>
                <van-cell-group inset class="mb-3 mx-0">
                    <van-field
                        v-model="email"
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        :error-message="errors.email"
                    />
                    <van-field
                        v-model="password"
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        :error-message="errors.password"
                    />
                </van-cell-group>
            </div>
            <div class="my-4">
                <van-button
                    round
                    block
                    type="primary"
                    native-type="submit"
                    color="#3c57b6"
                    :loading="submitBtnLoading"
                >
                    Confirm
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "@/stores/loginStore";
import { showSuccessToast } from "vant";

const router = useRouter();
const loginStore = useLoginStore();

const onClickLeft = () => history.back();

const email = ref("");
const password = ref("");
const errors = ref({
    email: "",
    password: "",
});
const submitBtnLoading = ref(false);

const onSubmit = async (values) => {
    submitBtnLoading.value = true;
    errors.value = {
        email: "",
        password: "",
    };
    await loginStore.store(values.email, values.password);
    
    if (loginStore.getErrorMessage) {
        if (loginStore.getErrors) {
            errors.value = {
                email: loginStore.getErrors.email
                    ? loginStore.getErrors.email.join(", ")
                    : "",
                password: loginStore.getErrors.password
                    ? loginStore.getErrors.password.join(", ")
                    : "",
            };
        }
    } else {
        if (loginStore.getResponse?.data.is_verified) {
            ls.set("__access-token", loginStore.getResponse?.data.access_token);
            showSuccessToast(loginStore.getResponse?.message);
            router.push("/");
        } else {
            ls.set("__otp-token", loginStore.getResponse?.data.otp_token);
            router.push("/two-step-verification");
        }
    }
    submitBtnLoading.value = false;
};
</script>

<style scoped></style>
