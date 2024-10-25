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
import Profile from "./pages/Profile";
import Timeline from "./components/Timeline";
import Wall from "./components/Wall";
import Reposts from "./components/Reposts";
import Course from "./pages/Course";
import Lessons from "./components/Lessons";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Feed />} />
          <Route path="courses" element={<Courses />} />
          <Route path="excercise" element={<Problems />} />
          <Route path="playground" element={<PlayGround />} />
          <Route path="saved" element={<Saved />} />
        </Route>

        <Route path=":username/post/:postId" element={<PostPage />} />
        <Route path=":username" element={<Profile />}>
          <Route index element={<Timeline />} />
          <Route path="wall" element={<Wall />} />
          <Route path="reposts" element={<Reposts />} />
        </Route>

        <Route path="/courses/:collectionSlug/:courseSlug" element={<Course />}>
          <Route path=":lessonSlug" element={<Lessons />}/>
        </Route>
        
        <Route path="*" element={'404 not found'} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
