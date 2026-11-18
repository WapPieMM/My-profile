import React, { useEffect, useState } from 'react';
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Minimize2, Check } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';
import { ResilientImage } from './ResilientImage';

interface ProjectLightboxModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onSelectForInquiry: (project: ProjectItem) => void;
}

export const ProjectLightboxModal: React.FC<ProjectLightboxModalProps> = ({
  project,
  onClose,
  onNavigate,
  onSelectForInquiry,
}) => {
  const [expandedImage, setExpandedImage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!project) return;
    setExpandedImage(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose, onNavigate]);

  if (!project) return null;

  const handleCopyCaseStudyUrl = () => {
    const shareUrl = `${window.location.origin}/#project-${project.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-project-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#FAF9F6] text-zinc-900 rounded-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header Bar */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4 border-b border-zinc-200 bg-[#FAF9F6] shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-500 truncate">
            <span className="font-medium text-zinc-800">{project.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{project.year}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline truncate">{project.client}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('prev')}
              aria-label="ผลงานก่อนหน้า"
              className="w-10 h-10 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('next')}
              aria-label="ผลงานถัดไป"
              className="w-10 h-10 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดหน้าต่างแสดงผลงาน"
              className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Case Study Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* High-Resolution Media Frame */}
          <div className="relative group rounded-xl overflow-hidden border border-zinc-200 bg-zinc-900">
            <ResilientImage
              src={project.image}
              alt={project.title}
              fallbackTitle={project.title}
              fallbackGradient={project.fallbackGradient}
              containerClassName={`w-full transition-all duration-200 ${
                expandedImage ? 'aspect-auto max-h-[680px]' : 'aspect-video max-h-[460px]'
              } overflow-hidden bg-zinc-900`}
              className={`w-full h-full ${expandedImage ? 'object-contain' : 'object-cover'}`}
            />
            <button
              type="button"
              onClick={() => setExpandedImage((prev) => !prev)}
              className="absolute bottom-4 right-4 px-3 py-2 rounded-lg bg-zinc-950/80 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-zinc-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              {expandedImage ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>ปรับขนาดพอดีกรอบ</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ดูภาพเต็มสัดส่วน</span>
                </>
              )}
            </button>
          </div>

          {/* Title & Measurable Impact Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-6 border-b border-zinc-200">
            <div className="lg:col-span-8 space-y-2">
              <h2
                id="lightbox-project-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900"
              >
                {project.title}
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed">
                {project.subtitle}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                <span>บทบาท: {project.role}</span>
                <span aria-hidden="true">·</span>
                <span>ระยะเวลาดำเนินงาน: {project.duration}</span>
                <span aria-hidden="true">·</span>
                <span>ผู้ว่าจ้าง: {project.client}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-zinc-200">
              <p className="text-xs text-zinc-500 mb-1">ผลลัพธ์หลังส่งมอบงาน</p>
              <p className="text-lg font-bold text-blue-600 font-mono tabular-nums tracking-tight">
                {project.impactMetric}
              </p>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                {project.impactDetail}
              </p>
            </div>
          </div>

          {/* Case Study Narrative Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-900">
                01. ภาพรวมโปรเจกต์
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.summary}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-900">
                02. โจทย์และความท้าทาย
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-900">
                03. แนวทางการออกแบบและพัฒนา
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Deliverables & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-200">
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 mb-3">
                สิ่งที่ส่งมอบในโปรเจกต์ (Deliverables)
              </h4>
              <ul className="space-y-2 text-sm text-zinc-700">
                {project.deliverables.map((item) => (
                  <li key={item} className="flex items-baseline gap-2.5">
                    <span className="text-blue-600 font-mono text-xs">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-500 mb-3">
                เทคโนโลยีและเครื่องมือที่ใช้ (Tools & Architecture)
              </h4>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {project.techAndTools.join(' · ')}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectForInquiry(project)}
                  className="px-4 py-2.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>ปรึกษาโปรเจกต์ลักษณะนี้</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyCaseStudyUrl}
                  className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-xs font-medium rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>คัดลอกลิงก์ผลงานแล้ว</span>
                    </>
                  ) : (
                    <span>คัดลอกลิงก์ Case Study</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
