import '../style/project.css'

function Project(props) {
    return (
        <div className = "project">
            <h3>{props.name}</h3>
            <p>{props.description}</p>
            <button>Delete</button>
        </div>
    )
}

export default Project;