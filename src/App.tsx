import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Menu,
  X,
  Send,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import {
  PROFILE_DATA,
  HERO_METRICS,
  PROJECTS_DATA,
  EXPERIENCE_TIMELINE,
  CRAFT_CAPABILITIES,
  TESTIMONIALS_DATA,
  SERVICE_SCOPES,
  ProjectCategory,
  ProjectItem,
} from './data/portfolioData';
import { ResilientImage } from './components/ResilientImage';
import { ProjectLightboxModal } from './components/ProjectLightboxModal';
import { ResumePreviewModal } from './components/ResumePreviewModal';
import { LanyardHeroSection } from './components/LanyardHeroSection';

interface SavedInquiry {
  id: string;
  clientName: string;
  clientContact: string;
  companyOrChannel: string;
  serviceId: string;
  serviceLabel: string;
  budgetTier: string;
  timeline: string;
  projectDetails: string;
  createdAt: string;
}

const BUDGET_TIERS = [
  '฿30,000 – ฿50,000',
  '฿50,000 – ฿100,000',
  '฿100,000 – ฿200,000',
  'มากกว่า ฿200,000 / สัญญาต่อเนื่อง',
];

const TIMELINE_OPTIONS = [
  'เริ่มงานได้ทันที (ภายใน 1–2 สัปดาห์)',
  'ภายในเดือนหน้า',
  'ต้องการปรึกษาขอบเขตงานก่อน',
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Copy states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Contact & Interactive Scope Estimator state
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICE_SCOPES[0].id);
  const [selectedBudget, setSelectedBudget] = useState<string>(BUDGET_TIERS[1]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>(TIMELINE_OPTIONS[0]);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [companyOrChannel, setCompanyOrChannel] = useState('LinkedIn');
  const [projectDetails, setProjectDetails] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState<SavedInquiry | null>(null);
  const [savedInquiries, setSavedInquiries] = useState<SavedInquiry[]>(() => {
    try {
      const raw = localStorage.getItem('napat_studio_inquiries_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('napat_studio_inquiries_v1', JSON.stringify(savedInquiries));
    } catch {
      // Ignore storage error
    }
  }, [savedInquiries]);

  const filteredProjects =
    activeCategory === 'all'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((item) => item.category === activeCategory);

  const currentServiceScope =
    SERVICE_SCOPES.find((s) => s.id === selectedServiceId) || SERVICE_SCOPES[0];

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2200);
  };

  const handleNavigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedProject) return;
    const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === selectedProject.id);
    if (currentIndex === -1) return;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % PROJECTS_DATA.length
        : (currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    setSelectedProject(PROJECTS_DATA[nextIndex]);
  };

  const handleSelectProjectForInquiry = (project: ProjectItem) => {
    setSelectedProject(null);
    if (project.category === 'product') {
      setSelectedServiceId('web-development');
    } else if (project.category === 'brand') {
      setSelectedServiceId('brand-portfolio');
    } else {
      setSelectedServiceId('ux-ui-design');
    }
    setProjectDetails(
      `สนใจทำโปรเจกต์ลักษณะใกล้เคียงกับ "${project.title}" โดยมีเป้าหมายเพื่อ...`
    );
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientContact.trim()) {
      setFormError('กรุณาระบุชื่อผู้ติดต่อ และช่องทางติดต่อกลับ (อีเมล เบอร์โทรศัพท์ หรือ Line ID)');
      return;
    }
    setFormError('');

    const newInquiry: SavedInquiry = {
      id: `INQ-${Date.now().toString().slice(-5)}`,
      clientName: clientName.trim(),
      clientContact: clientContact.trim(),
      companyOrChannel: companyOrChannel.trim() || 'LinkedIn / Freelance',
      serviceId: currentServiceScope.id,
      serviceLabel: currentServiceScope.label,
      budgetTier: selectedBudget,
      timeline: selectedTimeline,
      projectDetails:
        projectDetails.trim() ||
        'ต้องการนัดพูดคุยรายละเอียดขอบเขตงานและแนวทางการออกแบบเพิ่มเติม',
      createdAt: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setSavedInquiries((prev) => [newInquiry, ...prev]);
    setSubmittedInquiry(newInquiry);
    setClientName('');
    setClientContact('');
    setProjectDetails('');
  };

  const formatBriefForCopy = (inq: SavedInquiry) => {
    return [
      `[ใบสรุปบรีฟงาน — ${PROFILE_DATA.brandWordmark}]`,
      `รหัสอ้างอิง: ${inq.id} (${inq.createdAt})`,
      `ผู้ติดต่อ: ${inq.clientName} (${inq.companyOrChannel})`,
      `ช่องทางติดต่อกลับ: ${inq.clientContact}`,
      `ประเภทงาน: ${inq.serviceLabel}`,
      `งบประมาณโดยประมาณ: ${inq.budgetTier}`,
      `ระยะเวลาเริ่มงาน: ${inq.timeline}`,
      `รายละเอียด: ${inq.projectDetails}`,
    ].join('\n');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 flex flex-col">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-zinc-900 whitespace-nowrap shrink-0"
          >
            {PROFILE_DATA.brandWordmark}
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav
            aria-label="เมนูหลัก"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
          >
            <a
              href="#works"
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              ผลงานคัดสรร
            </a>
            <a
              href="#about"
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              ประวัติและทักษะ
            </a>
            <a
              href="#capabilities"
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              ขอบเขตบริการ
            </a>
            <a
              href="#contact"
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              ติดต่อร่วมงาน
            </a>
          </nav>

          {/* Zone 3: 1 primary action (+ mobile menu drawer toggle on small viewports) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="#contact"
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap shrink-0"
            >
              ติดต่องานฟรีแลนซ์
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="เปิดเมนูนำทางบนมือถือ"
              aria-expanded={mobileMenuOpen}
              className="md:hidden w-10 h-10 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <nav
            aria-label="เมนูมือถือ"
            className="md:hidden border-b border-zinc-200 bg-[#FAF9F6] px-4 py-4 space-y-2"
          >
            <a
              href="#works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-zinc-800 hover:text-blue-600"
            >
              01. ผลงานคัดสรร (Selected Works)
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-zinc-800 hover:text-blue-600"
            >
              02. ประวัติและประสบการณ์ (Biography & Timeline)
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-zinc-800 hover:text-blue-600"
            >
              03. สิ่งที่ถนัดและขอบเขตบริการ (Capabilities)
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-blue-600"
            >
              04. ประเมินงบประมาณและติดต่อกลับ (Hire / Contact)
            </a>
          </nav>
        )}
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: Split-Screen Hero with Interactive 3D Physics ID Card Lanyard */}
        <LanyardHeroSection
          onOpenResume={() => setIsResumeOpen(true)}
          copiedKey={copiedKey}
          onCopyText={handleCopyText}
        />

        {/* Subtle Editorial Marquee Divider */}
        <div
          aria-hidden="true"
          className="border-y border-zinc-200 bg-white py-3 overflow-hidden select-none"
        >
          <div className="animate-marquee flex items-center gap-8 text-xs font-serif italic text-zinc-500 tracking-wide">
            <span>selected works & case studies</span>
            <span>·</span>
            <span>product strategy & ux/ui architecture</span>
            <span>·</span>
            <span>responsive react & typescript engineering</span>
            <span>·</span>
            <span>minimalist brand systems</span>
            <span>·</span>
            <span>built for linkedin & freelance excellence</span>
            <span>·</span>
            <span>selected works & case studies</span>
            <span>·</span>
            <span>product strategy & ux/ui architecture</span>
            <span>·</span>
            <span>responsive react & typescript engineering</span>
            <span>·</span>
            <span>minimalist brand systems</span>
            <span>·</span>
            <span>built for linkedin & freelance excellence</span>
          </div>
        </div>

        {/* SECTION 2: Minimalist Bento Project Gallery (#works) */}
        <section
          id="works"
          className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-mono text-zinc-500">
                01. ผลงานคัดสรรและกรณีศึกษา (Selected Works)
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                แกลเลอรีผลงานแบบมินิมอล พร้อมผลลัพธ์จริงจากผู้ว่าจ้าง
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                คลิกที่การ์ดผลงานเพื่อเปิดดูรายละเอียดโจทย์ธุรกิจ แนวทางการแก้ปัญหา และภาพขนาดเต็มแบบไม่มีสิ่งรบกวน
              </p>
            </div>

            {/* Interactive Segmented Filter Controls */}
            <div
              role="group"
              aria-label="กรองหมวดหมู่ผลงาน"
              className="flex flex-wrap items-center gap-1 p-1 bg-zinc-200/70 rounded-lg self-start"
            >
              {(
                [
                  { id: 'all', label: `ทั้งหมด (${PROJECTS_DATA.length})` },
                  { id: 'product', label: 'UX/UI & Web App' },
                  { id: 'brand', label: 'Brand & Editorial' },
                  { id: 'mobile', label: 'Mobile Product' },
                ] as { id: ProjectCategory; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeCategory === tab.id
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredProjects.map((project, index) => {
              const isWideBento = activeCategory === 'all' && index === 0;
              return (
                <article
                  key={project.id}
                  id={`project-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  className={`group rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col ${
                    isWideBento ? 'md:col-span-2 lg:grid lg:grid-cols-12' : ''
                  }`}
                >
                  {/* Media Container */}
                  <div
                    className={`relative overflow-hidden bg-zinc-900 ${
                      isWideBento
                        ? 'lg:col-span-7 aspect-video lg:aspect-auto lg:min-h-[380px]'
                        : 'aspect-[4/3]'
                    }`}
                  >
                    <ResilientImage
                      src={project.image}
                      alt={project.title}
                      fallbackTitle={project.title}
                      fallbackGradient={project.fallbackGradient}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* Editorial Card Body (Zero-Pill Metadata) */}
                  <div
                    className={`p-6 sm:p-8 flex flex-col justify-between space-y-5 ${
                      isWideBento ? 'lg:col-span-5' : 'flex-1'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Clean Unboxed Metadata Line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="font-medium text-zinc-700">
                          {project.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{project.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.duration}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 space-y-3">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-xs text-zinc-500">ผลลัพธ์ที่วัดได้</span>
                        <span className="text-xs font-bold text-blue-600 font-mono tabular-nums">
                          {project.impactMetric}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                        <span className="truncate max-w-[70%]">
                          {project.techAndTools.slice(0, 3).join(' · ')}
                        </span>
                        <span className="font-semibold text-zinc-900 group-hover:text-blue-600 inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                          <span>เปิดอ่าน Case Study</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Biography Story & Career Chronicle (#about) */}
        <section
          id="about"
          className="border-t border-zinc-200 bg-white py-16 sm:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
            {/* Bio Narrative & Philosophy */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-xs font-mono text-zinc-500">
                  02. ประวัติชีวะและแนวคิดการทำงาน (Biography & Ethos)
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                  ผสานวิธีคิดเชิงโครงสร้างแบบสถาปนิก เข้ากับวิศวกรรมซอฟต์แวร์ยุคใหม่
                </h2>
                <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-zinc-200 space-y-3">
                  <p className="font-serif italic text-lg text-zinc-800 leading-relaxed">
                    “{PROFILE_DATA.philosophyQuote}”
                  </p>
                  <p className="text-xs text-zinc-500">
                    — {PROFILE_DATA.fullNameThai}, ก่อตั้ง {PROFILE_DATA.brandWordmark}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-zinc-600 leading-relaxed">
                {PROFILE_DATA.biographyParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-zinc-200">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 mb-1.5">
                      พื้นฐานการศึกษา
                    </h3>
                    <p className="text-sm font-semibold text-zinc-900">
                      สถาปัตยกรรมศาสตรบัณฑิต (เกียรตินิยมอันดับ 1)
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      จุฬาลงกรณ์มหาวิทยาลัย · วิชาโทการออกแบบโต้ตอบดิจิทัล
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 mb-1.5">
                      รูปแบบการทำงานร่วมกับผู้ว่าจ้าง
                    </h3>
                    <p className="text-sm font-semibold text-zinc-900">
                      ส่งมอบตรงเวลา สื่อสารชัดเจน พร้อมไฟล์ต้นฉบับ 100%
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      อัปเดตงานผ่าน Figma, Notion, Slack หรือ Line ตามความสะดวกของทีมคุณ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Experience Chronicle */}
            <div className="space-y-8 pt-8 border-t border-zinc-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900">
                    เส้นทางอาชีพและประสบการณ์ทำงาน (Experience Timeline)
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    ประสบการณ์ร่วมงานกับบริษัทเทคโนโลยี เอเจนซี่ และการทำงานอิสระเต็มเวลา
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer self-start"
                >
                  <span>เปิดดูในรูปแบบเรซูเม่พร้อมพิมพ์</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200">
                {EXPERIENCE_TIMELINE.map((item) => (
                  <div
                    key={item.index}
                    className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start"
                  >
                    <div className="lg:col-span-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 tabular-nums">
                        <span className="font-semibold text-zinc-900">{item.index}</span>
                        <span>{item.period}</span>
                      </div>
                      <p className="text-base font-bold text-zinc-900">
                        {item.organization}
                      </p>
                      <p className="text-xs text-zinc-500">{item.location}</p>
                    </div>

                    <div className="lg:col-span-8 space-y-2.5">
                      <h4 className="text-base font-semibold text-zinc-900">
                        {item.role}
                      </h4>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-xs font-medium text-blue-600 pt-1">
                        ผลลัพธ์สำคัญ: {item.keyAchievement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Core Capabilities, Skills & Attributable Testimonials (#capabilities) */}
        <section
          id="capabilities"
          className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-16"
        >
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono text-zinc-500">
              03. สิ่งที่ถนัดและขอบเขตบริการ (Capabilities & Craft)
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              ความเชี่ยวชาญหลักที่พร้อมช่วยขับเคลื่อนโปรเจกต์ของคุณ
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              สามารถเลือกว่าจ้างเฉพาะส่วนการออกแบบ UX/UI, การพัฒนาโค้ดหน้าบ้าน-หลังบ้าน หรือดูแลครบวงจรตั้งแต่เริ่มต้นจนเปิดตัวจริง
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {CRAFT_CAPABILITIES.map((craft) => (
              <div
                key={craft.index}
                className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span className="font-bold text-zinc-900">{craft.index}</span>
                    <span>ระยะเวลาเฉลี่ย: {craft.typicalTimeline}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                      {craft.title}
                    </h3>
                    <p className="text-xs font-serif italic text-zinc-500">
                      {craft.englishTitle}
                    </p>
                  </div>

                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {craft.description}
                  </p>

                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-semibold text-zinc-800">
                      สิ่งที่ส่งมอบในหมวดนี้:
                    </p>
                    <ul className="space-y-1.5 text-xs text-zinc-600">
                      {craft.deliverables.map((del) => (
                        <li key={del} className="flex items-baseline gap-2">
                          <span className="text-blue-600 font-mono">—</span>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <p className="text-xs text-zinc-400 mb-1">เครื่องมือและเทคโนโลยี</p>
                  <p className="text-xs font-medium text-zinc-700 leading-relaxed">
                    {craft.tools.join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Claim-to-Proof Adjacency: Attributable Testimonials */}
          <div className="pt-8 border-t border-zinc-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <h3 className="text-lg font-bold text-zinc-900">
                เสียงสะท้อนและผลลัพธ์จากผู้ว่าจ้างจริง (Client Testimonials)
              </h3>
              <p className="text-xs text-zinc-500">
                อ้างอิงจากรีวิวการร่วมงานจริงบน LinkedIn และสัญญาจ้างที่ตรวจสอบได้
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {TESTIMONIALS_DATA.map((test) => (
                <div
                  key={test.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base text-zinc-800 leading-relaxed">
                      “{test.quote}”
                    </p>
                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-zinc-200/80">
                      <p className="text-xs font-semibold text-zinc-900 mb-1">
                        ความเปลี่ยนแปลงที่เกิดขึ้น (Before → Outcome):
                      </p>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {test.beforeOutcome}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-zinc-900">{test.author}</p>
                      <p className="text-zinc-500">
                        {test.role} · {test.organization}
                      </p>
                    </div>
                    <span className="text-zinc-400 font-mono text-right">
                      {test.projectRef}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Easy Contact System & Interactive Freelance Scope Estimator (#contact) */}
        <section
          id="contact"
          className="border-t border-zinc-200 bg-white py-16 sm:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Direct Contact Channels & Shareable Freelance Profile Card */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-3">
                  <p className="text-xs font-mono text-zinc-500">
                    04. ติดต่อสอบถามและประเมินโปรเจกต์ (Contact & Inquiry)
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                    พร้อมเริ่มงานใหม่และพูดคุยโจทย์ของคุณอย่างเป็นกันเอง
                  </h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    เลือกขอบเขตงานด้านขวาเพื่อดูงบประมาณเบื้องต้นและส่งข้อความติดต่อกลับ หรือคัดลอกช่องทางติดต่อโดยตรงด้านล่างเพื่อทักคุยผ่าน Line, อีเมล หรือ LinkedIn ได้ทันที
                  </p>
                </div>

                {/* Direct One-Click Copy Channels */}
                <div className="rounded-2xl border border-zinc-200 bg-[#FAF9F6] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-zinc-500">
                      ช่องทางติดต่อโดยตรง ({PROFILE_DATA.responseSla})
                    </h3>
                  </div>

                  <div className="divide-y divide-zinc-200/80 text-sm">
                    <div className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">อีเมลติดต่องาน</p>
                        <p className="font-mono font-medium text-zinc-900">
                          {PROFILE_DATA.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText('contact-email', PROFILE_DATA.email)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copiedKey === 'contact-email' ? 'คัดลอกแล้ว ✓' : 'คัดลอกอีเมล'}
                      </button>
                    </div>

                    <div className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Line Official / โทรศัพท์</p>
                        <p className="font-mono font-medium text-zinc-900">
                          {PROFILE_DATA.lineId} · {PROFILE_DATA.phone}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText('contact-line', PROFILE_DATA.lineId)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copiedKey === 'contact-line' ? 'คัดลอกแล้ว ✓' : 'คัดลอก Line ID'}
                      </button>
                    </div>

                    <div className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">LinkedIn Profile</p>
                        <p className="font-mono font-medium text-zinc-900">
                          {PROFILE_DATA.linkedinHandle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            'contact-linkedin',
                            `https://${PROFILE_DATA.linkedinHandle}`
                          )
                        }
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copiedKey === 'contact-linkedin' ? 'คัดลอกแล้ว ✓' : 'คัดลอกลิงก์'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submitted Inquiries Log (if any) */}
                {savedInquiries.length > 0 && (
                  <div className="rounded-2xl border border-zinc-200 bg-[#FAF9F6] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-900">
                        รายการบรีฟที่คุณบันทึกไว้ ({savedInquiries.length})
                      </h4>
                      <span className="text-xs text-zinc-500">พร้อมคัดลอกส่งต่อ</span>
                    </div>
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {savedInquiries.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-white border border-zinc-200 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between font-mono text-zinc-500">
                            <span>{item.id} · {item.createdAt}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(`inq-${item.id}`, formatBriefForCopy(item))
                              }
                              className="text-blue-600 font-sans font-medium hover:underline cursor-pointer"
                            >
                              {copiedKey === `inq-${item.id}`
                                ? 'คัดลอกบรีฟแล้ว ✓'
                                : 'คัดลอกข้อความบรีฟ'}
                            </button>
                          </div>
                          <p className="font-semibold text-zinc-900">
                            {item.serviceLabel} ({item.budgetTier})
                          </p>
                          <p className="text-zinc-600 truncate">
                            ผู้ติดต่อ: {item.clientName} · {item.clientContact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Interactive Scope Estimator & Easy Contact Form */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-zinc-200 bg-[#FAF9F6] p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-bold text-zinc-900">
                        ประเมินขอบเขตงานและส่งข้อมูลติดต่อกลับด่วน
                      </h3>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">
                      ใช้เวลาเพียง 1 นาที
                    </span>
                  </div>

                  {/* Step 1: Select Service Scope */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-zinc-700">
                      1. เลือกประเภทงานที่คุณสนใจ
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SERVICE_SCOPES.map((service) => {
                        const isSelected = service.id === selectedServiceId;
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => setSelectedServiceId(service.id)}
                            className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-900 text-white border-zinc-900'
                                : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                            }`}
                          >
                            <p className="text-xs font-bold">{service.label}</p>
                            <p
                              className={`text-xs font-mono mt-1 tabular-nums ${
                                isSelected ? 'text-zinc-300' : 'text-zinc-500'
                              }`}
                            >
                              ประมาณการ: {service.estimatedRange} · {service.duration}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Live Scope Summary Box */}
                    <div className="p-4 rounded-xl bg-white border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-zinc-900">
                          ขอบเขตมาตรฐาน: {currentServiceScope.label}
                        </p>
                        <p className="text-xs text-zinc-600">
                          {currentServiceScope.summary}
                        </p>
                      </div>
                      <div className="sm:text-right shrink-0">
                        <p className="text-xs text-zinc-400">งบประมาณอ้างอิง</p>
                        <p className="text-sm font-bold text-blue-600 font-mono tabular-nums">
                          {currentServiceScope.estimatedRange}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleSubmitInquiry} className="space-y-5">
                    {/* Budget & Timeline selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="budget-select"
                          className="block text-xs font-semibold text-zinc-700 mb-1.5"
                        >
                          2. งบประมาณที่ตั้งไว้
                        </label>
                        <select
                          id="budget-select"
                          value={selectedBudget}
                          onChange={(e) => setSelectedBudget(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-blue-600"
                        >
                          {BUDGET_TIERS.map((tier) => (
                            <option key={tier} value={tier}>
                              {tier}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="timeline-select"
                          className="block text-xs font-semibold text-zinc-700 mb-1.5"
                        >
                          3. ช่วงเวลาที่ต้องการเริ่มงาน
                        </label>
                        <select
                          id="timeline-select"
                          value={selectedTimeline}
                          onChange={(e) => setSelectedTimeline(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-blue-600"
                        >
                          {TIMELINE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Client Name, Contact & Channel */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="client-name"
                          className="block text-xs font-semibold text-zinc-700 mb-1.5"
                        >
                          ชื่อของคุณ *
                        </label>
                        <input
                          id="client-name"
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="เช่น คุณภาคิน / คุณแพรว"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="client-contact"
                          className="block text-xs font-semibold text-zinc-700 mb-1.5"
                        >
                          อีเมล / เบอร์โทร / Line ID *
                        </label>
                        <input
                          id="client-contact"
                          type="text"
                          value={clientContact}
                          onChange={(e) => setClientContact(e.target.value)}
                          placeholder="ระบุช่องทางให้ติดต่อกลับ"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="client-channel"
                          className="block text-xs font-semibold text-zinc-700 mb-1.5"
                        >
                          พบพอร์ตนี้จากช่องทางใด
                        </label>
                        <select
                          id="client-channel"
                          value={companyOrChannel}
                          onChange={(e) => setCompanyOrChannel(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-blue-600"
                        >
                          <option value="LinkedIn">LinkedIn Profile</option>
                          <option value="Fastwork / Freelance">Fastwork / แพลตฟอร์มฟรีแลนซ์</option>
                          <option value="Referral">คนรู้จักแนะนำ</option>
                          <option value="Direct Search">ค้นหาผ่านเว็บไซต์โดยตรง</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="project-details"
                        className="block text-xs font-semibold text-zinc-700 mb-1.5"
                      >
                        รายละเอียดโปรเจกต์โดยย่อ หรือลิงก์อ้างอิง (ถ้ามี)
                      </label>
                      <textarea
                        id="project-details"
                        rows={3}
                        value={projectDetails}
                        onChange={(e) => setProjectDetails(e.target.value)}
                        placeholder="เล่าเป้าหมายของเว็บไซต์/แอปพลิเคชัน กลุ่มเป้าหมาย หรือสิ่งที่ต้องการให้ช่วยดูแล..."
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 resize-y"
                      />
                    </div>

                    {formError && (
                      <p role="alert" className="text-xs font-medium text-rose-600">
                        {formError}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <p className="text-xs text-zinc-500">
                        ข้อมูลของคุณจะถูกสรุปเป็นใบแจ้งรายละเอียดและพร้อมให้คัดลอกส่งต่อทันที
                      </p>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>บันทึกบรีฟและส่งข้อมูลติดต่อกลับ</span>
                      </button>
                    </div>
                  </form>

                  {/* Instant Confirmation & One-Click Copy Brief Card */}
                  {submittedInquiry && (
                    <div
                      role="status"
                      className="p-5 rounded-xl bg-white border border-blue-200 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>บันทึกข้อมูลติดต่อกลับเรียบร้อยแล้ว ({submittedInquiry.id})</span>
                          </p>
                          <p className="text-xs text-zinc-600">
                            ขอบคุณครับคุณ {submittedInquiry.clientName} คุณสามารถคัดลอกข้อความสรุปบรีฟด้านล่างเพื่อส่งเข้า Line หรือ LinkedIn DM ได้ทันที
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(
                              'latest-brief',
                              formatBriefForCopy(submittedInquiry)
                            )
                          }
                          className="px-3.5 py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {copiedKey === 'latest-brief'
                            ? 'คัดลอกสรุปบรีฟแล้ว ✓'
                            : 'คัดลอกสรุปบรีฟส่งแชท'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-zinc-200 bg-[#FAF9F6] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="space-y-1">
            <p className="font-bold text-zinc-900">
              {PROFILE_DATA.brandWordmark} — {PROFILE_DATA.fullNameThai}
            </p>
            <p>
              ออกแบบและพัฒนาเพื่อใช้เป็นพอร์ตโฟลิโอทางการสำหรับ LinkedIn และแพลตฟอร์มฟรีแลนซ์
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              เปิดดูเรซูเม่ (CV)
            </button>
            <a href="#works" className="hover:text-zinc-900 transition-colors">
              แกลเลอรีผลงาน
            </a>
            <a href="#about" className="hover:text-zinc-900 transition-colors">
              ประวัติการทำงาน
            </a>
            <a href="#contact" className="hover:text-zinc-900 transition-colors">
              ติดต่อจ้างงาน
            </a>
          </div>
        </div>
      </footer>

      {/* Fullscreen Lightbox Case Study Modal */}
      <ProjectLightboxModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNavigate={handleNavigateLightbox}
        onSelectForInquiry={handleSelectProjectForInquiry}
      />

      {/* Executive CV & LinkedIn Profile Kit Modal */}
      <ResumePreviewModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
