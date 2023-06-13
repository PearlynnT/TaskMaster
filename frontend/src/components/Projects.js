import '../style/project.css';

function Project(props) {
    const handleDelete = async event => {
        event.preventDefault();
        try {
            // todo: delete
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="project">
            <h3>{props.name}</h3>
            <p>{props.description}</p>
            <p>{props.members}</p>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default Project;

// import { useState, useEffect } from "react";
// import useAxiosPrivate from "../hooks/useAxiosPrivate";
// import { useNavigate, useLocation } from "react-router-dom";
// import '../style/project.css';

// function Projects() {
//     const [projects, setProjects] = useState();
//     const axiosPrivate = useAxiosPrivate();
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         let isMounted = true;
//         const controller = new AbortController();

//         const getProjects = async () => {
//             try {
//                 const response = await axiosPrivate.get('/projects', {
//                     signal: controller.signal
//                 });
//                 isMounted && setProjects(response.data); // i think this retrieves all projects
//             } catch (err) {
//                 navigate('/login', { state: { from: location }, replace: true });
//             }
//         }

//         getProjects();

//         return () => {
//             isMounted = false;
//             controller.abort();
//         }
//     }, [])

//     return (
//         <div>
//             <h1>Projects</h1>
//             {projects?.length
//                 ? (
//                     <div>
//                         {projects.map((project, i) => {
//                             <div key={i} className="project">
//                                 <h3>{project?.name}</h3>
//                                 <p>{project?.description}</p>
//                             </div>}
//                         )}
//                     </div>
//                 ) : <h2>You have no projects.</h2>
//             }
//         </div>
//     )
// }

// export default Projects