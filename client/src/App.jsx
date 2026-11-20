import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router';

import Home from './views/Home';
import Station from './views/Station';
import Login from './views/authentication/Login';
import { UserProvider } from './contexts/UserContext';
import MandatoryCheckTrains from './views/mandatory/MandatoryCheckTrains';
import ShiftHandler from './views/controlroom/ShiftHandler';
import Layout from './components/Layout';

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <UserProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/station/:stationName" element={<Station />} />
              <Route path="/login" element={<Login />} />
              <Route path="/mctrains" element={<MandatoryCheckTrains />} />
              <Route path="/ccshift" element={<ShiftHandler />} />
            </Route>
            


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
