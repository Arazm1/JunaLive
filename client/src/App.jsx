import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router';

import Home from './views/Home';
import Station from './views/Station';
import SearchClosingTrains from './views/closingtrains/SearchClosingTrains';
import Closing from './views/closingtrains/Closing';

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/station/:stationName" element={<Station />} />


          <Route path="/closing-trains/search" element={<SearchClosingTrains />} />
          <Route path="/closing-trains2/search" element={<Closing />} />

        </Routes>
    </BrowserRouter>
  )
}

export default App;
