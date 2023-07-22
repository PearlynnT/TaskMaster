import React, { useState, useEffect } from 'react';
import '../style/project.css';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import deleteIcon from '../icon/delete.png';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function Project(props) {
    const axiosPrivate = useAxiosPrivate();
    const toggle = props.toggle;
    const [deleteToggle, setDeleteToggle] = useState(false);
    const [projTasks, setProjTasks] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTasks = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/tasks",
                    {
                      signal: controller.signal,
                    }
                );
                const tasks = data.filter((item) => (item.project.toString() === props._id));
                if (isMounted) {
                    setProjTasks(tasks);
                }
            } catch (err) {
                console.log(err);
            }
        }

        getTasks();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const handleDelete = () => {
        setDeleteToggle(true);
    }

    const onCancel = () => {
        setDeleteToggle(false);
    }

    // delete tasks when project is deleted
    const deleteTasks = async () => {
        try {
            for (let i = 0; i < projTasks.length; i++) {
                const response = await axiosPrivate.delete(
                    `/tasks/${projTasks[i]._id}`
                );
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onConfirm = async (id) => {
        try {
            const response = await axiosPrivate.delete(
                `/projects/${id}`
            ).then(() => toggle()).then(() => deleteTasks());
        } catch (err) {
            console.log(err);
        }
        setDeleteToggle(false);
    }

    return (
        <div>
            <div className="project">
                <div className="project--header">
                    <h3 className='project--name'>{props.name}</h3>
                    <h4 className='project--member'>{props.members.length + 1 === 1 ? '1 member' : props.members.length + 1 + ' members'}</h4>
                    <div className='project--actions'>
                        <button className='project--button' onClick={handleDelete}>
                            <img className='project--delete' src={deleteIcon} alt='Delete Button' />
                        </button>
                    </div>
                </div>
                <div className='divider'></div>
                <p className='project--description'>{props.description}</p>
            </div>
            <DeleteConfirmationModal isOpen={deleteToggle} onCancel={onCancel} onConfirm={() => onConfirm(props._id)} />
        </div>
        
    )
}

export default Project;

