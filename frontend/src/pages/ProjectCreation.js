import { Link } from "react-router-dom";
import Header from "../components/Header";

function ProjectCreation() {
    return (
        <div>
            <Header />
            <Link to="/">Home Page</Link>
            <br/>
            <input type = 'text' placeholder = 'Project Name: '/>
            <br/>
            <br/>
            <input type = 'text' placeholder = 'Project Description: '/>
            <br/>
            <button>Submit</button>
        </div>
    )
}

export default ProjectCreation