import { useState } from "react";
import { useUserContext } from "../../hooks/contextHooks";
import useForm from "../../hooks/formHooks";
import login_bg from "../../assets/login_background.png";
import { useLocation } from "react-router";


const Login = () => {

    const [error, setError] = useState('');

    const { handleLogin } = useUserContext();
    const location = useLocation();


    const initValues = {
        username: '',
        password: '',
    };


    const doLogin = async () => {
        setError('');
        try{
            await handleLogin(inputs, location.state?.from?.pathname);
        }
        catch(e){
            console.log('Error in login: ', e.message);
            setError(e.message || 'Invalid username or password')
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(
        doLogin,
        initValues,
    );
    
return (
    <div 
        style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(${login_bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
        className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat font-sans px-4"
    >
      <form 
        onSubmit={handleSubmit} 
        className="bg-slate-950/65 backdrop-blur-md border border-white/15 p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] w-full max-w-sm text-slate-100"
      >
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold tracking-wide text-white">
            JunaLive
          </h2>
          <p className="text-xs text-slate-300/80 mt-1">
            Sign in to continue
          </p>
        </div>
        
        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-950/70 text-red-600 p-3 rounded-md mb-5 text-sm border border-red-500/40">
            {error}
          </div>
        )}
        
        <div className="mb-5 flex flex-col">
          <label htmlFor="username" className="text-sm font-medium tracking-wider text-slate-300">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username}
            onChange={handleInputChange} // Swapped to useForm handler
            required
            className="p-2.5 mt-1.5 rounded-lg bg-slate-900/70 border border-white/15 text-white placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:border-amber-400/70 transition"
          />
        </div>

        <div className="mb-6 flex flex-col">
          <label htmlFor="password" className="text-sm font-medium tracking-wider text-slate-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password}
            onChange={handleInputChange} // Swapped to useForm handler
            required
            className="p-2.5 mt-1.5 rounded-lg bg-slate-900/70 border border-white/15 text-white placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:border-amber-400/70 transition"
          />
        </div>

        <button 
          type="submit" 
          className="w-full p-2.5 bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-base cursor-pointer shadow-lg shadow-amber-500/20 transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;