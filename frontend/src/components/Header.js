import React, { useState, useEffect } from 'react';
import Logout from "./Logout"
import '../style/header.css';
import Profile from "./Profile";
import bellIcon from "../icon/bell.png"; 
import Notification from './Notification';

function Header() {
    const [toggle, setToggle] = useState(false);

    const handleBellClick = () => {
        setToggle(!toggle);
    }

    return (
        <div className="header--container">
            <Profile />
            <h1 className="header--title">Task Master</h1>
            <img 
                src={bellIcon} 
                alt='Bell Icon' 
                className="header--bell"
                onClick={handleBellClick}
            />
            <Logout className="header--logout"/>
            {toggle && <Notification />}
        </div>
    )
}

export default Header