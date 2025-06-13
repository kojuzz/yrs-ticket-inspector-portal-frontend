import { defineStore } from 'pinia'
import axiosInstance from '@/axiosInstance'

export const useMarkerStore = defineStore("markerStore", {
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
        async get(north_east_latitude, north_east_longitude, south_west_latitude, south_west_longitude) {
            try {
                let response = await axiosInstance.get(`station-by-region?north_east_latitude=${north_east_latitude}&north_east_longitude=${north_east_longitude}&south_west_latitude=${south_west_latitude}&south_west_longitude=${south_west_longitude}`);
                this.response = response.data ?? null;
                this.error = null;
                this.errorMessage = null;
                this.errors = [];
            } catch (error) {
                this.response = null;
                this.error = error;
                this.errorMessage = error?.response?.data?.message ?? null;
                this.errors = error?.response?.data?.errors ?? null;
            }
        }
    }
});
