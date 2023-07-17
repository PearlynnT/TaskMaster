import React, { useState , useEffect} from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';
import Header from '../components/Header';
import Projects from '../components/Projects';
import Tasks from '../components/Tasks';
import Chats from '../components/Chats';
import Stats from '../components/Stats';

import '../style/toggle.css';

function Home() {
  const [toggleCount, setToggleCount] = useState(1);
  const [socket, setSocket] = useState(null);
  const { currUser, notification, setNotification, selectedRoom, setSelectedRoom } = useAuth();

  const handleProjectToggle = () => {
    setToggleCount(1);
    setSelectedRoom("");
  };

  const handleTaskToggle = () => {
    setToggleCount(2);
    setSelectedRoom("");
  };

  const handleChatToggle = () => {
    setToggleCount(3);
  };

  const handleStatsToggle = () => {
    setToggleCount(4);
    setSelectedRoom("");
  };

  const [projects, setProjects] = useState([]);
  let user = '';
  const axiosPrivate = useAxiosPrivate();
  const [flag, setFlag] = useState(false);

  const toggle = () => {
    setFlag(!flag);
  }

  useEffect(() => {
    //const newSocket = io.connect('https://task-master-evop.onrender.com');
    const newSocket = io.connect('http://localhost:3500');
    setSocket(newSocket);

    //newSocket.emit("setup", currUser);

    // Cleanup function to disconnect socket on component unmount
    return () => {
        newSocket.disconnect();
    };
  }, []);

//   useEffect(() => {
//     console.log(selectedRoom)
//     if (socket) {
//       socket.on("receive_notification", (data) => {
//         // notifications when chat not selected
//         if (selectedRoom === "" || selectedRoom !== data.room) {
//             if (!notification.includes(data)) {
//                 console.log("here")
//                 setNotification([data, ...notification]);
//             }
//         }
//       })
//     }
// }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkMembers = arr => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === user) {
          return true;
        }
      }
      return false;
    }

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
            //setUser(currentUser[0]._id)
            user = currentUser[0]._id;
          }
        } catch (err) {
          console.log(err);
        }
    };

    const getProjects = async () => {
      try {
        const { data } = await axiosPrivate.get(
          "/projects",
          {
            signal: controller.signal,
          }
        );
        let arr = [];
        const ownProject = data.filter((item) => (item.owner === user));
        if (ownProject.length !== 0) {
          arr.push(ownProject);
        }
        const membProject = data.filter((item) => (checkMembers(item.members)));
        if (membProject.length !== 0) {
          arr.push(membProject);
        }
        if (isMounted) {
          setProjects(arr[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUser().then(() => getProjects());

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [flag]);
  
  return (
    <div>
      <Header />
      <div className='toggle--container'>
        <button className={`toggle--projects ${toggleCount === 1 ? 'toggled' : ''}`} onClick={handleProjectToggle}>Projects</button>
        <button className={`toggle--tasks ${toggleCount === 2 ? 'toggled' : ''}`} onClick={handleTaskToggle}>Tasks</button>
        <button className={`toggle--tasks ${toggleCount === 3 ? 'toggled' : ''}`} onClick={handleChatToggle}>Chats</button>
        <button className={`toggle--tasks ${toggleCount === 4 ? 'toggled' : ''}`} onClick={handleStatsToggle}>Stats</button>
      </div>
      {toggleCount === 1 
        ? <Projects projects={projects} toggle={toggle} socket={socket} /> 
        : toggleCount === 2
        ? <Tasks projects={projects} toggle={toggle} socket={socket} />
        : toggleCount === 3 
        ? <Chats projects={projects} socket={socket} />
        : <Stats />}
    </div>
  );
}

export default Home;