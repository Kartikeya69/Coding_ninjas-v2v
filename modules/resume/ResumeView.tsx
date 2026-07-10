'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  Layout, 
  ChevronDown, 
  Gauge, 
  Eye, 
  CheckCircle2, 
  FolderPlus,
  RefreshCw
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useResumeStore, Resume, ResumeExperience, ResumeProject, ResumeEducation } from '@/hooks/useResumeStore';
import { resumeSections } from '@/config/resumeSections';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

// Sub components
import { TemplateEngine } from './TemplateEngine';
import { InlineAIPanel } from './InlineAIPanel';
import { ATSReportWidget } from './ATSReportWidget';
import { ExportButton } from './ExportButton';

// External helper to generate unique IDs, avoiding render-time Date.now purity checks
let idCounter = 0;
const generateId = (prefix: string) => {
  idCounter++;
  return `${prefix}_${Date.now()}_${idCounter}`;
};

export const ResumeView: React.FC = () => {
  const { profile } = useUser();
  const { 
    resumes, 
    activeResumeId, 
    saveStatus, 
    isAnalyzing, 
    activeAnalysis,
    loadResumes, 
    createResume, 
    updateActiveResume, 
    setActiveResumeId,
    setAnalysis,
    setAnalyzing
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'ats'>('editor');
  const [activeSectionId, setActiveSectionId] = useState<string>('details');
  const [targetJobDescription, setTargetJobDescription] = useState<string>('');
  
  // Multi-resume creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [newResumeRole, setNewResumeRole] = useState('');
  const [newResumeTemplate, setNewResumeTemplate] = useState<'modern' | 'minimal' | 'developer' | 'corporate'>('modern');

  // Preview zoom level
  const [zoom, setZoom] = useState<number>(0.85);

  // Initial load
  useEffect(() => {
    if (profile?.uid) {
      loadResumes(profile.uid);
    }
  }, [profile?.uid, loadResumes]);

  const activeResume = resumes.find(r => r.id === activeResumeId);

  // Trigger ATS Review API call
  const triggerATSReview = async () => {
    if (!profile?.uid || !activeResume) return;
    setAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.uid,
          resumeData: activeResume,
          jobDescription: targetJobDescription
        })
      });

      const res = await response.json();
      if (res.success) {
        setAnalysis(res.analysis);
        
        // Push the new score onto history logs
        const updatedHistory = [
          ...activeResume.scoreHistory,
          { date: new Date().toLocaleDateString(), score: res.analysis.matchScore }
        ].slice(-4); // keep last 4 scans

        await updateActiveResume(profile.uid, {
          scoreHistory: updatedHistory
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Create new resume callback
  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid || !newResumeName.trim() || !newResumeRole.trim()) return;

    try {
      await createResume(profile.uid, newResumeName, newResumeRole, newResumeTemplate);
      setNewResumeName('');
      setNewResumeRole('');
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Update specific fields callback
  const handleDetailsChange = (field: string, value: string) => {
    if (!profile?.uid || !activeResume) return;
    updateActiveResume(profile.uid, {
      details: {
        ...activeResume.data.details,
        [field]: value
      }
    });
  };

  const handleSummaryChange = (val: string) => {
    if (!profile?.uid || !activeResume) return;
    updateActiveResume(profile.uid, { summary: val });
  };

  // Add/Remove Education block
  const addEducation = () => {
    if (!profile?.uid || !activeResume) return;
    const items = [...activeResume.data.education];
    items.push({
      id: generateId('edu'),
      school: '',
      degree: '',
      major: '',
      graduationYear: ''
    });
    updateActiveResume(profile.uid, { education: items });
  };

  const updateEducation = (id: string, field: keyof ResumeEducation, value: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateActiveResume(profile.uid, { education: items });
  };

  const deleteEducation = (id: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.education.filter(edu => edu.id !== id);
    updateActiveResume(profile.uid, { education: items });
  };

  // Add/Remove Experience block
  const addExperience = () => {
    if (!profile?.uid || !activeResume) return;
    const items = [...activeResume.data.experience];
    items.push({
      id: generateId('exp'),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      bullets: ['Worked on frontend development']
    });
    updateActiveResume(profile.uid, { experience: items });
  };

  const updateExperience = (id: string, field: keyof Omit<ResumeExperience, 'bullets'>, value: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateActiveResume(profile.uid, { experience: items });
  };

  const updateExperienceBullet = (expId: string, bulletIdx: number, value: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.experience.map(exp => {
      if (exp.id === expId) {
        const nextBullets = [...exp.bullets];
        nextBullets[bulletIdx] = value;
        return { ...exp, bullets: nextBullets };
      }
      return exp;
    });
    updateActiveResume(profile.uid, { experience: items });
  };

  const addExperienceBullet = (expId: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.experience.map(exp => 
      exp.id === expId ? { ...exp, bullets: [...exp.bullets, 'New key highlight achievement'] } : exp
    );
    updateActiveResume(profile.uid, { experience: items });
  };

  const deleteExperienceBullet = (expId: string, bulletIdx: number) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.experience.map(exp => {
      if (exp.id === expId) {
        return { ...exp, bullets: exp.bullets.filter((_, idx) => idx !== bulletIdx) };
      }
      return exp;
    });
    updateActiveResume(profile.uid, { experience: items });
  };

  const deleteExperience = (id: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.experience.filter(exp => exp.id !== id);
    updateActiveResume(profile.uid, { experience: items });
  };

  // Add/Remove Projects block
  const addProject = () => {
    if (!profile?.uid || !activeResume) return;
    const items = [...activeResume.data.projects];
    items.push({
      id: generateId('proj'),
      name: '',
      technologies: '',
      bullets: ['Implemented full-stack architecture features.']
    });
    updateActiveResume(profile.uid, { projects: items });
  };

  const updateProject = (id: string, field: keyof Omit<ResumeProject, 'bullets'>, value: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.projects.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    updateActiveResume(profile.uid, { projects: items });
  };

  const updateProjectBullet = (projId: string, bulletIdx: number, value: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.projects.map(p => {
      if (p.id === projId) {
        const nextBullets = [...p.bullets];
        nextBullets[bulletIdx] = value;
        return { ...p, bullets: nextBullets };
      }
      return p;
    });
    updateActiveResume(profile.uid, { projects: items });
  };

  const addProjectBullet = (projId: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.projects.map(p => 
      p.id === projId ? { ...p, bullets: [...p.bullets, 'New project milestone detail'] } : p
    );
    updateActiveResume(profile.uid, { projects: items });
  };

  const deleteProjectBullet = (projId: string, bulletIdx: number) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.projects.map(p => {
      if (p.id === projId) {
        return { ...p, bullets: p.bullets.filter((_, idx) => idx !== bulletIdx) };
      }
      return p;
    });
    updateActiveResume(profile.uid, { projects: items });
  };

  const deleteProject = (id: string) => {
    if (!profile?.uid || !activeResume) return;
    const items = activeResume.data.projects.filter(p => p.id !== id);
    updateActiveResume(profile.uid, { projects: items });
  };

  // Add/Remove Skills tag
  const handleAddSkill = (skill: string) => {
    if (!profile?.uid || !activeResume || !skill.trim()) return;
    const list = [...activeResume.data.skills];
    if (!list.includes(skill.trim())) {
      list.push(skill.trim());
      updateActiveResume(profile.uid, { skills: list });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    if (!profile?.uid || !activeResume) return;
    const list = activeResume.data.skills.filter(s => s !== skill);
    updateActiveResume(profile.uid, { skills: list });
  };

  // Document Printable Export triggers
  const handleTriggerExport = (format: 'pdf' | 'markdown' | 'json') => {
    if (!activeResume) return;

    if (format === 'pdf') {
      window.print();
    } else if (format === 'markdown') {
      const mdContent = `# ${activeResume.data.details.fullName}\n\n${activeResume.data.summary}\n`;
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeResume.name.replace(/\s+/g, '_')}_resume.md`;
      link.click();
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(activeResume, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeResume.name.replace(/\s+/g, '_')}_resume.json`;
      link.click();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 select-none animate-in fade-in duration-300 relative">
      
      {/* Hidden layout style overrides for device browser print models */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, nav, aside, button, .no-print, input, textarea {
            display: none !important;
          }
          #resume-printable-area {
            transform: scale(1) !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            width: 100% !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Toolbar / Select bar */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Resume Studio</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Optimize experience summaries, audit keywords ATS compliance score ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Resume Selector */}
          <div className="relative">
            <select
              value={activeResumeId || ''}
              onChange={(e) => setActiveResumeId(e.target.value || null)}
              className="bg-card border border-border rounded-lg text-xs font-semibold text-white px-3 py-1.5 focus:border-primary outline-none cursor-pointer"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-white transition-all cursor-pointer border border-border"
          >
            <FolderPlus className="h-4 w-4" />
          </button>

          {activeResume && (
            <ExportButton onTriggerExport={handleTriggerExport} className="no-print" />
          )}
        </div>
      </div>

      {activeResume ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Block: Nav Tabs & Forms Fields (Col 5) */}
          <div className="no-print lg:col-span-5 flex flex-col gap-4">
            
            {/* Editor Sections Selector */}
            <div className="flex bg-muted/20 p-0.5 rounded-lg border border-border/30">
              {resumeSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    "flex-1 text-[9px] uppercase tracking-wider font-bold py-1.5 rounded-md transition-all cursor-pointer",
                    activeSectionId === section.id ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-white'
                  )}
                >
                  {section.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Structured Form Container */}
            <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-5 flex flex-col gap-4">
              
              {/* STATUS BAR */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-border/30 pb-2 mb-1">
                <span>Section: <strong className="text-white">{activeSectionId.toUpperCase()}</strong></span>
                <span>{saveStatus === 'saving' ? 'Saving changes...' : 'Changes Autosaved'}</span>
              </div>

              {/* 1. PERSONAL DETAILS SECTION */}
              {activeSectionId === 'details' && (
                <div className="flex flex-col gap-3 text-left">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={activeResume.data.details.fullName}
                      onChange={(e) => handleDetailsChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase">Email</label>
                      <input 
                        type="email" 
                        value={activeResume.data.details.email}
                        onChange={(e) => handleDetailsChange('email', e.target.value)}
                        placeholder="john@doe.com"
                        className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase">Phone</label>
                      <input 
                        type="text" 
                        value={activeResume.data.details.phone}
                        onChange={(e) => handleDetailsChange('phone', e.target.value)}
                        placeholder="+1-234-567-890"
                        className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase">Target Role / Designation</label>
                    <input 
                      type="text" 
                      value={activeResume.targetRole}
                      onChange={(e) => updateActiveResume(profile?.uid || '', { targetRole: e.target.value })}
                      placeholder="Frontend Software Engineer"
                      className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase">GitHub Username</label>
                      <input 
                        type="text" 
                        value={activeResume.data.details.github}
                        onChange={(e) => handleDetailsChange('github', e.target.value)}
                        placeholder="johndoe"
                        className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase">LinkedIn Username</label>
                      <input 
                        type="text" 
                        value={activeResume.data.details.linkedin}
                        onChange={(e) => handleDetailsChange('linkedin', e.target.value)}
                        placeholder="john-doe"
                        className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PROFESSIONAL SUMMARY */}
              {activeSectionId === 'summary' && (
                <div className="flex flex-col gap-3 text-left">
                  <label className="text-[10px] text-muted-foreground font-semibold uppercase">Summary text</label>
                  <textarea 
                    value={activeResume.data.summary}
                    onChange={(e) => handleSummaryChange(e.target.value)}
                    placeholder="Brief professional details..."
                    rows={6}
                    className="w-full text-xs rounded-lg border border-border bg-muted/10 px-3 py-2 text-white outline-none focus:border-primary/50 resize-none"
                  />
                  <InlineAIPanel 
                    originalText={activeResume.data.summary} 
                    onApply={handleSummaryChange} 
                    sectionId="summary" 
                  />
                </div>
              )}

              {/* 3. WORK EXPERIENCE LIST */}
              {activeSectionId === 'experience' && (
                <div className="flex flex-col gap-4 text-left">
                  {activeResume.data.experience.map((exp) => (
                    <div key={exp.id} className="p-3 bg-muted/10 border border-border/60 rounded-lg flex flex-col gap-2 relative">
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-red-400 p-1 rounded hover:bg-muted/30 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-muted-foreground uppercase font-bold">Company</label>
                          <input 
                            type="text" 
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Stripe"
                            className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-muted-foreground uppercase font-bold">Role</label>
                          <input 
                            type="text" 
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                            placeholder="Software Engineer"
                            className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-muted-foreground uppercase font-bold">Start Date</label>
                          <input 
                            type="text" 
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="June 2024"
                            className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-muted-foreground uppercase font-bold">End Date</label>
                          <input 
                            type="text" 
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="Present"
                            className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                          />
                        </div>
                      </div>

                      {/* Experience Bullet Items */}
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold">Key highlights & bullet items</span>
                        {exp.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5 p-2 bg-muted/15 border border-border/30 rounded">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={bullet}
                                onChange={(e) => updateExperienceBullet(exp.id, idx, e.target.value)}
                                className="flex-1 bg-background border border-border rounded-lg px-2 py-1 text-[10.5px] text-white outline-none focus:border-primary/50"
                              />
                              <button 
                                onClick={() => deleteExperienceBullet(exp.id, idx)}
                                className="text-muted-foreground hover:text-red-400 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <InlineAIPanel 
                              originalText={bullet} 
                              onApply={(newText) => updateExperienceBullet(exp.id, idx, newText)} 
                              sectionId="experience" 
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => addExperienceBullet(exp.id)}
                          className="mt-1 self-start flex items-center gap-1 text-[10px] text-primary hover:underline cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Bullet Point</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addExperience}
                    className="w-full py-2 border border-dashed border-border rounded-lg hover:border-primary text-xs text-white hover:text-primary transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Work Experience Block</span>
                  </button>
                </div>
              )}

              {/* 4. EDUCATION SECTION */}
              {activeSectionId === 'education' && (
                <div className="flex flex-col gap-4 text-left">
                  {activeResume.data.education.map((edu) => (
                    <div key={edu.id} className="p-3 bg-muted/10 border border-border/60 rounded-lg flex flex-col gap-2 relative">
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-red-400 p-1 rounded hover:bg-muted/30 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-muted-foreground uppercase font-bold">Institution / School</label>
                        <input 
                          type="text" 
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          placeholder="Stanford University"
                          className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-muted-foreground uppercase font-bold">Degree</label>
                          <input 
                            type="text" 
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Bachelor of Science"
                            className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-muted-foreground uppercase font-bold">Major</label>
                          <input 
                            type="text" 
                            value={edu.major}
                            onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                            placeholder="Computer Science"
                            className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-muted-foreground uppercase font-bold">Graduation Year</label>
                        <input 
                          type="text" 
                          value={edu.graduationYear}
                          onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                          placeholder="2026"
                          className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addEducation}
                    className="w-full py-2 border border-dashed border-border rounded-lg hover:border-primary text-xs text-white hover:text-primary transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Education Block</span>
                  </button>
                </div>
              )}

              {/* 5. PROJECTS SECTION */}
              {activeSectionId === 'projects' && (
                <div className="flex flex-col gap-4 text-left">
                  {activeResume.data.projects.map((proj) => (
                    <div key={proj.id} className="p-3 bg-muted/10 border border-border/60 rounded-lg flex flex-col gap-2 relative">
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-red-400 p-1 rounded hover:bg-muted/30 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-muted-foreground uppercase font-bold">Project Name</label>
                          <input 
                            type="text" 
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                            placeholder="Lumina Career OS"
                            className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-muted-foreground uppercase font-bold">Technologies</label>
                          <input 
                            type="text" 
                            value={proj.technologies}
                            onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                            placeholder="TypeScript, NextJS, Firestore"
                            className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-primary/50"
                          />
                        </div>
                      </div>

                      {/* Project Bullet Highlights */}
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold">Project Bullet Highlights</span>
                        {proj.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5 p-2 bg-muted/15 border border-border/30 rounded">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={bullet}
                                onChange={(e) => updateProjectBullet(proj.id, idx, e.target.value)}
                                className="flex-1 bg-background border border-border rounded-lg px-2 py-1 text-[10.5px] text-white outline-none focus:border-primary/50"
                              />
                              <button 
                                onClick={() => deleteProjectBullet(proj.id, idx)}
                                className="text-muted-foreground hover:text-red-400 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <InlineAIPanel 
                              originalText={bullet} 
                              onApply={(newText) => updateProjectBullet(proj.id, idx, newText)} 
                              sectionId="projects" 
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => addProjectBullet(proj.id)}
                          className="mt-1 self-start flex items-center gap-1 text-[10px] text-primary hover:underline cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Bullet Point</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addProject}
                    className="w-full py-2 border border-dashed border-border rounded-lg hover:border-primary text-xs text-white hover:text-primary transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Project Block</span>
                  </button>
                </div>
              )}

              {/* 6. SKILLS SECTION */}
              {activeSectionId === 'skills' && (
                <div className="flex flex-col gap-3 text-left">
                  <label className="text-[10px] text-muted-foreground font-semibold uppercase">Add Skills Tag</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Next.js (press enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.currentTarget;
                        handleAddSkill(target.value);
                        target.value = '';
                      }
                    }}
                    className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {activeResume.data.skills.map((skill) => (
                      <span 
                        key={skill}
                        onClick={() => handleRemoveSkill(skill)}
                        className="px-2.5 py-1 rounded-md border border-primary/20 bg-primary/5 text-[9px] font-mono text-primary cursor-pointer hover:border-red-400 hover:text-red-400 transition-all flex items-center gap-1"
                      >
                        <span>{skill}</span>
                        <span>&times;</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Block: Live Preview, ATS audit & Zoom Panels (Col 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Toolbar Tabs */}
            <div className="no-print flex items-center justify-between border-b border-border/40 pb-2.5">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer",
                    activeTab === 'preview' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Live Preview</span>
                </button>

                <button
                  onClick={() => setActiveTab('ats')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer",
                    activeTab === 'ats' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'
                  )}
                >
                  <Gauge className="h-3.5 w-3.5" />
                  <span>ATS Intelligence Audit</span>
                </button>
              </div>

              {/* Template Preference Dropdown & Zoom slider */}
              {activeTab === 'preview' && (
                <div className="flex items-center gap-2">
                  <select
                    value={activeResume.template}
                    onChange={(e) => updateActiveResume(profile?.uid || '', { template: e.target.value as Resume['template'] })}
                    className="bg-card border border-border rounded px-2.5 py-1 text-[10px] text-white cursor-pointer"
                  >
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="developer">Developer</option>
                  </select>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-muted/60 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* TAB CONTENT: Preview Canvas Frame */}
            {activeTab === 'preview' && (
              <div className="rounded-xl border border-border bg-card/25 backdrop-blur-xl p-4 overflow-x-auto relative flex justify-center items-start min-h-[70vh]">
                <TemplateEngine 
                  data={activeResume.data} 
                  template={activeResume.template} 
                  targetRole={activeResume.targetRole}
                  zoom={zoom} 
                />
              </div>
            )}

            {/* TAB CONTENT: ATS Audit Report & Job targets */}
            {activeTab === 'ats' && (
              <div className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col gap-6 text-left min-h-[70vh]">
                
                {/* Audit trigger section */}
                <div className="flex flex-col gap-2.5 p-4.5 rounded-xl border border-border/80 bg-muted/10">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold">Close gaps against specific target job description:</label>
                  <textarea
                    value={targetJobDescription}
                    onChange={(e) => setTargetJobDescription(e.target.value)}
                    placeholder="Paste the target job description here..."
                    rows={4}
                    className="w-full text-xs rounded-lg border border-border bg-background/50 px-3 py-2 text-white outline-none focus:border-primary/50 resize-none"
                  />
                  <button
                    onClick={triggerATSReview}
                    disabled={isAnalyzing}
                    className="mt-1 py-2.5 rounded-xl bg-linear-to-tr from-primary to-secondary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-primary/10"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Running ATS compatibility Audit...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Run AI ATS Review</span>
                      </>
                    )}
                  </button>
                </div>

                <ATSReportWidget 
                  analysis={activeAnalysis} 
                  scoreHistory={activeResume.scoreHistory} 
                />

              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-3">
          <span>You haven&apos;t created any resumes yet.</span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/95"
          >
            Create Your First Resume
          </button>
        </div>
      )}

      {/* CREATE NEW RESUME MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5 flex flex-col gap-4 font-sans text-left"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create New Resume Workspace</h3>
            <form onSubmit={handleCreateResume} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase font-bold">Resume Name</label>
                <input 
                  type="text" 
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  placeholder="e.g. Stripe Backend Intern Resume"
                  required
                  className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase font-bold">Target Job Role</label>
                <input 
                  type="text" 
                  value={newResumeRole}
                  onChange={(e) => setNewResumeRole(e.target.value)}
                  placeholder="e.g. Backend Software Engineer"
                  required
                  className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase font-bold">Layout Template</label>
                <select
                  value={newResumeTemplate}
                  onChange={(e) => setNewResumeTemplate(e.target.value as Resume['template'])}
                  className="bg-muted/10 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="developer">Developer</option>
                </select>
              </div>

              <div className="flex gap-2.5 mt-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-muted text-muted-foreground hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ResumeView;
