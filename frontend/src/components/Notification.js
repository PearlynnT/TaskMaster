import React, { useState, useEffect } from 'react';
import '../style/notification.css';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';

function Notification ( {dropDown, toggle} ) {
    const [notifications, setNotifications] = useState([]);
    let user = '';
    const axiosPrivate = useAxiosPrivate();
    const { currUser } = useAuth();
    const [flag, setFlag] = useState(false);
  
    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController();
  
      const getUser = async () => { 
          try {
            const { data } = await axiosPrivate.get(
                "/users",
                {
                  signal: controller.signal,
                }
            );
            const currentUser = data.filter((item) => (item.username === currUser));
            if (isMounted) {
              user = currentUser[0]._id;
            }
          } catch (err) {
            console.log(err);
          }
      };
  
      const getNotifications = async () => {
        try {
          const { data } = await axiosPrivate.get(
            "/notifications",
            {
              signal: controller.signal,
            }
          );
          const ownNotifications = data.filter((item) => (item.receipientId === user));
          if (isMounted) {
            setNotifications(ownNotifications);
          }
        } catch (err) {
          console.log(err);
        }
      };
  
      getUser().then(() => getNotifications());
  
      return () => {
        isMounted = false;
        controller.abort();
      };
    }, [dropDown, flag]);

    const handleAccept = async (notifID, id , newMemberId) => {
        try {
            await axiosPrivate.put(`/projects`,
                JSON.stringify({ id, newMemberId }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log("Updated members");
            handleDecline(notifID);
            toggle();
        } catch (err) {
            console.log(err);
        }
    }

    const handleDecline = async (id) => {
        try {
            await axiosPrivate.delete(
                `/notifications/${id}`
            );
        } catch (err) {
            console.log(err);
        }
        setFlag(!flag);
    }

    return (
        <div className="notification--container">
            {!notifications.length 
            ? (
                <div>
                    You have no notifications
                </div>
            ) : (
                <div>
                    {notifications.map((notif) => (
                        <div>
                            {notif.senderName} sent you an invite to join {notif.projectName}
                            <button onClick={() => handleAccept(notif._id, notif.projectId, notif.receipientId)}>Accept</button>
                            <button onClick={() => handleDecline(notif._id)}>Decline</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Notification;