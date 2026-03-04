import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera as CameraIcon, Upload, Calculator, Loader2, Sparkles, Image as ImageIcon, X as XIcon } from 'lucide-react';
import { Camera } from './components/Camera';
import { MathResult } from './components/MathResult';
import { solveMathProblem } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (base64Image: string) => {
    setIsCameraOpen(false);
    setImage(base64Image);
    processImage(base64Image);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Image: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const solution = await solveMathProblem(base64Image, 'image/jpeg');
      setResult(solution);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
            <Calculator size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900">CALLCAM</h1>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-zinc-500">
          <span>Snap</span>
          <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
          <span>Solve</span>
          <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
          <span>Learn</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!image && !isLoading && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} />
                  AI Powered Math Solver
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-zinc-900 leading-[0.9] tracking-tighter">
                  Math problems solved in a <span className="text-emerald-600">snap.</span>
                </h2>
                <p className="text-zinc-600 text-lg max-w-md">
                  Struggling with homework? Just take a photo of your math problem and get instant step-by-step solutions.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 group"
                  >
                    <CameraIcon className="group-hover:scale-110 transition-transform" />
                    Open Camera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white text-zinc-900 border-2 border-zinc-200 rounded-2xl font-bold hover:border-zinc-900 transition-all"
                  >
                    <Upload size={20} />
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[40px] blur-3xl"></div>
                <div className="relative bg-white p-4 rounded-[32px] shadow-2xl border border-zinc-100 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://picsum.photos/seed/math/800/1000"
                    alt="Math Example"
                    className="rounded-[20px] w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-zinc-900 text-white p-6 rounded-2xl shadow-xl max-w-[200px] -rotate-6">
                    <p className="text-xs font-mono opacity-50 mb-2">SOLVING...</p>
                    <p className="text-sm font-medium">"Find the derivative of f(x) = x² + 3x..."</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-zinc-200 rounded-full"></div>
                <div className="absolute inset-0 w-24 h-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calculator className="text-zinc-900" size={32} />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-zinc-900">Analyzing Problem</h3>
                <p className="text-zinc-500">Our AI is crunching the numbers...</p>
              </div>
              {image && (
                <div className="mt-4 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img src={image} alt="Processing" className="w-full h-full object-cover opacity-50" />
                </div>
              )}
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-red-50 p-8 rounded-3xl border border-red-100 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <XIcon size={32} />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={reset}
                className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {result && !isLoading && (
            <MathResult result={result} onReset={reset} />
          )}
        </AnimatePresence>
      </main>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <Camera
            onCapture={handleCapture}
            onClose={() => setIsCameraOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="p-8 text-center text-zinc-400 text-sm">
        <p>© 2024 CALLCAM. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
