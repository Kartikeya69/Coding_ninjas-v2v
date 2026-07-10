import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import {
  User,
  GraduationCap,
  Target,
  Briefcase,
  Award,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  School,
  BookOpen,
  DollarSign,
  Compass,
  Code,
  Globe,
  UserCheck,
  Check
} from "lucide-react";

interface AIOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function AIOnboarding({ onComplete }: AIOnboardingProps) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    age: "20",
    country: "",
    educationLevel: "Undergraduate (Computer Science / STEM)",
    stage: "college", // default stage
    schoolName: "",
    gradeClass: "11th Grade",
    favoriteSubjects: [],
    dreamCareer: "",
    collegeName: "",
    degreeMajor: "Computer Science",
    graduationYear: "2028",
    linkedinUrl: "",
    portfolioUrl: "",
    currentRole: "",
    currentCompany: "",
    experienceYears: "1-2 Years",
    salary: "",
    interests: [],
    careerGoals: [],
    skills: [],
    targetExams: [],
    preferredIndustries: [],
    startupInterest: false,
    startupIdea: "",
    mentorshipPreference: "Technical Guidance",
  });

  const [tempTag, setTempTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakenField, setShakenField] = useState<string | null>(null);

  // Handler for age changes that automatically adapts the life-stage
  const handleAgeChange = (ageVal: string) => {
    const ageNum = parseInt(ageVal || "0", 10);
    let autoStage: 'school' | 'college' | 'professional' = 'college';

    if (ageNum > 0 && ageNum < 18) {
      autoStage = 'school';
    } else if (ageNum >= 18 && ageNum <= 22) {
      autoStage = 'college';
    } else if (ageNum > 22) {
      autoStage = 'professional';
    }

    setFormData(prev => {
      // Setup dynamic defaults based on stage
      let eduLevel = prev.educationLevel;
      if (autoStage === 'school') {
        eduLevel = "High School / Young Scholar";
      } else if (autoStage === 'college') {
        eduLevel = "Undergraduate (Computer Science / STEM)";
      } else if (autoStage === 'professional') {
        eduLevel = "Early Professional / Career Transitioner";
      }

      return {
        ...prev,
        age: ageVal,
        stage: autoStage,
        educationLevel: eduLevel
      };
    });
  };

  // Handler for manually overriding the stage
  const handleStageOverride = (manualStage: 'school' | 'college' | 'professional') => {
    setFormData(prev => {
      let eduLevel = prev.educationLevel;
      let age = prev.age;
      
      if (manualStage === 'school') {
        eduLevel = "High School / Young Scholar";
        if (parseInt(age || "0", 10) >= 18 || parseInt(age || "0", 10) === 0) {
          age = "16"; // set sensible school age
        }
      } else if (manualStage === 'college') {
        eduLevel = "Undergraduate (Computer Science / STEM)";
        if (parseInt(age || "0", 10) < 18 || parseInt(age || "0", 10) > 22) {
          age = "20"; // set sensible college age
        }
      } else if (manualStage === 'professional') {
        eduLevel = "Early Professional / Career Transitioner";
        if (parseInt(age || "0", 10) <= 22) {
          age = "25"; // set sensible professional age
        }
      }

      return {
        ...prev,
        stage: manualStage,
        educationLevel: eduLevel,
        age
      };
    });
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    const ageNum = parseInt(formData.age || "0", 10);

    if (currentStep === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = "This field is required to generate your personalized Lumina-AI experience.";
      }
      if (!formData.age?.trim() || isNaN(ageNum) || ageNum <= 0) {
        newErrors.age = "This field is required to generate your personalized Lumina-AI experience.";
      }
      if (!formData.country?.trim()) {
        newErrors.country = "This field is required to generate your personalized Lumina-AI experience.";
      }
    } else if (currentStep === 2) {
      if (activeStage === "school") {
        if (!formData.schoolName?.trim()) {
          newErrors.schoolName = "This field is required to generate your personalized Lumina-AI experience.";
        }
      } else if (activeStage === "college") {
        if (!formData.collegeName?.trim()) {
          newErrors.collegeName = "This field is required to generate your personalized Lumina-AI experience.";
        }
        if (!formData.degreeMajor?.trim()) {
          newErrors.degreeMajor = "This field is required to generate your personalized Lumina-AI experience.";
        }
        if (!formData.graduationYear?.trim()) {
          newErrors.graduationYear = "This field is required to generate your personalized Lumina-AI experience.";
        }
      } else if (activeStage === "professional") {
        if (!formData.currentRole?.trim()) {
          newErrors.currentRole = "This field is required to generate your personalized Lumina-AI experience.";
        }
        if (!formData.currentCompany?.trim()) {
          newErrors.currentCompany = "This field is required to generate your personalized Lumina-AI experience.";
        }
      }
    } else if (currentStep === 4) {
      if (activeStage === "school") {
        if (!formData.dreamCareer?.trim()) {
          newErrors.dreamCareer = "This field is required to generate your personalized Lumina-AI experience.";
        }
      } else {
        if (formData.startupInterest && !formData.startupIdea?.trim()) {
          newErrors.startupIdea = "This field is required to generate your personalized Lumina-AI experience.";
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      setShakenField(firstErrorField);
      setTimeout(() => {
        setShakenField(null);
      }, 500);

      const elementId = `container-${firstErrorField}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const inputElement = element.querySelector("input, select, textarea") as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        if (inputElement) {
          inputElement.focus();
        }
      }
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      return;
    }

    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      // Build full profile based on life stage
      const stage = formData.stage || 'college';
      let compiledEdu = formData.educationLevel || "Undergraduate";
      let compiledSkills = formData.skills || [];
      let compiledGoals = formData.careerGoals || [];
      let compiledInterests = formData.interests || [];

      // Fill intelligent defaults if empty
      if (stage === 'school') {
        compiledEdu = `${formData.gradeClass || "High School"} Scholar at ${formData.schoolName || "Academic Academy"}`;
        if (!compiledSkills.length) compiledSkills = ["Problem Solving", "Logical Reasoning", "Coding Basics", "Science Projects"];
        if (!compiledGoals.length) compiledGoals = [formData.dreamCareer || "STEM Specialist", "University Scholar"];
        if (!compiledInterests.length) compiledInterests = formData.favoriteSubjects?.length ? formData.favoriteSubjects : ["Computer Science", "Mathematics", "Robotics"];
      } else if (stage === 'college') {
        compiledEdu = `${formData.degreeMajor || "STEM"} Student, ${formData.collegeName || "State University"} (Class of ${formData.graduationYear || "2028"})`;
        if (!compiledSkills.length) compiledSkills = ["Python", "JavaScript", "React", "Data Structures"];
        if (!compiledGoals.length) compiledGoals = ["Software Engineer Intern", "Graduate Scholar", "AI Specialist"];
        if (!compiledInterests.length) compiledInterests = ["Software Engineering", "Artificial Intelligence", "Internships"];
      } else {
        compiledEdu = `${formData.currentRole || "Professional"} at ${formData.currentCompany || "Enterprise Hub"} (${formData.experienceYears || "1-2 Years"})`;
        if (!compiledSkills.length) compiledSkills = ["System Architecture", "React", "Cloud Deployments", "Agile Leadership"];
        if (!compiledGoals.length) compiledGoals = ["Senior Tech Specialist", "Engineering Manager", "Startup Co-Founder"];
        if (!compiledInterests.length) compiledInterests = ["High-Performance Computing", "Leadership Development", "Finance Planning"];
      }

      const fullProfile: UserProfile = {
        name: formData.name || "Innovator",
        age: formData.age || "21",
        country: formData.country || "India",
        educationLevel: compiledEdu,
        interests: compiledInterests,
        careerGoals: compiledGoals,
        skills: compiledSkills,
        targetExams: formData.targetExams?.length ? formData.targetExams : (stage === 'school' ? ["SAT", "STEM Olympiad"] : stage === 'college' ? ["GRE", "AWS Cloud Practitioner"] : ["System Design Expert"]),
        preferredIndustries: formData.preferredIndustries?.length ? formData.preferredIndustries : (stage === 'school' ? ["Science & Exploration", "Academic Labs"] : stage === 'college' ? ["Software & Tech", "Product Design"] : ["Tech Enterprise", "Fintech Innovations"]),
        startupInterest: !!formData.startupInterest,
        startupIdea: formData.startupIdea || (formData.startupInterest ? "An innovative venture aiming to drive inclusion in engineering sectors." : ""),
        mentorshipPreference: formData.mentorshipPreference || "Career Progression",
        onboardingCompleted: true,
        streakDays: 1,
        lastActivityDate: new Date().toISOString().split("T")[0],
        
        // Custom life-stage metadata
        stage,
        schoolName: formData.schoolName,
        gradeClass: formData.gradeClass,
        favoriteSubjects: formData.favoriteSubjects,
        dreamCareer: formData.dreamCareer,
        collegeName: formData.collegeName,
        degreeMajor: formData.degreeMajor,
        graduationYear: formData.graduationYear,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        currentRole: formData.currentRole,
        currentCompany: formData.currentCompany,
        experienceYears: formData.experienceYears,
        salary: formData.salary,
      };

      // Trigger immersive Career DNA holographic animation
      setIsAnalyzing(true);
      setActivePhaseIndex(0);
      setAnalysisProgress(0);
      setAnalysisLogs([]);

      const dynamicPhases = [
        {
          label: "Extracting life-stage parameters",
          subLogs: [
            "Analyzing profile: " + (formData.name || "Innovator") + " (" + (formData.age || "21") + ")",
            "Engaged stage adaptation: " + (stage?.toUpperCase() || "COLLEGE"),
            "Compiling local career profiles & credentials..."
          ]
        },
        {
          label: "Correlating professional goals & skills",
          subLogs: [
            "Analyzing " + ((formData.interests as string[])?.length || 0) + " academic and tech interests",
            "Weighting target goals: " + ((formData.careerGoals as string[])?.slice(0, 3).join(", ") || "General Development"),
            "Mapping custom skill vectors: " + ((formData.skills as string[])?.slice(0, 4).join(", ") || "STEM core competency")
          ]
        },
        {
          label: "Searching global scholarship & career databases",
          subLogs: [
            "Indexing 120,000+ top-tier STEM fellowships & grants",
            "Filtering registries matching geographical parameters for: " + (formData.country || "Global"),
            "Calibrating priority internship matching matrix"
          ]
        },
        {
          label: "Calibrating personalized Gemini Career Copilot",
          subLogs: [
            "Instantiating Gemini 2.5 Flash neural client context",
            "Injecting system directives for: " + (formData.mentorshipPreference || "Career Progression"),
            "Securing private server API communication pipelines"
          ]
        },
        {
          label: "Structuring dual-pathway Career DNA helix",
          subLogs: [
            "Plotting dynamic learning paths and certifications",
            "Compiling custom resume-ATS optimization matrices",
            "Structuring private encrypted metadata schema"
          ]
        },
        {
          label: "Finalizing cloud runtime configurations",
          subLogs: [
            "Synthesizing customized dashboard modules",
            "Unlocking 100% Free Lifetime Access credentials",
            "LUMINA CORE IS ONLINE. SYSTEM BOOT SECURED."
          ]
        }
      ];

      let currentPhaseIdx = 0;
      let currentSubLogIdx = 0;
      let progressVal = 0;
      
      const totalTicks = 120; // 120 ticks * 60ms = 7.2 seconds of highly detailed logs
      const interval = setInterval(() => {
        progressVal += (100 / totalTicks);
        if (progressVal >= 100) {
          progressVal = 100;
          setAnalysisProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            onComplete(fullProfile);
          }, 800);
          return;
        }

        setAnalysisProgress(Math.floor(progressVal));

        const targetPhaseIdx = Math.min(Math.floor((progressVal / 100) * dynamicPhases.length), dynamicPhases.length - 1);
        
        if (targetPhaseIdx !== currentPhaseIdx) {
          currentPhaseIdx = targetPhaseIdx;
          setActivePhaseIndex(currentPhaseIdx);
          currentSubLogIdx = 0;
        }

        const currentPhaseObj = dynamicPhases[currentPhaseIdx];
        if (currentSubLogIdx < currentPhaseObj.subLogs.length) {
          const nextLog = currentPhaseObj.subLogs[currentSubLogIdx];
          setAnalysisLogs(prev => [...prev, nextLog]);
          currentSubLogIdx++;
        }
      }, 60);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleAddTag = (field: "interests" | "careerGoals" | "skills" | "targetExams" | "favoriteSubjects") => {
    if (!tempTag.trim()) return;
    const currentList = (formData[field] as string[]) || [];
    if (!currentList.includes(tempTag.trim())) {
      setFormData({
        ...formData,
        [field]: [...currentList, tempTag.trim()],
      });
    }
    setTempTag("");
  };

  const handleRemoveTag = (field: "interests" | "careerGoals" | "skills" | "targetExams" | "favoriteSubjects", index: number) => {
    const currentList = (formData[field] as string[]) || [];
    const updated = currentList.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: updated,
    });
  };

  const handleQuickAdd = (field: "interests" | "careerGoals" | "skills" | "targetExams" | "favoriteSubjects", value: string) => {
    const currentList = (formData[field] as string[]) || [];
    if (!currentList.includes(value)) {
      setFormData({
        ...formData,
        [field]: [...currentList, value],
      });
    }
  };

  const activeStage = formData.stage || "college";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6" id="onboarding-step-1">
            {/* Premium Information Banner */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-4 rounded-xl border border-brand-violet/30 bg-brand-violet/[0.03] shadow-[0_0_15px_rgba(139,92,255,0.08)] space-y-2 text-left mb-6 relative overflow-hidden"
              id="info-banner"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center space-x-2 text-brand-violet">
                <Sparkles className="w-4 h-4 animate-pulse text-brand-magenta" />
                <h3 className="text-[11px] font-black uppercase tracking-wider text-white">
                  Help Us Personalize Your Career Journey
                </h3>
              </div>
              <p className="text-[10.5px] text-gray-400 leading-relaxed">
                The more accurate your information, the more personalized your AI Career Coach, Career DNA, Roadmap, Scholarships, and Job Recommendations will be.
              </p>
              <p className="text-[9.5px] text-gray-400 font-medium">
                Fields marked with <span className="text-brand-coral font-extrabold text-[13px] inline-block animate-pulse">*</span> are required to create your personalized workspace.
              </p>
            </motion.div>

            <div className="flex items-center space-x-3 text-blue-400">
              <User className="w-6 h-6" id="icon-user" />
              <h2 className="text-xl font-semibold tracking-tight text-white" id="title-step-1">Basic Profile</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed" id="desc-step-1">
              Let's initialize your Lumina AI experience. Enter your details to activate adaptive life-stage features.
            </p>
            <div className="space-y-4 text-left" id="fields-step-1">
              <div id="container-name" className={shakenField === "name" ? "animate-shake" : ""}>
                <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1" id="lbl-name">
                  <span>Full Name</span>
                  <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priyanjali Sharma"
                  className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                    errors.name ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                  }`}
                  value={formData.name || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  id="input-name"
                />
                {errors.name && (
                  <p className="text-[10px] text-brand-coral font-semibold mt-1">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4" id="grid-profile">
                <div id="container-age" className={shakenField === "age" ? "animate-shake" : ""}>
                  <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1" id="lbl-age">
                    <span>Age</span>
                    <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                      errors.age ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                    }`}
                    value={formData.age || ""}
                    onChange={(e) => {
                      handleAgeChange(e.target.value);
                      if (errors.age) setErrors({ ...errors, age: "" });
                    }}
                    id="input-age"
                  />
                  {errors.age && (
                    <p className="text-[10px] text-brand-coral font-semibold mt-1">
                      {errors.age}
                    </p>
                  )}
                </div>
                <div id="container-country" className={shakenField === "country" ? "animate-shake" : ""}>
                  <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1" id="lbl-country">
                    <span>Country</span>
                    <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                      errors.country ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                    }`}
                    value={formData.country || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, country: e.target.value });
                      if (errors.country) setErrors({ ...errors, country: "" });
                    }}
                    id="input-country"
                  />
                  {errors.country && (
                    <p className="text-[10px] text-brand-coral font-semibold mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Stage Identification Display */}
              <div className="mt-6 p-4 bg-gray-900/40 border border-gray-800 rounded-xl" id="box-stage-identifier">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">DYNAMIC LIFE-STAGE CLASSIFICATION</span>
                
                {activeStage === 'school' && (
                  <div className="flex items-start space-x-3 text-left" id="identifier-school">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-400">⚡ Young Scholar Identified (Age &lt; 18)</h4>
                      <p className="text-[10.5px] text-gray-400 mt-0.5 leading-relaxed">
                        Lumina is configured for **free courses, academic Olympiads, secondary school scholarships, skill development, and career exploration**. No resume required.
                      </p>
                    </div>
                  </div>
                )}

                {activeStage === 'college' && (
                  <div className="flex items-start space-x-3 text-left" id="identifier-college">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-400">🎓 College Student Identified (Age 18–22)</h4>
                      <p className="text-[10.5px] text-gray-400 mt-0.5 leading-relaxed">
                        Lumina is configured for **internships, fellowships, academic scholarships, resume scoring, interview prep, and learning roadmaps**.
                      </p>
                    </div>
                  </div>
                )}

                {activeStage === 'professional' && (
                  <div className="flex items-start space-x-3 text-left" id="identifier-professional">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-purple-400">💼 Working Professional Identified (Age 22+)</h4>
                      <p className="text-[10.5px] text-gray-400 mt-0.5 leading-relaxed">
                        Lumina is configured for **high-tier professional jobs, career switching paths, salary negotiations, leadership certifications, and finance planning**.
                      </p>
                    </div>
                  </div>
                )}

                {/* Overriding option */}
                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between" id="box-override-stage">
                  <span className="text-[10px] text-gray-500">Not your current stage? Override:</span>
                  <div className="flex space-x-1" id="btns-stage-overrides">
                    <button
                      type="button"
                      onClick={() => handleStageOverride('school')}
                      className={`px-2 py-1 text-[10px] rounded font-semibold transition-all border ${
                        activeStage === 'school'
                          ? "bg-emerald-950/40 border-emerald-500 text-emerald-400"
                          : "bg-transparent border-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      School
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStageOverride('college')}
                      className={`px-2 py-1 text-[10px] rounded font-semibold transition-all border ${
                        activeStage === 'college'
                          ? "bg-blue-950/40 border-blue-500 text-blue-400"
                          : "bg-transparent border-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      College
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStageOverride('professional')}
                      className={`px-2 py-1 text-[10px] rounded font-semibold transition-all border ${
                        activeStage === 'professional'
                          ? "bg-purple-950/40 border-purple-500 text-purple-400"
                          : "bg-transparent border-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      Professional
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6" id="onboarding-step-2">
            <div className="flex items-center space-x-3 text-blue-400">
              <School className="w-6 h-6" id="icon-edu" />
              <h2 className="text-xl font-semibold tracking-tight text-white" id="title-step-2">
                {activeStage === 'school' ? "School Details" : activeStage === 'college' ? "University Details" : "Employment Context"}
              </h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed" id="desc-step-2">
              Lumina calibrates matches and roadmaps based on your active academic or workplace records.
            </p>
            <div className="space-y-4 text-left animate-fadeIn" id="fields-step-2">
              {activeStage === 'school' && (
                <>
                  <div id="container-schoolName" className={shakenField === "schoolName" ? "animate-shake" : ""}>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>School Name</span>
                      <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kendriya Vidyalaya, Saint Mary's High"
                      className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                        errors.schoolName ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                      }`}
                      value={formData.schoolName || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, schoolName: e.target.value });
                        if (errors.schoolName) setErrors({ ...errors, schoolName: "" });
                      }}
                    />
                    {errors.schoolName && (
                      <p className="text-[10px] text-brand-coral font-semibold mt-1">
                        {errors.schoolName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Grade or Year</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Selected)</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={formData.gradeClass || ""}
                      onChange={(e) => setFormData({ ...formData, gradeClass: e.target.value })}
                    >
                      <option>9th Grade / Freshman</option>
                      <option>10th Grade / Sophomore</option>
                      <option>11th Grade / Junior</option>
                      <option>12th Grade / Senior</option>
                      <option>Other / Middle School</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Favorite Subjects (Press Enter)</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Optional)</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="e.g. Mathematics, Creative Writing, Biology"
                        className="flex-1 px-4 py-2 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        value={tempTag}
                        onChange={(e) => setTempTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag("favoriteSubjects");
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag("favoriteSubjects")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(formData.favoriteSubjects || []).map((sub, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-900">
                          {sub}
                          <button type="button" onClick={() => handleRemoveTag("favoriteSubjects", index)} className="ml-1.5 hover:text-white font-bold">&times;</button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500">
                      Quick select:{" "}
                      {["Mathematics", "Computer Science", "Physics", "Creative Writing", "Art", "Biology"].map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickAdd("favoriteSubjects", s)}
                          className="mr-2 underline hover:text-gray-300"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
 
              {activeStage === 'college' && (
                <>
                  <div id="container-collegeName" className={shakenField === "collegeName" ? "animate-shake" : ""}>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>University / College</span>
                      <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford University, IIT Bombay"
                      className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                        errors.collegeName ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                      }`}
                      value={formData.collegeName || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, collegeName: e.target.value });
                        if (errors.collegeName) setErrors({ ...errors, collegeName: "" });
                      }}
                    />
                    {errors.collegeName && (
                      <p className="text-[10px] text-brand-coral font-semibold mt-1">
                        {errors.collegeName}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div id="container-degreeMajor" className={shakenField === "degreeMajor" ? "animate-shake" : ""}>
                      <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        <span>Major & Degree</span>
                        <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B.S. Computer Science"
                        className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                          errors.degreeMajor ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                        }`}
                        value={formData.degreeMajor || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, degreeMajor: e.target.value });
                          if (errors.degreeMajor) setErrors({ ...errors, degreeMajor: "" });
                        }}
                      />
                      {errors.degreeMajor && (
                        <p className="text-[10px] text-brand-coral font-semibold mt-1">
                          {errors.degreeMajor}
                        </p>
                      )}
                    </div>
                    <div id="container-graduationYear" className={shakenField === "graduationYear" ? "animate-shake" : ""}>
                      <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        <span>Graduation Year</span>
                        <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2028"
                        className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                          errors.graduationYear ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                        }`}
                        value={formData.graduationYear || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, graduationYear: e.target.value });
                          if (errors.graduationYear) setErrors({ ...errors, graduationYear: "" });
                        }}
                      />
                      {errors.graduationYear && (
                        <p className="text-[10px] text-brand-coral font-semibold mt-1">
                          {errors.graduationYear}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Current Education Level Label</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Selected)</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={formData.educationLevel || ""}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    >
                      <option>Undergraduate (Computer Science / STEM)</option>
                      <option>Undergraduate (Business / Arts)</option>
                      <option>Master's Student (Research/Industry)</option>
                      <option>Ph.D. Scholar / PostDoc Researcher</option>
                    </select>
                  </div>
                </>
              )}
 
              {activeStage === 'professional' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div id="container-currentRole" className={shakenField === "currentRole" ? "animate-shake" : ""}>
                      <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        <span>Current Role / Title</span>
                        <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Associate Analyst, Developer"
                        className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                          errors.currentRole ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                        }`}
                        value={formData.currentRole || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, currentRole: e.target.value });
                          if (errors.currentRole) setErrors({ ...errors, currentRole: "" });
                        }}
                      />
                      {errors.currentRole && (
                        <p className="text-[10px] text-brand-coral font-semibold mt-1">
                          {errors.currentRole}
                        </p>
                      )}
                    </div>
                    <div id="container-currentCompany" className={shakenField === "currentCompany" ? "animate-shake" : ""}>
                      <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        <span>Current Company</span>
                        <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cognizant, AWS, Stripe"
                        className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                          errors.currentCompany ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                        }`}
                        value={formData.currentCompany || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, currentCompany: e.target.value });
                          if (errors.currentCompany) setErrors({ ...errors, currentCompany: "" });
                        }}
                      />
                      {errors.currentCompany && (
                        <p className="text-[10px] text-brand-coral font-semibold mt-1">
                          {errors.currentCompany}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Years of Experience</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Selected)</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={formData.experienceYears || ""}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    >
                      <option>Junior / Entry-Level (0-1 Year)</option>
                      <option>Mid-Level Specialist (2-4 Years)</option>
                      <option>Senior Professional (5-9 Years)</option>
                      <option>Principal / Tech Lead (10+ Years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Target Role Education Label</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Selected)</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={formData.educationLevel || ""}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    >
                      <option>Early Professional / Career Transitioner</option>
                      <option>Industry Expert Seeking Promotions</option>
                      <option>Managerial Track Leadership</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6" id="onboarding-step-3">
            <div className="flex items-center space-x-3 text-blue-400">
              <Code className="w-6 h-6" id="icon-skills" />
              <h2 className="text-xl font-semibold tracking-tight text-white" id="title-step-3">
                {activeStage === 'school' ? "Hobbies & Extracurriculars" : "Core Skills & Portfolios"}
              </h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed" id="desc-step-3">
              {activeStage === 'school' ? "Share your high school hobbies so Lumina can recommend matching youth camps and Olympiads." : "List core competencies to feed into our Gemini resume scanning matching index."}
            </p>
            <div className="space-y-4 text-left animate-fadeIn" id="fields-step-3">
              <div>
                <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  <span>{activeStage === 'school' ? "Interests & Hobbies" : "Core Skills & Tech stack"}</span>
                  <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Optional - Press Enter)</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={activeStage === 'school' ? "e.g. Coding, Robotics, Video Editing, Guitar" : "e.g. React, Python, ML, Figma, Kubernetes"}
                    className="flex-1 px-4 py-2 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    value={tempTag}
                    onChange={(e) => setTempTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag("skills");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag("skills")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(formData.skills || []).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-950/40 text-blue-300 border border-blue-900">
                      {skill}
                      <button type="button" onClick={() => handleRemoveTag("skills", index)} className="ml-1.5 hover:text-white font-bold">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[10px] text-gray-500">
                  Quick add:{" "}
                  {activeStage === 'school' 
                    ? ["Coding", "Robotics", "Drawing", "Public Speaking", "Writing", "Chess"].map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickAdd("skills", s)}
                          className="mr-2 underline hover:text-gray-300"
                        >
                          {s}
                        </button>
                      ))
                    : activeStage === 'college'
                    ? ["Python", "TypeScript", "React", "Data Structures", "UI/UX Design", "Machine Learning"].map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickAdd("skills", s)}
                          className="mr-2 underline hover:text-gray-300"
                        >
                          {s}
                        </button>
                      ))
                    : ["System Design", "AWS", "Kubernetes", "Agile Leadership", "React", "Data Engineering"].map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickAdd("skills", s)}
                          className="mr-2 underline hover:text-gray-300"
                        >
                          {s}
                        </button>
                      ))
                  }
                </div>
              </div>

              {activeStage === 'college' && (
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Portfolio or GitHub Link</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. github.com/username"
                      className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={formData.portfolioUrl || ""}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeStage === 'professional' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>LinkedIn Profile Link</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. linkedin.com/in/username"
                      className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={formData.linkedinUrl || ""}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Resume / Portfolio Link</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. my-portfolio.com"
                      className="w-full px-4 py-2.5 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={formData.portfolioUrl || ""}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6" id="onboarding-step-4">
            <div className="flex items-center space-x-3 text-blue-400">
              <Target className="w-6 h-6" id="icon-targets" />
              <h2 className="text-xl font-semibold tracking-tight text-white" id="title-step-4">
                {activeStage === 'school' ? "Scholarships & Ambitions" : "Milestones & Projects"}
              </h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed" id="desc-step-4">
              Specify your primary targeting filters so Lumina AI can calibrate matching listings.
            </p>
            <div className="space-y-4 text-left animate-fadeIn" id="fields-step-4">
              {activeStage === 'school' && (
                <>
                  <div id="container-dreamCareer" className={shakenField === "dreamCareer" ? "animate-shake" : ""}>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Dream Career / Ambition</span>
                      <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aerospace Scientist, Game Designer, AI Developer"
                      className={`w-full px-4 py-2.5 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors ${
                        errors.dreamCareer ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                      }`}
                      value={formData.dreamCareer || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, dreamCareer: e.target.value });
                        if (errors.dreamCareer) setErrors({ ...errors, dreamCareer: "" });
                      }}
                    />
                    {errors.dreamCareer && (
                      <p className="text-[10px] text-brand-coral font-semibold mt-1">
                        {errors.dreamCareer}
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl space-y-3">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">PREFERENTIAL FILTERS</span>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white">Track High School Scholarships?</h4>
                        <p className="text-[10px] text-gray-500">Enable school-level academic funding alerts.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, startupInterest: !formData.startupInterest })}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                          formData.startupInterest ? "bg-emerald-600" : "bg-gray-800"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                          formData.startupInterest ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                      <div>
                        <h4 className="text-xs font-semibold text-white">Track Olympiads & Competitions?</h4>
                        <p className="text-[10px] text-gray-500">Enable STEM competitions & exam boards tracking.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const exams = formData.targetExams || [];
                          if (exams.includes("Olympiads")) {
                            setFormData({ ...formData, targetExams: exams.filter(e => e !== "Olympiads") });
                          } else {
                            setFormData({ ...formData, targetExams: [...exams, "Olympiads"] });
                          }
                        }}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                          (formData.targetExams || []).includes("Olympiads") ? "bg-emerald-600" : "bg-gray-800"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                          (formData.targetExams || []).includes("Olympiads") ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeStage !== 'school' && (
                <>
                  <div>
                    <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      <span>Target Professional Paths</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Optional - Press Enter)</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="e.g. Machine Learning Engineer, UX Lead, Product Owner"
                        className="flex-1 px-4 py-2 bg-[#11161d] border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        value={tempTag}
                        onChange={(e) => setTempTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag("careerGoals");
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag("careerGoals")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(formData.careerGoals || []).map((goal, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950/40 text-purple-300 border border-purple-900">
                          {goal}
                          <button type="button" onClick={() => handleRemoveTag("careerGoals", index)} className="ml-1.5 hover:text-white font-bold">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white">Startup Incubator Integration?</h4>
                        <p className="text-[10px] text-gray-500">I have a project idea I'd like to validate.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, startupInterest: !formData.startupInterest })}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                          formData.startupInterest ? "bg-blue-600" : "bg-gray-800"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                          formData.startupInterest ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {formData.startupInterest && (
                      <div id="container-startupIdea" className={`space-y-2 pt-2 border-t border-gray-800/60 animate-fadeIn ${shakenField === "startupIdea" ? "animate-shake" : ""}`}>
                        <label className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          <span>Concept Abstract / Description</span>
                          <span className="text-brand-coral font-bold ml-1 text-xs">*</span>
                        </label>
                        <textarea
                          placeholder="e.g. A decentralized micro-tutoring webapp for women in STEM..."
                          className={`w-full px-4 py-2 bg-[#11161d] border rounded-lg text-xs text-white focus:outline-none transition-colors h-20 resize-none ${
                            errors.startupIdea ? "border-brand-coral focus:border-brand-coral shadow-[0_0_10px_rgba(255,107,122,0.15)] animate-pulse" : "border-gray-800 focus:border-blue-500"
                          }`}
                          value={formData.startupIdea || ""}
                          onChange={(e) => {
                            setFormData({ ...formData, startupIdea: e.target.value });
                            if (errors.startupIdea) setErrors({ ...errors, startupIdea: "" });
                          }}
                        />
                        {errors.startupIdea ? (
                          <p className="text-[10px] text-brand-coral font-semibold mt-1">
                            {errors.startupIdea}
                          </p>
                        ) : (
                          <span className="block text-[9px] text-gray-500">*Our Gemini validator will generate a detailed Lean Business Canvas.</span>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6" id="onboarding-step-5">
            <div className="flex items-center space-x-3 text-blue-400">
              <Award className="w-6 h-6" id="icon-calibration" />
              <h2 className="text-xl font-semibold tracking-tight text-white" id="title-step-5">Focus & Match Calibration</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed" id="desc-step-5">
              Specify your primary workspace focus area. Lumina will calibrate matching opportunities and milestones.
            </p>
            <div className="space-y-4 text-left animate-fadeIn" id="fields-step-5">
              <div>
                <label className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <span>Primary Focus Preference</span>
                  <span className="text-[9px] text-gray-500 font-bold ml-1.5 lowercase italic tracking-wider opacity-85">(Selected)</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {activeStage === 'school' && 
                    [
                      "Olympiads & STEM Coaching",
                      "Career Discovery Advising",
                      "College Selection Prep",
                      "Coding & Tech Development"
                    ].map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, mentorshipPreference: option })}
                        className={`p-3 text-left border rounded-lg text-xs font-semibold transition-all ${
                          formData.mentorshipPreference === option
                            ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                            : "bg-[#11161d] border-gray-800 text-gray-400 hover:border-gray-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))
                  }

                  {activeStage === 'college' && 
                    [
                      "Internship & Job Hunting",
                      "Resume & Portfolio Review",
                      "Technical Mock Interviews",
                      "Ph.D. & Academic Admissions",
                      "Startup Incubation"
                    ].map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, mentorshipPreference: option })}
                        className={`p-3 text-left border rounded-lg text-xs font-semibold transition-all ${
                          formData.mentorshipPreference === option
                            ? "bg-blue-950/40 border-blue-500 text-blue-300"
                            : "bg-[#11161d] border-gray-800 text-gray-400 hover:border-gray-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))
                  }

                  {activeStage === 'professional' && 
                    [
                      "Career Switching Strategy",
                      "Leadership & Executive Coaching",
                      "Salary Negotiation Support",
                      "System Design & Architecture",
                      "Venture Launch & Funding"
                    ].map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, mentorshipPreference: option })}
                        className={`p-3 text-left border rounded-lg text-xs font-semibold transition-all ${
                          formData.mentorshipPreference === option
                            ? "bg-purple-950/40 border-purple-500 text-purple-300"
                            : "bg-[#11161d] border-gray-800 text-gray-400 hover:border-gray-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))
                  }
                </div>
              </div>

              {/* Adaptive final summary notice */}
              <div className="p-4 bg-blue-950/20 border border-blue-900/50 rounded-xl flex items-start space-x-3 mt-4" id="box-agreement">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Adaptive Workspace Configuration</h4>
                  <p className="text-[10.5px] text-gray-400 leading-relaxed">
                    {activeStage === 'school' && "Lumina is initializing custom milestones for school curriculum, free introductory STEM courses, Olympiad trackers, and general career explorations."}
                    {activeStage === 'college' && "Lumina is initializing professional resume templates, summer internship hubs, research fellowship checklists, and academic scholarship directories."}
                    {activeStage === 'professional' && "Lumina is initializing senior professional job listings, promotion strategies, leadership credential tracking, and financial salary planners."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isAnalyzing) {
    const analysisPhasesText = [
      "Extracting life-stage parameters",
      "Correlating professional goals & skills",
      "Searching global scholarship & career databases",
      "Calibrating personalized Gemini Career Copilot",
      "Structuring dual-pathway Career DNA helix",
      "Finalizing cloud runtime configurations"
    ];

    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 text-center space-y-8 animate-fadeIn" id="dna-analysis-panel">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-violet/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        
        <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden space-y-8" id="dna-analysis-card">
          {/* Animated background radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,255,0.06)_0%,transparent_75%)]" />

          {/* Header titles */}
          <div className="space-y-2 relative z-10 text-center">
            <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block">Lumina Neural Apparatus</span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">Generating Your AI Career DNA</h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Analyzing education levels, weighting skill priority indices, and loading custom templates for your adaptive dashboard.
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 max-w-2xl mx-auto relative z-10 pt-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-ping" />
                <span>Synthesis Matrix</span>
              </span>
              <span className="text-brand-magenta font-mono">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div 
                className="bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-cyan h-full rounded-full transition-all duration-100 shadow-lg shadow-brand-violet/40"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>

          {/* TWO-COLUMN BENTO GRID: OPERATIONS & TERMINAL LOGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-left" id="bento-analysis-grid">
            
            {/* Left Bento: Operations Checklist */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 bg-[#0a0a0f]/80 space-y-4" id="bento-checklists">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block border-b border-white/5 pb-2">Active Task Operations</span>
              <div className="space-y-3">
                {analysisPhasesText.map((label, idx) => {
                  const isCompleted = idx < activePhaseIndex;
                  const isActive = idx === activePhaseIndex;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isCompleted 
                          ? "bg-brand-emerald/5 border-brand-emerald/20 text-brand-emerald"
                          : isActive
                          ? "bg-brand-violet/10 border-brand-violet/30 text-white shadow-md shadow-brand-violet/5"
                          : "bg-white/[0.02] border-white/5 text-gray-500"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-mono text-gray-500">0{idx + 1}</span>
                        <span className="text-xs font-semibold leading-none">{label}</span>
                      </div>
                      <div>
                        {isCompleted ? (
                          <div className="w-4 h-4 rounded-full bg-brand-emerald/20 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-brand-emerald" />
                          </div>
                        ) : isActive ? (
                          <div className="w-4 h-4 border-2 border-brand-violet border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Bento: Terminal Logs & Ring Animation */}
            <div className="flex flex-col space-y-6" id="bento-visualizer-logs">
              
              {/* Spinning Ring Miniature Visualizer */}
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-[#0a0a0f]/80 flex items-center space-x-4 relative overflow-hidden h-24">
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-dashed border-brand-cyan/40 animate-[spin_8s_linear_infinite]" />
                  <div className="absolute inset-1.5 rounded-full border border-brand-violet/30 animate-[spin_5s_linear_reverse_infinite]" />
                  <div className="w-8 h-8 rounded-full bg-[#050505] border border-brand-magenta flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[8px] font-black text-brand-gold uppercase tracking-widest">Active Adaptor Configuration</span>
                  <span className="block text-xs font-bold text-white uppercase">{formData.stage || "College / STEM"} Workspace</span>
                  <span className="block text-[10px] text-gray-400">Loading custom {formData.stage === 'school' ? 'Olympiad & high school exploration modules' : formData.stage === 'college' ? 'Summer internships & scholarship matrices' : 'Executive roadmaps & leadership checklists'}.</span>
                </div>
              </div>

              {/* Console Terminal Logs */}
              <div className="bg-[#050507]/95 border border-white/10 rounded-2xl p-4 h-56 overflow-y-auto text-left font-mono text-[9.5px] text-gray-400 space-y-1.5 shadow-inner relative flex-1 scrollbar-none" id="analysis-scrolling-logs">
                <div className="sticky top-0 bg-[#050507]/95 pb-1 mb-1 border-b border-white/5 flex items-center justify-between">
                  <span className="text-brand-cyan font-bold uppercase text-[8px] tracking-wider">System Log Terminal</span>
                  <span className="text-brand-emerald animate-ping w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                </div>
                <p className="text-brand-emerald font-semibold">&gt; ESTABLISHING SECURE PROTOCOLS WITH GEMINI MODELS...</p>
                {analysisLogs.map((log, lidx) => (
                  <p key={lidx} className="animate-fadeIn text-gray-300 leading-normal">
                    <span className="text-brand-cyan mr-1.5">&gt;</span>
                    {log}
                  </p>
                ))}
                <div className="w-1.5 h-3 bg-brand-violet animate-pulse inline-block mt-0.5" />
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6" id="onboarding-container">
      {/* Decorative ambient glowing center */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" id="glowing-orb-onboarding" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-brand-magenta/5 rounded-full blur-3xl pointer-events-none" id="glowing-orb-onboarding-2" />

      <div className="glass-card border border-white/10 rounded-3xl p-8 shadow-2xl relative" id="onboarding-card">
        {/* Header Branding */}
        <div className="text-center mb-8" id="onboarding-header">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-magenta mb-3 text-white shadow-lg shadow-brand-violet/20" id="box-app-logo">
            <Sparkles className="w-6 h-6 animate-pulse text-white" id="icon-app-logo" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase font-display" id="onboarding-app-title">Lumina AI</h1>
          <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5" id="onboarding-app-subtitle">Career & Opportunity Operating System</p>
        </div>

        {/* Dynamic step progress indicators */}
        <div className="flex items-center justify-between mb-8 px-2" id="step-indicators">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none" id={`box-step-indicator-${s}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? "bg-gradient-to-tr from-brand-violet to-brand-magenta text-white shadow-lg shadow-brand-violet/20 scale-105"
                    : step > s
                    ? "bg-brand-violet/20 text-brand-violet border border-brand-violet/30"
                    : "bg-white/5 text-gray-500 border border-white/5"
                }`}
                id={`indicator-${s}`}
              >
                {s}
              </div>
              {s < 5 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all ${
                    step > s ? "bg-brand-violet/40" : "bg-white/5"
                  }`}
                  id={`bar-indicator-${s}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Onboarding Questionnaire Wrapper */}
        <div className="min-h-[300px]" id="step-wrapper">
          {renderStep()}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5" id="onboarding-footer-actions">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className={`px-5 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center space-x-1 cursor-pointer ${
              step === 1
                ? "border-white/5 text-gray-600 cursor-not-allowed bg-transparent"
                : "border-white/10 text-gray-300 bg-white/5 hover:bg-white/10"
            }`}
            id="btn-onboarding-back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-violet to-brand-magenta hover:shadow-brand-violet/30 hover:shadow-lg text-white font-semibold rounded-xl text-xs transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.01]"
            id="btn-onboarding-next"
          >
            <span>{step === 5 ? "Initialize Lumina" : "Continue"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
