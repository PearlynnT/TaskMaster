import React, { useState, useEffect } from 'react';
import '../style/project.css';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import deleteIcon from '../icon/delete.png'

function Project(props) {
    const axiosPrivate = useAxiosPrivate();
    const toggle = props.toggle;

    const handleDelete = async (id) => {
        try {
            const response = await axiosPrivate.delete(
                `/projects/${id}`
            ).then(() => toggle());
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="project">
            <div className="project--header">
                <h3 className='project--name'>{props.name}</h3>
                <h4 className='project--member'>{props.members.length + 1 + ' members'}</h4>
                <button className='project--button' onClick={() => handleDelete(props._id)}>
                    <img className='project--delete' src={deleteIcon} alt='Delete Button' />
                </button>
            </div>
            <div className='divider'></div>
            <p className='project--description'>{props.description}</p>
        </div>
    )
}

export default Project;

