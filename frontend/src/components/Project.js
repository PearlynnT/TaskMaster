import '../style/project.css'

function Project(props) {
    return (
        <div className = "project">
            <h3>{props.title}</h3>
            <p>{props.desc}</p>
        </div>
    )
}

export default Project;