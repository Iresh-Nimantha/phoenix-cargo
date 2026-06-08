import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, User, Phone, Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../hooks/useContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const defaultChatbotData = {
  botName: 'Phoenix Assistant',
  persona: `You are "Phoenix Assistant", the official friendly customer support AI bot for Phoenix Cargo (Pvt) Ltd.
Provide professional, polite, and accurate freight forwarding answers. Keep answers brief (1-3 sentences max) to fit inside a small chat window.

Core Company Information:
- Address: No. 77, Sri Medhananda Mawatha, Moratuwa, Sri Lanka.
- Phone Support: 070 644 0992 | 076 736 7280.
- Email Support: imports@phoenixcargo.com.
- Core Services: Air Freight, Sea Freight (FCL/LCL), Road & Rail Freight, Customs Clearance & Brokerage.
- Specialized Cargo Handling:
  * Project Cargo: Heavy lift, Out of Gauge (OOG) shipping, custom industrial routes.
  * Pharmaceutical Cargo: Cold-chain shipping solutions, strict temperature control, medical grade.
  * Hazardous Cargo: Dangerous goods class 1-9 handling, compliance certification.
- 24/7 Operations: We run constant tracking and dispatch support.

If asked about tracking, guide the user to the "/tracking" page.
If asked about rates or quote requests, guide the user to click the "Get a Quote" button on the website.
Do not invent facts or promise exact delivery rates without verification. Always remain polite and elite.`,
};

export default function Chatbot() {
  const { pathname } = useLocation();
  const { content } = useContent('chatbot', defaultChatbotData);
  const botSettings = { ...defaultChatbotData, ...content };

  const [isOpen, setIsOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Synchronize bottom offset with MobileBottomNav scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your Phoenix Assistant. How can I help you with your global shipping, cargo tracking, or shipping needs today? 🌐',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const launcherButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to bottom of chat list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Click outside close trigger
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node) &&
        launcherButtonRef.current &&
        !launcherButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setTimeout(() => {
        let reply = "I'd be glad to assist you! For quick help, you can track packages on our /tracking page or get a quote. You can also reach our team directly at imports@phoenixcargo.com or 070 644 0992.";
        const lowered = userMessage.toLowerCase();
        if (lowered.includes('track') || lowered.includes('where') || lowered.includes('status')) {
          reply = "You can track your shipment live using our online Tracking Page! Just select your courier (DHL, FedEx, UPS, etc.) and enter your tracking number there.";
        } else if (lowered.includes('quote') || lowered.includes('price') || lowered.includes('rate') || lowered.includes('cost')) {
          reply = "To get an accurate shipping rate, please use the 'Get a Quote' button at the top of our homepage. Our team will prepare a custom proposal for you!";
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${botSettings.persona}\n\nUser Question: ${userMessage}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const botResponse = data.candidates[0].content.parts[0].text;
        setMessages((prev) => [...prev, { role: 'assistant', content: botResponse.trim() }]);
      } else {
        throw new Error('Gemini API response error');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having a brief connection issue, but you can reach our 24/7 hotline at 070 644 0992 or email imports@phoenixcargo.com for instant cargo support!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed ${isNavVisible ? 'bottom-24' : 'bottom-6'} md:bottom-6 right-6 z-[999] select-none transition-all duration-300`}>
      <motion.button
        ref={launcherButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-r from-blue-700 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-cyan-500/30 transition-all border border-white/20 relative group"
      >
        <span className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <MessageSquare className="w-6 h-6 relative z-10" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed sm:absolute bottom-[92px] sm:bottom-18 left-4 right-4 sm:left-auto sm:right-0 w-auto sm:w-[380px] h-[480px] sm:h-[500px] max-w-[calc(100vw-32px)] sm:max-w-none bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col z-[1000] sm:z-auto"
          >
            <div className="bg-[#800C30] p-5 text-white flex items-center justify-between border-b border-white/10 relative overflow-hidden shrink-0">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">{botSettings.botName}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Support Online</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 pointer-events-auto relative z-[100] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white/40 border-b border-gray-100 p-3 flex gap-2 justify-around text-[10px] text-gray-500 font-bold shrink-0">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-600" /> 070 644 0992
              </div>
              <div className="flex items-center gap-1 font-sans">
                <Send className="w-3 h-3 text-cyan-600" /> imports@phoenixcargo.com
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role !== 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-[#800C30] text-white flex items-center justify-center shrink-0 shadow-sm border border-cyan-500/20">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}
                  <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#800C30] text-white rounded-tr-none' : 'bg-white text-[#800C30] border border-gray-200/50 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#800C30] text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="bg-white border border-gray-200/50 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about shipping, tracking, or services..."
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#800C30] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:font-normal placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-[#800C30] hover:bg-cyan-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
