import React from 'react';
import TasksByProject from './TasksByProject';

function Tasks(props) {

    return (
        <div>
          {props.projects?.length > 0 ? (
            <div>
              {props.projects?.map((project, i) => (
                  <div key={i}>
                    {<TasksByProject 
                      name = {project.name}
                      _id = {project._id}
                      />}
                  </div>
                ))}
            </div>
          ) : (
            <p style={{margin: "20px"}}>You have no tasks</p>
          )}
          
        </div>
    )
}

export default Tasks;
