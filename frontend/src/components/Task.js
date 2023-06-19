import React from 'react';
import '../style/task.css';
import deleteIcon from '../icon/delete.png';
import editIcon from '../icon/edit.png';
import { Completed, OnGoing, Stuck } from './Status';

function Task(props) {
    return (
        <div className='task'>
            <div className="task--name">{props.name}</div>
            <div className="task--divider"></div>
            <div className="task--description">{props.description}</div>
            <div className="task--divider"></div>
            <div className='task--status'>
                {props.status === 0 
                 ? <Completed /> 
                 : props.status === 1 
                 ? <OnGoing /> 
                 : <Stuck />}
            </div>
            <div className="task--divider"></div>
            <div className='task--date'>{props.date}</div>
            <div className="task--divider"></div>
            <div className='task--people'>{props.people}</div>
            <div className="task--divider"></div>
            <div className='task--actions'>
                <button className='task--button'><img className='task--delete' src={deleteIcon} alt='Delete Button' /></button>
                <button className='task--button'><img className='task--edit' src={editIcon} alt='Edit Button' /></button>
            </div>
        </div>
    );
}

export default Task;
