import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import FullPost from './components/FullPost';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/" element={<Home />} />
      <Route path="/createPost" element={<CreatePost />} />
      <Route path="/post/:postId" element={<FullPost />} />
    </Routes>
  );
}

export default App;
