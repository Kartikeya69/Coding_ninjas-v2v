'use client';

import React from 'react';
import { ResumeData } from '@/hooks/useResumeStore';
import { cn } from '@/utils/cn';

interface TemplateEngineProps {
  data: ResumeData;
  template: 'modern' | 'minimal' | 'developer' | 'corporate';
  targetRole?: string;
  zoom?: number;
}

export const TemplateEngine: React.FC<TemplateEngineProps> = ({
  data,
  template,
  targetRole,
  zoom = 1
}) => {
  const { details, summary, experience, education, projects, skills } = data;

  const fontStyle = (() => {
    switch (template) {
      case 'minimal':
        return 'font-serif';
      case 'developer':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  })();

  return (
    <div 
      className={cn(
        "bg-white text-black p-8 rounded-xs shadow-lg mx-auto origin-top select-text text-left transition-all duration-300",
        fontStyle
      )}
      style={{
        width: '210mm',
        minHeight: '297mm',
        transform: `scale(${zoom})`,
        marginBottom: `calc((297mm * (${zoom} - 1)))`
      }}
      id="resume-printable-area"
    >
      {/* 1. Header Details Layout */}
      <div className={cn(
        "border-b border-gray-300 pb-4 mb-5",
        template === 'minimal' ? 'text-center' : 'text-left'
      )}>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
          {details.fullName || 'YOUR FULL NAME'}
        </h1>
        {targetRole && (
          <h2 className="text-xs font-semibold text-primary mt-1 uppercase tracking-wider">
            {targetRole}
          </h2>
        )}
        <div className={cn(
          "flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-gray-500 mt-2 font-mono justify-start",
          template === 'minimal' && 'justify-center'
        )}>
          {details.email && <span>{details.email}</span>}
          {details.phone && <span>{details.phone}</span>}
          {details.location && <span>{details.location}</span>}
          {details.github && <span>github.com/{details.github}</span>}
          {details.linkedin && <span>linkedin.com/in/{details.linkedin}</span>}
        </div>
      </div>

      {/* 2. Professional Summary Section */}
      {summary && (
        <div className="mb-5">
          <h3 className="text-[10px] font-bold text-gray-900 border-b border-gray-200 pb-1 uppercase tracking-wider mb-2">
            Professional Summary
          </h3>
          <p className="text-[10px] text-gray-700 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* 3. Work Experience Section */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h3 className="text-[10px] font-bold text-gray-900 border-b border-gray-200 pb-1 uppercase tracking-wider mb-2">
            Work Experience
          </h3>
          <div className="flex flex-col gap-4">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-900">
                  <span>{exp.role} — {exp.company}</span>
                  <span className="text-[9px] font-normal text-gray-500 font-mono">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="list-disc pl-4 mt-1.5 flex flex-col gap-1 text-[10px] text-gray-700">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Projects Section */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h3 className="text-[10px] font-bold text-gray-900 border-b border-gray-200 pb-1 uppercase tracking-wider mb-2">
            Featured Projects
          </h3>
          <div className="flex flex-col gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-900">
                  <span>{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[9px] font-normal text-primary font-mono">
                      [{proj.technologies}]
                    </span>
                  )}
                </div>
                {proj.bullets.length > 0 && (
                  <ul className="list-disc pl-4 mt-1.5 flex flex-col gap-1 text-[10px] text-gray-700">
                    {proj.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Education Section */}
      {education.length > 0 && (
        <div className="mb-5">
          <h3 className="text-[10px] font-bold text-gray-900 border-b border-gray-200 pb-1 uppercase tracking-wider mb-2">
            Education
          </h3>
          <div className="flex flex-col gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start text-[10px] text-gray-800">
                <div>
                  <span className="font-bold text-gray-900">{edu.school}</span>
                  <span className="text-gray-500"> — {edu.degree} {edu.major ? `in ${edu.major}` : ''}</span>
                </div>
                <span className="text-[9px] font-mono text-gray-500 shrink-0">{edu.graduationYear}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Skills Section */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h3 className="text-[10px] font-bold text-gray-900 border-b border-gray-200 pb-1 uppercase tracking-wider mb-2">
            Skills & Competencies
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {skills.map((s, idx) => (
              <span 
                key={idx} 
                className={cn(
                  "text-[9px] border border-gray-300 rounded px-2 py-0.5 text-gray-700 font-medium font-mono bg-gray-50",
                  template === 'developer' && 'border-gray-900 text-black font-bold'
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateEngine;
