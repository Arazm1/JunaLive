import './App.css';
import {BrowserRouter, Routes, Route, Outlet} from 'react-router';

import Home from './views/Home';
import Station from './views/Station';
import Login from './views/authentication/Login';
import { UserProvider } from './contexts/UserContext';
import MandatoryCheckTrains from './views/mandatory/MandatoryCheckTrains';
import ShiftHandler from './views/controlroom/ShiftHandler';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <UserProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/station/:stationName" element={<Station />} />
              <Route path="/login" element={<Login />} />
              {/*<Route path="/mctrains" element={<MandatoryCheckTrains />} />*/}
              {/*<Route path="/ccshift" element={<ShiftHandler />} />*/}


              {/* Login required routes below! */}
              <Route
                path="/mctrains"
                element={
                  <ProtectedRoute>
                    {' '}
                    <MandatoryCheckTrains />{' '}
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin required routes below! */}
            <Route element={<ProtectedAdminRoute><Outlet /></ProtectedAdminRoute>}>
              <Route path="/ccshift" element={<ShiftHandler />} />
            </Route>

          </Routes>
        </UserProvider>
    </BrowserRouter>
  )
}

export default App;
