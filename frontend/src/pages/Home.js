import { Link } from "react-router-dom";
import Header from "../components/Header";
import Project from "../components/Project";
import '../style/home.css'
import data from '../data/data.js'

function Home() {
    // to be replaced with axios 
    const dataSet = data.map(item => {
        return (
            <Project
                key={item.id}
                {...item}
            />
        )
    })

    return (
        <div className = "home">
            <Header />
            <Link to="/projectCreation">+ Create New Project</Link>
            <div className = "home--data">
                {dataSet}
            </div>
        </div>
    )
}

export default Home