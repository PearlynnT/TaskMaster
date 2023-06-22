import React, { useState, useEffect } from 'react';
import '../style/task.css';
import deleteIcon from '../icon/delete.png';
import { Completed, OnGoing, Stuck } from './Status';
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

    return (
        <div className='task'>
            <div className="task--name">{props.name}</div>
            <div className="task--divider"></div>
            <div className="task--description">{props.description}</div>
            <div className="task--divider"></div>
            <div className='task--status'>{props.priority}</div>
            <div className="task--divider"></div>
            <div className='task--date'>{props.date}</div>
            <div className="task--divider"></div>
            <div className='task--people'>{props.completed ? 'Completed' : 'Not completed'}</div>
            <div className="task--divider"></div>
            <div className="task--assignTo">{userName}</div>
            <div className="task--divider"></div>
            <div className='task--actions'>
                <button className='task--button' onClick={() => handleDelete(props._id)}><img className='task--delete' src={deleteIcon} alt='Delete Button' /></button>
            </div>
        </div>
    );
}

export default Task;
