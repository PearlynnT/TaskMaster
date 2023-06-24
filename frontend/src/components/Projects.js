import Project from "./Project";
import '../style/projects.css';
import NewProject from "./NewProject";

function Projects(props) {
  const projects = props.projects;
  const toggle = props.toggle;

  return (
    <div style={{margin:'30px'}}>
      <div className='projects--new'>
        <NewProject />
      </div>
      <div>
        {projects?.length ? (
          <div className="projects--container">
            {projects.map((project, i) => (
              <div key={i}>
                {<Project 
                  {...project}
                  toggle = {toggle}
                  />}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>You have no projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
