import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';

function Stats({ socket }) {
    const axiosPrivate = useAxiosPrivate();
    const { currUser, notification, setNotification } = useAuth();

    //const [user, setUser] = useState(null);
    let user = '';
    const [activeProjs, setActiveProjs] = useState(0);
    const [completedProjs, setCompletedProjs] = useState(0);
    const [activeTasks, setActiveTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    // let activeProjs = 0;
    // let completedProjs = 0;
    // let activeTasks = 0;
    // let completedTasks = 0;

    // useEffect(() => {
    //     socket.on("receive_message", (data) => { 
    //         // notifications when chat not selected
    //         if (!notification.includes(data)) {
    //           console.log("stats")
    //           setNotification([data, ...notification]);
    //         }
    //     });
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

        // get user id
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
                    user = currentUser[0]._id;
                }
            } catch (err) {
                console.log(err);
            }
        };

        const getActiveProjs = async () => { 
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
                for (let i = 0; i < arr[0].length; i++) { 
                    if (arr[0][i].completed) {
                        arr[0].splice(i, 1);
                    }
                }
                if (isMounted && arr[0] !== undefined) {
                    setActiveProjs(arr[0].length);
                    //activeProjs = arr[0].length;
                }
            } catch (err) {
                console.log(err);
            }
        }

        const getCompletedProjs = async () => {
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
                for (let i = 0; i < arr[0].length; i++) {
                    if (!arr[0][i].completed) {
                        arr[0].splice(i, 1);
                    }
                }
                if (isMounted && arr[0] !== undefined) {
                    setCompletedProjs(arr[0].length);
                    //completedProjs = arr[0].length;
                }
            } catch (err) {
                console.log(err);
            }
        }

        const getActiveTasks = async () => { 
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                        signal: controller.signal,
                    }
                );
                const userTasks = data.filter((item) => (item.assignTo.toString() === user));
                const tasks = userTasks.filter((item) => (!item.completed));
                if (isMounted) {
                    setActiveTasks(tasks.length);
                    //activeTasks = tasks.length;
                }
            } catch (err) {
                console.log(err);
            }
        }

        const getCompletedTasks = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                        signal: controller.signal,
                    }
                );
                const userTasks = data.filter((item) => (item.assignTo.toString() === user));
                const tasks = userTasks.filter((item) => (item.completed));
                if (isMounted) {
                    setCompletedTasks(tasks.length);
                    //completedTasks = tasks.length;
                }
            } catch (err) {
                console.log(err);
            }
        }

        // const promiseExec = async () => {
        //     const promise = await Promise.all([
        //         getActiveProjs(),
        //         getCompletedProjs(),
        //         getActiveTasks(),
        //         getCompletedTasks()
        //     ]);
        // }

        // getUser().then(() => promiseExec()); 

        getUser()
            .then(() => getActiveProjs())
            .then(() => getCompletedProjs())
            .then(() => getActiveTasks())
            .then(() => getCompletedTasks())

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <>
            <h2>Total active projects: {activeProjs}</h2>
            <h2>Total completed projects: {completedProjs}</h2>
            <h2>Total active tasks: {activeTasks}</h2>
            <h2>Total completed tasks: {completedTasks}</h2>
        </>
    )
}

export default Stats;