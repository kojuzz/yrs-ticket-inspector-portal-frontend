import { defineStore } from 'pinia'
import axiosInstance from '@/axiosInstance'

export const useRouteDetailStore = defineStore("routeDetailStore", {
    state: () => ({ 
        response: null, 
        error: null,
        errorMessage: null,
        errors: [],
    }),
    getters: {
        getResponse: (state) => state.response,
        getError: (state) => state.error,
        getErrorMessage: (state) => state.errorMessage,
        getErrors: (state) => state.errors,
    },
    actions: {
        async get(slug, origin_station_slug = null, destination_station_slug = null) {
            try {
                let response = await axiosInstance.get(`route/${slug}?origin_station_slug=${origin_station_slug}&destination_station_slug=${destination_station_slug}`);
                this.response = response.data ?? null;
                this.error = null;
                this.errorMessage = null;
                this.errors = [];
            } catch (error) {
                console.log(error);
                this.response = null;
                this.error = error;
                this.errorMessage = error?.response?.data?.message ?? null;
                this.errors = error?.response?.data?.errors ?? null;
            }
        }
    }
});
