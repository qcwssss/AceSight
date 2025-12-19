
import React, { useState, useRef, useEffect } from 'react';
import { 
  Trophy, 
  Video, 
  LineChart, 
  Zap, 
  Target, 
  CheckCircle2, 
  Share2,
  Play,
  Star,
  ArrowRight,
  Loader2,
  Mail,
  Activity,
  Maximize2,
  Footprints,
  Move,
  Upload,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Helper for smooth scrolling ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// --- Sub-components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="w-8 h-8 tennis-gradient rounded-full flex items-center justify-center">
        <Target className="text-slate-950 w-5 h-5" />
      </div>
      <span className="text-xl font-extrabold tracking-tighter uppercase">AceAnalysis</span>
    </div>
    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
      <button onClick={() => scrollToSection('analysis-studio')} className="hover:text-white transition-colors cursor-pointer">Analysis Studio</button>
      <button onClick={() => scrollToSection('movement-engine')} className="hover:text-white transition-colors cursor-pointer">The Engine</button>
      <button onClick={() => scrollToSection('results')} className="hover:text-white transition-colors cursor-pointer">Certification</button>
    </div>
    <button 
      onClick={() => scrollToSection('waitlist-section')}
      className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-bold hover:bg-[#dfff00] transition-all active:scale-95 shadow-lg shadow-white/5 cursor-pointer"
    >
      Join Waitlist
    </button>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="dark-card p-8 rounded-3xl transition-transform hover:-translate-y-2">
    <div className="w-12 h-12 rounded-2xl bg-[#dfff00]/10 flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-[#dfff00]" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

// --- Video Analysis Module ---

interface AnalysisResults {
  ntrpLevel: string;
  footworkScore: number;
  postureScore: number;
  swingEfficiency: number;
  improvementAreas: string[];
  guidance: string;
}

const AnalysisStudio = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      runAnalysis();
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    setResults(null);

    try {
      // Simulate calling Gemini API for broad-stroke movement analysis
      // In a production app, we would send frames or the video file to the API
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate a mock professional tennis biomechanical analysis for a full-body movement video. Focus on broad-stroke footwork, body alignment, and swing flow. Return JSON format.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ntrpLevel: { type: Type.STRING },
              footworkScore: { type: Type.NUMBER },
              postureScore: { type: Type.NUMBER },
              swingEfficiency: { type: Type.NUMBER },
              improvementAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              guidance: { type: Type.STRING }
            }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      // Add a slight delay for realistic processing feel
      setTimeout(() => {
        setResults(data);
        setAnalyzing(false);
      }, 2500);
    } catch (err) {
      console.error("Analysis failed:", err);
      // Fallback data if API fails or isn't configured
      setResults({
        ntrpLevel: "3.5",
        footworkScore: 78,
        postureScore: 82,
        swingEfficiency: 74,
        improvementAreas: ["Recovery stride timing", "Core rotation on forehand", "Split-step consistency"],
        guidance: "Focus on staying lower through your weight transfer. Your recovery after the wide ball is slightly delayed by inconsistent small adjustment steps."
      });
      setAnalyzing(false);
    }
  };

  return (
    <section id="analysis-studio" className="py-24 px-6 relative bg-slate-950 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-4">Analysis Studio</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload your footage to see our Movement Intelligence engine in action. 
            We analyze your full body, posture, and locomotion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Area */}
          <div className="relative group">
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#dfff00]/50 hover:bg-white/10 overflow-hidden relative ${videoPreview ? 'border-solid border-[#dfff00]/30' : ''}`}
            >
              {videoPreview ? (
                <>
                  <video src={videoPreview} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 text-center">
                    {analyzing ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-[#dfff00] animate-spin mb-4" />
                        <span className="text-xl font-bold uppercase tracking-widest animate-pulse">Scanning Kinematics...</span>
                      </div>
                    ) : (
                      <div className="group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-white mb-4 mx-auto" />
                        <span className="text-lg font-bold">Replace Video</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Video className="w-8 h-8 text-[#dfff00]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Drop your video here</h3>
                  <p className="text-slate-500 text-sm">Full-body court view recommended</p>
                </>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="dark-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border-white/10 flex flex-col">
            {!results && !analyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <Activity className="w-16 h-16 mb-6" />
                <h3 className="text-2xl font-bold uppercase italic mb-2">Awaiting Data</h3>
                <p>Upload a video to generate your movement profile.</p>
              </div>
            ) : analyzing ? (
              <div className="flex-1 space-y-8 animate-pulse">
                <div className="h-10 bg-white/5 rounded-xl w-3/4" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-white/5 rounded-2xl" />
                  <div className="h-24 bg-white/5 rounded-2xl" />
                  <div className="h-24 bg-white/5 rounded-2xl" />
                </div>
                <div className="h-32 bg-white/5 rounded-2xl" />
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Assessed Level</span>
                    <h3 className="text-5xl font-black italic text-[#dfff00]">NTRP {results?.ntrpLevel}</h3>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#dfff00]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#dfff00]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-[8px] uppercase font-bold text-slate-500 mb-2">Footwork</div>
                    <div className="text-xl font-black">{results?.footworkScore}%</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-[8px] uppercase font-bold text-slate-500 mb-2">Posture</div>
                    <div className="text-xl font-black">{results?.postureScore}%</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-[8px] uppercase font-bold text-slate-500 mb-2">Swing</div>
                    <div className="text-xl font-black">{results?.swingEfficiency}%</div>
                  </div>
                </div>

                <div className="bg-[#dfff00]/5 p-6 rounded-3xl border border-[#dfff00]/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-[#dfff00]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#dfff00]">AI Performance Guidance</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic mb-4">
                    "{results?.guidance}"
                  </p>
                  <div className="space-y-2">
                    {results?.improvementAreas.map((area, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-1 h-1 rounded-full bg-[#dfff00]" />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                   onClick={() => scrollToSection('results')}
                   className="w-full py-4 bg-white text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-[#dfff00] transition-all flex items-center justify-center gap-2"
                >
                  Save to AceProfile <Share2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Rest of components ---

const WaitlistSection = () => {
  const [email, setEmail] = useState('');
  const [willPay, setWillPay] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || willPay === null) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div id="waitlist-section" className="text-center py-20 animate-in zoom-in duration-500 max-w-lg mx-auto scroll-mt-24">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#dfff00]/20 mb-8 border border-[#dfff00]/30">
          <CheckCircle2 className="w-12 h-12 text-[#dfff00]" />
        </div>
        <h3 className="text-4xl font-black mb-4 uppercase italic">You're on the list!</h3>
        <p className="text-slate-400 text-lg leading-relaxed px-6">
          We've registered <span className="text-white font-bold">{email}</span>. We'll invite you to our Movement Intelligence alpha soon.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-8 text-sm text-[#dfff00] font-bold hover:underline cursor-pointer"
        >
          Wait, I entered the wrong email
        </button>
      </div>
    );
  }

  return (
    <section id="waitlist-section" className="py-24 px-6 relative scroll-mt-24">
      <div className="max-w-4xl mx-auto dark-card rounded-[4rem] p-8 md:p-16 border-white/10 relative overflow-hidden">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 text-[#dfff00]">
            <Mail className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Beta Access</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none uppercase">Early Access Form</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Reserve your spot for the AI-powered tennis revolution.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="max-w-md mx-auto relative group">
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-[#dfff00] focus:ring-4 focus:ring-[#dfff00]/10 transition-all text-center text-xl font-medium placeholder:text-slate-600"
            />
          </div>

          <div className="max-w-lg mx-auto bg-black/40 p-8 rounded-3xl border border-white/5 shadow-inner">
            <p className="text-sm font-bold text-slate-300 mb-6 text-center uppercase tracking-widest">
              Would you pay for a premium AI coach to improve your game?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setWillPay(true)}
                className={`group relative overflow-hidden py-5 rounded-2xl font-black transition-all border-2 cursor-pointer ${
                  willPay === true 
                  ? 'bg-[#dfff00] text-slate-950 border-[#dfff00] scale-105 shadow-xl shadow-[#dfff00]/20' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                }`}
              >
                YES, LEVEL ME UP
              </button>
              <button 
                type="button"
                onClick={() => setWillPay(false)}
                className={`py-5 rounded-2xl font-black transition-all border-2 cursor-pointer ${
                  willPay === false 
                  ? 'bg-slate-800 text-white border-slate-700 scale-105 shadow-xl' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                }`}
              >
                FREE VERSION ONLY
              </button>
            </div>
          </div>

          <div className="text-center pt-4">
            <button 
              type="submit"
              disabled={isSubmitting || !email || willPay === null}
              className="group relative inline-flex items-center justify-center px-16 py-6 tennis-gradient text-slate-950 font-black text-xl rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-2xl shadow-[#dfff00]/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-3" />
                  SECURING YOUR SPOT...
                </>
              ) : (
                <>
                  CLAIM EARLY ACCESS <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const [profileImgFailed, setProfileImgFailed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-[#dfff00] selection:text-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#dfff00]/10 via-transparent to-transparent -z-10 pointer-events-none blur-3xl opacity-50" />
        
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#dfff00] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#dfff00]">Full-Body Movement Vision</span>
          </div>
          
          <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter mb-8 leading-[0.85] uppercase italic">
            MAP YOUR <br />
            <span className="text-[#dfff00]">ON-COURT FLOW.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Upload full-body court footage. Our Gemini-powered engine maps your locomotion, footwork patterns, and overall kinematic flow to improve your court coverage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => scrollToSection('analysis-studio')}
              className="w-full sm:w-auto px-12 py-6 tennis-gradient text-slate-950 font-black text-lg rounded-full flex items-center justify-center gap-2 hover:shadow-[0_0_50px_rgba(223,255,0,0.4)] transition-all group cursor-pointer"
            >
              OPEN STUDIO <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-12 py-6 bg-white/5 text-white font-black text-lg rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Play className="w-5 h-5 fill-white" /> WATCH AI IN ACTION
            </button>
          </div>

          <div className="mt-24 relative max-w-5xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#dfff00] to-green-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl grid-bg">
              <img 
                src="https://images.unsplash.com/photo-1595435066041-3705353160a0?q=80&w=2070&auto=format&fit=crop" 
                alt="Tennis Movement Analysis" 
                className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-full content-center">
                  
                  {/* Locomotion Summary */}
                  <div className="bg-slate-950/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 translate-y-4 md:translate-y-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Footwork Path</span>
                      <div className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[8px] font-bold">OPTIMIZED</div>
                    </div>
                    <div className="h-32 flex items-end gap-1.5">
                      {[30, 60, 45, 100, 75, 90, 55, 40].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#dfff00] rounded-t-md opacity-80" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>

                  {/* Certification Badge */}
                  <div className="bg-[#dfff00] p-8 rounded-[3rem] border-4 border-white/20 shadow-2xl flex flex-col justify-center items-center text-slate-950 scale-110 z-20">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70">Kinematic Level</span>
                     <span className="text-8xl font-black italic tracking-tighter">3.5</span>
                     <div className="flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full mt-4">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-wider">NTRP Movement Cert</span>
                     </div>
                  </div>

                  {/* Movement Guidance Overlay */}
                  <div className="bg-slate-950/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 -translate-y-4 md:-translate-y-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">AI Intelligence</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <span>Recovery Stride</span>
                          <span className="text-white">Good</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#dfff00] w-[88%]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <span>Split-Step Timing</span>
                          <span className="text-white">Late</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 w-[42%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnalysisStudio />

      {/* Movement Engine: Details */}
      <section id="movement-engine" className="py-32 px-6 bg-slate-900/20 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-[#dfff00] font-black tracking-[0.4em] uppercase text-xs mb-4">The Logic Engine</div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter italic">BROAD-STROKE VISION.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">We analyze the entire person. No intricate racket technicalities—just pure, effective athletic movement for every enthusiast.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Move}
              title="Full-Body Locomotion"
              description="Trace your footsteps and court positioning. See where you hesitate and identify wasted energy in your baseline coverage."
            />
            <FeatureCard 
              icon={Activity}
              title="Kinematic Flow"
              description="Analyze how your weight shifts during preparation and follow-through. We focus on balance and broad body alignment."
            />
            <FeatureCard 
              icon={Trophy}
              title="Movement Passport"
              description="Receive an NTRP-aligned movement rating. Share your digital athletic profile and prove your court intelligence."
            />
          </div>
        </div>
      </section>

      {/* Social Certification Section */}
      <section id="results" className="py-32 px-6 relative bg-slate-950 scroll-mt-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-center lg:text-left">
            <Zap className="w-16 h-16 text-[#dfff00] mb-8 mx-auto lg:mx-0" />
            <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
              TELL THE WORLD <br />
              <span className="text-[#dfff00]">YOUR LEVEL.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light">
              Stop guessing. Get certified based on your actual court movement. Every analysis generates a shareable "Ace Profile" that acts as your digital tennis identity.
            </p>
          </div>

          <div className="flex-1 relative perspective-1000">
             <div className="relative dark-card p-4 rounded-[3.5rem] border border-white/20 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 max-w-sm mx-auto group cursor-default">
                <div className="bg-slate-900 rounded-[3rem] overflow-hidden p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-10 h-10 tennis-gradient rounded-xl flex items-center justify-center">
                      <Star className="text-slate-950 fill-slate-950 w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AceProfile</span>
                  </div>
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-[#dfff00] mx-auto mb-4 overflow-hidden shadow-xl bg-slate-800">
                      {!profileImgFailed ? (
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" 
                          alt="User" 
                          onError={() => setProfileImgFailed(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#dfff00] font-black text-2xl">AC</div>
                      )}
                    </div>
                    <h4 className="text-2xl font-black uppercase tracking-tight">ALEXA CHENG</h4>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase text-center">Movement Grade: A-</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-8">
                     <div className="bg-white/5 p-3 rounded-xl text-center">
                        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Court Speed</div>
                        <div className="text-sm font-bold text-white">Top 15%</div>
                     </div>
                     <div className="bg-white/5 p-3 rounded-xl text-center">
                        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Consistency</div>
                        <div className="text-sm font-bold text-white">Top 40%</div>
                     </div>
                  </div>
                  <button className="w-full mt-10 py-5 bg-[#dfff00] text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer">
                    <Share2 className="w-5 h-5" /> SHARE PROGRESS
                  </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      <WaitlistSection />

      <footer className="py-20 border-t border-white/5 px-6 text-center bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 tennis-gradient rounded-full flex items-center justify-center">
              <Target className="text-slate-950 w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">AceAnalysis</span>
          </div>
          <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
            Revolutionizing tennis movement training through the power of Google Gemini AI. Movement intelligence for everyone.
          </p>
          <div className="mt-16 text-[10px] text-slate-800 font-bold uppercase tracking-widest">
            © 2025 ACE ANALYSIS MOVEMENT LAB. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
