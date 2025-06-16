import { useRouteStore } from "@/stores/routeStore";

const stores = {
    routeStore: useRouteStore()
};

const useStoreHelper = (storeName) => {
    return stores[storeName]
};

export { useStoreHelper };