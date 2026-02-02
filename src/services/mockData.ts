export const MOCK_DATA = {
    homepageConfig: {
        success: true,
        config: {
            id: 1,
            hero_title: "Olimpiadalar orqali kelajagingizni quring",
            hero_subtitle: "O'zbekistonning eng iqtidorli yoshlari safida bo'ling. Bilimingizni sinang va qimmatbaho sovg'alarga ega bo'ling.",
            hero_button_text: "Boshlash",
            hero_button_link: "/register",
            hero_image: null,
            cta_title: "Kelajagingizni bugundan boshlang",
            cta_subtitle: "Minglab o'quvchilar safida bo'ling va o'z bilimingizni sinovdan o'tkazing",
            cta_button_text: "Ro'yxatdan o'tish",
            cta_button_link: "/register",
            show_stats: true,
            show_olympiads: true,
            show_courses: true,
            show_professions: true,
            show_testimonials: true,
            show_mentors: true,
            show_winners: true,
            show_steps: true,
            show_cta: true,
            show_faq: true
        }
    },
    stats: [
        { id: 1, label: "O'quvchilar", value: "10,000+", icon: "Users", order: 1, is_active: true },
        { id: 2, label: "Olimpiadalar", value: "50+", icon: "Trophy", order: 2, is_active: true },
        { id: 3, label: "O'qituvchilar", value: "100+", icon: "GraduationCap", order: 3, is_active: true },
        { id: 4, label: "Kurslar", value: "20+", icon: "BookOpen", order: 4, is_active: true }
    ],
    upcomingOlympiads: [
        {
            id: 6,
            title: "Matematika Bo'yicha Sinov Olimpiadasi",
            slug: "matematika-sinov-test",
            description: "Tizimni test qilish uchun maxsus yaratilgan matematika olimpiadasi.",
            subject: "Matematika",
            start_date: "2026-01-30T13:56:00+05:00",
            end_date: "2027-01-30T14:56:00+05:00",
            duration: 30,
            price: "0.00",
            is_paid: false,
            status: "ONGOING",
            status_display: "Jarayonda",
            questions_count: 5,
            xp_reward: 100,
            participants_count: 2,
            time_remaining: "17h 59m"
        },
        {
            id: 2,
            title: "Informatika Challenge",
            slug: "informatika-challenge",
            description: "Dasturlash va algoritmlar bo'yicha musobaqa.",
            subject: "Informatika",
            start_date: "2026-02-09T01:40:04.339369+05:00",
            end_date: "2026-02-09T03:40:04.339371+05:00",
            duration: 90,
            price: "30000.00",
            is_paid: true,
            status: "UPCOMING",
            status_display: "Kutilmoqda",
            questions_count: 11,
            xp_reward: 50,
            participants_count: 1,
            time_remaining: "6d 4h 43m"
        }
    ],
    featuredCourses: [
        {
            id: 2,
            title: "Python Dasturlash",
            description: "Python dasturlash tilini noldan professional darajagacha o'rganing.",
            level: "BEGINNER",
            price: "200000.00",
            lessons_count: 6,
            students_count: 1,
            rating: "4.90"
        },
        {
            id: 1,
            title: "Matematika Pro",
            description: "Olimpiada matematikasi bo'yicha to'liq kurs.",
            level: "INTERMEDIATE",
            price: "150000.00",
            lessons_count: 5,
            students_count: 1,
            rating: "4.80"
        }
    ],
    professions: [
        {
            id: 1,
            name: "Frontend Dasturchi",
            description: "Veb-saytlarning vizual qismini yarating. HTML, CSS, JavaScript va React orqali interfeyslar quring.",
            icon: "Code",
            color: "from-blue-500 to-indigo-600",
            is_active: true,
            order: 1,
            salary_range: "5,000,000 - 15,000,000",
            learning_time: "6-9 oy",
            required_subjects: [
                { subject_id: 1, name: "Matematika", icon: "Calculator", importance: 4, order: 1 },
                { subject_id: 3, name: "Informatika", icon: "Code", importance: 5, order: 2 }
            ],
            roadmap_steps: [
                { id: 1, title: "Veb asoslari", description: "HTML va CSS orqali ilk sahifalarni yasash", step_type: "LEARN", step_type_display: "O'rganish", order: 1 },
                { id: 2, title: "JavaScript Dasturlash", description: "Mantiqiy va interaktiv elementlar qo'shish", step_type: "LEARN", step_type_display: "O'rganish", order: 2 }
            ]
        },
        {
            id: 2,
            name: "Backend Dasturchi",
            description: "Serverlar va ma'lumotlar bazasi bilan ishlang. Murakkab mantiq va xavfsizlikni ta'minlang.",
            icon: "Database",
            color: "from-slate-700 to-slate-900",
            is_active: true,
            order: 2,
            salary_range: "5,000,000 - 15,000,000",
            learning_time: "7-10 oy",
            required_subjects: [
                { subject_id: 1, name: "Matematika", icon: "Calculator", importance: 5, order: 1 },
                { subject_id: 3, name: "Informatika", icon: "Code", importance: 5, order: 2 }
            ],
            roadmap_steps: [
                { id: 4, title: "Python Asoslari", description: "Tilni chuqur o'rgang va mantiqiy misollar yeching", step_type: "LEARN", step_type_display: "O'rganish", order: 1 }
            ]
        }
    ],
    mentors: [
        {
            id: 9,
            name: "Ogabek Marimov",
            position: "Dasturchi",
            company: "Ardent",
            experience: "5 yil",
            social_links: { telegram: "mapumob" },
            image: "https://ui-avatars.com/api/?name=Ogabek+Marimov&background=random"
        }
    ],
    steps: [
        { id: 1, title: "Sifatli Ta'lim", description: "Eng malakali o'qituvchilar tomonidan tayyorlangan darslar", icon: "ShieldCheck" },
        { id: 2, title: "Amaliyot", description: "Nazariya va amaliyotning uyg'unligi", icon: "Zap" },
        { id: 3, title: "Sertifikat", description: "Xalqaro darajadagi sertifikatga ega bo'ling", icon: "FileCheck" }
    ],
    testimonials: [
        {
            id: 1,
            name: "Davronbek",
            profession: "O'quvchi",
            text_uz: "Ardent orqali men matematika olimpiadasida g'olib bo'ldim!",
            image: "https://ui-avatars.com/api/?name=Davronbek&background=random"
        }
    ],
    banners: [],
    subjects: [
        { id: 1, name: "Matematika", icon: "Calculator" },
        { id: 2, name: "Fizika", icon: "Atom" },
        { id: 3, name: "Informatika", icon: "Code" }
    ],
    user: {
        id: 1,
        full_name: "Demo User",
        email: "demo@ardent.uz",
        role: "STUDENT",
        coins: 500,
        xp: 1200,
        streak: 5,
        avatar: "https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff"
    },
    learningState: {
        enrollment: { id: 1, status: "ACTIVE", progress: 25 },
        modules: [
            {
                id: 1,
                title: "Kirish",
                description: "Python olamiga xush kelibsiz",
                order: 1,
                lessons: [
                    {
                        id: 101,
                        title: "Python-ni o'rnatish",
                        description: "Kompyuteringizga Python muhitini o'rnatish",
                        video_url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
                        youtube_id: "rfscVS0vtbw",
                        video_type: "youtube",
                        video_duration: 600,
                        order: 1,
                        is_free: true,
                        is_locked: false,
                        progress: { is_video_watched: true, is_completed: true },
                        practice: { id: 1, type: "TEXT", problem_text: "Python versiyasini tekshirish buyrug'ini yozing", points: 10 },
                        test: null
                    },
                    {
                        id: 102,
                        title: "O'zgaruvchilar va ma'lumot turlari",
                        description: "O'zgaruvchilar bilan ishlash asoslari",
                        video_url: "https://www.youtube.com/watch?v=SygD_SAt7j8",
                        youtube_id: "SygD_SAt7j8",
                        video_type: "youtube",
                        video_duration: 800,
                        order: 2,
                        is_free: false,
                        is_locked: false,
                        progress: null,
                        practice: null,
                        test: {
                            id: 1,
                            min_pass_score: 60,
                            max_attempts: 3,
                            questions: [
                                { id: 1, text: "Python-da matnli ma'lumot turi qanday ataladi?", options: ["int", "str", "float", "bool"], points: 10 },
                                { id: 2, text: "O'zgaruvchi nomi raqam bilan boshlanishi mumkinmi?", options: ["Ha", "Yo'q"], points: 10 }
                            ]
                        }
                    }
                ]
            }
        ]
    }
};
