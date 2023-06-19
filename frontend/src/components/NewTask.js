import React from 'react';
import { Link } from 'react-router-dom';
import '../style/newTask.css'

function NewTask(props) {
    let id = props.id;

    return (
        <Link to={`/taskCreation/${id}`}>
            <div className='newTask'>
                + Add New Task
            </div>
        </Link>
    )
}

export default NewTask;