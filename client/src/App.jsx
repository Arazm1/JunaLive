import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router';

import Home from './views/Home';
import Station from './views/Station';
import SearchClosingTrains from './views/closingtrains/SearchClosingTrains';
import Closing from './views/closingtrains/Closing';
import Login from './views/authentication/Login';
import { UserProvider } from './contexts/UserContext';
import MandatoryCheckTrains from './views/mandatory/MandatoryCheckTrains';
import ShiftHandler from './views/controlroom/ShiftHandler';

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <UserProvider>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/station/:stationName" element={<Station />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mctrains" element={<MandatoryCheckTrains />} />
            <Route path="/ccshift" element={<ShiftHandler />} />


          {/*
            <Route path="/closing-trains/search" element={<SearchClosingTrains />} />
            <Route path="/closing-trains2/search" element={<Closing />} />
          */}

          </Routes>
        </UserProvider>
    </BrowserRouter>
  )
}

export default App;
