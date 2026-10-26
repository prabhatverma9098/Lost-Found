import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const { chatMessages, sendChatMessage, user } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickAction = (action: string) => {
    if (action.startsWith('/')) {
      navigate(action);
    } else {
      sendChatMessage(action);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat Window Card matching reference panel 9 */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex-1 flex flex-col overflow-hidden">
        {/* Header matching reference panel 9 */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            {/* Robot AI Icon matching reference */}
            <div className="w-10 h-10 rounded-xl bg-[#0866E8] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
                <span>Campus Assistant (AI)</span>
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-emerald-700">Online</span>
                <span className="text-slate-300">•</span>
                <span>Supports English & Hinglish</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              AKS University AI Model
            </span>
          </div>
        </div>

        {/* Message Stream matching reference panel 9 */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#F8FAFC]">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                  isUser ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isUser
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-[#0866E8] text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2.5">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-line ${
                      isUser
                        ? 'bg-[#0866E8] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-[#E2E8F0] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Quick suggested action buttons matching reference panel 9 */}
                  {!isUser && msg.quickButtons && msg.quickButtons.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.quickButtons.map((btn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickAction(btn.action)}
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#EAF3FF] text-[#0866E8] text-xs font-semibold border border-blue-200 shadow-xs hover:border-[#0866E8] transition-all flex items-center gap-1.5"
                        >
                          <span>{btn.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`text-[10px] text-slate-400 block ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions Bar */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Suggested:</span>
          {[
            'Mera ID card kho gaya hai, kya karu?',
            'How to claim a found iPhone?',
            'Where is the Security Office located?',
            'Can I report a found smartwatch?'
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendChatMessage(prompt)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar matching reference panel 9 */}
        <div className="p-4 bg-white border-t border-[#E2E8F0]">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0866E8]/20 focus:border-[#0866E8] text-sm text-slate-900 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-xl bg-[#0866E8] hover:bg-[#0652ba] disabled:opacity-40 text-white font-semibold transition-all shadow-xs flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
