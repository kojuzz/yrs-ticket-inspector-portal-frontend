import { defineStore } from 'pinia'
import axiosInstance from '@/axiosInstance'

export const useChangePasswordStore = defineStore("changePasswordStore", {
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
        async store(old_password, new_password) {
            try {
                let response = await axiosInstance.post(`ticket-inspector-portal/change-password`, { 
                    old_password: old_password,
                    new_password: new_password,
                 });
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
