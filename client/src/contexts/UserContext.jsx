import { createContext, useEffect, useState } from "react";
import { useAuthentication, useUser } from "../hooks/apiHooks";
import { useNavigate } from "react-router";



const UserContext = createContext(null);


const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const { postLogin } = useAuthentication();
    const { getUserByToken } = useUser();
    const navigate = useNavigate();





    const handleLogin = async (inputs) => {
        try{
            const { token, user } = await postLogin(inputs);
            localStorage.setItem('token', token);
            setUser(user);
            navigate('/'); //Change this later to somewhere else
        }
        catch(e){
            console.log(e.message);
        }
    }


    const handleLogout = () => {
        try{
            localStorage.removeItem('token');
            setUser(null);
            navigate('/')
        }
        catch(e){
            console.log(e.message);
        }
    }

    const handleAutoLogin = async () => {
        try{
            const token = localStorage.getItem('token');
            if(!token){
                setLoadingUser(false);
                return;
            }
            const userData = await getUserByToken(token);
            console.log("AUTO LOGIN:", userData);
            setUser(userData.user);
        }
        catch(e){
            console.log(e.message);
            localStorage.removeItem('token'); 
        }
        finally{
            setLoadingUser(false);
         }
    }


    useEffect(() => {
        handleAutoLogin();
    }, []);



    return(
        <UserContext.Provider
        value={{
            user,
            setUser,
            loadingUser,
            handleLogin,
            handleLogout,
            handleAutoLogin,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export {UserProvider, UserContext};