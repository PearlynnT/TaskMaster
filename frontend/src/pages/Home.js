import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
//import Tasks from "../components/Tasks"

function Home() {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <>
            <h1>Landing Page</h1>
            <div className="logoutBtn">
                <button onClick={signOut}>Logout</button>
            </div>
        </>
    )
}

export default Home