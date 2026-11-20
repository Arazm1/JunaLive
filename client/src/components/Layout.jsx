import {Link, Outlet} from 'react-router';
import { useEffect } from 'react';
import { useUserContext } from '../hooks/contextHooks';

import Footer from './common/Footer.jsx';
import Header from './common/Header.jsx';






const Layout = () => {
    const { handleAutoLogin } = useUserContext();


    useEffect(() => {
    handleAutoLogin();
  }, []);


  return(

    <>
    <Header/>
    <main>
        <Outlet/>
    </main>
    <Footer/>
    </>
  );
}

export default Layout;