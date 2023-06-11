import { Link } from "react-router-dom";
import Header from "../components/Header";
import Project from "../components/Project";
import '../style/home.css'

function Home() {
    return (
        <div className = "home">
            <Header />
            <Link to="/projectCreation">+ Create New Project</Link>
            <div className = 'home--data'>
            <Project name = "Project A" description = "This is my first project"/>
            <Project name = "Project B" description = "This is my second project"/>
            <Project name = "Project C" description = "This is my third project"/>
            </div>
            
        </div>
    )
}

export default Home