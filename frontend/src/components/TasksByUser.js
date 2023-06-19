// to be imported in Home.js

import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import Task from "./Task";

function TasksByUser() {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState('');
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
                    setUser(currentUser[0]._id);
                }
            } catch (err) {
                console.log(err);
            }
        }

        const getTasksByUser = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                      signal: controller.signal,
                    }
                );
                const userTasks = data.filter((item) => (item.assignTo === user)); // need to check assignTo type
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