import React, { useState , useEffect} from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import Projects from '../components/Projects';
import Tasks from '../components/Tasks';
import '../style/toggle.css';

function Home() {
  const [isToggled, setIsToggled] = useState(true);
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const [projects, setProjects] = useState([]);
  let user = '';
  const axiosPrivate = useAxiosPrivate();
  const { currUser } = useAuth();
  const [flag, setFlag] = useState(false);

  const toggle = () => {
    setFlag(!flag);
  }

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

    const getUser = async () => { // to edit
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
    for (let proj of projects) {
      console.log(proj);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [flag]);
  
  return (
    <div>
      <Header />
      <div className='toggle--container'>
        <button className={`toggle--projects ${isToggled ? 'toggled' : ''}`} onClick={handleToggle}>Projects</button>
        <button className={`toggle--tasks ${!isToggled ? 'toggled' : ''}`} onClick={handleToggle}>Tasks</button>
      </div>
      {isToggled ? <Projects projects = {projects} toggle = {toggle}/> : <Tasks projects = {projects} toggle = {toggle}/>}
    </div>
  );
}

export default Home;