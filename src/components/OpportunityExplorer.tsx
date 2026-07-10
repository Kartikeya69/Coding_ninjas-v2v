import React, { useState } from "react";
import { UserProfile, Opportunity, OpportunityCategory, Application, ApplicationStatus } from "../types";
import { Award, Clock, Search, ExternalLink, ShieldAlert, CheckCircle2, Bookmark, FolderOpen, Tag, ArrowUpRight } from "lucide-react";

interface OpportunityExplorerProps {
  profile: UserProfile;
  opportunities: Opportunity[];
  applications: Application[];
  onSaveOpportunity: (opp: Opportunity) => void;
  onUpdateAppStatus: (appId: string, status: ApplicationStatus) => void;
}

export default function OpportunityExplorer({
  profile,
  opportunities,
  applications,
  onSaveOpportunity,
  onUpdateAppStatus,
}: OpportunityExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<OpportunityCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"explore" | "tracker">("explore");

  const categories: (OpportunityCategory | "All")[] = [
    "All",
    "Scholarships",
    "Grants",
    "Fellowships",
    "Hackathons",
    "Competitions",
    "Exchange Programs",
    "Internships",
    "Research Programs",
  ];

  // Filter opportunities based on search and category
  const filteredOpps = opportunities
    .filter((opp) => {
      const matchCat = activeCategory === "All" || opp.category === activeCategory;
      const matchSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    // Sort by Match Score descending by default
    .sort((a, b) => b.matchScore - a.matchScore);

  // Helper to color match scores
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20";
    if (score >= 80) return "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20";
    return "text-brand-violet bg-brand-violet/10 border-brand-violet/20";
  };

  // Helper to color urgency scores
  const getUrgencyBadge = (score: number, deadline: string) => {
    if (score >= 80) return { label: "High Urgency", classes: "bg-brand-coral/10 text-brand-coral border border-brand-coral/20" };
    if (score >= 50) return { label: "Moderate", classes: "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" };
    return { label: "Flexible", classes: "bg-white/5 text-gray-400 border border-white/10" };
  };

  return (
    <div className="space-y-6" id="opp-explorer-root">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 gap-4" id="opp-explorer-header">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight" id="opp-title">Opportunity Intelligence Engine</h1>
          <p className="text-xs text-gray-400" id="opp-subtitle">AI ranking, eligibility matching, and application timeline optimizer</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5" id="opp-tabs-wrapper">
          <button
            type="button"
            onClick={() => setActiveTab("explore")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "explore"
                ? "bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-md shadow-brand-violet/10"
                : "text-gray-400 hover:text-white"
            }`}
            id="tab-btn-explore"
          >
            Explore Matching ({opportunities.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tracker")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "tracker"
                ? "bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-md shadow-brand-violet/10"
                : "text-gray-400 hover:text-white"
            }`}
            id="tab-btn-tracker"
          >
            <span>Application Tracker</span>
            {applications.length > 0 && (
              <span className="px-1.5 py-0.5 bg-white/10 text-white text-[10px] font-extrabold rounded-full">
                {applications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "explore" ? (
        <div className="space-y-5" id="opp-explore-pane">
          {/* Filters, categories, and Search */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 glass-card border border-white/5 rounded-3xl p-5" id="opp-filter-panel">
            <div className="flex-1 relative" id="search-box">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" id="icon-search" />
              <input
                type="text"
                placeholder="Search opportunities (e.g., Google, Thiel, biotechnology, hackathon)..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/25 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="input-search-query"
              />
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-400 bg-white/5 px-3 py-2.5 rounded-xl border border-white/5" id="filter-meta">
              <Tag className="w-3.5 h-3.5 text-brand-violet" id="icon-tag-meta" />
              <span>Targeting: <span className="text-gray-200 font-semibold">{profile.country}</span></span>
            </div>
          </div>

          {/* Horizontal scrollable category ribbon */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none" id="categories-ribbon">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-brand-violet/15 border-brand-violet/40 text-brand-violet"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/15 hover:text-white"
                }`}
                id={`btn-cat-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of normalized opportunities */}
          {filteredOpps.length === 0 ? (
            <div className="text-center py-16 glass-card border border-white/5 rounded-3xl" id="empty-opps-box">
              <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" id="icon-empty-folder" />
              <p className="text-xs text-gray-400" id="empty-opps-text">No opportunities found matching "{searchQuery}" in category "{activeCategory}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="grid-opps">
              {filteredOpps.map((opp) => {
                const urgency = getUrgencyBadge(opp.urgencyScore, opp.deadline);
                const isAlreadySaved = applications.some((app) => app.opportunityId === opp.id);

                return (
                  <div
                    key={opp.id}
                    className="glass-card border border-white/5 hover:border-brand-violet/25 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative group transition-all"
                    id={`opp-card-${opp.id}`}
                  >
                    {/* Urgency & Match Score badges */}
                    <div className="flex items-center justify-between mb-4" id={`badges-opp-${opp.id}`}>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold ${urgency.classes}`} id={`urgency-badge-${opp.id}`}>
                        {urgency.label} ({opp.deadline})
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-extrabold ${getScoreColor(opp.matchScore)}`} id={`match-badge-${opp.id}`}>
                        {opp.matchScore}% Match
                      </span>
                    </div>

                    <div className="space-y-2 mb-4" id={`content-opp-${opp.id}`}>
                      <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-extrabold font-display" id={`provider-opp-${opp.id}`}>
                        {opp.provider}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-brand-violet transition-colors" id={`title-opp-${opp.id}`}>
                        {opp.title}
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-3" id={`desc-opp-${opp.id}`}>
                        {opp.description}
                      </p>

                      {/* AI Recommendation Reason */}
                      <div className="p-3.5 bg-brand-violet/5 border border-brand-violet/10 rounded-2xl text-xs text-brand-violet/90 flex items-start space-x-2 font-medium" id={`recommend-opp-${opp.id}`}>
                        <Award className="w-4 h-4 mt-0.5 text-brand-violet flex-shrink-0" />
                        <span>{opp.recommendationReason}</span>
                      </div>

                      {/* Eligibility checklist */}
                      <div className="pt-2.5 space-y-2" id={`eligibility-opp-${opp.id}`}>
                        <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-display" id={`lbl-eligibility-${opp.id}`}>ELIGIBILITY REQUIREMENT CHECKLIST</span>
                        {opp.eligibilityCriteria.map((crit, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-gray-300" id={`crit-${opp.id}-${idx}`}>
                            <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
                            <span>{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer fields & CTA actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto" id={`actions-opp-${opp.id}`}>
                      <div>
                        <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider" id={`lbl-funding-${opp.id}`}>FUNDING PROFILE</span>
                        <span className="text-sm text-brand-emerald font-black" id={`val-funding-${opp.id}`}>{opp.amount}</span>
                      </div>
                      <div className="flex items-center space-x-2" id={`btn-group-${opp.id}`}>
                        <button
                          type="button"
                          onClick={() => onSaveOpportunity(opp)}
                          disabled={isAlreadySaved}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isAlreadySaved
                              ? "bg-brand-emerald/15 border-brand-emerald/35 text-brand-emerald"
                              : "bg-white/5 border-white/10 hover:border-white/15 text-gray-400 hover:text-white"
                          }`}
                          title={isAlreadySaved ? "Added to Tracker" : "Save Opportunity"}
                          id={`btn-save-opp-${opp.id}`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <a
                          href={opp.link}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="px-4 py-2.5 bg-gradient-to-r from-brand-violet to-brand-magenta text-white font-bold rounded-xl text-xs flex items-center space-x-1 hover:opacity-90 transition-all cursor-pointer shadow-md shadow-brand-violet/10"
                          id={`btn-link-opp-${opp.id}`}
                        >
                          <span>Apply</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Application Timeline & Tracker pane */
        <div className="space-y-5" id="opp-tracker-pane">
          {applications.length === 0 ? (
            <div className="text-center py-20 glass-card border border-white/5 rounded-3xl" id="empty-tracker">
              <ShieldAlert className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" id="icon-shield-tracker" />
              <h3 className="text-sm font-semibold text-white" id="title-empty-tracker">Tracker is empty</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed" id="desc-empty-tracker">
                Save interesting programs from the matching pool. You can monitor dates, compile roadmaps, and track deadlines seamlessly.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("explore")}
                className="mt-5 px-5 py-2.5 bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-brand-violet/25"
                id="btn-return-explore"
              >
                Find Opportunities
              </button>
            </div>
          ) : (
            <div className="space-y-3.5" id="list-tracker">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 bg-white/5 border border-white/10 hover:border-brand-violet/15 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  id={`tracker-item-${app.id}`}
                >
                  <div className="space-y-1.5" id={`tracker-info-${app.id}`}>
                    <div className="flex items-center space-x-2" id={`tracker-title-header-${app.id}`}>
                      <span className="px-2 py-0.5 bg-white/10 text-brand-violet text-[9px] font-extrabold rounded-lg uppercase border border-white/5">
                        {app.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">Provider: {app.providerOrCompany}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white" id={`tracker-title-${app.id}`}>{app.title}</h3>
                    <div className="flex items-center space-x-4 text-[10px] text-gray-500 font-medium" id={`tracker-meta-${app.id}`}>
                      <span>Closes: <span className="text-gray-400 font-bold">{app.deadline}</span></span>
                      <span>Last Updated: <span className="text-gray-400 font-bold">{app.updatedAt}</span></span>
                    </div>
                  </div>

                  {/* Status Controller */}
                  <div className="flex items-center space-x-3 mt-2 md:mt-0" id={`tracker-controls-${app.id}`}>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5" id={`lbl-status-${app.id}`}>Application Status</label>
                      <select
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-violet transition-colors cursor-pointer"
                        value={app.status}
                        onChange={(e) => onUpdateAppStatus(app.id, e.target.value as ApplicationStatus)}
                        id={`select-status-${app.id}`}
                      >
                        <option value="Interested">Interested</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Accepted">Accepted 🎉</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
