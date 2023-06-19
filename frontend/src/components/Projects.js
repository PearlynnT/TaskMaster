import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import Project from "./Project";
import '../style/projects.css';
import NewProject from "./NewProject";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [owner, setOwner] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const { currUser } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getOwner = async () => {
        try {
            const { data } = await axiosPrivate.get(
                "/users",
                {
                  signal: controller.signal,
                }
            );
            const currentUser = data.filter((item) => (item.username === currUser));
            setOwner(currentUser[0]._id);
        } catch (err) {
            console.log(err);
        }
    };

    const getProjects = async () => {
      try {
        const response = await axiosPrivate.get(
          "/projects",
          {
            signal: controller.signal,
          }
        );
        if (isMounted) {
          setProjects(response.data);
        }
      } catch (err) {
        
      }
    };

    getOwner().then(() => getProjects());

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <div>
        {projects.length ? (
          <div className = "projects--container">
            {projects.map((project, i) => (
              <div key={i}>
                {<Project 
                  {...project}
                  />}
              </div>
            ))}
            <NewProject />
          </div>
        ) : (
          <div>
            <p>You have no projects</p>
            <NewProject />
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
