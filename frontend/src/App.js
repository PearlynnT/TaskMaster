import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
import ProjectCreation from './pages/ProjectCreation';
import TaskCreation from './pages/TaskCreation';
import TasksByProject from './components/TasksByProject';
import TaskUpdate from './pages/TaskUpdate';
import AvatarSelection from './pages/AvatarSelection';

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
            <Route path="avatarSelection" element={<AvatarSelection />} />
            <Route path="projectCreation" element={<ProjectCreation />} />
            <Route path="taskCreation/:id" element={<TaskCreation />} />
            <Route path="tasks/:id" element={<TasksByProject />} />
            <Route path="taskUpdate/:id" element={<TaskUpdate />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
