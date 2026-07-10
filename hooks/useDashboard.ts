import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardPreferencesState {
  isSidebarCollapsed: boolean;
  activeTab: string;
  widgetVisibility: Record<string, boolean>;
  
  // Actions
  toggleSidebarCollapsed: () => void;
  setActiveTab: (tab: string) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  resetPreferences: () => void;
}

export const useDashboard = create<DashboardPreferencesState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      activeTab: 'overview',
      widgetVisibility: {
        ai_insights: true,
        ai_health: true,
        roadmap_completion: true,
        scholarships_widget: true,
        jobs_widget: true,
        finance_widget: true,
        mentor_widget: true,
        recent_activity: true,
      },
      
      toggleSidebarCollapsed: () => set((state) => ({ 
        isSidebarCollapsed: !state.isSidebarCollapsed 
      })),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      toggleWidgetVisibility: (widgetId) => set((state) => ({
        widgetVisibility: {
          ...state.widgetVisibility,
          [widgetId]: !state.widgetVisibility[widgetId],
        }
      })),
      
      resetPreferences: () => set({
        isSidebarCollapsed: false,
        activeTab: 'overview',
        widgetVisibility: {
          ai_insights: true,
          ai_health: true,
          roadmap_completion: true,
          scholarships_widget: true,
          jobs_widget: true,
          finance_widget: true,
          mentor_widget: true,
          recent_activity: true,
        }
      }),
    }),
    {
      name: 'lumina-dashboard-layout-pref',
    }
  )
);

export default useDashboard;
