import { Navigate, useLocation } from "react-router";
import { useUserContext } from "../hooks/contextHooks"

/**
 * A component that protects the routes for authenticated users.
 * Otherwise, redirects to home page if the user is not logged in.
 * 
 * @param children - The components to render if the user is authenticated.
 * @returns The children if user is authenticated, or redirects to main page.
 */
const ProtectedRoute = ({ children, role}) => {
    const { user, loadingUser } = useUserContext();
    const location = useLocation();

    if(loadingUser){
        return(
            <p className="p-6 text-gray-500">
                Loading...
            </p>
        );
    }

    if(!user){
        return <Navigate to="/login" replace state={{from: location}}/>
    }

    if(role && user.role !== role){
        return(
            <Navigate to="/" replace/>
        )
    }

    return children;
};

export default ProtectedRoute;