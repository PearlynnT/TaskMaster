import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import BarGraph from './BarGraph';

function Stats() {
    const axiosPrivate = useAxiosPrivate();
    const { currUser } = useAuth();

    //const [user, setUser] = useState(null);
    let user = '';
    const [activeProjs, setActiveProjs] = useState(0);
    const [completedProjs, setCompletedProjs] = useState(0);
    const [activeTasks, setActiveTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [activeProjsArr, setActiveProjsArr] = useState(null);
    const [activeProjsName, setActiveProjsName] = useState([]);
    const [activeTasksInActiveProj, setActiveTasksInActiveProj] = useState([]);
    // const [totalProjs, setTotalProjs] = useState(0);
    // const [totalTasks, setTotalTasks] = useState(0);
    // let activeProjs = 0;
    // let completedProjs = 0;
    // let activeTasks = 0;
    // let completedTasks = 0;

    // useEffect(() => {
    //     setTotalProjs(activeProjs + completedProjs);
    // }, [activeProjs, completedProjs]);

    // useEffect(() => {
    //     setTotalTasks(activeTasks + completedTasks);
    // }, [activeTasks, completedTasks]);

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
                    setActiveProjsArr(arr[0]);
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

    // bar graph of active tasks for each active project
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getActiveTasksByProj = async (id) => {
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                      signal: controller.signal,
                    }
                );
                const projectTasks = data.filter((item) => (item.project === id));
                const tasks = projectTasks.filter((item) => (!item.completed));
                if (isMounted) {
                    //activeTasksInActiveProj.push(tasks.length);
                    setActiveTasksInActiveProj(oldArr => [...oldArr, tasks.length]);
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (activeProjsArr !== null) {
            const nameArr = activeProjsArr.map((proj) => proj.name);
            setActiveProjsName(nameArr);
            const idArr = activeProjsArr.map((proj) => proj._id);
            for (let i = 0; i < idArr.length; i++) {
                getActiveTasksByProj(idArr[i]);
            }
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [activeProjsArr]);

    return (
        <>
            {
            /**<h2>Total active projects: {activeProjs}</h2>
            <h2>Total completed projects: {completedProjs}</h2>
            <h2>Total active tasks: {activeTasks}</h2>
            <h2>Total completed tasks: {completedTasks}</h2>
            **/
            }
            <Box
                id="chart"
                flex={1}
                display="flex"
                bgcolor="#fcfcfc"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                pl={3.5}
                py={2}
                gap={2}
                borderRadius="15px"
                minHeight="110px"
                width="fit-content"
            >
                <Stack direction="column">
                    <Typography fontSize={14} color="#808191">
                        Active Projects
                    </Typography>
                    <Typography
                        fontSize={24}
                        color="#11142d"
                        fontWeight={700}
                        mt={1}
                    >
                        {activeProjs}
                    </Typography>
                </Stack>
                <ReactApexChart
                    options={{
                        chart: { type: "donut" },
                        colors: ["#D1E5F4", "#9ABDDC" ],
                        legend: { show: false },
                        dataLabels: { enabled: false },
                    }}
                    series={[activeProjs, completedProjs]}
                    type="donut"
                    width="120px"
                />

                <Stack direction="column">
                    <Typography fontSize={14} color="#808191">
                        Active Tasks
                    </Typography>
                    <Typography
                        fontSize={24}
                        color="#11142d"
                        fontWeight={700}
                        mt={1}
                    >
                        {activeTasks}
                    </Typography>
                </Stack>
                <ReactApexChart
                    options={{
                        chart: { type: "donut" },
                        colors: ["#D1E5F4", "#9ABDDC" ],
                        legend: { show: false },
                        dataLabels: { enabled: false },
                    }}
                    series={[activeTasks, completedTasks]}
                    type="donut"
                    width="120px"
                />
            </Box>
            <Stack
                mt="25px"
                width="100%"
                direction={{ xs: "column", lg: "row" }}
                gap={4}
            >
                <BarGraph names={activeProjsName} data={activeTasksInActiveProj} />
            </Stack>
        </>
    )
}

export default Stats;