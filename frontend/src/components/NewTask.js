import React from 'react';
import { Link } from 'react-router-dom';
import '../style/newTask.css'

function NewTask(props) {
    let id = props.id;

    return (
        <div className='newTask'>
            <Link to={`/taskCreation/${id}`}>
                <p style={{color:'black'}}>+ Add New Task</p>
            </Link>
        </div>
    )
}

export default NewTask;