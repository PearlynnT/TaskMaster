import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import '../style/logout.css';

function Logout() {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <div className="logoutBtn">
            <button className='logout--button' onClick={signOut}>Logout</button>
        </div>
    )
}

export default Logout