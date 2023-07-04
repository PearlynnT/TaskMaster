import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/task.css';
import deleteIcon from '../icon/delete.png';
import { Completed, NotCompleted } from './Status';
import Priority from './Priority';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Task(props) {
    const axiosPrivate = useAxiosPrivate();
    const [userName, setUserName] = useState("");
    
    const handleDelete = async (id) => {
        try {
            const response = await axiosPrivate.delete(
                `/tasks/${id}`
            ).then(() => props.toggle());
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUserName = async (id) => { 
            try {
              const { data } = await axiosPrivate.get(
                  `/users/${id}`,
                  {
                    signal: controller.signal,
                  }
              );
              const userName = data.username;
              if (isMounted) {
                setUserName(userName)
              }
            } catch (err) {
              console.log(err);
            }
        };
        getUserName(props.assignTo);
        return () => {
            isMounted = false;
            controller.abort();
          };
    }, [userName])

    const date = new Date(props.date);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    const formattedDate = date.toLocaleString(undefined, options);

    return (
        <div className='task'>
            <div className="task--name">{props.name}</div>
            <div className="task--divider"></div>
            <div className="task--description">{props.description}</div>
            <div className="task--divider"></div>
            <div className='task--priority'><Priority priority={props.priority} /></div>
            <div className="task--divider"></div>
            <div className='task--date'>{formattedDate}</div>
            <div className="task--divider"></div>
            <div className='task--completed'>{props.completed ? <Completed /> : <NotCompleted />}</div>
            <div className="task--divider"></div>
            <div className="task--assignTo">{userName}</div>
            <div className="task--divider"></div>
            <div className='task--actions'>
                <Link to={`/taskUpdate/${props._id}`}>Edit</Link>
                <button className='task--button' onClick={() => handleDelete(props._id)}><img className='task--delete' src={deleteIcon} alt='Delete Button' /></button>
            </div>
        </div>
    );
}

export default Task;
