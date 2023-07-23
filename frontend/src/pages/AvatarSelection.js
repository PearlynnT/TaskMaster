import React, { useState, useEffect } from 'react';
import { Buffer } from "buffer";
import '../style/avatarSelection.css';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from '../api/axios';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function AvatarSelection() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const api = `https://api.multiavatar.com`;
    const [loading, setLoading] = useState(false);
    const [avatars, setAvatars] = useState([]);
    const [toggle, setToggle] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const { currUser } = useAuth();
    const [currUserId, setCurrUserId] = useState("");

    const refresh = () => {
        setToggle(!toggle);
        setAvatars([]);
        setSelectedIndex(null);
    }

    const confirm = async () => {
      try {
          if (selectedIndex !== null) {
              const avatar = avatars[selectedIndex];
              await axiosPrivate.put(`/users/${currUserId}`, { avatar });
              navigate('/', { replace: true });
          }
      } catch (error) {
          console.log('Error updating avatar:', error);
      }
    };
  

    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController();

      const getCurrUserId = async () => {
          try {
              const { data } = await axiosPrivate.get(
                  "/users",
                  {
                    signal: controller.signal,
                  }
              );
              const currentUser = data.filter((item) => (item.username === currUser));
              if (isMounted) {
                  setCurrUserId(currentUser[0]._id);
              }
          } catch (err) {
              console.log(err);
          }
      };

      getCurrUserId();

      return () => {
          isMounted = false;
          controller.abort();
      };
    }, [])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        setLoading(true);
        const data = [];
      
        const getAvatar = async (i) => {
          try {
            const image = await axios.get(
              `https://api.multiavatar.com/${Math.round(Math.random() * 10000)}?apikey=${process.env.REACT_APP_API_KEY}`,
              { responseType: "arraybuffer" }
            );
            const buffer = Buffer.from(image.data, "binary");
            data.push(buffer.toString("base64"));
          } catch (err) {
            console.log(err);
          }
        };
      
        const getAvatars = async (num) => {
          try {
            const requests = [];
            for (let i = 0; i < num; i++) {
              requests.push(getAvatar(i));
            }
            await Promise.all(requests);
            if (isMounted) {
              setAvatars(data);
            }
          } catch (err) {
            console.log(err);
          }
        };
      
        getAvatars(4).then(() => setLoading(false));
      
        return () => {
          isMounted = false;
          controller.abort();
        };
      }, [toggle]);
      

    return (
        <div className="avatar--container">
            <div className="avatar--header">Choose a profile icon</div>
            <div className="avatar--icons">
                {loading 
                ? <ClipLoader 
                    size={100}
                    color={"#123abc"}
                />
                : (
                    <div>
                        <div className='avatars'>
                            {avatars.map((avatar, index) => {
                            return (
                                    <img
                                        className={`avatar--image ${selectedIndex === index ? "avatar--selected" : ""}`}
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        key={index}
                                        onClick={() => {
                                            setSelectedIndex(index);
                                            console.log(`${index} selected !`);
                                        }}
                                    />
                            );
                            })}
                        </div>
                    </div>
                    )
                }
            </div>
            <div></div>
            <div></div>
            <div className="avatar--buttons">
                <button onClick={refresh} className="avatar--refresh">Refresh</button>
                <button onClick={confirm} className="avatar--confirm">Confirm</button>
            </div>
        </div>
    )
}

export default AvatarSelection;