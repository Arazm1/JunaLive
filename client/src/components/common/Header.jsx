import logo from "../../assets/logo.png";
import { Link } from "react-router";

const Header = () => {


    return(
        <header className="h-16 border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <img
                        src={logo}
                        alt="JunaLive Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <h1 className="text-xl font-semibold">
                        JunaLive
                    </h1>
                </Link>
            </div>

        </header>
    );
};

export default Header;