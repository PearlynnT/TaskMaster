import { Link, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
//import useLogout from "../hooks/useLogout";

function Home() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    //const logout = useLogout();

    const logout = async () => {
        // todo
        setAuth({});
        navigate('/login');
    }

    // const signOut = async () => {
    //     await logout();
    //     navigate('/login');
    // }

    return (
        <>
            <h1>Landing Page</h1>
            <div className="logoutBtn">
                <button onClick={logout}>Logout</button>
            </div>
        </>
    )
}

export default Home