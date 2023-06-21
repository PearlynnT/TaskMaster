// todo

import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import Task from "./Task";
import NewTask from "./NewTask";
import { Link } from 'react-router-dom';

function TasksByProject() {
    const [tasks, setTasks] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    let { id } = useParams();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTasksByProject = async () => { // doesnt work
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                      signal: controller.signal,
                    }
                );
                const projectTasks = data.filter((item) => (item.project === id)); // to check
                if (isMounted) {
                    setTasks(projectTasks);
                }
            } catch (err) {
                console.log(err);
            }
        }

        getTasksByProject();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

    return (
        <>
            <Link to="/"><span style={{color: '#6988F6', textDecoration: 'underline'}}>Home</span></Link>
            {tasks.length ? (
                <div>
                    <NewTask id={id} />
                    <br />
                    {tasks.map((task, i) => (
                        <div key={i}>
                            <Task {...task} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <NewTask id={id} />
                    <br />
                    <p>This project has no task</p>
                </div>
            )}
            <div className='divider'></div>
        </>
    )
}

export default TasksByProject