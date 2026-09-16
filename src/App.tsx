import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Onboarding } from './pages/Onboarding';
import Roadmap from './pages/Roadmap';
import { AITester } from './components/ai/AITester';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Roadmap />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="*" element={<Roadmap />} />
        </Routes>
        <AITester />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
