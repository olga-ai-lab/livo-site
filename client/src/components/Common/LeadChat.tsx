import React, { useState, useRef, useEffect } from 'react';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { Send, Bot, User, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  type?: 'text' | 'options' | 'input';
  options?: string[];
  inputType?: string;
}

interface LeadChatProps {
  brand: 'livonius' | 'livo';
  productName: string;
}

export const LeadChat: React.FC<LeadChatProps> = ({ brand, productName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLivonius = brand === 'livonius';
  const brandColor = isLivonius ? '#056677' : '#0284C7';
  const brandBg = isLivonius ? 'bg-[#056677]' : 'bg-[#0284C7]';

  const steps = [
    {
      text: `Olá! Sou o assistente virtual da ${isLivonius ? 'Livonius' : 'Livo MGA'}. Gostaria de uma cotação personalizada para ${productName}?`,
      type: 'options',
      options: ['Sim, quero cotar', 'Tenho uma dúvida']
    },
    {
      text: 'Ótimo! Para começar, qual é o seu nome completo?',
      type: 'input',
      inputType: 'text'
    },
    {
      text: 'Prazer! E qual é o nome da sua empresa?',
      type: 'input',
      inputType: 'text'
    },
    {
      text: 'Perfeito. Qual é o seu melhor e-mail para contato?',
      type: 'input',
      inputType: 'email'
    },
    {
      text: 'Entendido. Um de nossos especialistas entrará em contato em breve com uma proposta sob medida. Obrigado!',
      type: 'text'
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(steps[0]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (step: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: step.text,
      sender: 'bot',
      type: step.type,
      options: step.options,
      inputType: step.inputType
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUserResponse = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot thinking
    setTimeout(() => {
      const nextStepIndex = currentStep + 1;
      if (nextStepIndex < steps.length) {
        setCurrentStep(nextStepIndex);
        addBotMessage(steps[nextStepIndex]);
      }
    }, 1000);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleUserResponse(inputValue);
    setInputValue('');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${brandBg} text-white shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <MessageSquare />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col max-h-[600px]"
          >
            {/* Header */}
            <div className={`${brandBg} p-4 text-white flex items-center gap-3`}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistente Virtual</h3>
                <p className="text-xs opacity-80">Online agora</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 min-h-[300px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? `${brandBg} text-white rounded-br-none`
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Options */}
              {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].type === 'options' && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {messages[messages.length - 1].options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleUserResponse(option)}
                      className={`text-xs px-3 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].type === 'input' && (
              <form onSubmit={handleInputSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                  type={messages[messages.length - 1].inputType || 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua resposta..."
                  className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#056677]"
                  autoFocus
                />
                <button
                  type="submit"
                  className={`p-2 rounded-md ${brandBg} text-white hover:opacity-90 transition-opacity`}
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
