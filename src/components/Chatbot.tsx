import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, User, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are "Alliance Assistant", the official friendly customer support AI bot for Alliance Freight (Pvt) Ltd.
Provide professional, polite, and accurate logistics answers. Keep answers brief (1-3 sentences max) to fit inside a small chat window.

Core Company Information:
- Address: No. 77, Sri Medhananda Mawatha, Moratuwa, Sri Lanka.
- Phone Support: 070 644 0992 | 076 736 7280.
- Email Support: imports@alliancefreightcmb.com.
- Core Services: Air Freight, Sea Freight (FCL/LCL), Road & Rail Freight, Customs Clearance & Brokerage.
- Specialized Cargo Handling:
  * Project Cargo: Heavy lift, Out of Gauge (OOG) shipping, custom industrial routes.
  * Pharmaceutical Cargo: Cold-chain logistics, strict temperature control, medical grade.
  * Hazardous Cargo: Dangerous goods class 1-9 handling, compliance certification.
- 24/7 Operations: We run constant tracking and dispatch support.

If asked about tracking, guide the user to the "/tracking" page.
If asked about rates or quote requests, guide the user to click the "Get a Quote" button on the website.
Do not invent facts or promise exact delivery rates without verification. Always remain polite and elite.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your Alliance Assistant. How can I help you with your global shipping, cargo tracking, or logistics needs today? 🌐',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      // Elegant facts-based fallback answer if API Key is not set or configured
      setTimeout(() => {
        let reply = "I'd be glad to assist you! For quick help, you can track packages on our /tracking page or get a quote. You can also reach our team directly at imports@alliancefreightcmb.com or 070 644 0992.";

        const lowered = userMessage.toLowerCase();
        if (lowered.includes('track') || lowered.includes('where') || lowered.includes('status')) {
          reply = "You can track your shipment live using our online Tracking Page! Just select your courier (DHL, FedEx, UPS, etc.) and enter your tracking number there.";
        } else if (lowered.includes('quote') || lowered.includes('price') || lowered.includes('rate') || lowered.includes('cost')) {
          reply = "To get an accurate shipping rate, please use the 'Get a Quote' button at the top of our homepage. Our team will prepare a custom proposal for you!";
        } else if (lowered.includes('contact') || lowered.includes('phone') || lowered.includes('number') || lowered.includes('email')) {
          reply = "You can contact our support team 24/7 at imports@alliancefreightcmb.com, or call us at 070 644 0992 or 076 736 7280.";
        } else if (lowered.includes('address') || lowered.includes('where are you') || lowered.includes('location')) {
          reply = "Our main office is located at No. 77, Sri Medhananda Mawatha, Moratuwa, Sri Lanka. You are welcome to visit us!";
        } else if (lowered.includes('pharma') || lowered.includes('temperature') || lowered.includes('medical')) {
          reply = "Yes! We specialize in pharmaceutical cargo with dedicated cold-chain tracking and strict temperature compliance control.";
        } else if (lowered.includes('hazard') || lowered.includes('dangerous') || lowered.includes('chemical')) {
          reply = "Yes, we handle dangerous goods and hazardous cargo class 1-9 with full regulatory compliance and customs clearance support.";
        } else if (lowered.includes('heavy') || lowered.includes('project') || lowered.includes('industrial')) {
          reply = "Our specialized project cargo division manages OOG (Out of Gauge) shipping, heavy machinery transport, and custom routes.";
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}`,
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
      // Direct catch fallback reply
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having a brief connection issue, but you can reach our 24/7 hotline at 070 644 0992 or email imports@alliancefreightcmb.com for instant cargo support!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[999] select-none">
      {/* Floating launcher button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-r from-blue-700 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-cyan-500/30 transition-all border border-white/20 relative group"
      >
        <span className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageSquare className="w-6 h-6 relative z-10" />}
      </motion.button>

      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-18 right-0 w-[340px] sm:w-[380px] h-[500px] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col"
          >
            {/* Header info */}
            <div className="bg-[#0B2545] p-5 text-white flex items-center justify-between border-b border-white/10 relative overflow-hidden shrink-0">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">Alliance Assistant</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Support Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Support mini cards */}
            <div className="bg-white/40 border-b border-gray-100 p-3 flex gap-2 justify-around text-[10px] text-gray-500 font-bold shrink-0">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-600" /> 070 644 0992
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-600" /> imports@alliancefreightcmb.com
              </div>
            </div>

            {/* Message bubble list area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-[#0B2545] text-white flex items-center justify-center shrink-0 shadow-sm border border-cyan-500/20">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${msg.role === 'user'
                        ? 'bg-[#0B2545] text-white rounded-tr-none'
                        : 'bg-white text-[#0B2545] border border-gray-200/50 rounded-tl-none'
                      }`}
                  >
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
                  <div className="w-7 h-7 rounded-lg bg-[#0B2545] text-white flex items-center justify-center shrink-0">
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

            {/* Input message form footer */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about shipping, tracking, or services..."
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#0B2545] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:font-normal placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-[#0B2545] hover:bg-cyan-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
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
