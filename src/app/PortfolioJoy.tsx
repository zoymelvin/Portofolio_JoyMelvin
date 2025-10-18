"use client"; // <-- PERBAIKAN ADA DI SINI

import React, { useEffect, useMemo, useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Code2, Moon, SunMedium, Rocket, Send, CheckCircle, XCircle, Award, ExternalLink, X } from "lucide-react";

// ==========================================
// Type Definitions
// ==========================================
interface BadgeProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface SectionProps {
  id: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

interface LightboxProps {
  open: boolean;
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

interface Project {
  title: string;
  tag: string;
  desc: string;
  stack: string[];
  repo: string;
  images: string[];
}

interface Certificate {
  title: string;
  issuer: string;
  year: string;
  pdfUrl: string;
}

interface CertificateCardProps extends Omit<Certificate, 'pdfUrl'> {
  onClick: () => void;
}

interface PdfViewerModalProps {
  src: string;
  onClose: () => void;
}

interface NavbarProps {
    onToggleTheme: (theme: string) => void;
    theme: string;
    activeSection: string | null;
}

interface HeroProps {
    onViewCv: () => void;
}

interface AboutProps {
    onViewCv: () => void;
}

// ==========================================
// Utilities & Hooks
// ==========================================
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

function useScrollSpy(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const sections = sectionIds.map(id => document.getElementById(id));
        
        if (observer.current) {
            observer.current.disconnect();
        }

        const observerOptions = {
            rootMargin: "-40% 0px -60% 0px",
            threshold: 0
        };

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            if (section) observer.current?.observe(section);
        });

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [sectionIds]);

    return activeSection;
}

// ==========================================
// Data Konfigurasi
// ==========================================
const CV_PDF_URL: string = "/cv-joy-melvin-ginting.pdf";
const HERO_IMAGE_URL: string = "/projects/home/melvin.png";

const PROJECTS_DATA: Project[] = [
  {
    title: "DOKIDOKI – Anime Explorer",
    tag: "Flutter",
    desc: "Eksplorasi UI: home, genre, detail, watchlist; arsitektur modul & provider.",
    stack: ["Flutter", "Provider", "Router", "REST", "Jikan V4 API"],
    repo: "https://github.com/zoymelvin/DokiDoki",
    images: [ "/projects/dokidoki/dokidoki1.png", "/projects/dokidoki/dokidoki2.png", "/projects/dokidoki/dokidoki3.png", "/projects/dokidoki/dokidoki4.png" ],
  },
  {
    title: "RasAI – AI Recipe Assistant",
    tag: "Flutter",
    desc: "Aplikasi rekomendasi resep berbasis teks/gambar, dengan state management dan integrasi API.",
    stack: ["Flutter", "Dart", "REST API", "State Mgmt"],
    repo: "https://github.com/zoymelvin/RasAi",
    images: [ "/projects/rasai/rasai1.png", "/projects/rasai/rasai2.png" ],
  },
  {
    title: "GadjahDjaya POS",
    tag: "Kotlin",
    desc: "Sistem kasir sederhana untuk rumah makan: transaksi, stok, dan laporan dasar.",
    stack: ["Kotlin", "Firebase", "Midtrans", "Storage"],
    repo: "https://github.com/zoymelvin/GadjahDjaya",
    images: [ "/projects/gadjahdjaya/gadjahdjaya1.jpg", "/projects/gadjahdjaya/gadjahdjaya2.jpg", "/projects/gadjahdjaya/gadjahdjaya3.jpg" ],
  },
  {
    title: "BookEat – ReqRes API",
    tag: "Kotlin",
    desc: "Menampilkan daftar pengguna dari ReqRes, memilih, & mengirim data antar Activity.",
    stack: ["Kotlin", "Retrofit", "RecyclerView", "ViewModel"],
    repo: "https://github.com/zoymelvin/BookEat",
    images: [ "/projects/bookeat/bookeat1.jpg", "/projects/bookeat/bookeat2.jpg", "/projects/bookeat/bookeat3.jpg", "/projects/bookeat/bookeat4.jpg" ],
  },
];

const CERTIFICATES_DATA: Certificate[] = [
   { title: "Skilhub Community x HMIF Universitas Syiah Kuala", issuer: "Memanfaatkan A.I yang bersifat Generative untuk Menciptakan Desain UI/UX", year: "2024", pdfUrl: "/sertifikat/Joy melvin Ginting  - Sertifikat Webinar SkilHub Community x HMIF Universitas Syiah Kuala.pdf" },
    { title: "Introduction To Computer (ITC) 2021", issuer: "ITC", year: "2021", pdfUrl: "/sertifikat/E Sertifikat Joy Melvin Ginting.pdf" },
    { title: "Amikom Computer Club (AMCC)", issuer: "Divisi Hardware Software", year: "2022", pdfUrl: "/sertifikat/E Sertifikat Joy Melvin Ginting AMCC.pdf" },
    { title: "IFCAMP 2023", issuer: "Building Apps with Framework Laravel", year: "2023", pdfUrl: "/sertifikat/Joy Melvin Ginting.pdf" },
   
];

// ==========================================
// UI Components
// ==========================================
const Badge: React.FC<BadgeProps> = ({ children, isActive, onClick }) => (
  <button onClick={onClick} disabled={!onClick} className={`inline-flex items-center rounded-full border px-3 py-1 text-xs md:text-sm font-medium transition-colors duration-200 ${ isActive ? "bg-indigo-600 border-indigo-600 text-white" : "dark:border-zinc-700/80 border-zinc-200 dark:text-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800" } ${onClick ? 'cursor-pointer' : ''}`}>
    {children}
  </button>
);

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children }) => (
  <section id={id} className="scroll-mt-20 py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-2xl">{subtitle}</p>}
      </motion.div>
      <div className="mt-10">{children}</div>
    </div>
  </section>
);

const Lightbox: React.FC<LightboxProps> = ({ open, images, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!open) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 z-10">‹</button>
      <AnimatePresence mode="wait">
        <motion.img key={index} src={images[index]} alt="preview" className="max-h-[85vh] max-w-[90vw] rounded-2xl border border-white/10 shadow-2xl object-contain" onClick={(e: React.MouseEvent) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}/>
      </AnimatePresence>
      <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 z-10">›</button>
      <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 rounded-full bg-white/10 px-3 py-1 text-white text-sm transition hover:bg-white/20 z-10">Close</button>
    </motion.div>
  );
};

const ProjectCard: React.FC<Project> = ({ title, tag, desc, repo, images = [], stack }) => {
  const [idx, setIdx] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);
  const hasImages = images && images.length > 0;

  const handlePrev = () => setIdx((p) => (p - 1 + images.length) % images.length);
  const handleNext = () => setIdx((p) => (p + 1) % images.length);

  return (
    <>
      <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        {hasImages && (
          <div className="relative h-60 w-full overflow-hidden cursor-pointer" onClick={() => setOpenLightbox(true)}>
            <img src={images[0]} alt={`${title} screenshot`} className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            {images.length > 1 && (<div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded-full">1 / {images.length}</div>)}
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <Badge isActive={false}>{tag}</Badge>
            {repo && <a href={repo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 transition-colors"><Github size={16}/> Repo</a>}
          </div>
          <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((s, i) => <span key={i} className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300">{s}</span>)}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {openLightbox && <Lightbox open={openLightbox} images={images} index={idx} onClose={() => setOpenLightbox(false)} onPrev={handlePrev} onNext={handleNext} />}
      </AnimatePresence>
    </>
  );
};

const CertificateCard: React.FC<CertificateCardProps> = ({ title, issuer, year, onClick }) => (
    <motion.div onClick={onClick} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 transition-all duration-300 hover:shadow-lg hover:border-indigo-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/80">
        <div className="flex items-center gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-full"><Award className="text-zinc-600 dark:text-zinc-400"/></div>
            <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{issuer}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{year}</span>
            <ExternalLink size={16} className="text-zinc-400 dark:text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500"/>
        </div>
    </motion.div>
);

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ src, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-4xl h-[90vh] bg-zinc-800 rounded-lg shadow-2xl flex flex-col" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-3 border-b border-zinc-700">
                    <span className="text-white text-sm">Pratinjau Dokumen</span>
                    <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-white"><X size={20} /></button>
                </div>
                <iframe src={src} className="w-full h-full border-0 rounded-b-lg" title="PDF Viewer"></iframe>
            </motion.div>
        </motion.div>
    );
};

// ==========================================
// Page Sections
// ==========================================
const Navbar: React.FC<NavbarProps> = ({ onToggleTheme, theme, activeSection }) => (
  <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur bg-white/70 dark:bg-zinc-950/60">
    <nav className="mx-auto flex max-w-8xl items-center justify-between px-4 py-3">
      <a href="#home" className="font-semibold tracking-tight text-zinc-900 dark:text-white">zoymelvin</a>
      <div className="hidden gap-6 md:flex">
        {["tentang", "skill", "proyek", "sertifikat", "kontak"].map((id) => (
          <a key={id} href={`#${id}`} className={`text-sm capitalize transition-colors ${activeSection === id ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
            {id}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Toggle theme" onClick={() => onToggleTheme(theme === "dark" ? "light" : "dark")} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          {theme === "dark" ? <SunMedium size={16} /> : <Moon size={16} />}
        </button>
        <a href="#kontak" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm">
          <Send size={16} /> Hubungi
        </a>
      </div>
    </nav>
  </header>
);

const Hero: React.FC<HeroProps> = ({ onViewCv }) => (
    <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(50%_50%_at_30%_10%,theme(colors.indigo.500/.2),transparent_80%),radial-gradient(50%_50%_at_70%_90%,theme(colors.violet.500/.2),transparent_80%)]"></div>
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300 backdrop-blur">
                        <Rocket size={14} className="text-indigo-500" />
                        <span>Mobile Developer & Tech Enthusiast</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">Joy Melvin Ginting</h1>
                    <p className="mt-4 text-zinc-700 dark:text-zinc-300 md:text-lg">Selamat datang di portofolio saya. Di sini saya menampilkan proyek mobile yang saya kembangkan, dari ide, desain, hingga menjadi aplikasi fungsional.</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="#proyek" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-transform hover:scale-105 shadow">
                            <Code2 size={16} /> Lihat Proyek
                        </a>
                        <button onClick={onViewCv} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-transform hover:scale-105">
                            Lihat CV
                        </button>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.6, delay: 0.2 }} 
                    className="relative h-[600px] w-full hidden md:flex items-center justify-center"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                            src={HERO_IMAGE_URL} 
                            alt="Joy Melvin Ginting (Anime)" 
                            className="max-h-full max-w-full object-contain"
                            style={{ filter: 'drop-shadow(0 0 2rem rgba(129, 140, 248, 0.2))' }}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

const About: React.FC<AboutProps> = ({ onViewCv }) => (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="prose prose-zinc dark:prose-invert max-w-none md:col-span-2">
            <p>Saya adalah seorang mobile developer yang antusias, dengan fokus pada <strong>Flutter</strong> dan <strong>Native Android (Kotlin)</strong>. Saya menikmati seluruh proses pengembangan aplikasi, mulai dari merancang wireframe, mengimplementasikan UI/UX, mengintegrasikan API, hingga pengujian dan publikasi.</p>
            <p>Ketertarikan utama saya adalah pada pengembangan aplikasi untuk memberikan solusi yang  dapat mendukung kebutuhan bisnis. Saat ini, saya terus mengasah kemampuan dengan membangun portofolio proyek yang praktis dan profesional.</p>
            <ul>
                <li><strong>Minat:</strong> Mobile Development, UI/UX, API, Business Solutions.</li>
                <li><strong>Domisili:</strong> Yogyakarta, Indonesia.</li>
                <li><strong>Bahasa:</strong> Indonesia (native), English (learning).</li>
            </ul>
        </div>
        <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 h-fit">
                <div className="mb-3 font-medium">Info Kontak</div>
                <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <a href="mailto:zoymelvin04@gmail.com" className="flex items-center gap-2 hover:text-indigo-500"><Mail size={16}/> zoymelvin04@gmail.com</a>
                    <a href="https://github.com/zoymelvin" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-500"><Github size={16} /> zoymelvin</a>
                    <a href="https://www.linkedin.com/in/joy-melvin-ginting-a82115279/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-500"><Linkedin size={16} /> Joy Melvin Ginting</a>
                </div>
            </div>
            <button onClick={onViewCv} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105">
                Lihat CV
            </button>
        </div>
    </div>
);

const Skills = () => {
    const skills = [
        { title: "Flutter", desc: "Widget, Navigator, HTTP/REST, Provider/Bloc dasar, build APK.", tags: ["Dart", "Material 3", "State", "API", "JSON"] },
        { title: "Android (Kotlin)", desc: "Activity/Fragment, RecyclerView, Retrofit, Room dasar, Coroutines.", tags: ["Kotlin", "XML", "Retrofit", "Room", "MVVM"] },
        { title: "Alat & Praktik", desc: "Git/GitHub, Figma, Debugging, Dokumentasi, Play Store (dasar).", tags: ["Git", "GitHub", "Figma", "CI/CD (basic)", "Testing (UI)"] },
    ];
    return (
        <div className="grid gap-5 md:grid-cols-3">
            {skills.map((skill, i) => (
                <motion.div key={skill.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg">
                    <h4 className="mb-2 font-semibold text-zinc-900 dark:text-white">{skill.title}</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{skill.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {skill.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const ContactForm = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
        const { name, value } = e.target; 
        setFormData(prev => ({ ...prev, [name]: value })); 
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setStatus('sending');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStatus('success');
        setTimeout(() => { 
            setStatus('idle'); 
            setFormData({ name: '', email: '', subject: '', message: '' }); 
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <input name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Nama" required />
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="form-input" placeholder="Email" required />
            </div>
            <input name="subject" value={formData.subject} onChange={handleChange} className="form-input w-full" placeholder="Subjek" required />
            <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="form-input w-full" placeholder="Pesan Anda..." required />
            <div className="flex items-center gap-4">
                <button type="submit" disabled={status === 'sending'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
                    {status === 'sending' ? 'Mengirim...' : status === 'success' ? 'Terkirim!' : 'Kirim Pesan'}
                    {status !== 'sending' && <Send size={16} />}
                </button>
                <AnimatePresence>
                    {status === 'success' && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center gap-2 text-sm text-green-600"><CheckCircle size={16}/> Pesan berhasil dikirim.</motion.div>}
                    {status === 'error' && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center gap-2 text-sm text-red-600"><XCircle size={16}/> Gagal mengirim pesan.</motion.div>}
                </AnimatePresence>
            </div>
        </form>
    );
};

const Footer = () => (
  <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
    <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center md:text-left">© {new Date().getFullYear()} Joy Melvin Ginting. All rights reserved.</p>
      <div className="flex items-center gap-4 text-zinc-500">
          <a href="https://github.com/zoymelvin" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors"><Github size={20}/></a>
          <a href="https://www.linkedin.com/in/joy-melvin-ginting-a82115279/" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors"><Linkedin size={20}/></a>
          <a href="mailto:zoymelvin04@gmail.com" className="hover:text-indigo-500 transition-colors"><Mail size={20}/></a>
      </div>
    </div>
  </footer>
);

// ==========================================
// Main App Component
// ==========================================
export default function PortfolioJoy() {
  const { theme, setTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const sectionIds = useMemo(() => ["tentang", "skill", "proyek", "sertifikat", "kontak"], []);
  const activeSection = useScrollSpy(sectionIds);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "Semua") return PROJECTS_DATA;
    return PROJECTS_DATA.filter((p) => p.tag === activeFilter);
  }, [activeFilter]);

  const handleViewPdf = (url: string) => setPdfSrc(url);

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        .form-input { border-radius: 0.75rem; border: 1px solid; background-color: transparent; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; width: 100%; transition: border-color 0.2s; }
        .light .form-input { border-color: #d4d4d8; } .dark .form-input { border-color: #3f3f46; }
        .form-input:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #6366f1; }
      `}</style>
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-indigo-200/50 dark:selection:bg-indigo-400/30 font-sans">
        <Navbar onToggleTheme={setTheme} theme={theme} activeSection={activeSection} />
        <main>
          <Hero onViewCv={() => handleViewPdf(CV_PDF_URL)} />
          <Section id="tentang" title="Tentang Saya" subtitle="Lulusan S1 Sistem Informasi & programmer mobile">
             <About onViewCv={() => handleViewPdf(CV_PDF_URL)} />
          </Section>
          <Section id="skill" title="Skill & Teknologi" subtitle="Teknologi inti yang saya gunakan untuk membangun aplikasi">
             <Skills />
          </Section>
          <Section id="proyek" title="Proyek Pilihan" subtitle="Kumpulan aplikasi Flutter & Kotlin yang pernah saya kerjakan">
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {["Semua", "Flutter", "Kotlin"].map((filter) => (
                <Badge key={filter} isActive={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
                  {filter}
                </Badge>
              ))}
            </div>
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredProjects.map((p) => <ProjectCard key={p.title} {...p} />)}
              </AnimatePresence>
            </motion.div>
          </Section>
          <Section id="sertifikat" title="Sertifikat & Pencapaian" subtitle="Beberapa pelatihan yang saya ikuti untuk meningkatkan keahlian">
            <div className="grid gap-5 md:grid-cols-2">
              {CERTIFICATES_DATA.map((cert) => (
                <CertificateCard key={cert.title} {...cert} onClick={() => handleViewPdf(cert.pdfUrl)}/>
              ))}
            </div>
          </Section>
          <Section id="kontak" title="Mari Terhubung" subtitle="Terbuka untuk magang, freelance, atau kolaborasi proyek">
            <ContactForm />
          </Section>
        </main>
        <Footer />
        <AnimatePresence>
          {pdfSrc && <PdfViewerModal src={pdfSrc} onClose={() => setPdfSrc(null)} />}
        </AnimatePresence>
      </div>
    </>
  );
}
