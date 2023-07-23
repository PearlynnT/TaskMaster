import React, { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../style/taskCreation.css';
import { useNavigate } from 'react-router-dom';

const UPDATE_TASK_URL = '/update'; 

function TaskUpdate() {
    const axiosPrivate = useAxiosPrivate();
    // this id is task id 
    const { id } = useParams();
    const navigate = useNavigate();

    const nameRef = useRef();
    const errRef = useRef();

    const [proj, setProj] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priorityLvl, setPriorityLvl] = useState('');
    const [assign, setAssign] = useState(null);
    const [date, setDate] = useState(null);
    const [status, setStatus] = useState(false);

    const [userOptions, setUserOptions] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const priorityOptions = [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" }
    ];

    const [completedOptions, setCompletedOptions] = useState([
        { value: true, label: "Completed" },
        { value: false, label: "Not Completed" }
    ]);

    useEffect(() => {
        nameRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [name, description])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProjectId = async () => {
            try {
                let { data } = await axiosPrivate.get(`/tasks`);
                const p = data.filter((item) => (item._id === id))
                if (isMounted) {
                    setProj(p[0].project);
                }
            } catch (err) {
                console.log(err);
            }
        }

        const getOptions = async userData => {
            try {
                let arr = [];
                for (let i = 0; i < userData.length; i++) {
                    let { data } = await axiosPrivate.get(`/users/${userData[i]}`);
                    arr.push({ value: data._id, label: data.username });
                }
                setUserOptions(arr); 
            } catch (err) {
                console.log(err);
            }
        }

        const getUsers = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/projects",
                    {
                      signal: controller.signal,
                    }
                );
                // data is all the projects 
                const project = data.filter((item) => (item._id === proj));
                if (isMounted) {
                    let arr = project[0].members;
                    arr.push(project[0].owner);
                    getOptions(arr);
                }
            } catch (err) {
                console.log(err);
            }
        }

        const getTaskData = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    `/tasks/${id}`,
                    {
                        signal: controller.signal,
                    }
                );
                if (isMounted) {
                    setName(data.name);
                    setDescription(data.description);
                    setPriorityLvl(priorityOptions.find(option => option.value === data.priority));
                    setAssign(userOptions.find(option => option.value == data.assignTo));
                    setDate(new Date(data.date));
                    setStatus(completedOptions.find(option => option.value === data.completed));
                }
            } catch (err) {
                console.log(err);
            }
        }

        const fetchData = async () => {
            await getProjectId();
            await getUsers();
            await getTaskData();
        };
    
        fetchData();
    

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [proj])

    const handleUpdate = async event => {
        event.preventDefault();
        let priority = priorityLvl?.value;
        let assignTo = assign?.value;
        let completed = status?.value;
        try {
            const response = await axiosPrivate.put(`/tasks/${id}`,
                JSON.stringify({ proj, name, description, priority, assignTo, date, completed}),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Failed to update the task');
            }
            errRef.current.focus();
        }
    }

    return (
        <div className='taskCreation--container'>
            {success ? (
                navigate("/", { replace: true })
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='blueHeader'>Update Task</h1>
                    <form onSubmit={handleUpdate}>
                        <label htmlFor="name">Task Name:</label>
                        <input
                            type="text"
                            id="name"
                            ref={nameRef}
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                        <label htmlFor="description">Task Description:</label>
                        <input
                            type="text"
                            id="description"
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            required
                        />
                        <Select
                            options={priorityOptions}
                            name="priority"
                            value={priorityLvl}
                            onChange={setPriorityLvl}
                            autoFocus={true}
                            placeholder='Priority'
                            required
                        />
                        <Select
                            options={userOptions}
                            name="assignTo"
                            value={assign}
                            onChange={setAssign}
                            autoFocus={true}
                            placeholder='Assign members'
                            required
                        />
                        <Select
                            options={completedOptions}
                            name="completed"
                            value={status}
                            onChange={setStatus}
                            autoFocus={true}
                            placeholder='Completed Status'
                            required
                        />
                        <label htmlFor="date">Completed By:</label>
                        <DatePicker
                            showIcon
                            selected={date}
                            onChange={setDate}
                            dateFormat='dd/MM/yyyy'
                            minDate={new Date()}
                            required
                        />
                        <button type="submit" className='addTask'>Update Task</button>
                    </form>
                </section>
            )}
            <Link to="/"><span style={{ color: '#6988F6', textDecoration: 'underline' }}>Home Page</span></Link>
        </div>
    )
}

export default TaskUpdate;
