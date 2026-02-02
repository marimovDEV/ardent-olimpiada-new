import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const AIChatWidget = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: t('aiChat.greeting'), sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (text?: string) => {
        const queryText = text || input;
        if (!queryText.trim() || loading) return;

        const newUserMsg: Message = { id: Date.now(), text: queryText, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);
        if (!text) setInput("");
        setLoading(true);

        try {
            let sessionId = localStorage.getItem('ai_session_id');
            if (!sessionId) {
                sessionId = Math.random().toString(36).substring(7);
                localStorage.setItem('ai_session_id', sessionId);
            }

            const lang = localStorage.getItem('i18nextLng') || 'uz';
            const normalizedLang = lang.startsWith('ru') ? 'ru' : 'uz';

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai-assistant-faq/query/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: queryText,
                    context_url: window.location.href,
                    language: normalizedLang,
                    session_id: sessionId
                })
            });

            const data = await response.json();

            const botResponse: Message = {
                id: Date.now() + 1,
                text: data.content || t('aiChat.error'),
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: t('aiChat.error'),
                sender: 'bot'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        t('aiChat.suggestions.course'),
        t('aiChat.suggestions.pricing'),
        t('aiChat.suggestions.free'),
        t('aiChat.suggestions.certificate')
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] md:w-[400px] shadow-2xl rounded-2xl overflow-hidden"
                    >
                        <Card className="border-0 h-[500px] flex flex-col">
                            {/* Header */}
                            <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{t('aiChat.title')}</h3>
                                        <p className="text-xs opacity-80">{t('aiChat.status')}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="hover:bg-white/20 text-white" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-hidden bg-muted/30 relative">
                                <ScrollArea className="h-full p-4" ref={scrollRef}>
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-card border rounded-tl-none shadow-sm'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                        {loading && (
                                            <div className="flex justify-start">
                                                <div className="bg-card border rounded-2xl rounded-tl-none px-4 py-2 flex gap-1 items-center">
                                                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                                {/* Suggestions Overlay (if only 1 message) */}
                                {messages.length === 1 && (
                                    <div className="absolute bottom-2 left-0 right-0 p-4">
                                        <p className="text-xs text-muted-foreground mb-2 ml-1">{t('aiChat.quickQuestions')}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((s, i) => (
                                                <button
                                                    key={i}
                                                    className="bg-background border hover:bg-muted text-xs px-3 py-1.5 rounded-full transition-colors shadow-sm"
                                                    disabled={loading}
                                                    onClick={() => {
                                                        handleSend(s);
                                                    }}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-background border-t">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex gap-2"
                                >
                                    <Input
                                        placeholder={t('aiChat.placeholder')}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={loading}
                                        className="rounded-full bg-muted/50"
                                    />
                                    <Button type="submit" size="icon" className="rounded-full aspect-square shrink-0">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform bg-gradient-to-r from-primary to-violet-600 border-2 border-white/20"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
            </Button>
        </div>
    );
};

export default AIChatWidget;
