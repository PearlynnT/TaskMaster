// to be edited

import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

function Tasks() {
    const [tasks, setTasks] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTasks = async () => {
            try {
                const response = await axiosPrivate.get('/tasks', {
                    signal: controller.signal
                });
                isMounted && setTasks(response.data);
            } catch (err) {
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getTasks();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <div>
            {tasks?.length
                ? (
                    <div>
                        {tasks.map((task, i) => <div key={i}>{/* todo */}</div>)}
                    </div>
                ) : <h2>You have no tasks</h2>
            }
        </div>
    )
}

export default Tasks