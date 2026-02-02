
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";

// Steps
import Step1Info from "./steps/Step1Info";
import Step2Content from "./steps/Step2Content";
import Step3Settings from "./steps/Step3Settings";
import Step4Questions from "./steps/Step4Questions";
import Step5Rewards from "./steps/Step5Rewards"; // New Step
import Step5Preview from "./steps/Step5Preview";

export interface OlympiadFormState {
    id?: number;
    title: string;
    slug: string;
    description: string;
    subject_id: number | null;
    subject: string;
    profession: string | number | null; // Added
    course: string | number | null;     // Added
    thumbnail: File | string | null;

    // Content
    rules: string;
    prizes: string;
    evaluation_criteria: string;

    // Schedule
    start_date: string;
    end_date: string;
    duration: number;

    // Config
    status: "DRAFT" | "UPCOMING" | "ONGOING" | "PAUSED" | "COMPLETED" | "CANCELED";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    grade_range: string;
    format: "ONLINE" | "LIVE" | "HYBRID";
    max_participants: number | "";

    // Payment
    is_paid: boolean;
    price: number;
    currency: "UZS";
    discount_percent: number;

    // Security
    max_attempts: number;
    tab_switch_limit: number;
    time_limit_per_question: number;
    is_random: boolean;
    cannot_go_back: boolean;
    required_camera: boolean;
    required_full_screen: boolean;
    disable_copy_paste: boolean;

    // Meta
    is_active: boolean;
    xp_reward: number;

    // Extended Settings (New)
    eligibility_grades: any;
    eligibility_regions: any;
    technical_config: any;
    certificate_config: any;
}
const STEPS = [
    { id: 1, title: "Asosiy Ma'lumotlar" },
    { id: 2, title: "Tavsif va Qoidalar" },
    { id: 3, title: "Sozlamalar" },
    { id: 4, title: "Savollar" },
    { id: 5, title: "Mukofotlar" },
    { id: 6, title: "Ko'rib chiqish" }
];

const AdminOlympiadWizard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState<OlympiadFormState>({
        title: "",
        slug: "",
        description: "",
        subject_id: null,
        subject: "",
        profession: null, // Added
        course: null,     // Added
        thumbnail: null,

        rules: "",
        prizes: "",
        evaluation_criteria: "",

        start_date: "",
        end_date: "",
        duration: 60,

        status: "DRAFT",
        level: "BEGINNER",
        difficulty: "MEDIUM",
        grade_range: "",
        format: "ONLINE",
        max_participants: "",

        is_paid: false,
        price: 0,
        currency: "UZS",
        discount_percent: 0,

        max_attempts: 1,
        tab_switch_limit: 3,
        time_limit_per_question: 0,
        is_random: false,
        cannot_go_back: false,
        required_camera: false,
        required_full_screen: false,
        disable_copy_paste: false,

        is_active: true,
        xp_reward: 50,

        eligibility_grades: [],
        eligibility_regions: [],
        technical_config: { internet_policy: 'allow_resume' },
        certificate_config: { enabled: false, threshold_percent: 60 }
    });

    useEffect(() => {
        if (isEdit) fetchOlympiad();

        // Check for step param
        const params = new URLSearchParams(window.location.search);
        const stepParam = params.get('step');
        if (stepParam) {
            setCurrentStep(parseInt(stepParam));
        }
    }, [id]);

    const fetchOlympiad = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/olympiads/${id}/`, { headers: getAuthHeader() });
            const data = res.data;

            setFormData({
                ...data,
                subject_id: data.subject_id || null,
                profession: data.profession || null,
                course: data.course || null,
                start_date: data.start_date ? data.start_date.slice(0, 16) : "",
                end_date: data.end_date ? data.end_date.slice(0, 16) : "",
                max_participants: data.max_participants || "",
                // Ensure new fields are handled if backend sends them (or defaults)
                eligibility_grades: data.eligibility_grades || [],
                eligibility_regions: data.eligibility_regions || [],
                technical_config: data.technical_config || { internet_policy: 'allow_resume' },
                certificate_config: data.certificate_config || { enabled: false, threshold_percent: 60 }
            });
        } catch (error) {
            console.error(error);
            toast.error("Ma'lumotlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const updateData = (data: Partial<OlympiadFormState>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };


    const handleNext = async () => {
        // Basic validation per step
        if (currentStep === 1) {
            // Updated validation: Title is required, AND (Subject OR Profession OR Course)
            if (!formData.title) {
                toast.error("Olimpiada nomi majburiy");
                return;
            }
            if (!formData.subject_id && !formData.profession && !formData.course) {
                toast.error("Iltimos, Fan, Kasb yoki Kursdan birini tanlang");
                return;
            }

            // AUTO-SAVE LOGIC IF NEW
            if (!isEdit) {
                setLoading(true);
                try {
                    let payload: any;
                    let headers = { ...getAuthHeader() };

                    // Determine if we need FormData (for new file)
                    const isMultipart = formData.thumbnail instanceof File;

                    if (isMultipart) {
                        headers['Content-Type'] = 'multipart/form-data';
                        const fd = new FormData();
                        fd.append('status', 'DRAFT');
                        Object.entries(formData).forEach(([key, value]) => {
                            if (value === null || value === undefined) return;
                            if (key === 'thumbnail' && value instanceof File) {
                                fd.append(key, value);
                                return;
                            }
                            const strVal = String(value);
                            if (strVal.trim() === "") {
                                if (['start_date', 'end_date', 'result_time', 'max_participants', 'subject_id', 'profession', 'course', 'slug'].includes(key)) return;
                            }
                            // Handle JSON fields for FormData (Initial creation needs this too if we populated them)
                            if (['eligibility_grades', 'eligibility_regions', 'technical_config', 'certificate_config'].includes(key)) {
                                fd.append(key, JSON.stringify(value));
                                return;
                            }
                            fd.append(key, strVal);
                        });
                        payload = fd;
                    } else {
                        // USE JSON (Safer for types)
                        headers['Content-Type'] = 'application/json';
                        payload = { ...formData, status: 'DRAFT' };

                        // Clean empty/null values for JSON
                        if (!payload.slug) delete payload.slug;

                        // Dates -> null if empty
                        if (!payload.start_date) payload.start_date = null;
                        if (!payload.end_date) payload.end_date = null;
                        if (!payload.result_time) payload.result_time = null;

                        // FKs -> null if empty
                        if (!payload.subject_id) payload.subject_id = null;
                        if (!payload.profession) payload.profession = null;
                        if (!payload.course) payload.course = null;

                        // Numeric strings -> null or default if empty
                        if (payload.max_participants === "") payload.max_participants = null;

                        if (payload.duration === "") payload.duration = 60;
                        if (payload.price === "") payload.price = 0;
                        if (payload.discount_percent === "") payload.discount_percent = 0;
                        if (payload.max_attempts === "") payload.max_attempts = 1;
                        if (payload.tab_switch_limit === "") payload.tab_switch_limit = 3;
                        if (payload.time_limit_per_question === "") payload.time_limit_per_question = 0;
                        if (payload.xp_reward === "") payload.xp_reward = 50;

                        delete payload.thumbnail;
                    }

                    const res = await axios.post(`${API_URL}/olympiads/`, payload, { headers });

                    toast.success("Qoralama saqlandi. Endi davom etishingiz mumkin.");

                    // Navigate to edit page with step 2
                    navigate(`/admin/olympiads/${res.data.id}/edit?step=2`, { replace: true });
                    return;

                } catch (error: any) {
                    console.error("Save error:", error);
                    const errMsg = error.response?.data ? JSON.stringify(error.response.data) : "Qoralamani saqlashda xatolik";
                    toast.error(`Xatolik: ${errMsg}`);
                    setLoading(false);
                    return;
                }
            }
        }

        if (currentStep === 3) {
            if (!formData.start_date || !formData.end_date) {
                toast.error("Boshlanish va tugash vaqtini belgilang");
                return;
            }
        }

        // Auto-save for existing olympiad before moving next
        if (isEdit) {
            const success = await handleSubmit(true);
            if (!success) return; // Stop if save failed
        }

        if (currentStep < 6) setCurrentStep(c => c + 1);
    };

    const handleSubmit = async (stayOnPage = false): Promise<boolean> => {
        // Validation: If status is not DRAFT, check if we have questions
        if (!stayOnPage && formData.status !== 'DRAFT') {
            // additional checks
        }

        setLoading(true);
        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                // Skip null/undefined values entirely
                if (value === null || value === undefined) return;

                // Handle File upload
                if (key === 'thumbnail') {
                    if (value instanceof File) payload.append(key, value);
                    return;
                }

                const strValue = String(value);

                // Fix for 400 Bad Request: Do not send empty strings for optional dates OR foreign keys
                if (strValue.trim() === "") {
                    // Skip empty strings for optional fields
                    if (['start_date', 'end_date', 'result_time', 'max_participants', 'subject_id', 'profession', 'course', 'slug'].includes(key)) {
                        return;
                    }
                }

                // Handle JSON fields for FormData
                if (['eligibility_grades', 'eligibility_regions', 'technical_config', 'certificate_config'].includes(key)) {
                    payload.append(key, JSON.stringify(value));
                    return;
                }

                payload.append(key, strValue);
            });

            if (isEdit) {
                await axios.put(`${API_URL}/olympiads/${id}/`, payload, {
                    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
                });
                if (!stayOnPage) {
                    toast.success("Olimpiada muvaffaqiyatli saqlandi");
                    navigate("/admin/olympiads");
                } else {
                    // Quiet success for auto-save, or small toast
                    // toast.success("Saqlandi"); 
                }
                return true;
            } else {
                // This path might be less used now if we auto-save, but still valid for direct submit
                const res = await axios.post(`${API_URL}/olympiads/`, payload, {
                    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Olimpiada yaratildi");
                navigate("/admin/olympiads");
                return true;
            }
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.status || "Saqlashda xatolik yuz berdi";
            toast.error(typeof msg === 'string' ? msg : "Xatolik");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update URL on step change
    useEffect(() => {
        if (isEdit) {
            const params = new URLSearchParams(window.location.search);
            if (params.get('step') !== String(currentStep)) {
                // Use history.pushState or navigate with replace:true to avoid reload, 
                // but navigate changes route. Since we are on same route just changing param:
                navigate(`?step=${currentStep}`, { replace: true });
            }
        }
    }, [currentStep, isEdit]);

    return (
        <div className="container mx-auto py-8 max-w-5xl min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate("/admin/olympiads")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Ortga
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{isEdit ? "Olimpiadani Tahrirlash" : "Yangi Olimpiada"}</h1>
                        <p className="text-muted-foreground text-sm">
                            {STEPS.find(s => s.id === currentStep)?.title} (Bosqich {currentStep}/6)
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Step Indicators */}
                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={`w-8 h-2 rounded-full transition-all ${step.id === currentStep ? "bg-primary w-12" :
                                    step.id < currentStep ? "bg-primary/50" : "bg-border"
                                    }`}
                                title={step.title}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow bg-card border rounded-2xl shadow-sm p-6 md:p-8 mb-8 relative overflow-hidden">

                {currentStep === 1 && <Step1Info data={formData} update={updateData} />}
                {currentStep === 2 && <Step2Content data={formData} update={updateData} />}
                {currentStep === 3 && <Step3Settings data={formData} update={updateData} />}
                {currentStep === 4 && <Step4Questions olympiadId={Number(id)} isEdit={isEdit} />}
                {currentStep === 5 && <Step5Rewards data={formData} update={updateData} olympiadId={Number(id)} />}
                {currentStep === 6 && <Step5Preview data={formData} />}

            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="w-32"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Ortga
                </Button>

                <div className="flex gap-4">
                    <Button variant="ghost" className="text-muted-foreground bg-muted/50 hover:bg-muted" onClick={() => handleSubmit(true)}>
                        Qoralama sifatida saqlash
                    </Button>

                    {currentStep === 5 ? (
                        <Button onClick={() => handleSubmit(false)} disabled={loading} className="w-40 gap-2 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4" />
                            {loading ? "Saqlanmoqda..." : "Nashr qilish"}
                        </Button>
                    ) : (
                        <Button onClick={handleNext} className="w-40 gap-2">
                            Keyingi <ChevronRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOlympiadWizard;
