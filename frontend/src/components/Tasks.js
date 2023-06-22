import React from 'react';
import '../style/tasks.css';
import TasksByProject from './TasksByProject';

function Tasks(props) {

    return (
        <div>
            {props.projects?.map((project, i) => (
              <div key={i}>
                {<TasksByProject 
                  name = {project.name}
                  _id = {project._id}
                  toggle = {props.toggle}
                  />}
              </div>
            ))}
        </div>
    )
}

export default Tasks;