import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { LandingPage } from './pages/LandingPage';
import { PlannerPage } from './pages/PlannerPage';
import { ResultsPage } from './pages/ResultsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { AboutPage } from './pages/AboutPage';
import { destinationService } from './services/destinationService';
import { tripService } from './services/tripService';
import { Destination, PlanTripRequest, ReplanTripRequest, TripPlanResponse } from './types/travel';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentPlan, setCurrentPlan] = useState<TripPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [plannerInitialPrompt, setPlannerInitialPrompt] = useState<string>('');
  const [plannerInitialDest, setPlannerInitialDest] = useState<string>('');

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const data = await destinationService.getAllDestinations();
      setDestinations(data);
    } catch (err) {
      console.error('Failed to load destinations', err);
    }
  };

  const handleStartPlanning = (initialPrompt?: string) => {
    if (initialPrompt) {
      setPlannerInitialPrompt(initialPrompt);
    }
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDestination = (destName: string) => {
    setPlannerInitialDest(destName);
    setPlannerInitialPrompt(`Plan a 3 day trip to ${destName} for 2 people under ₹28,000.`);
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanTrip = async (req: PlanTripRequest) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const plan = await tripService.planTrip(req);
      setCurrentPlan(plan);
      setActiveTab('results');
    } catch (err: any) {
      console.error('Plan trip error', err);
      alert(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplanTrip = async (req: ReplanTripRequest) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const plan = await tripService.replanTrip(req);
      setCurrentPlan(plan);
      setActiveTab('results');
    } catch (err: any) {
      console.error('Replan trip error', err);
      alert(err.response?.data?.message || 'Failed to replan trip.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async (tripId: number) => {
    try {
      const updated = await tripService.saveTrip(tripId);
      setCurrentPlan(updated);
    } catch (err: any) {
      console.error('Save trip error', err);
      throw err;
    }
  };

  const handleSelectSavedTrip = async (tripId: number) => {
    setLoading(true);
    try {
      const trip = await tripService.getTripById(tripId);
      setCurrentPlan(trip);
      setActiveTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to get trip details', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF9] text-[#172033]">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {activeTab === 'landing' && (
              <LandingPage
                onStartPlanning={handleStartPlanning}
                destinations={destinations}
                onSelectDestination={handleSelectDestination}
              />
            )}

            {activeTab === 'planner' && (
              <PlannerPage
                initialPrompt={plannerInitialPrompt}
                initialDestination={plannerInitialDest}
                onPlanTrip={handlePlanTrip}
                loading={loading}
              />
            )}

            {activeTab === 'results' && currentPlan && (
              <ResultsPage
                plan={currentPlan}
                onSaveTrip={handleSaveTrip}
                onReplanTrip={handleReplanTrip}
                onStartOver={() => {
                  setCurrentPlan(null);
                  setActiveTab('planner');
                }}
                isAuthenticated={isAuthenticated}
                openAuthModal={() => setIsAuthOpen(true)}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardPage
                onSelectTrip={handleSelectSavedTrip}
                onNewTrip={() => {
                  setCurrentPlan(null);
                  setActiveTab('planner');
                }}
                openAuthModal={() => setIsAuthOpen(true)}
              />
            )}

            {activeTab === 'destinations' && (
              <DestinationsPage
                destinations={destinations}
                onSelectDestination={handleSelectDestination}
              />
            )}

            {activeTab === 'about' && (
              <AboutPage
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
