import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import Project from "./Project";
import '../style/projects.css';
import NewProject from "./NewProject";

function Projects() {
  const [projects, setProjects] = useState([]);
  //const [user, setUser] = useState('');
  let user = '';
  const axiosPrivate = useAxiosPrivate();
  const { currUser } = useAuth();

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

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <div className='projects--new'>
        <NewProject />
      </div>
      <div>
        {projects.length ? (
          <div className="projects--container">
            {projects.map((project, i) => (
              <div key={i}>
                {<Project 
                  {...project}
                  />}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>You have no projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
