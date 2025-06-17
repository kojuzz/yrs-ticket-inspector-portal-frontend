import { useTicketInspectionStore } from "@/stores/ticketInspectionStore";

const stores = {
    ticketInspectionStore: useTicketInspectionStore()
};

const useStoreHelper = (storeName) => {
    return stores[storeName]
};

export { useStoreHelper };