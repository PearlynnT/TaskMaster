import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Task from "./Task";
import NewTask from "./NewTask";
import '../style/tasksByProject.css'
import '../style/task.css';

function TasksByProject(props) {
    const [tasks, setTasks] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTasksByProject = async () => { 
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                      signal: controller.signal,
                    }
                );
                const projectTasks = data.filter((item) => (item.project === props._id));
                if (isMounted) {
                    setTasks(projectTasks);
                }
            } catch (err) {
                console.log(err);
            }
        }

        getTasksByProject();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

    const taskView = <div>
        {tasks.map((task, i) => (
        <div key={i}>
          {<Task 
            {...task}
            toggle={props.toggle}
            />}
        </div>
      ))}
    </div>

    const title = <div className='tasksByProject--container'>
        <div className="task--name">Name</div>
        <div className="task--description">Description</div>
        <div className='task--priority'>Priority </div>
        <div className='task--date'>Deadline</div>
        <div className='task--completed'>Status</div>
        <div className="task--assignTo">Assigned To</div>
        <div className='task--actions'>Actions</div>
    </div>

    return (
        <div className='tbp--container'>
            <div className='tbp--name'>{props.name}</div>
            {title}
            {taskView}
            <NewTask id={props._id}/>
        </div>
    )
}

export default TasksByProject