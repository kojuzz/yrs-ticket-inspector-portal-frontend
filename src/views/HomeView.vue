<template>
    <van-nav-bar :fixed="true">
        <template #left>
            <div class="flex justify-start">
                <img
                    src="@/assets/image/logo.png"
                    alt="YRS"
                    class="w-8 h-8 rounded-lg bg-white p-1 mr-1"
                />
                <div>
                    <h5 class="text-left text-white text-xs mb-0">YRS</h5>
                    <p class="text-left text-white text-xs mb-0">
                        Ticket Inspector Portal
                    </p>
                </div>
            </div>
        </template>
    </van-nav-bar>
    <div class="pt-[46px]"></div>

    <div class="p-3">
        <div class="bg-white rounded-lg p-3">
            <div class="flex justify-center items-center py-3">
                <img
                    src="@/assets/image/qr-scan.png"
                    alt="YRS"
                    class="w-5/12"
                />
            </div>

            <p class="text-sm text-gray-500 text-center mb-5">
                Select Route, Click "Scan" button, and scan the QR code.
            </p>

            <div class="flex justify-center mb-5">
                <van-field
                    v-model="routeTitle"
                    is-link
                    readonly
                    label="Route"
                    placeholder="Select Route"
                    @click="routeFieldClick"
                    class="border rounded-lg"
                    :error-message="errors.route_slug"
                />
                <van-popup v-model:show="showRoutePicker" position="bottom">
                    <van-picker
                        title="Route"
                        confirm-button-text="Confirm"
                        cancel-button-text="Cancel"
                        :columns="routes"
                        :columns-field-names="{ value: 'slug', text: 'title' }"
                        @confirm="routePickerConfirm"
                        @cancel="showRoutePicker = false"
                        @change="routePickerChange"
                    />
                </van-popup>
            </div>

            <div class="text-center mb-3">
                <van-button
                    round
                    block
                    type="primary"
                    native-type="submit"
                    color="#3c57b6"
                    icon="scan"
                    @click="onScanOpen"
                >
                    Scan
                </van-button>
            </div>
        </div>
    </div>

    <van-dialog
        v-model:show="showDialog"
        :close-on-click-overlay="true"
        :show-confirm-button="false"
        :show-cancel-button="true"
        :cancel-button-text="'Close'"
        @cancel="onScanClose"
        @close="onScanClose"
    >
        <div class="p-3">
            <qrcode-stream
                v-if="showQRScanner"
                :track="paintBoundingBox"
                @detect="onScanDetect"
                :paused="paused"
            ></qrcode-stream>
        </div>
    </van-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useRouteStore } from "@/stores/routeStore";
import { QrcodeStream } from "vue-qrcode-reader";
import { useInspectTicketStore } from "@/stores/inspectTicketStore";
import { showNotify } from "vant";
import successMp3 from "@/assets/audio/success.mp3";
import errorMp3 from "@/assets/audio/error.mp3";

const routeStore = useRouteStore();
const inspectTicketStore = useInspectTicketStore();

const routes = ref([]);
const page = ref(1);
const last_page = ref(null);
const finished = ref(false);

const routeSlug = ref("");
const routeTitle = ref("");
const showRoutePicker = ref(false);

const showDialog = ref(false);
const showQRScanner = ref(false);
const paused = ref(false);
const errors = ref({
    route_slug: "",
});

const successSound = ref(null);
const errorSound = ref(null);

// Fetch Route
const fetchRoute = async () => {
    if (finished.value == false) {
        await routeStore.get({
            page: page.value,
            search: "",
        });
        routes.value.push(...(routeStore.getResponse?.data ?? []));
        last_page.value = routeStore.getResponse?.meta.last_page ?? null;
        if (page.value >= last_page.value) {
            finished.value = true;
        } else {
            page.value++;
        }
    }
};

const routeFieldClick = () => {
    showRoutePicker.value = true;
    fetchRoute();
};
const routePickerConfirm = ({ selectedOptions }) => {
    routeSlug.value = selectedOptions[0]?.slug;
    routeTitle.value = selectedOptions[0]?.title;
    showRoutePicker.value = false;
};
const routePickerChange = ({
    selectedValues,
    selectedOptions,
    selectedIndexes,
    columnIndex,
}) => {
    if (
        routes.value[routes.value.length - 1]?.slug == selectedOptions[0]?.slug
    ) {
        fetchRoute();
    }
};

const paintBoundingBox = (detectedCodes, ctx) => {
    for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height },
        } = detectedCode;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#007bff";
        ctx.strokeRect(x, y, width, height);
    }
};

const onScanOpen = () => {
    showDialog.value = true;
    showQRScanner.value = true;
    successSound.value = new Audio(successMp3);
    errorSound.value = new Audio(errorMp3);
};
const onScanClose = () => {
    showDialog.value = false;
    showQRScanner.value = false;
};

const onScanDetect = async (detectedCode) => {
    try {
        const result = detectedCode.map((code) => code.rawValue);
        if(result.length <= 0) {
            throw new Error("QR is invalid");
        }
        await inspectTicketStore.store(routeSlug.value, result[0]);
        if(inspectTicketStore.getErrorMessage) {
            if (inspectTicketStore.getErrors) {
                errors.value = {
                    route_slug: inspectTicketStore.getErrors.route_slug
                        ? inspectTicketStore.getErrors.route_slug.join(", ")
                        : "",
                };
            }
            errorSound.value.play();
        } else {
            successSound.value.play();
            showNotify({
                type: "success",
                message: inspectTicketStore.getResponse?.message,
                position: "bottom",
            });
        }
    } catch(error) {
        errorSound.value.play();
        showNotify({
            type: "danger",
            message: error.name,
            position: "bottom",
        });
    }
    paused.value = true
    setTimeout(() => {
        paused.value = false
    }, 500)
};    

</script>
<style scope></style>
