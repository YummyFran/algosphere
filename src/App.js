import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import Problems from "./pages/Problems";
import PlayGround from "./pages/PlayGround";
import Saved from "./pages/Saved";
import MainLayout from "./Layouts/MainLayout";
import Feed from "./pages/Feed";
import PostPage from "./pages/PostPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Feed />} />
          <Route path="courses" element={<Courses />} />
          <Route path="problems" element={<Problems />} />
          <Route path="playground" element={<PlayGround />} />
          <Route path="saved" element={<Saved />} />
          <Route path=":username/post/:postId" element={<PostPage />} />
        </Route>
        <Route path="*" element={'404 not found'} />
      </Routes>
    </HashRouter>
  );
}

export default App;
