import React from 'react';
import useAuth from '../hooks/useAuth';
import '../style/profile.css'
import icon from '../icon/temp.png';
import { useNavigate} from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const { currUser } = useAuth();
    const changeIcon = () => {
        navigate("/avatarSelection", { replace: true });
    }
    return (
        <div className='profile--container'>
            <img 
                src={icon} 
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