import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Tasks from '../components/Tasks';
//import Projects from '../components/Projects';

function Home() {
  return (
    <div className="home">
      <Header />
      <Link to="/projectCreation">+ Create New Project</Link>
      <div className="home--data">
        <Tasks/>
      </div>
    </div>
  );
}

export default Home;