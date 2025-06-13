<template>
    <van-nav-bar
        title="Station Detail"
        :fixed="true"
        left-arrow
        @click-left="onClickLeft"
    />
    <van-pull-refresh
        v-model="refreshing"
        pulling-text="Pull to refresh"
        loosing-text="Release to refresh"
        loading-text="Loading..."
        success-text="Refresh success"
        @refresh="onRefresh"
    >
    
        <div v-if="stationDetail != null">
            
            <div class="bg-theme pt-14 pb-20">
                <h6 class="text-center text-white">
                    {{ stationDetail.title }}
                </h6>
                <p class="text-center text-white text-xs mb-0">
                    {{ stationDetail.description }}
                </p>
            </div>

            <div class="p-3 relative" style="top: -74px">            
                <div id="map" class="h-40 mb-3 rounded-lg shadow"></div>

                <van-tabs>
                    <van-tab>
                        <template #title>Clockwise</template>
                        <div class="py-2">
                            <van-cell-group inset class="mb-3 mx-0">
                                <van-cell
                                    v-for="route_schedule in stationDetail.clockwise_route_schedules"
                                    :key="route_schedule.slug"
                                    :title="route_schedule.title"
                                    :label="route_schedule.description"
                                    is-link
                                    :to="`/route/${route_schedule.slug}?origin_station_slug=&destination_station_slug=`"
                                >
                                </van-cell>
                            </van-cell-group>
                        </div>
                    </van-tab>
                    <van-tab>
                        <template #title>Anti-clockwise</template>
                        <div class="py-2">
                            <van-cell-group inset class="mb-3 mx-0">
                                <van-cell
                                    v-for="route_schedule in stationDetail.anticlockwise_route_schedules"
                                    :key="route_schedule.slug"
                                    :title="route_schedule.title"
                                    :label="route_schedule.description"
                                    is-link
                                    :to="`/route/${route_schedule.slug}?origin_station_slug=&destination_station_slug=`"
                                >
                                </van-cell>
                            </van-cell-group>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>

        <div v-if="errorMessage != null" class="pt-14 px-3 pb-20">
            <div class="bg-white rounded-lg shadow-md flex justify-center items-center">
                <van-empty image="error" :description="errorMessage" class="text-center" />
            </div>
        </div>
    </van-pull-refresh>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStationDetailStore } from "@/stores/stationDetailStore";

const onClickLeft = () => history.back();
const router = useRouter();
const route = useRoute();
const stationDetailStore = useStationDetailStore();
const stationDetail = ref(null);
const errorMessage = ref(null);
const refreshing = ref(false);
var map = null;

const fetchStationDetail = async () => {
    await stationDetailStore.get(route.params.slug);
    stationDetail.value = stationDetailStore.getResponse?.data;
    errorMessage.value = stationDetailStore.getErrorMessage;
    if (stationDetail.value != null) {
        nextTick(() => {
            initMap();
        });
    }
};

const initMap = () => {
    if (map != null){
        map.remove();
    }
    map = L.map("map").setView(
        [stationDetail.value.latitude, stationDetail.value.longitude],
        16
    );

    // OpenStreetMap Layer
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Maptiler Layer
    // L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=ZhXnrLZGFlTXTegKJMsk').addTo(map);

    // Icon
    var StationMarker = L.icon({
        iconUrl: "/src/assets/image/station-marker.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    L.marker([stationDetail.value.latitude, stationDetail.value.longitude], {
        icon: StationMarker,
    }).addTo(map);
};

onMounted(() => {
    fetchStationDetail();
});

const onRefresh = () => {
    fetchStationDetail();
    refreshing.value = false;
};
</script>

<style scoped></style>
