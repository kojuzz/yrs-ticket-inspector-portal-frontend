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
                        Yangon Railway Service
                    </p>
                </div>
            </div>
        </template>
    </van-nav-bar>
    <div class="bg-theme pt-14 px-3 pb-12"></div>

    <div class="relative p-3" style="top: -56px">
        <!-- Origin -->
        <div class="origin-component">
            <van-field
                v-model="originStationTitle"
                is-link
                readonly
                label="Origin"
                placeholder="Select Origin"
                @click="originFieldClick"
            />
            <van-popup
                v-model:show="showOriginPicker"
                destroy-on-close
                position="bottom"
            >
                <van-picker
                    title="Station"
                    confirm-button-text="Confirm"
                    cancel-button-text="Cancel"
                    :columns="stations"
                    :columns-field-names="{ text: 'title', value: 'slug' }"
                    @confirm="originPickerConfirm"
                    @cancel="showOriginPicker = false"
                    @change="originPickerChange"
                />
            </van-popup>
        </div>

        <!-- Destination -->
        <div class="destination-component mb-3">
            <van-field
                v-model="destinationStationTitle"
                is-link
                readonly
                label="Destination"
                placeholder="Select Destination"
                @click="destinationFieldClick"
            />
            <van-popup
                v-model:show="showDestinationPicker"
                destroy-on-close
                position="bottom"
            >
                <van-picker
                    title="Station"
                    confirm-button-text="Confirm"
                    cancel-button-text="Cancel"
                    :columns="stations"
                    :columns-field-names="{ text: 'title', value: 'slug' }"
                    @confirm="destinationPickerConfirm"
                    @cancel="showDestinationPicker = false"
                    @change="destinationPickerChange"
                />
            </van-popup>
        </div>

        <!-- Map -->
        <div class="h-screen">
            <div id="map" class="h-4/6 rounded-lg shadow-md"></div>
        </div>
    </div>

    <van-dialog
        v-model:show="showDialog"
        :show-confirm-button="true"
        :show-cancel-button="true"
        :confirm-button-text="'Select Destination'"
        :cancel-button-text="'Select Origin'"
        :confirm-button-color="'#1CBC9B'"
        :cancel-button-color="'#1CBC9B'"
        :close-on-click-overlay="true"
        @confirm="dialogSelectDestination"
        @cancel="dialogSelectOrigin"
    >
        <div class="p-3">
            <img
                src="@/assets/image/station.png"
                class="w-16 h-16 mx-auto mb-4"
            />
            <p class="text-center text-md mb-3 text-gray-700">
                {{ dialogStationTitle }}
            </p>
            <div class="text-center">
                <van-button
                    icon="info-o"
                    type="primary"
                    size="small"
                    plain
                    color="#1CBC9B"
                    :to="`/station/${dialogStationSlug}`"
                >
                    Station Information
                </van-button>
            </div>
        </div>
    </van-dialog>

</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStationStore } from "@/stores/stationStore";
import { useMarkerStore } from "@/stores/markerStore";

const router = useRouter();

const stationStore = useStationStore();
const markerStore = useMarkerStore();

const stations = ref([]);
const page = ref(1);
const last_page = ref(null);
const finished = ref(false);

const markers = ref([]);

const originStationTitle = ref("");
const originStationSlug = ref("");
const showOriginPicker = ref(false);

const destinationStationTitle = ref("");
const destinationStationSlug = ref("");
const showDestinationPicker = ref(false);

var map = null;

const showDialog = ref(false);
const dialogStationTitle = ref(null);
const dialogStationSlug = ref(null);

// Fetch Station
const fetchStation = async () => {
    if (finished.value == false) {
        await stationStore.get({
            page: page.value,
            search: "",
        });
        stations.value.push(...(stationStore.getResponse?.data ?? []));
        last_page.value = stationStore.getResponse?.meta.last_page ?? null;
        if (page.value >= last_page.value) {
            finished.value = true;
        } else {
            page.value++;
        }
    }
};

// Fetch Marker
const fetchMarker = async () => {
    if (map.getZoom() >= 13) {
        let bounds = map.getBounds();
        await markerStore.get(
            bounds._northEast.lat,
            bounds._northEast.lng,
            bounds._southWest.lat,
            bounds._southWest.lng
        );
        markers.value = markerStore.getResponse?.data ?? [];

    // Icon
    var stationMarker = L.icon({
        iconUrl: "/src/assets/image/station-marker.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    // Locations Markers
    markers.value.forEach(function (marker) {
        L.marker([marker["latitude"], marker["longitude"]], {
            icon: stationMarker,
        })
        .addTo(map)
        .on("click", () => {
            showDialog.value = true;
            dialogStationTitle.value = marker["title"];
            dialogStationSlug.value = marker["slug"];
        });
    });

    }
};

// Origin Stations
const originFieldClick = () => {
    showOriginPicker.value = true;
    fetchStation();
};
const originPickerConfirm = ({ selectedOptions }) => {
    originStationTitle.value = selectedOptions[0]?.title;
    originStationSlug.value = selectedOptions[0]?.slug;
    showOriginPicker.value = false;
};
const originPickerChange = ({
    selectedValues,
    selectedOptions,
    selectedIndexes,
    columnIndex,
}) => {
    if (
        stations.value[stations.value.length - 1]?.slug ==
        selectedOptions[0]?.slug
    ) {
        fetchStation();
    }
};

// Destination Stations
const destinationFieldClick = () => {
    showDestinationPicker.value = true;
    fetchStation();
};
const destinationPickerConfirm = ({ selectedOptions }) => {
    destinationStationTitle.value = selectedOptions[0]?.title;
    destinationStationSlug.value = selectedOptions[0]?.slug;
    showDestinationPicker.value = false;
};
const destinationPickerChange = ({
    selectedValues,
    selectedOptions,
    selectedIndexes,
    columnIndex,
}) => {
    if (
        stations.value[stations.value.length - 1]?.slug ==
        selectedOptions[0]?.slug
    ) {
        fetchStation();
    }
};

const dialogSelectOrigin = () => {
    originStationTitle.value = dialogStationTitle.value;
    originStationSlug.value = dialogStationSlug.value;
    showOriginPicker.value = false;
}

const dialogSelectDestination = () => {
    destinationStationTitle.value = dialogStationTitle.value;
    destinationStationSlug.value = dialogStationSlug.value;
    showDestinationPicker.value = false;
}

const initMap = () => {
    if (map != null) {
        map.remove();
    }
    map = L.map("map").setView([16.78106, 96.161914], 13); // မြေပုံ ပြတဲ့နေရာ, ပုံစံ
    // OpenStreetMap Layer
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    fetchMarker();

    // Get Current Location
    // navigator.geolocation.getCurrentPosition((position) => {
        // map.setView([position.coords.latitude, position.coords.longitude], 13);
        // fetchMarker();
    // });

    map.on("moveend", () => {
        fetchMarker();
    });

};

watch(originStationSlug, () => {
    if (originStationSlug.value != "" && destinationStationSlug.value != "") {
        router.push(
            `route?origin_station_slug=${originStationSlug.value}&destination_station_slug=${destinationStationSlug.value}`
        );
    }
});

watch(destinationStationSlug, () => {
    if (originStationSlug.value != "" && destinationStationSlug.value != "") {
        router.push(
            `route?origin_station_slug=${originStationSlug.value}&destination_station_slug=${destinationStationSlug.value}`
        );
    }
});

onMounted(() => {
    initMap();
});
</script>
<style scope>
    .origin-component .van-cell{
        border-radius: 10px 10px 0 0 !important;
    }
    .destination-component .van-cell{
        border-radius: 0 0 10px 10px !important;
    }
</style>
