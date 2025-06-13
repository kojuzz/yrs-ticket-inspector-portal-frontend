import { useStationStore } from "@/stores/stationStore";
import { useRouteStore } from "@/stores/routeStore";

const stores = {
    stationStore: useStationStore(),
    routeStore: useRouteStore()
};

const useStoreHelper = (storeName) => {
    return stores[storeName]
};

export { useStoreHelper };