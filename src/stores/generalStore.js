import { defineStore } from 'pinia'
import axiosInstance from '@/axiosInstance'

export const useGeneralStore = defineStore("generalStore", {
    state: () => ({ 
        isAuthenticated: false,
    }),
    getters: {
        getIsAuthenticated: (state) => state.isAuthenticated,
    },
    actions: {
        setIsAuthenticated(isAuthenticated) {
            this.$state.isAuthenticated = isAuthenticated;
        }
    }
});
