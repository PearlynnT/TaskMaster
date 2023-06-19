import Header from '../components/Header';
import Projects from '../components/Projects';
import Tasks from '../components/Tasks';
import React, { useState } from 'react';
import '../style/toggle.css';

function Home() {
  const [isToggled, setIsToggled] = useState(true);
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  return (
    <div>
      <Header />
      <div className='toggle--container'>
        <button className={`toggle--projects ${isToggled ? 'toggled' : ''}`} onClick={handleToggle}>Projects</button>
        <button className={`toggle--tasks ${!isToggled ? 'toggled' : ''}`} onClick={handleToggle}>Tasks</button>
      </div>
      {isToggled ? <Projects/> : <Tasks />}
    </div>
  );
}

export default Home;