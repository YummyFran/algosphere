import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import Excercises from "./pages/Excercises";
import PlayGround from "./pages/PlayGround";
import MainLayout from "./Layouts/MainLayout";
import Feed from "./pages/Feed";
import PostPage from "./pages/PostPage";
import Profile from "./pages/Profile";
import Timeline from "./components/Timeline";
import Wall from "./components/Wall";
import Reposts from "./components/Reposts";
import Course from "./pages/Course";
import Lessons from "./components/Lessons";
import NewUser from "./pages/NewUser";
import Metrics from "./Layouts/Metrics";
import Following from "./components/Following";
import Followers from "./components/Followers";
import PostActivity from "./pages/PostActivity";
import ExerciseRenderer from "./pages/ExerciseRenderer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/newuser" element={<NewUser />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Feed />} />
          <Route path="courses" element={<Courses />} />
          <Route path="exercises" element={<Excercises />} />
          <Route path="playground" element={<PlayGround />} />
        </Route>

        <Route path=":username/post/:postId" element={<PostPage />} />
        <Route path=":username/post/:postId/activity" element={<PostActivity />} />
        <Route path=":username" element={<Profile />}>
          <Route index element={<Timeline />} />
          <Route path="wall" element={<Wall />} />
          <Route path="reposts" element={<Reposts />} />

        </Route>
        <Route path=":username" element={<Metrics />}>
          <Route path="following" element={<Following />} />
          <Route path="followers" element={<Followers />} />
        </Route>

        <Route path="/courses/:collectionSlug/:courseSlug" element={<Course />}>
          <Route path=":lessonSlug" element={<Lessons />}/>
        </Route>

        <Route path="exercises/:exerciseSlug" element={<ExerciseRenderer />} />
        
        <Route path="*" element={'404 not found'} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
