import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
import ProjectCreation from './pages/ProjectCreation';
import TaskView from './pages/TaskView';

function App() {
  return (
    <Routes>
      <Route path="/">
        {/* public routes */}
        <Route element = {<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="projectCreation" element={<ProjectCreation />} />
            <Route path="taskView" element={<TaskView />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
