import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import Project from "./Project";
import '../style/projects.css';
import NewProject from "./NewProject";

function Projects() {
  const [projects, setProjects] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

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

    getProjects();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location]);

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
