import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import Projects from "../components/Projects"

function Home() {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <>
            <Projects />
            <div className="logoutBtn">
                <button onClick={signOut}>Logout</button>
            </div>
        </>
    )
}

export default Home