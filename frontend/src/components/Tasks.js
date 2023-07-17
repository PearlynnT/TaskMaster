import { useEffect } from "react";
import useAuth from '../hooks/useAuth';
import TasksByProject from './TasksByProject';

function Tasks(props) {
  const socket = props.socket;
  const { notification, setNotification, selectedRoom } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on("receive_notification", (data) => {
        // notifications when chat not selected
        if (selectedRoom === "") {
            if (!notification.includes(data)) {
                setNotification([data, ...notification]);
            }
        }
      })
    }
  }, []);

  return (
      <div>
        {props.projects?.length > 0 ? (
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
        ) : (
          <p style={{margin: "20px"}}>You have no tasks</p>
        )}
        
      </div>
  )
}

export default Tasks;
