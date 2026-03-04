import React from 'react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { CheckCircle2, Calculator } from 'lucide-react';

interface MathResultProps {
  result: string;
  onReset: () => void;
}

export const MathResult: React.FC<MathResultProps> = ({ result, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200"
    >
      <div className="bg-zinc-900 p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Solution Found</h2>
            <p className="text-zinc-400 text-sm">Step-by-step breakdown</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
        >
          Solve Another
        </button>
      </div>

      <div className="p-8">
        <div className="markdown-body">
          <Markdown>{result}</Markdown>
        </div>
      </div>

      <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          <Calculator size={20} />
          Try Another Problem
        </button>
      </div>
    </motion.div>
  );
};
