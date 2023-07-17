import Logout from "./Logout"
import '../style/header.css';
import Profile from "./Profile";

function Header() {
    return (
        <div className="header--container">
            <Profile />
            <h1 className="header--title">Task Master</h1>
            <Logout className="header--logout"/>
        </div>
    )
}

export default Header