import React, { useState } from 'react';
import Logout from "./Logout"
import '../style/header.css';
import Profile from "./Profile";
import bellIcon from "../icon/bell.png"; 
import Notification from './Notification';

function Header( {toggle} ) {
    const [dropDown, setDropDown] = useState(false);

    const handleBellClick = () => {
        setDropDown(!dropDown);
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
            {dropDown && <Notification dropDown={dropDown} toggle={toggle}/>}
        </div>
    )
}

export default Header