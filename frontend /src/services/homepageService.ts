import api, { getAuthHeader } from "./api";

// --- CMS Types ---

export interface HomePageConfig {
    id: number;
    title_uz: string;
    title_ru: string;
    subtitle_uz: string;
    subtitle_ru: string;
    button_text_uz: string;
    button_text_ru: string;
    button_link: string;
    background_image: string | null;
    is_active: boolean;
    show_stats: boolean;
    show_olympiads: boolean;
    show_courses: boolean;
    show_professions: boolean;
    show_testimonials: boolean;
    show_mentors: boolean;
    show_winners: boolean;
    show_steps: boolean;
    show_cta: boolean;
    show_faq: boolean;
}

export interface StatsConfig {
    id: number;
    students_count: number;
    olympiads_count: number;
    courses_count: number;
    teachers_count: number;
    auto_calculate: boolean; // If true, backend calculates real numbers, else uses these manual values
}

export interface Winner {
    id: number;
    subject_id: number;
    subject_name: string; // for display
    stage: 'REPUBLIC' | 'REGION' | 'SCHOOL';
    student_name: string;
    region: string;
    score: number;
    position: 1 | 2 | 3;
    image: string;
    is_featured: boolean; // Big card design
}

export interface FeaturedOlympiad {
    id: number;
    title: string;
    date: string;
    price: number;
    participants_limit: number;
    start_time: string;
    is_last_chance: boolean; // <20% spots left
}

export interface FeaturedCourse {
    id: number;
    course_id: number;
    title: string;
    price: number;
    level: string;
    duration: string;
    thumbnail: string;
    is_featured: boolean;
    order: number;
}

export interface ProfessionCMS {
    id: number;
    name_uz: string;
    name_ru: string;
    salary: string;
    courses_count: number;
    roadmap_link: string;
    icon: string;
}

export interface Testimonial {
    id: number;
    name: string;
    profession: string;
    text_uz: string;
    text_ru: string;
    image: string;
    rating: number; // 1-5
    is_active: boolean;
    is_highlighted: boolean;
}

export interface Mentor {
    id: number;
    name: string;
    position: string;
    company: string;
    experience: string;
    bio_uz: string;
    bio_ru: string;
    social_links: {
        telegram?: string;
        linkedin?: string;
        instagram?: string;
    };
    image: string;
}

export interface Banner {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    mobile_image?: string;
    button_text?: string;
    button_link?: string;
    order: number;
    is_active: boolean;
}

// --- Service ---

export const homepageService = {
    // Public APIs (Fetching data for Home)
    getHero: async () => {
        const res = await api.get(`/homepage/hero/`);
        return res.data; // List of active heros
    },
    getStats: async () => {
        const res = await api.get(`/homepage/stats/`);
        return res.data;
    },
    getWinners: async () => {
        const res = await api.get(`/homepage/winners/`);
        return res.data;
    },
    getPrideResults: async () => {
        const res = await api.get(`/homepage/pride-results/`);
        return res.data;
    },
    getUpcomingOlympiads: async () => {
        const res = await api.get(`/homepage/upcoming-olympiads/`);
        return res.data;
    },
    getFeaturedCourses: async () => {
        const res = await api.get(`/homepage/featured-courses/`);
        return res.data;
    },
    getProfessions: async () => {
        const res = await api.get(`/homepage/professions/`);
        return res.data;
    },
    getTestimonials: async () => {
        const res = await api.get(`/homepage/testimonials/`);
        return res.data;
    },
    getMentors: async () => {
        const res = await api.get(`/homepage/mentors/`);
        return res.data;
    },

    // Admin APIs (Managing data) - Assuming standard CRUD for now
    // Admin APIs (Managing data)
    getConfig: async () => {
        const res = await api.get(`/homepage/get_config/`);
        return res.data;
    },
    updateConfig: async (data: any) => {
        return api.post(`/homepage/update_config/`, data, { headers: getAuthHeader() }); // Using POST for update based on backend implementation
    },

    // Stats Management
    createStat: async (data: any) => {
        return api.post(`/home-stats/`, data, { headers: getAuthHeader() });
    },
    deleteStat: async (id: number) => {
        return api.delete(`/home-stats/${id}/`, { headers: getAuthHeader() });
    },

    // Steps Management
    getSteps: async () => {
        const res = await api.get(`/home-steps/`);
        return res.data;
    },
    createStep: async (data: any) => {
        return api.post(`/home-steps/`, data, { headers: getAuthHeader() });
    },
    deleteStep: async (id: number) => {
        return api.delete(`/home-steps/${id}/`, { headers: getAuthHeader() });
    },

    // Advantages Management
    getAdvantages: async () => {
        const res = await api.get(`/home-advantages/`);
        return res.data;
    },
    createAdvantage: async (data: any) => {
        return api.post(`/home-advantages/`, data, { headers: getAuthHeader() });
    },
    deleteAdvantage: async (id: number) => {
        return api.delete(`/home-advantages/${id}/`, { headers: getAuthHeader() });
    },

    // Banners Management
    getBanners: async () => {
        const res = await api.get(`/banners/`);
        return res.data;
    },
    createBanner: async (data: any) => {
        return api.post(`/banners/`, data, { headers: getAuthHeader() });
    },
    deleteBanner: async (id: number) => {
        return api.delete(`/banners/${id}/`, { headers: getAuthHeader() });
    },

    // Testimonials Management
    // getTestimonials already exists (public), but we use standard endpoint for admin lists too
    createTestimonial: async (data: any) => {
        return api.post(`/testimonials/`, data, { headers: getAuthHeader() });
    },
    deleteTestimonial: async (id: number) => {
        return api.delete(`/testimonials/${id}/`, { headers: getAuthHeader() });
    },
};
