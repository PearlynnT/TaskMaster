import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import Project from "./Projects";
import '../style/task.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getTasks = async () => {
      try {
        const response = await axiosPrivate.get(
          "/projects",
          {
            signal: controller.signal,
          }
        );
        if (isMounted) {
          setTasks(response.data);
        }
      } catch (err) {
        
      }
    };

    getTasks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location]);

  return (
    <div>
      {tasks.length ? (
        <div className = "task--container">
          {tasks.map((task, i) => (
            <div key={i}>
              {<Project 
                // name={task.name} 
                // description={task.description}
                // members={task.members}
                {...task}
                />}
            </div>
          ))}
        </div>
      ) : (
        <h2>You have no tasks</h2>
      )}
    </div>
  );
}

export default Tasks;
