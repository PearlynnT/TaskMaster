import Logout from "./Logout"
import '../style/header.css';

function Header() {
    return (
        <div className="header--container">
            <h1 className="header--title">Task Master</h1>
            <Logout className="header--logout"/>
        </div>
    )
}

export default Header