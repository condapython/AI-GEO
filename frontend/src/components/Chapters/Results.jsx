import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreRing } from '../UI/ScoreRing';
import { GlassCard } from '../UI/GlassCard';
import { 
  Copy, Check, Send, Sparkles, Code, FileText, HelpCircle, 
  ChevronDown, ChevronUp, AlertCircle, RefreshCw 
} from 'lucide-react';
import { publishGEOAssets } from '../../utils/api';

export function Results({ data }) {
  if (!data) return null;

  const [activeTab, setActiveTab] = useState('summary');
  const [copiedStates, setCopiedStates] = useState({});
  const [openFaqIdx, setOpenFaqIdx] = useState({});
  
  // Publishing form state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState(null); // 'success' | 'error'
  const [publishMessage, setPublishMessage] = useState('');

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const toggleFaq = (idx) => {
    setOpenFaqIdx(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!webhookUrl) return;

    setIsPublishing(true);
    setPublishStatus(null);
    setPublishMessage('');

    const payload = {
      business_name: data.business_name || 'Apex Solutions',
      answer_first_summary: data.answer_first_summary,
      structured_content: data.structured_content,
      json_ld_schema: data.json_ld_schema,
      suggested_faqs: data.suggested_faqs,
      score: data.score
    };

    try {
      await publishGEOAssets(webhookUrl, authToken, payload);
      setPublishStatus('success');
      setPublishMessage('Successfully published and deployed assets to CMS webhook!');
    } catch (err) {
      setPublishStatus('error');
      setPublishMessage(err.message || 'Failed to publish to webhook.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Safe lightweight markdown parser for clean UI rendering without bloated libraries
  const renderMarkdown = (md) => {
    if (!md) return null;
    return md.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return <h4 key={idx} className="text-lg font-bold text-primary mt-4 mb-2">{trimmed.replace('### ', '')}</h4>;
      }
      if (trimmed.startsWith('## ')) {
        return <h3 key={idx} className="text-xl font-bold text-textPrimary mt-6 mb-3 border-b border-borderBase pb-1">{trimmed.replace('## ', '')}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        return <li key={idx} className="list-disc ml-6 text-textSecondary mb-1">{trimmed.replace('- ', '')}</li>;
      }
      if (trimmed === '') return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-textSecondary mb-2 leading-relaxed text-sm md:text-base">{trimmed}</p>;
    });
  };

  return (
    <section className="relative w-full min-h-screen py-24 z-20 pointer-events-auto bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-textPrimary mb-4">GEO Analysis Results</h2>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            Interactive report generated in real-time from Gemini analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Score */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <ScoreRing score={data.score} size={240} />
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="mt-6 text-center"
            >
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-2
                ${data.score >= 80 ? 'bg-success/20 text-success' : data.score >= 50 ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'}`}>
                Grade: {data.grade}
              </span>
            </motion.div>
          </div>

          {/* Summary & Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard delay={0.2} className="p-6">
              <h3 className="text-lg font-mono text-primary mb-2 uppercase tracking-widest flex items-center">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                Executive Summary
              </h3>
              <p className="text-textPrimary leading-relaxed">{data.summary}</p>
            </GlassCard>
            
            <div className="grid grid-cols-3 gap-4">
              <GlassCard delay={0.4} className="p-4 text-center">
                <div className="text-3xl font-mono font-bold text-textPrimary">{data.metrics?.mentionRate ?? 0}%</div>
                <div className="text-xs text-textSecondary uppercase mt-1">Mention Rate</div>
              </GlassCard>
              <GlassCard delay={0.5} className="p-4 text-center">
                <div className="text-3xl font-mono font-bold text-textPrimary">{data.metrics?.authorityScore ?? 0}</div>
                <div className="text-xs text-textSecondary uppercase mt-1">Authority</div>
              </GlassCard>
              <GlassCard delay={0.6} className="p-4 text-center">
                <div className="text-3xl font-mono font-bold text-textPrimary">{data.metrics?.contentDepth ?? 0}%</div>
                <div className="text-xs text-textSecondary uppercase mt-1">Content Depth</div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Query Simulator */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-textPrimary mb-6 flex items-center">
            <span className="w-8 h-[2px] bg-primary mr-4"></span>
            Simulated AI Responses
          </h3>
          <div className="space-y-4">
            {data.queries?.map((q, i) => (
              <GlassCard key={i} delay={0.7 + i * 0.1} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <p className="text-textSecondary italic mb-2">"{q.query}"</p>
                    <p className="text-textPrimary font-medium border-l-2 border-borderBase pl-4 py-1">
                      {q.response}
                    </p>
                  </div>
                  <div className="md:w-48 flex flex-col justify-center">
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-textSecondary">Visibility</span>
                      <span className={q.visibility >= 60 ? 'text-success' : q.visibility >= 30 ? 'text-warning' : 'text-danger'}>
                        {q.visibility}%
                      </span>
                    </div>
                    <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${q.visibility}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 1 + i * 0.1 }}
                        className={`h-full ${q.visibility >= 60 ? 'bg-success' : q.visibility >= 30 ? 'bg-warning' : 'bg-danger'}`}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-textPrimary mb-6 flex items-center">
            <span className="w-8 h-[2px] bg-secondary mr-4"></span>
            Optimization Roadmap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recommendations?.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotateY: 90 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                style={{ perspective: 1000 }}
              >
                <div className="h-full bg-surface border border-borderBase rounded-xl p-6 relative overflow-hidden border-l-4" style={{ borderLeftColor: rec.priority === 'High' ? '#EF4444' : rec.priority === 'Medium' ? '#F59E0B' : '#10B981' }}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg text-textPrimary">{rec.title}</h4>
                    <span className="text-xs px-2 py-1 bg-background rounded text-textSecondary font-mono">{rec.priority}</span>
                  </div>
                  <p className="text-textSecondary text-sm">{rec.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* GEO Generated Assets Dashboard */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-textPrimary mb-6 flex items-center">
            <span className="w-8 h-[2px] bg-primary mr-4"></span>
            GEO Optimized Content Assets
          </h3>
          
          <GlassCard className="overflow-hidden border-primary/20">
            {/* Tabs Headers */}
            <div className="flex flex-wrap border-b border-borderBase bg-background/50">
              <button 
                onClick={() => setActiveTab('summary')}
                className={`flex items-center px-6 py-4 font-display font-bold text-sm tracking-wider uppercase transition-all border-b-2
                  ${activeTab === 'summary' ? 'border-primary text-primary bg-surface/50' : 'border-transparent text-textSecondary hover:text-textPrimary hover:bg-surface/30'}`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Answer-First
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`flex items-center px-6 py-4 font-display font-bold text-sm tracking-wider uppercase transition-all border-b-2
                  ${activeTab === 'content' ? 'border-primary text-primary bg-surface/50' : 'border-transparent text-textSecondary hover:text-textPrimary hover:bg-surface/30'}`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Structured Body
              </button>
              <button 
                onClick={() => setActiveTab('schema')}
                className={`flex items-center px-6 py-4 font-display font-bold text-sm tracking-wider uppercase transition-all border-b-2
                  ${activeTab === 'schema' ? 'border-primary text-primary bg-surface/50' : 'border-transparent text-textSecondary hover:text-textPrimary hover:bg-surface/30'}`}
              >
                <Code className="w-4 h-4 mr-2" />
                JSON-LD Schema
              </button>
              <button 
                onClick={() => setActiveTab('faqs')}
                className={`flex items-center px-6 py-4 font-display font-bold text-sm tracking-wider uppercase transition-all border-b-2
                  ${activeTab === 'faqs' ? 'border-primary text-primary bg-surface/50' : 'border-transparent text-textSecondary hover:text-textPrimary hover:bg-surface/30'}`}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Conversational FAQs
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 md:p-8 bg-surface/40 min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === 'summary' && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold">💡 Optimization Tip</span>
                      <p className="text-textSecondary text-xs mt-1">
                        Place this paragraph at the absolute top of your page. AI search engine crawlers scan top-down and prioritize structured, direct direct answers.
                      </p>
                    </div>

                    <div className="bg-background/80 border border-borderBase rounded-xl p-6 relative">
                      <p className="text-textPrimary text-base md:text-lg leading-relaxed italic">
                        {data.answer_first_summary}
                      </p>
                      <button 
                        onClick={() => copyToClipboard(data.answer_first_summary, 'summary')}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-surface hover:bg-primary/20 text-textSecondary hover:text-primary transition-all border border-borderBase"
                      >
                        {copiedStates['summary'] ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'content' && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold">💡 Optimization Tip</span>
                      <p className="text-textSecondary text-xs mt-1">
                        Replace or augment your primary services page body with this rewritten markdown structure. It features high entity density and logical H2/H3 syntax.
                      </p>
                    </div>

                    <div className="bg-background/80 border border-borderBase rounded-xl p-6 relative max-h-[400px] overflow-y-auto">
                      <div className="prose prose-invert max-w-none">
                        {renderMarkdown(data.structured_content)}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(data.structured_content, 'content')}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-surface hover:bg-primary/20 text-textSecondary hover:text-primary transition-all border border-borderBase"
                      >
                        {copiedStates['content'] ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'schema' && (
                  <motion.div
                    key="schema"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold">💡 Optimization Tip</span>
                      <p className="text-textSecondary text-xs mt-1">
                        Inject this JSON-LD schema markup inside the <code>&lt;head&gt;</code> tags of your website. AI indexers read this first to build factual links.
                      </p>
                    </div>

                    <div className="bg-background/80 border border-borderBase rounded-xl p-6 relative font-mono text-sm overflow-x-auto">
                      <pre className="text-textPrimary text-xs leading-relaxed text-left">
                        {JSON.stringify(data.json_ld_schema, null, 2)}
                      </pre>
                      <button 
                        onClick={() => copyToClipboard(JSON.stringify(data.json_ld_schema, null, 2), 'schema')}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-surface hover:bg-primary/20 text-textSecondary hover:text-primary transition-all border border-borderBase"
                      >
                        {copiedStates['schema'] ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'faqs' && (
                  <motion.div
                    key="faqs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold">💡 Optimization Tip</span>
                      <p className="text-textSecondary text-xs mt-1">
                        Incorporate these conversational Q&A blocks into a dedicated FAQ section to capture conversational AI search queries.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {data.suggested_faqs?.map((faq, idx) => (
                        <div key={idx} className="border border-borderBase rounded-xl bg-background/50 overflow-hidden">
                          <button 
                            onClick={() => toggleFaq(idx)}
                            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-surface/30 transition-all"
                          >
                            <span className="font-bold text-textPrimary text-sm md:text-base">{faq.question}</span>
                            {openFaqIdx[idx] ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-textSecondary" />}
                          </button>
                          
                          {openFaqIdx[idx] && (
                            <div className="px-6 py-4 border-t border-borderBase bg-surface/10 relative">
                              <p className="text-textSecondary text-sm md:text-base leading-relaxed pr-10">
                                {faq.answer}
                              </p>
                              <button 
                                onClick={() => copyToClipboard(`Q: ${faq.question}\nA: ${faq.answer}`, `faq_${idx}`)}
                                className="absolute bottom-4 right-4 p-1.5 rounded bg-surface hover:bg-primary/20 text-textSecondary hover:text-primary transition-all border border-borderBase"
                              >
                                {copiedStates[`faq_${idx}`] ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* Automated Deployment Pipeline Panel */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-textPrimary mb-6 flex items-center">
            <span className="w-8 h-[2px] bg-secondary mr-4"></span>
            Automate Deployment Pipeline
          </h3>
          
          <GlassCard className="p-6 md:p-8 border-secondary/20">
            <h4 className="text-lg font-bold mb-2">CMS Webhook Integration</h4>
            <p className="text-textSecondary text-sm mb-6">
              Connect this optimizer directly to your website. We will push the Answer-First summary, structured markdown, JSON-LD schema, and FAQs to your endpoint (e.g., Zapier hook, Make automation, Webflow, or custom CMS server).
            </p>
            
            <form onSubmit={handlePublish} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-textSecondary uppercase tracking-widest mb-2 font-bold">Webhook endpoint URL</label>
                  <input 
                    type="url" 
                    required
                    className="w-full bg-background/50 border border-borderBase rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-all text-sm"
                    placeholder="https://hooks.zapier.com/..."
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-textSecondary uppercase tracking-widest mb-2 font-bold">Authorization Token (Optional)</label>
                  <input 
                    type="password" 
                    className="w-full bg-background/50 border border-borderBase rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-all text-sm"
                    placeholder="Bearer token or API secret"
                    value={authToken}
                    onChange={e => setAuthToken(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={isPublishing || !webhookUrl}
                  className="px-6 py-3 bg-secondary text-textPrimary font-bold rounded-lg shadow-[0_0_20px_rgba(213,0,249,0.3)] hover:shadow-[0_0_30px_rgba(213,0,249,0.5)] transition-all uppercase tracking-widest text-xs flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Deploy Assets
                    </>
                  )}
                </button>
                
                {publishStatus && (
                  <div className={`flex items-center text-sm px-4 py-2 rounded-lg border ${
                    publishStatus === 'success' ? 'bg-success/15 border-success/30 text-success' : 'bg-danger/15 border-danger/30 text-danger'
                  }`}>
                    {publishStatus === 'success' ? <Check className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                    {publishMessage}
                  </div>
                )}
              </div>
            </form>
          </GlassCard>
        </div>

        <div className="mt-20 text-center pb-12">
          <button onClick={() => window.location.reload()} className="px-6 py-3 border border-borderBase text-textSecondary hover:text-primary hover:border-primary transition-all rounded-full font-mono text-sm">
            Restart Analysis
          </button>
        </div>
      </div>
    </section>
  );
}
