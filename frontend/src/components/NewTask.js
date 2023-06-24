import React from 'react';
import { Link } from 'react-router-dom';
import '../style/newTask.css'

function NewTask(props) {
    let id = props.id;

    return (
        <div>
            <div style={{margin:'0px'}} className='divider'></div>
            <div className='newTask'>
                <Link to={`/taskCreation/${id}`}>
                    <p style={{color:'black'}}>+ Add New Task</p>
                </Link>
            </div>
        </div>
    )
}

export default NewTask;