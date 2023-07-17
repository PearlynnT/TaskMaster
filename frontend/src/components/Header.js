import { useState, useEffect } from "react";
import Logout from "./Logout";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import notificationIcon from "../icon/notification.png";
import DisplayNotification from "./DisplayNotification";
import uuid from 'react-uuid';
import '../style/header.css';

function Header() {
    const axiosPrivate = useAxiosPrivate();
    const { notification, setNotification } = useAuth();
    const [open, setOpen] = useState(false);

    const handleRead = () => {
        setNotification([]);
        setOpen(false);
    }

    return (
        <div className="header--container">
            <h1 className="header--title">Task Master</h1>
            <div className="header--actions">
                <button className="header--button" onClick={() => setOpen(!open)}>
                    <img className="header--notifications" src={notificationIcon} alt="Notification Button" />
                    {notification.length > 0 &&
                        <div className="header--notificationCount">{notification.length}</div>      
                    }
                </button>
            </div>
            {open && (
                <div className="header--notificationList">
                    {!notification.length && (
                        <span className="header--notification">No New Messages</span>
                    )}
                    {notification.map((notif) => <DisplayNotification key={uuid()} notif={notif} />)}
                    {notification.length && (
                        <button className="header--notificationRead" onClick={handleRead}>
                            Mark as read
                        </button>
                    )}
                </div>
            )}
            <Logout className="header--logout"/>
        </div>
    )
}

export default Header;