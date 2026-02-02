// Mock Data
import { LearningState } from "./services/learningService";
import { Profession } from "./services/professionService";
import { HeroConfig, StatsConfig, Winner, FeaturedOlympiad, FeaturedCourse, Testimonial, Mentor, ProfessionCMS } from "./services/homepageService";
import { MOCK_DATA } from "./services/mockData";

// --- AUTH & USERS ---
const MOCK_USER_STUDENT = {
    id: 1,
    first_name: "Demo",
    last_name: "Student",
    full_name: "Demo Student",
    username: "student",
    balance: 500000,
    role: "STUDENT",
    avatar: "https://github.com/shadcn.png",
    is_superuser: false,
    language: "uz"
};

const MOCK_USER_TEACHER = {
    id: 2,
    first_name: "Demo",
    last_name: "Teacher",
    full_name: "Demo Teacher",
    username: "teacher",
    balance: 1000000,
    role: "TEACHER",
    avatar: "https://github.com/shadcn.png",
    is_superuser: false,
    teacher_profile: {
        bio: "Tajribali matematika o'qituvchisi",
        specialization: "Matematika",
        verification_status: "APPROVED"
    },
    language: "ru"
};

const MOCK_USER_ADMIN = {
    id: 3,
    first_name: "Demo",
    last_name: "Admin",
    full_name: "Demo Admin",
    username: "admin",
    balance: 9999999,
    role: "ADMIN",
    avatar: "https://github.com/shadcn.png",
    is_superuser: true,
    language: "uz"
};

// --- CMS DATA ---

const MOCK_HERO: HeroConfig[] = [
    {
        id: 1,
        title_uz: "Ardent Olimpiada 2024 – Ilm bilan cho‘qqilarni zabt eting",
        title_ru: "Ardent Olympiad 2024 – Conquer peaks with knowledge",
        subtitle_uz: "Respublikadagi eng nufuzli fan olimpiadalarida ishtirok eting",
        subtitle_ru: "Participate in the most prestigious subject olympiads in the Republic",
        button_text_uz: "Olimpiadaga Qatnashish",
        button_text_ru: "Participate",
        button_link: "/olympiads",
        background_image: null,
        is_active: true
    },
    {
        id: 2,
        title_uz: "Yangi IT kurslarimiz ochildi!",
        title_ru: "New IT courses launched!",
        subtitle_uz: "Dasturlashni professionallardan o'rganing",
        subtitle_ru: "Learn programming from professionals",
        button_text_uz: "Kursni tanlash",
        button_text_ru: "Choose course",
        button_link: "/courses",
        background_image: null,
        is_active: true
    }
];

const MOCK_STATS_CONFIG: StatsConfig = {
    id: 1,
    students_count: 12500,
    olympiads_count: 45,
    courses_count: 120,
    teachers_count: 55,
    auto_calculate: false
};

const MOCK_WINNERS: Winner[] = [
    {
        id: 1,
        subject_id: 1,
        subject_name: "Matematika",
        stage: "REPUBLIC",
        student_name: "Azizov Sardor",
        region: "Toshkent sh.",
        score: 98,
        position: 1,
        image: "https://github.com/shadcn.png",
        is_featured: true
    },
    {
        id: 2,
        subject_id: 2,
        subject_name: "Fizika",
        stage: "REGION",
        student_name: "Karimova Malika",
        region: "Samarqand",
        score: 95,
        position: 2,
        image: "https://github.com/shadcn.png",
        is_featured: false
    }
];

const MOCK_UPCOMING_OLYMPIADS: FeaturedOlympiad[] = [
    {
        id: 1,
        title: "Kuzgi Matematika Olimpiadasi",
        date: "2024-10-25",
        price: 50000,
        participants_limit: 200,
        start_time: "10:00",
        is_last_chance: true
    },
    {
        id: 2,
        title: "Informatika: Algoritmlar",
        date: "2024-11-01",
        price: 0,
        participants_limit: 500,
        start_time: "14:00",
        is_last_chance: false
    }
];

const MOCK_FEATURED_COURSES: FeaturedCourse[] = [
    {
        id: 1,
        course_id: 3,
        title: "Web Dasturlash (Frontend)",
        price: 300000,
        level: "Mukammal",
        duration: "20 soat",
        thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80",
        is_featured: true,
        order: 1
    },
    {
        id: 2,
        course_id: 1,
        title: "Python Asoslari",
        price: 0,
        level: "Boshlang'ich",
        duration: "4 soat",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
        is_featured: true,
        order: 2
    }
];

const MOCK_CMS_PROFESSIONS: ProfessionCMS[] = [
    {
        id: 1,
        name_uz: "Frontend Dasturchi",
        name_ru: "Frontend Developer",
        salary: "$400 - $2000",
        courses_count: 5,
        roadmap_link: "/professions/1",
        icon: "layout"
    },
    {
        id: 2,
        name_uz: "Backend Dasturchi",
        name_ru: "Backend Developer",
        salary: "$500 - $3000",
        courses_count: 4,
        roadmap_link: "/professions/backend",
        icon: "server"
    }
];

const MOCK_TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "Javohir",
        profession: "Software Engineer",
        text_uz: "Bu platforma orqali men o'z karyeramni boshladim. Tavsiya qilaman!",
        text_ru: "I started my career through this platform. Highly recommended!",
        image: "https://github.com/shadcn.png",
        rating: 5,
        is_active: true,
        is_highlighted: true
    },
    {
        id: 2,
        name: "Madina",
        profession: "Student",
        text_uz: "Olimpiada savollari juda sifatli tuzilgan.",
        text_ru: "Olympiad questions are very high quality.",
        image: "https://github.com/shadcn.png",
        rating: 4,
        is_active: true,
        is_highlighted: false
    }
];

const MOCK_MENTORS: Mentor[] = [
    {
        id: 1,
        name: "Alisher Uzoqov",
        position: "Senior Python Developer",
        company: "Google",
        experience: "10 yil",
        bio_uz: "Google kompaniyasida 5 yillik tajribaga ega mutaxassis.",
        bio_ru: "Specialist with 5 years of experience at Google.",
        social_links: { telegram: "@alisher", linkedin: "linkedin.com/in/alisher" },
        image: "https://github.com/shadcn.png"
    }
];

const MOCK_GAMIFICATION_DASHBOARD = {
    streak: 5,
    xp_today: 150,
    daily_goal: 500,
    total_xp: 2450,
    level: 4,
    next_level_xp: 3000,
    rank: 12,
    total_students: 1500,
    badges: [
        { id: 1, name: "Early Bird", image: "https://images.unsplash.com/photo-1599305090598-fe179d501c27?w=100&q=80", earned_at: "2024-01-10" },
        { id: 2, name: "Fast Learner", image: "https://images.unsplash.com/photo-1599305090598-fe179d501c27?w=100&q=80", earned_at: "2024-01-15" }
    ],
    leaderboard: [
        { id: 1, username: "student1", xp: 5000, rank: 1, avatar: null },
        { id: 2, username: "student2", xp: 4800, rank: 2, avatar: null },
        { id: 3, username: "student3", xp: 4500, rank: 3, avatar: null }
    ]
};

// --- LEGACY MOCK DATA (Courses, Olympiads, etc.) ---
const MOCK_COURSES_LEGACY = [
    // ... Same as before but kept for Course Detail pages
    {
        id: 1,
        title: "Python Asoslari",
        subject: "Informatika",
        level: "Boshlang'ich",
        lessons_count: 12,
        price: 0,
        is_enrolled: false
    },
    {
        id: 3,
        title: "Web Dasturlash (Frontend)",
        subject: "Informatika",
        level: "Mukammal",
        lessons_count: 45,
        price: 300000,
        is_enrolled: true,
        enrollment: { id: 101, progress: 35, current_lesson: 5 }
    }
];

const MOCK_OLYMPIADS_LEGACY = [
    {
        id: 1,
        title: "Kuzgi Matematika Olimpiadasi",
        status: "UPCOMING",
        participants_count: 120
    }
];

const MOCK_LEARNING_STATE: LearningState = {
    enrollment: { id: 101, progress: 10, current_lesson: 1, updated_at: new Date().toISOString() },
    modules: [{
        id: 1, title: "Kirish", description: "Kursga kirish", order: 1,
        lessons: [{ id: 1, title: "Kurs haqida", description: "Intro", video_url: "", video_type: "youtube", video_duration: 300, pdf_url: null, order: 1, is_free: true, is_locked: false, progress: { is_video_watched: true, is_completed: true, practice_score: null, test_score: null }, practice: null, test: null }]
    }]
};

// Override window.fetch
const originalFetch = window.fetch;

console.log("🛠️ MOCK API INITIALIZED - CMS Enabled");

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || 'GET';

    console.log(`📡 MockAPI: ${method} ${url}`);

    const jsonResponse = (data: any, status = 200) => {
        return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
    };

    await new Promise(r => setTimeout(r, 300));

    try {
        // Helper to manage registrations in local storage for demo persistence
        const getRegistrations = () => JSON.parse(localStorage.getItem('demo_registrations') || '[]');
        const saveRegistration = (reg: any) => {
            const regs = getRegistrations();
            regs.push(reg);
            localStorage.setItem('demo_registrations', JSON.stringify(regs));
        };
        const isRegistered = (olympiadId: number) => getRegistrations().some((r: any) => r.olympiad_id === olympiadId);
        const getResult = (olympiadId: number) => JSON.parse(localStorage.getItem(`demo_result_${olympiadId}`) || 'null');

        // --- CMS ENDPOINTS ---
        // ... (existing CMS endpoints)
        if (url.includes('/api/homepage/get_config/')) return jsonResponse(MOCK_DATA.homepageConfig);
        if (url.includes('/api/homepage/hero/')) return jsonResponse(MOCK_HERO);
        if (url.includes('/api/homepage/stats/')) return jsonResponse(MOCK_STATS_CONFIG);
        if (url.includes('/api/stats/public/')) return jsonResponse({
            success: true,
            stats: {
                total_users: 12500,
                active_courses: 45,
                active_olympiads: 20,
                certificates_issued: 850
            }
        });
        if (url.includes('/api/homepage/winners/')) return jsonResponse(MOCK_WINNERS);
        if (url.includes('/api/homepage/pride-results/')) return jsonResponse([
            {
                id: 1,
                title: "Matematika Olimpiadasi 2024",
                subject: "subjects.matematika",
                date: "2024-03-15",
                stage: "republic",
                participants_count: 1248,
                winners: [
                    { id: 1, rank: 1, student_name: "Azizbek Toxirov", region: "Toshkent", score: 96, max_score: 100 },
                    { id: 2, rank: 2, student_name: "Malika Karimova", region: "Samarqand", score: 93, max_score: 100 },
                    { id: 3, rank: 3, student_name: "Javohir Aliyev", region: "Buxoro", score: 91, max_score: 100 }
                ]
            }
        ]);
        if (url.includes('/api/homepage/upcoming-olympiads/') || url.includes('/api/olympiads/upcoming/')) return jsonResponse(MOCK_DATA.upcomingOlympiads);
        if (url.includes('/api/homepage/featured-courses/') || url.includes('/api/courses/featured/')) return jsonResponse(MOCK_DATA.featuredCourses);
        if (url.includes('/api/homepage/professions/')) return jsonResponse(MOCK_DATA.professions.map(p => ({
            id: p.id,
            name_uz: p.name,
            name_ru: p.name + " (RU)",
            salary: p.salary_range,
            courses_count: 5,
            roadmap_link: `/professions/${p.id}`,
            icon: p.icon.charAt(0).toUpperCase() + p.icon.slice(1)
        })));
        if (url.includes('/api/homepage/testimonials/')) return jsonResponse(MOCK_DATA.testimonials.map(t => ({
            ...t,
            text_uz: t.text_uz,
            text_ru: t.text_uz + " (RU)",
            is_active: true,
            is_highlighted: true,
            rating: 5
        })));
        if (url.includes('/api/homepage/mentors/')) return jsonResponse(MOCK_DATA.mentors.map(m => ({
            ...m,
            bio_uz: "Tajribali mutaxassis",
            bio_ru: "Experienced specialist"
        })));
        if (url.includes('/api/banners/')) return jsonResponse(MOCK_DATA.banners);
        if (url.includes('/api/gamification/dashboard/')) return jsonResponse(MOCK_GAMIFICATION_DASHBOARD);
        if (url.includes('/api/notifications/unread_count/')) return jsonResponse({ count: 3 });
        if (url.includes('/api/admin/dashboard/overview/')) return jsonResponse({
            success: true,
            stats: {
                total_students: 1200,
                active_courses: 45,
                total_revenue: 150000000,
                pending_support: 5
            }
        });

        // --- AUTH ---
        if (url.includes('/api/auth/send-code/')) {
            return jsonResponse({ success: true, message: "Code sent" });
        }
        if (url.includes('/api/auth/verify-code/')) {
            return jsonResponse({ success: true, verified: true });
        }
        if (url.includes('/api/auth/resend-code/')) {
            return jsonResponse({ success: true, message: "Code resent" });
        }
        if (url.includes('/api/auth/complete-registration/')) {
            return jsonResponse({ success: true, token: "mock-jwt", user: MOCK_USER_STUDENT });
        }
        if (url.includes('/api/auth/forgot-password/')) {
            return jsonResponse({ success: true, message: "Reset code sent" });
        }
        if (url.includes('/api/auth/verify-reset-code/')) {
            return jsonResponse({ success: true, message: "Code verified" });
        }

        if (url.includes('/api/auth/login/')) {
            const body = init?.body ? JSON.parse(init.body as string) : {};
            let user = MOCK_USER_STUDENT;
            const username = body.username || body.phone || '';
            if (username.includes('teacher')) user = MOCK_USER_TEACHER;
            else if (username.includes('admin')) user = MOCK_USER_ADMIN;

            // For demo purposes, any password works.
            return jsonResponse({ success: true, token: "mock-jwt", user });
        }
        if (url.includes('/api/auth/me/') || url.includes('/api/auth/profile/')) {
            const storedUser = localStorage.getItem('user');
            const user = storedUser ? JSON.parse(storedUser) : MOCK_USER_STUDENT;
            return jsonResponse({ user });
        }

        // --- WALLET ---
        if (url.includes('/api/wallet/purchase/')) {
            const body = JSON.parse(init?.body as string || '{}');
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const olympiad = MOCK_DATA.upcomingOlympiads.find(o => o.id === body.id) || MOCK_OLYMPIADS_LEGACY[0];
                const price = parseFloat(olympiad.price || '0');

                if (user.balance >= price) {
                    user.balance -= price;
                    localStorage.setItem('user', JSON.stringify(user));
                    saveRegistration({ olympiad_id: body.id, created_at: new Date().toISOString() });
                    return jsonResponse({
                        success: true,
                        message: "To'lov muvaffaqiyatli amalga oshirildi va ro'yxatdan o'tdingiz.",
                        balance: user.balance
                    });
                } else {
                    return jsonResponse({ success: false, error: "Mablag' yetarli emas" }, 400);
                }
            }
        }

        // --- COURSES & LEARNING ---
        if (url.includes('/learning_state/')) return jsonResponse(MOCK_LEARNING_STATE);
        if (url.includes('/api/courses/my_courses/')) {
            // Return an array of enrollments
            return jsonResponse([
                {
                    id: 1,
                    course: MOCK_DATA.featuredCourses[0],
                    progress: 25,
                    current_lesson: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 2,
                    course: MOCK_DATA.featuredCourses[1],
                    progress: 60,
                    current_lesson: 3,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]);
        }
        if (url.includes('/api/courses/')) {
            if (method === 'GET') {
                const idMatch = url.match(/\/courses\/(\d+)\/$/);
                if (idMatch) return jsonResponse(MOCK_COURSES_LEGACY.find(c => c.id == parseInt(idMatch[1])) || { detail: "Not found" }, idMatch ? 200 : 404);
                return jsonResponse({ results: MOCK_COURSES_LEGACY });
            }
        }

        if (url.includes('/api/test-results/')) return jsonResponse({ results: [] });
        if (url.includes('/api/certificates/my-certificates/')) return jsonResponse({ results: [] });

        // --- OLYMPIADS ---
        if (url.includes('/api/olympiads/my_registrations/')) {
            const regs = getRegistrations();
            const results = regs.map((r: any) => ({
                id: r.olympiad_id,
                olympiad: MOCK_DATA.upcomingOlympiads.find(o => o.id === r.olympiad_id) || MOCK_OLYMPIADS_LEGACY[0],
                created_at: r.created_at
            }));
            return jsonResponse(results);
        }

        if (url.includes('/api/olympiads/') && url.includes('/start/')) return jsonResponse({ success: true });
        if (url.includes('/api/olympiads/') && url.includes('/questions/')) {
            const olympiadId = parseInt(url.match(/\/olympiads\/(\d+)\//)?.[1] || '0');
            const olympiad = MOCK_DATA.upcomingOlympiads.find(o => o.id === olympiadId) || MOCK_OLYMPIADS_LEGACY[0];
            return jsonResponse({
                olympiad,
                questions: [
                    { id: 1, text: "2 + 2 = ?", type: "MCQ", options: ["2", "3", "4", "5"], points: 10 },
                    { id: 2, text: "Python-ning yaratuvchisi kim?", type: "MCQ", options: ["Steve Jobs", "Guido van Rossum", "Bill Gates", "Mark Zuckerberg"], points: 10 },
                    { id: 3, text: "Informatika so'zining asosi nima?", type: "MCQ", options: ["Informatsiya va avtomatika", "Internet va texnika", "Kompyuter va mantiq", "Dastur va apparat"], points: 10 },
                    { id: 4, text: "O'zbekistonning poytaxti qaysi shahar?", type: "MCQ", options: ["Samarqand", "Buxoro", "Toshkent", "Xiva"], points: 10 },
                    { id: 5, text: "Yorug'lik tezligi qancha?", type: "MCQ", options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "340 m/s"], points: 10 }
                ]
            });
        }
        if (url.includes('/api/olympiads/') && url.includes('/submit_answer/')) return jsonResponse({ success: true });
        if (url.includes('/api/olympiads/') && url.includes('/submit/')) {
            const olympiadId = parseInt(url.match(/\/olympiads\/(\d+)\//)?.[1] || '0');
            const mockResult = {
                my_result: {
                    id: Math.floor(Math.random() * 1000),
                    student: "Demo User",
                    score: 90,
                    percentage: 90,
                    rank: 1,
                    time_taken: 350,
                    status: "COMPLETED",
                    created_at: new Date().toISOString()
                },
                avg_score: 75,
                participants_count: 125,
                status: "PUBLISHED",
                leaderboard: [
                    { rank: 1, student: "Demo User", region: "Toshkent", score: 90, time_taken: 350 },
                    { rank: 2, student: "Alisher Navoiy", region: "Samarqand", score: 85, time_taken: 420 },
                    { rank: 3, student: "Bobur Mirzo", region: "Andijon", score: 80, time_taken: 500 }
                ]
            };
            localStorage.setItem(`demo_result_${olympiadId}`, JSON.stringify(mockResult));
            return jsonResponse({ success: true, message: "Sizning javoblaringiz qabul qilindi!" });
        }
        if (url.includes('/api/olympiads/') && url.includes('/result/')) {
            const olympiadId = parseInt(url.match(/\/olympiads\/(\d+)\//)?.[1] || '0');
            const result = getResult(olympiadId);
            if (result) return jsonResponse(result);
            return jsonResponse({ detail: "Natija topilmadi" }, 404);
        }

        if (url.includes('/api/olympiads/')) {
            const idMatch = url.match(/\/olympiads\/(\d+)\//);
            if (idMatch) {
                const id = parseInt(idMatch[1]);
                const olympiad = MOCK_DATA.upcomingOlympiads.find(o => o.id === id) || MOCK_OLYMPIADS_LEGACY.find(o => o.id === id) || MOCK_OLYMPIADS_LEGACY[0];
                return jsonResponse({
                    ...olympiad,
                    is_registered: isRegistered(id),
                    is_completed: !!getResult(id),
                    status: getResult(id) ? 'PUBLISHED' : (olympiad.status || 'ONGOING'),
                    results_published: !!getResult(id)
                });
            }
            if (url.endsWith('/api/olympiads/') || url.includes('/api/olympiads/?')) {
                const results = MOCK_DATA.upcomingOlympiads.map(o => ({
                    ...o,
                    is_registered: isRegistered(o.id),
                    is_completed: !!getResult(o.id)
                }));
                return jsonResponse({ results });
            }
        }

        // Fallback
        if (!url.includes('/api/')) return originalFetch(input, init);

        console.warn(`⚠️ Unhandled Mock: ${url}`);
        return jsonResponse({ detail: "Mock endpoint not found" }, 404);

    } catch (e) {
        console.error("Mock Error", e);
        return jsonResponse({ detail: "Error" }, 500);
    }
};

import axios from 'axios';
import api from './services/api';

const mockAdapter = async (config: any) => {
    const url = config.baseURL ? config.baseURL + config.url : config.url;
    const init: RequestInit = {
        method: config.method?.toUpperCase(),
        headers: config.headers as any,
        body: config.data,
    };
    const response = await window.fetch(url!, init);
    const data = await response.json().catch(() => ({}));
    return { data, status: response.status, statusText: response.statusText, headers: Object.fromEntries(response.headers.entries()), config, request: {} };
};

api.defaults.adapter = mockAdapter;
axios.defaults.adapter = mockAdapter;
