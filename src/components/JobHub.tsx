import React, { useState } from "react";
import { UserProfile, Job, Application } from "../types";
import { Search, Briefcase, MapPin, DollarSign, Filter, FileText, Loader2, Copy, CheckCircle, ArrowUpRight } from "lucide-react";

interface JobHubProps {
  profile: UserProfile;
  jobs: Job[];
  applications: Application[];
  onTrackJob: (job: Job) => void;
}

export default function JobHub({ profile, jobs, applications, onTrackJob }: JobHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  
  // Cover Letter States
  const [draftingJobId, setDraftingJobId] = useState<string | null>(null);
  const [draftedLetter, setDraftedLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRemote = !remoteOnly || job.remote;
    return matchSearch && matchRemote;
  });

  const handleDraftCoverLetter = async (job: Job) => {
    setDraftingJobId(job.id);
    setDraftedLetter(null);
    setCopied(false);

    try {
      const response = await fetch("/api/jobs/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          description: job.description,
          userProfile: profile,
        }),
      });
      const data = await response.json();
      setDraftedLetter(data.letter);
    } catch (err) {
      console.error(err);
      setDraftedLetter("Error connecting to cover letter drafting service. Please try again.");
    } finally {
      setDraftingJobId(null);
    }
  };

  const handleCopy = () => {
    if (draftedLetter) {
      navigator.clipboard.writeText(draftedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6" id="job-hub-root">
      {/* Page Title */}
      <div id="job-hub-title-wrapper">
        <h1 className="text-xl font-bold text-white tracking-tight" id="title-job-hub">AI Job & Internship Hub</h1>
        <p className="text-xs text-gray-400" id="desc-job-hub">Explore AI-matched remote positions, evaluate package insights, and draft custom cover letters instantly</p>
      </div>

      {/* Filtering Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card border border-white/5 p-4 rounded-2xl" id="job-filter-panel">
        <div className="flex-1 relative" id="job-search-box">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" id="icon-search" />
          <input
            type="text"
            placeholder="Search job titles, skills, or companies..."
            className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/25"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="input-job-search"
          />
        </div>

        <div className="flex items-center space-x-4" id="job-switches-group">
          {/* Remote Toggle Switch */}
          <button
            type="button"
            onClick={() => setRemoteOnly(!remoteOnly)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              remoteOnly
                ? "bg-brand-violet/10 border-brand-violet text-brand-violet shadow-sm shadow-brand-violet/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
            id="btn-toggle-remote"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Remote Only</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="job-hub-bento-grid">
        {/* Left Columns: Job Listings */}
        <div className="lg:col-span-2 space-y-4" id="job-listings-panel">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 glass-card border border-white/5 rounded-3xl" id="empty-jobs">
              <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-xs text-gray-400">No matching job listings found.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isAlreadyTracked = applications.some((app) => app.title === job.title && app.providerOrCompany === job.company);
              
              return (
                <div
                  key={job.id}
                  className="glass-card border border-white/5 hover:border-brand-violet/25 p-6 rounded-3xl flex flex-col justify-between shadow-xl relative group transition-all"
                  id={`job-card-${job.id}`}
                >
                  {/* Matching Indicator */}
                  <div className="absolute top-5 right-5 px-2.5 py-1 bg-brand-violet/10 text-brand-violet border border-brand-violet/25 rounded-lg text-[10px] font-bold" id={`job-match-badge-${job.id}`}>
                    {job.matchScore}% Match
                  </div>

                  <div className="space-y-3" id={`job-content-${job.id}`}>
                    <div id={`job-headers-${job.id}`}>
                      <span className="text-[10px] uppercase font-bold text-brand-magenta tracking-widest" id={`job-company-${job.id}`}>{job.company}</span>
                      <h3 className="text-sm font-bold text-white group-hover:text-brand-violet transition-colors mt-0.5" id={`job-title-${job.id}`}>{job.title}</h3>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed" id={`job-desc-${job.id}`}>{job.description}</p>

                    {/* Metadata indicators */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-gray-400 border-t border-white/5 pt-3" id={`job-meta-${job.id}`}>
                      <span className="flex items-center space-x-1" id={`job-loc-${job.id}`}>
                        <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1" id={`job-sal-${job.id}`}>
                        <DollarSign className="w-3.5 h-3.5 text-brand-emerald" />
                        <span className="text-brand-emerald font-bold">{job.salary}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-white/5 text-gray-300 border border-white/10 rounded-lg" id={`job-type-${job.id}`}>
                        {job.type}
                      </span>
                    </div>

                    {/* Salary Insights */}
                    <div className="p-3 bg-brand-violet/5 border border-brand-violet/10 rounded-xl text-[10.5px] text-gray-300 leading-relaxed" id={`job-insights-${job.id}`}>
                      <span className="font-bold block text-white text-[9px] uppercase tracking-wider mb-1">AI Package Insights</span>
                      {job.salaryInsights}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5" id={`job-actions-${job.id}`}>
                    <button
                      type="button"
                      onClick={() => onTrackJob(job)}
                      disabled={isAlreadyTracked}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        isAlreadyTracked
                          ? "bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald"
                          : "bg-transparent border-white/10 hover:border-brand-violet/20 text-gray-400 hover:text-white"
                      }`}
                      id={`btn-track-job-${job.id}`}
                    >
                      {isAlreadyTracked ? "✓ Saved in Tracker" : "Track Application"}
                    </button>

                    <div className="flex items-center space-x-2" id={`btn-group-job-${job.id}`}>
                      <button
                        type="button"
                        onClick={() => handleDraftCoverLetter(job)}
                        className="px-3 py-2 bg-white/5 border border-white/10 hover:border-brand-magenta/30 hover:bg-brand-magenta/5 text-gray-300 font-bold rounded-xl text-[10px] flex items-center space-x-1 cursor-pointer transition-colors"
                        id={`btn-draft-letter-${job.id}`}
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-magenta" />
                        <span>Draft Cover Letter</span>
                      </button>
                      <a
                        href={job.link}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="px-3.5 py-2 bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-90 text-white font-bold rounded-xl text-[10px] flex items-center space-x-1 cursor-pointer shadow-md shadow-brand-violet/20"
                        id={`btn-apply-job-${job.id}`}
                      >
                        <span>Apply</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Columns: Active Cover Letter Workspace */}
        <div className="space-y-4" id="job-sidebar-panel">
          <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4 h-[520px] flex flex-col justify-between relative overflow-hidden" id="box-letter-workspace">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 flex-1 flex flex-col overflow-hidden z-10 relative" id="letter-content-wrapper">
              <h3 className="text-xs font-semibold text-white tracking-widest uppercase flex items-center space-x-2 font-display" id="lbl-letter-workspace">
                <FileText className="w-4 h-4 text-brand-magenta" />
                <span>AI Cover Letter Workspace</span>
              </h3>

              {draftingJobId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3" id="letter-drafting-loader">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-magenta" />
                  <p className="text-xs text-gray-400">Gemini is structuring your cover letter using your skill matrix...</p>
                </div>
              ) : draftedLetter ? (
                <div className="flex-1 flex flex-col justify-between overflow-hidden" id="letter-draft-result">
                  <div className="bg-white/5 p-4 border border-white/10 rounded-xl overflow-y-auto text-[10.5px] leading-relaxed text-gray-300 font-mono whitespace-pre-line flex-1 select-all" id="box-letter-text">
                    {draftedLetter}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3 animate-fadeIn" id="letter-results-actions">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Ready for clipboard</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3.5 py-2 bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-90 text-white font-bold rounded-xl text-[10px] flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-violet/20"
                      id="btn-copy-letter"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-brand-emerald" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-white" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-white/10 rounded-2xl" id="letter-workspace-idle">
                  <FileText className="w-10 h-10 text-gray-600 mb-2" />
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Click "Draft Cover Letter" on any matching position to trigger server-side Gemini custom templates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
