import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../style/taskUpdate.css';

//const UPDATE_TASK_URL = '/update';

function TaskUpdate() {
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();

    const descRef = useRef();
    const errRef = useRef();

    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [priorityLvl, setPriorityLvl] = useState('');
    const [date, setDate] = useState(null);
    //let priority = '';

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const priorityOptions = [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" }
    ];

    useEffect(() => {
        descRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [description])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTask = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                      signal: controller.signal,
                    }
                );
                const task = data.filter((item) => (item._id === id));
                if (isMounted) {
                    setDescription(task[0].description); 
                    setPriority(task[0].priority);
                    //priority = task[0].priority; 
                    setDate(new Date(task[0].date));
                }
            } catch (err) {
                console.log(err);
            }
        }

        getTask();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

    const handleSubmit = async event => {
        event.preventDefault();

        if (priorityLvl.value !== undefined) {
            setPriority(priorityLvl.value); 
        }
        console.log(description)
        console.log(priority)
        console.log(date)
        try {
            const response = await axiosPrivate.put(`/tasks/${id}`,
                JSON.stringify({ description, priority, date }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setSuccess(true);
            setDescription('');
            setPriority('');
            setPriorityLvl('');
            setDate(null);
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
        <div className="taskUpdate--container">
            { success ? (
                <section>
                    <h1>Successfully updated the task!</h1>
                    <Link to="/"><span style={{color: '#6988F6', textDecoration: 'underline'}}>Home</span></Link>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='blueHeader'>Update Task</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="description">Task Description:</label>
                        <input 
                            type="text"
                            id="description"
                            ref={descRef}
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        />
                        <Select 
                            options={priorityOptions}
                            name="priority"
                            onChange={setPriorityLvl}
                            autoFocus={true}
                            placeholder= 'Priority'
                        />
                        <label htmlFor="date">Completed By:</label>
                        <DatePicker 
                            showIcon
                            selected={date}
                            onChange={setDate}
                            dateFormat='dd/MM/yyyy'
                            minDate={new Date()}
                        />
                        <button type="submit" className='updateTask'>Update Task</button>
                    </form>
                </section>
            )}
        </div>
    )
}

export default TaskUpdate;