import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Settings, 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAvailableModels, testGeminiKey, updateAIConfig } from '../../services/ai';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AITester: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved API key
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      // Automatically test the saved key to populate models
      handleTestKey(savedKey);
    }
    
    const savedModel = localStorage.getItem('gemini_model_name');
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTestKey = async (keyToTest: string = apiKey) => {
    if (!keyToTest.trim()) return;
    
    setIsTestingKey(true);
    setKeyStatus('idle');
    setStatusMessage('Testing connection...');
    
    try {
      // Test by fetching models
      const result = await getAvailableModels(keyToTest);
      
      if (result.success && result.models.length > 0) {
        setModels(result.models);
        setKeyStatus('success');
        setStatusMessage(result.message);
        
        // Ensure selected model is in the list or set to the first one
        if (!result.models.includes(selectedModel)) {
          setSelectedModel(result.models[0]);
        }
        
        // Save valid key
        updateAIConfig(keyToTest, selectedModel);
      } else {
        setKeyStatus('error');
        setStatusMessage(result.message || 'Failed to fetch models.');
        setModels([]);
      }
    } catch (error: any) {
      setKeyStatus('error');
      setStatusMessage(error.message || 'An error occurred during testing.');
      setModels([]);
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    updateAIConfig(apiKey, newModel);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || !apiKey.trim() || isSending) return;
    
    const userMsg = chatInput;
    setChatInput('');
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsg
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsSending(true);
    
    try {
      const response = await testGeminiKey(apiKey, selectedModel, userMsg);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.success && response.reply ? response.reply : `Error: ${response.message}`
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Error: ${error.message || 'Failed to get response'}`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 z-50 flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1A1C24] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">AI Configuration</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                
                {/* API Key Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Google Gemini API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          setKeyStatus('idle');
                        }}
                        placeholder="AIzaSy..."
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                      <button
                        onClick={() => handleTestKey(apiKey)}
                        disabled={isTestingKey || !apiKey.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isTestingKey ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Test'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Status Message */}
                  <AnimatePresence>
                    {keyStatus !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                          keyStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                        >
                          {keyStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          {statusMessage}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Model Selection */}
                <AnimatePresence>
                  {models.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-4 border-t border-white/10"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Select Model
                        </label>
                        <div className="relative">
                          <select
                            value={selectedModel}
                            onChange={handleModelChange}
                            className="w-full appearance-none bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                          >
                            {models.map(model => (
                              <option key={model} value={model} className="bg-[#1A1C24]">{model}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Mini Chat Interface */}
                      <div className="mt-6 border border-white/10 rounded-xl bg-black/20 flex flex-col h-64 overflow-hidden">
                        <div className="p-3 bg-white/5 border-b border-white/10 flex items-center gap-2 text-sm font-medium text-gray-300">
                          <MessageSquare className="w-4 h-4 text-indigo-400" />
                          Test Chat
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                          {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-2">
                              <Bot className="w-8 h-8 opacity-50" />
                              <p>Send a message to test the AI.</p>
                            </div>
                          ) : (
                            messages.map(msg => (
                              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                  msg.sender === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                    : 'bg-white/10 text-gray-200 rounded-tl-sm'
                                }`}>
                                  {msg.text}
                                </div>
                              </div>
                            ))
                          )}
                          {isSending && (
                            <div className="flex justify-start">
                              <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2 text-sm text-gray-400 flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-2 border-t border-white/10 flex gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type a test message..."
                            className="flex-1 bg-transparent text-white px-3 py-2 text-sm focus:outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!chatInput.trim() || isSending}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-gray-700"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
