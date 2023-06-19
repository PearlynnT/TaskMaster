import React from 'react';
import Task from "./Task";
import data from '../data.js'
import '../style/tasks.css'

function Tasks() {
    const displayTask = data.map(x => {
        return (
            <Task {...x} />
        )
    })
    return (
        <div style={{margin:'10px 20px 0px 20px'}}>
            <h1 className='tasks--header'>Orbital</h1>
            {displayTask}
            <div className='tasks--new'>
                <button className='task--button'>+ New</button>
            </div>
            <h1 className='tasks--header'>Orbital</h1>
            {displayTask}
            <div className='tasks--new'>
                <button className='task--button'>+ New</button>
            </div>
        </div>
    )
}

export default Tasks;