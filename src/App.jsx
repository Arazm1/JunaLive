import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router';

import Home from './views/Home';
import Station from './views/Station';

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/station/:stationName" element={<Station />} />

        </Routes>
    </BrowserRouter>
  )
}

export default App;
