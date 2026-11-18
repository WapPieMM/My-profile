import React, { useEffect, useState } from 'react';
import { X, Printer, Check, Copy } from 'lucide-react';
import {
  PROFILE_DATA,
  EXPERIENCE_TIMELINE,
  CRAFT_CAPABILITIES,
  HERO_METRICS,
} from '../data/portfolioData';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLinkedinBio = () => {
    const bioText = `${PROFILE_DATA.fullNameThai} (${PROFILE_DATA.fullNameEn})\n${PROFILE_DATA.roleTitle}\n\n${PROFILE_DATA.leadBio}\n\nผลงานเด่น: 42 โปรเจกต์ระดับสากล | ค่าเฉลี่ย Conversion +138% | คะแนนรีวิว 4.98/5.0\nติดต่อ: ${PROFILE_DATA.email} | LinkedIn: ${PROFILE_DATA.linkedinHandle}`;
    navigator.clipboard.writeText(bioText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white text-zinc-900 rounded-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-zinc-200 bg-[#FAF9F6] shrink-0">
          <div>
            <h2 id="resume-modal-title" className="text-sm font-bold text-zinc-900">
              ประวัติย่อและข้อมูลสรุปสำหรับผู้ว่าจ้าง (Executive CV & LinkedIn Profile Kit)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLinkedinBio}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>คัดลอกข้อความแนะนำตัวแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอก Bio สำหรับแปะ LinkedIn</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">พิมพ์ / บันทึก PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดหน้าต่างเรซูเม่"
              className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                {PROFILE_DATA.fullNameThai}
              </h3>
              <p className="text-sm font-medium text-zinc-500 mt-0.5">
                {PROFILE_DATA.fullNameEn} · {PROFILE_DATA.roleTitle}
              </p>
            </div>
            <div className="text-xs text-zinc-600 space-y-1 sm:text-right font-mono">
              <p>{PROFILE_DATA.email}</p>
              <p>{PROFILE_DATA.linkedinHandle}</p>
              <p>Tel: {PROFILE_DATA.phone} · Line: {PROFILE_DATA.lineId}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400">
              01. สรุปประวัติและความเชี่ยวชาญ
            </h4>
            <p className="text-sm text-zinc-700 leading-relaxed">
              {PROFILE_DATA.leadBio}
            </p>
          </div>

          {/* Key Quantitative Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-zinc-200">
            {HERO_METRICS.map((m) => (
              <div key={m.value}>
                <p className="text-lg font-bold text-zinc-900 font-mono tabular-nums">
                  {m.value}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Experience History */}
          <div className="space-y-5">
            <h4 className="text-xs font-semibold text-zinc-400">
              02. ประสบการณ์การทำงาน (Work Experience)
            </h4>
            <div className="space-y-6">
              {EXPERIENCE_TIMELINE.map((exp) => (
                <div
                  key={exp.index}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 pb-5 border-b border-zinc-100 last:border-b-0 last:pb-0"
                >
                  <div className="sm:col-span-4">
                    <p className="text-xs font-mono text-zinc-500 tabular-nums">
                      {exp.period}
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 mt-0.5">
                      {exp.organization}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{exp.location}</p>
                  </div>
                  <div className="sm:col-span-8 space-y-1.5">
                    <p className="text-sm font-bold text-zinc-900">{exp.role}</p>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {exp.description}
                    </p>
                    <p className="text-xs font-medium text-blue-600 pt-1">
                      ผลงานสำคัญ: {exp.keyAchievement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Competencies */}
          <div className="space-y-4 pt-2 border-t border-zinc-200">
            <h4 className="text-xs font-semibold text-zinc-400">
              03. ทักษะและขอบเขตงานที่เชี่ยวชาญ (Core Craft & Stack)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {CRAFT_CAPABILITIES.map((craft) => (
                <div key={craft.index} className="space-y-1.5">
                  <p className="text-xs font-bold text-zinc-900">{craft.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {craft.tools.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-600">
            <div>
              <span className="font-semibold text-zinc-900">การศึกษา: </span>
              <span>ปริญญาตรี สถาปัตยกรรมศาสตรบัณฑิต (เกียรตินิยมอันดับ 1) · จุฬาลงกรณ์มหาวิทยาลัย</span>
            </div>
            <div className="font-mono text-zinc-500">
              ภาษา: ไทย (เจ้าของภาษา) · อังกฤษ (ระดับทำงานร่วมกับทีมต่างชาติ C1)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
