// todo: date
import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
//import useAuth from '../hooks/useAuth';
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../style/taskCreation.css';
import { useNavigate} from 'react-router-dom';

const ADD_TASK_URL = '/add';

function TaskCreation() {
    const axiosPrivate = useAxiosPrivate();
    //const { currUser } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const nameRef = useRef();
    const errRef = useRef();

    const [proj, setProj] = useState(id);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priorityLvl, setPriorityLvl] = useState(''); 
    const [assign, setAssign] = useState(null);
    const [date, setDate] = useState(null);
    const [completed, setCompleted] = useState(false);

    const [userOptions, setUserOptions] = useState([]);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const priorityOptions = [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" }
    ];

    useEffect(() => {
        nameRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [name, description])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

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
                const project = data.filter((item) => (item._id === id));
                if (isMounted) {
                    let arr = project[0].members;
                    arr.push(project[0].owner);
                    //setUserData(arr);
                    getOptions(arr);
                }
            } catch (err) {
                console.log(err);
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

    const handleSubmit = async event => {
        event.preventDefault();

        console.log(priorityLvl)
        let priority = priorityLvl.value;
        let assigned = assign.value;
        try {
            const response = await axios.post(ADD_TASK_URL,
                JSON.stringify({ proj, name, description, priority, assigned, date, completed }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setSuccess(true);
            setProj(null);
            setName('');
            setDescription('');
            setPriorityLvl('');
            setAssign(null);
            setDate(null);
            setCompleted(false);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Failed to add new task');
            }
            errRef.current.focus();
        }
    }

    return (
        <div className='taskCreation--container'>
            { success ? (
                navigate("/", { replace: true })
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='blueHeader'>Add Task</h1>
                    <form onSubmit={handleSubmit}>
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
                            onChange={setPriorityLvl}
                            autoFocus={true}
                            placeholder= 'Priority'
                            required
                        />
                        <Select 
                            options={userOptions}
                            name="assignTo"
                            onChange={setAssign}
                            autoFocus={true}
                            placeholder='Assign members'
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
                            // showYearDropdown
                            // scrollableMonthYearDropdown
                        />
                        <button type="submit" className='addTask'>Add Task</button>
                    </form>
                </section>
                )}
            <Link to="/"><span style={{color: '#6988F6', textDecoration: 'underline'}}>Home Page</span></Link>
        </div>
    )
}

export default TaskCreation