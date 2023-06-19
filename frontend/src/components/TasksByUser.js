// to be imported in Home.js

import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import Task from "./Task";

function TasksByUser() {
    const [tasks, setTasks] = useState([]);
    //const [user, setUser] = useState('');
    let user = '';
    const axiosPrivate = useAxiosPrivate();
    const { currUser } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

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
                    //setUser(currentUser[0]._id);
                    user = currentUser[0]._id
                    console.log(user)
                }
            } catch (err) {
                console.log(err);
            }
        }

        const getTasksByUser = async () => { // doesnt work
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                      signal: controller.signal,
                    }
                );
                const userTasks = data.filter((item) => (item.assignTo === user)); 
                console.log(data)
                if (isMounted) {
                    setTasks(userTasks);
                }
            } catch (err) {
                console.log(err);
            }
        }

        getUser().then(() => getTasksByUser());

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

    return (
        <>
            {tasks.length ? (
                <div>
                    {tasks.map((task, i) => (
                        <div key={i}>
                            <Task {...task} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p>You have no tasks</p>
                </div>
            )}
        </>
    )
}

export default TasksByUser