import { motion } from 'framer-motion';
import { ScoreRing } from '../UI/ScoreRing';
import { GlassCard } from '../UI/GlassCard';

export function Results({ data }) {
  if (!data) return null;

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
            Based on a simulation of Claude 3.5 Sonnet's knowledge graph.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
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
              <h3 className="text-lg font-mono text-primary mb-2 uppercase tracking-widest">Executive Summary</h3>
              <p className="text-textPrimary leading-relaxed">{data.summary}</p>
            </GlassCard>
            
            <div className="grid grid-cols-3 gap-4">
              <GlassCard delay={0.4} className="p-4 text-center">
                <div className="text-3xl font-mono font-bold text-textPrimary">{data.metrics.mentionRate}%</div>
                <div className="text-xs text-textSecondary uppercase mt-1">Mention Rate</div>
              </GlassCard>
              <GlassCard delay={0.5} className="p-4 text-center">
                <div className="text-3xl font-mono font-bold text-textPrimary">{data.metrics.authorityScore}</div>
                <div className="text-xs text-textSecondary uppercase mt-1">Authority</div>
              </GlassCard>
              <GlassCard delay={0.6} className="p-4 text-center">
                <div className="text-3xl font-mono font-bold text-textPrimary">{data.metrics.contentDepth}%</div>
                <div className="text-xs text-textSecondary uppercase mt-1">Content Depth</div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Query Simulator */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-textPrimary mb-6 flex items-center">
            <span className="w-8 h-[2px] bg-primary mr-4"></span>
            Simulated AI Responses
          </h3>
          <div className="space-y-4">
            {data.queries.map((q, i) => (
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
        <div>
          <h3 className="text-2xl font-display font-bold text-textPrimary mb-6 flex items-center">
            <span className="w-8 h-[2px] bg-secondary mr-4"></span>
            Optimization Roadmap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotateY: 90 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                style={{ perspective: 1000 }}
              >
                <div className="h-full bg-surface border border-borderBase rounded-xl p-6 relative overflow-hidden border-l-4" style={{ borderLeftColor: rec.priority === 'High' ? '#EF4444' : '#F59E0B' }}>
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

        <div className="mt-20 text-center pb-12">
          <button onClick={() => window.location.reload()} className="px-6 py-3 border border-borderBase text-textSecondary hover:text-primary hover:border-primary transition-all rounded-full font-mono text-sm">
            Restart Analysis
          </button>
        </div>
      </div>
    </section>
  );
}
