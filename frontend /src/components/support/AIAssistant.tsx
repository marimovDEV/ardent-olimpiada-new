import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, User, Send, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/services/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AIAssistantFAQ {
    id: number;
    question_uz: string;
    question_ru: string;
    answer_uz: string;
    answer_ru: string;
    category: string;
    action_label_uz: string | null;
    action_label_ru: string | null;
    action_link: string | null;
}

interface Message {
    id?: number;
    type: 'user' | 'bot';
    content: string;
    source?: 'FAQ' | 'LLM';
    action?: { label: string, link: string };
    faq_id?: number;
    message_id?: number;
    rated?: 'up' | 'down' | null;
}

interface AIAssistantProps {
    onTalkToAdmin: () => void;
}

const AIAssistant = ({ onTalkToAdmin }: AIAssistantProps) => {
    const [faqs, setFaqs] = useState<AIAssistantFAQ[]>([]);
    const [history, setHistory] = useState<Message[]>([]);
    const [language, setLanguage] = useState<'uz' | 'ru'>('uz');
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lang = localStorage.getItem('i18nextLng') || 'uz';
        setLanguage(lang.startsWith('ru') ? 'ru' : 'uz');

        fetchFaqs();

        setHistory([{
            type: 'bot',
            content: lang.startsWith('ru')
                ? "Здравствуйте! Я Ardent AI — ваш помощник. Выберите вопрос или напишите мне."
                : "Assalomu alaykum! Men Ardent AI yordamchingizman. Quyidagi savollardan birini tanlang yoki savolingizni yozing."
        }]);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const fetchFaqs = async () => {
        try {
            const res = await axios.get(`${API_URL}/ai-assistant-faq/`);
            setFaqs(res.data.results || res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuery = async (queryText: string) => {
        if (!queryText.trim()) return;

        setHistory(prev => [...prev, { type: 'user', content: queryText }]);
        setInput("");
        setLoading(true);

        try {
            let sessionId = localStorage.getItem('ai_session_id');
            if (!sessionId) {
                sessionId = Math.random().toString(36).substring(7);
                localStorage.setItem('ai_session_id', sessionId);
            }

            const res = await axios.post(`${API_URL}/ai-assistant-faq/query/`, {
                question: queryText,
                context_url: window.location.href,
                language: language,
                session_id: sessionId
            });

            const data = res.data;
            setHistory(prev => [
                ...prev,
                {
                    type: 'bot',
                    content: data.content,
                    source: data.type,
                    action: data.action,
                    faq_id: data.faq_id,
                    message_id: data.message_id
                }
            ]);
        } catch (error) {
            toast.error(language === 'uz' ? "Xatolik yuz berdi" : "Произошла ошибка");
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (msgIndex: number, rating: 1 | -1) => {
        const msg = history[msgIndex];
        if (!msg.message_id) return;

        try {
            await axios.post(`${API_URL}/ai-assistant-faq/rate/`, {
                message_id: msg.message_id,
                rating: rating
            });

            setHistory(prev => prev.map((m, i) =>
                i === msgIndex ? { ...m, rated: rating === 1 ? 'up' : 'down' } : m
            ));

            toast.success(language === 'uz' ? "Rahmat!" : "Спасибо!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectQuestion = (faq: AIAssistantFAQ) => {
        handleQuery(language === 'uz' ? faq.question_uz : faq.question_ru);
    };

    return (
        <div className="flex flex-col h-full bg-card dark:bg-slate-900 transition-colors">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-900 p-4 text-white flex items-center gap-3 shadow-md">
                <div className="w-10 h-10 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center border border-white/30 dark:border-white/10">
                    <Sparkles className="w-6 h-6 text-yellow-200" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Ardent AI</h3>
                    <p className="text-[10px] text-blue-100 dark:text-blue-200 uppercase tracking-widest font-bold">Smart Assistant v2.0</p>
                </div>
            </div>

            {/* Chat History */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 dark:bg-slate-950/20">
                {history.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] shadow-sm rounded-2xl p-3 text-sm relative group ${msg.type === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-card dark:bg-slate-800 text-foreground dark:text-slate-100 rounded-tl-none border border-border dark:border-slate-700'
                            }`}>
                            {msg.content}

                            {msg.action && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-3 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                                    onClick={() => {
                                        if (msg.action?.link.startsWith('http')) {
                                            window.open(msg.action.link, '_blank');
                                        } else {
                                            window.location.href = msg.action?.link || "#";
                                        }
                                    }}
                                >
                                    {msg.action.label}
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            )}

                            {msg.type === 'bot' && msg.message_id && (
                                <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                    <button
                                        onClick={() => handleRate(i, 1)}
                                        className={`p-1 rounded-full hover:bg-muted ${msg.rated === 'up' ? 'text-green-500' : 'text-muted-foreground'}`}
                                    >
                                        <ThumbsUp className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleRate(i, -1)}
                                        className={`p-1 rounded-full hover:bg-muted ${msg.rated === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}
                                    >
                                        <ThumbsDown className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            {msg.source === 'LLM' && (
                                <div className="text-[8px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">AI Generated</div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-2xl rounded-tl-none p-3 shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-primary dark:text-blue-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card dark:bg-slate-900 border-t border-border dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap gap-2">
                    {faqs.map(faq => (
                        <button
                            key={faq.id}
                            onClick={() => handleSelectQuestion(faq)}
                            className="bg-muted dark:bg-slate-800 border border-border dark:border-slate-700 px-3 py-2 rounded-lg text-xs font-medium text-foreground dark:text-slate-200 hover:bg-primary/10 dark:hover:bg-blue-900/40 hover:border-primary/40 dark:hover:border-blue-500/50 hover:text-primary dark:hover:text-blue-400 transition-all shadow-sm active:scale-95"
                        >
                            {language === 'uz' ? faq.question_uz : faq.question_ru}
                        </button>
                    ))}
                </div>

                <Button
                    variant="ghost"
                    className="w-full text-[10px] text-muted-foreground hover:text-primary hover:bg-primary/10 h-7"
                    onClick={onTalkToAdmin}
                >
                    <User className="w-3 h-3 mr-2" />
                    {language === 'uz' ? "Admin bilan bog'lanish" : "Связаться с админом"}
                </Button>
            </div>
        </div>
    );
};

export default AIAssistant;
