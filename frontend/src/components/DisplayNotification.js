// todo: display room in notifications

import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const DisplayNotification = (props) => {
    const { room, owner, message } = props.notif;
    const axiosPrivate = useAxiosPrivate();
    const [projectName, setProjectName] = useState('');

    // const getProject = async (id) => {
    //     try {
    //         const { data } = await axiosPrivate.get(
    //             `/projects/${id}`
    //         );
    //         console.log(data)
    //         return data.map((item) => item.room);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // useEffect(() => {
    //     const fetchProject = async () => {
    //         const name = await getProject(room);
    //         setProjectName(name);
    //     };
    //     fetchProject();
    // }, []);

    return (
        <div className="notification">
            {/* <span className="header--notificationTitle">{`New message in ${projectName}`}</span> */}
            <br></br>
            <span className="notification--text">{`${owner}: ${message}`}</span>
        </div>
    )
}
export default DisplayNotification;