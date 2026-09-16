import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Onboarding from './pages/Onboarding';
import Roadmap from './pages/Roadmap';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
