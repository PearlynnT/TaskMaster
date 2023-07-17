import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import '../style/profile.css'
import icon from '../icon/temp.png';
import { useNavigate} from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Profile() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { currUser } = useAuth();
    const changeIcon = () => {
        navigate("/avatarSelection", { replace: true });
    }
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
    
        const getAvatar = async () => {
            try {
                const { data } = await axiosPrivate.get('/users', {
                    signal: controller.signal,
                });
                const currentUser = data.filter((item) => item.username === currUser);
                console.log(currentUser);
                if (isMounted) {
                    if (currentUser[0].avatar === "") { // for first time login users 
                        navigate("/avatarSelection", { replace: true });
                    }
                    setAvatar(currentUser[0].avatar)
                    console.log(`Avatar: ${avatar}`);
                }
            } catch (err) {
                console.log(err);
            }
        };
    
        getAvatar();
    
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    

    return (
        <div className='profile--container'>
            <img 
                src={`data:image/svg+xml;base64,${avatar}`}
                placeholder='icon'
                className='profile--icon'
                onClick={changeIcon}
            />
            <div className="profile--name">
                {currUser}
            </div>
        </div>
    )
}

export default Profile;