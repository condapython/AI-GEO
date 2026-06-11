import { motion } from 'framer-motion';
import { useState } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { analyzeGEOVisibility } from '../../utils/api';

export function AnalysisTool({ onAnalysisComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    url: '',
    strategy: 'Comprehensive',
    apiKey: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    setIsAnalyzing(true);
    
    // Call API
    try {
      const results = await analyzeGEOVisibility(formData);
      onAnalysisComplete(results);
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="analysis-tool" className="relative w-full min-h-screen flex items-center justify-center py-24 z-20 pointer-events-auto">
      <div className="max-w-4xl mx-auto px-4 w-full">
        
        {!isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            style={{ perspective: "1000px" }}
          >
            <GlassCard className="p-8 md:p-12 border-primary/30 shadow-[0_0_50px_rgba(0,229,255,0.1)]">
              <h2 className="text-3xl font-display font-bold mb-2">Analyze Your AI Visibility</h2>
              <p className="text-textSecondary mb-8">Enter your business details to run a generative engine analysis.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Business Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-background/50 border border-borderBase rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g., Acme Corp"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Industry</label>
                    <input 
                      type="text" 
                      className="w-full bg-background/50 border border-borderBase rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g., SaaS, Retail, Healthcare"
                      value={formData.industry}
                      onChange={e => setFormData({...formData, industry: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Website URL</label>
                    <input 
                      type="url" 
                      className="w-full bg-background/50 border border-borderBase rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-all"
                      placeholder="https://"
                      value={formData.url}
                      onChange={e => setFormData({...formData, url: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">GEO Optimization Strategy</label>
                    <select 
                      className="w-full bg-background/50 border border-borderBase rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-all"
                      value={formData.strategy}
                      onChange={e => setFormData({...formData, strategy: e.target.value})}
                    >
                      <option value="Comprehensive">Comprehensive (Combined)</option>
                      <option value="Answer-First">Answer-First (Best for direct answers)</option>
                      <option value="Cite-Sources">Cite-Sources (Link to high-authority sites)</option>
                      <option value="Data-Backed">Data-Backed (Rich in statistics/numbers)</option>
                      <option value="Simple & Fluent">Simple & Fluent (Conversational search)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Gemini API Key (Optional)</label>
                    <input 
                      type="password" 
                      className="w-full bg-background/50 border border-borderBase rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-all"
                      placeholder="If empty, server key is used"
                      value={formData.apiKey}
                      onChange={e => setFormData({...formData, apiKey: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Core Offering / Description</label>
                  <textarea 
                    className="w-full bg-background/50 border border-borderBase rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-all min-h-[100px]"
                    placeholder="Briefly describe what you do..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-primary text-background font-bold rounded-lg shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all uppercase tracking-widest mt-4"
                >
                  Run Deep Analysis
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <div className="w-24 h-24 border-4 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/10 rounded-full animate-spin"></div>
            <h3 className="text-2xl font-display font-bold text-glow text-primary">Scanning LLM Networks...</h3>
            <div className="space-y-2 text-center text-textSecondary font-mono text-sm">
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}>Initializing Anthropic Claude pipeline...</motion.p>
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}>Querying semantic knowledge graphs...</motion.p>
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}>Synthesizing visibility score...</motion.p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
