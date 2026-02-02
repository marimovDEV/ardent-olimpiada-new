import api from "./api";

const authService = {
    getMe: async () => {
        const response = await api.get("/auth/me/");
        return response.data.user;
    },
    updateProfile: async (data: any) => {
        const response = await api.patch("/auth/profile/", data);
        return response.data;
    }
};

export default authService;
