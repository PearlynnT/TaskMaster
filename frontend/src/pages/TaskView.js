import { Link } from 'react-router-dom';

function TaskView() {
    return (
        <div>
            <h1>My Tasks</h1> 
            <Link to="/">Home Page</Link>
        </div>
    )
}

export default TaskView;