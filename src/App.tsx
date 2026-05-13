import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout';
import { useGameStore } from './store/useGameStore';

// Lazy load pages
import Home from './pages/Home';
import Levels from './pages/Levels';
import GameView from './pages/GameView';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import SettingsPage from './pages/SettingsPage';
import Leaderboard from './pages/Leaderboard';
import Quiz from './pages/Quiz';
import Subscription from './pages/Subscription';

function App() {
  const restoreEnergy = useGameStore(state => state.restoreEnergy);

  useEffect(() => {
    // Energy restoration loop
    const interval = setInterval(() => {
      restoreEnergy();
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [restoreEnergy]);

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/play/:levelId" element={<GameView />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
