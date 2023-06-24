import React from 'react';
import { Link } from 'react-router-dom';
import '../style/newProject.css'

function NewProject() {
    return (
        <Link to="/projectCreation">
            <div className='newProject'>
                + Create New Project
            </div>
        </Link>
    )
}

export default NewProject;