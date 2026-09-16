import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Roadmap from './pages/Roadmap';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Roadmap />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
