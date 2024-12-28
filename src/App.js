import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Saved from "./components/Saved";
import Reposts from "./components/Reposts";
import Course from "./pages/Course";
import Lessons from "./components/Lessons";
import NewUser from "./pages/NewUser";
import Metrics from "./Layouts/Metrics";
import Following from "./components/Following";
import Followers from "./components/Followers";
import PostActivity from "./pages/PostActivity";
import ExerciseRenderer from "./pages/ExerciseRenderer";
import Problem from "./pages/Problem";
import Duel from "./components/Duel";
import CodeBits from "./components/CodeBits";
import CodeBit from "./pages/CodeBit";
import { updateAllPost } from "./utils/firestore";
import Loading from "./components/Loading";

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
          <Route path="playground" element={<PlayGround />} >
            <Route index element={<CodeBits />}/>
            <Route path=":filterBy" element={<CodeBits />}/>
          </Route>
        </Route>

        <Route path=":username/post/:postId" element={<PostPage />} />
        <Route path=":username/post/:postId/activity" element={<PostActivity />} />
        <Route path=":username" element={<Profile />}>
          <Route index element={<Timeline />} />
          <Route path="saved" element={<Saved />} />
          <Route path="reposts" element={<Reposts />} />
        </Route>
        <Route path=":username" element={<Metrics />}>
          <Route path="following" element={<Following />} />
          <Route path="followers" element={<Followers />} />
        </Route>

        <Route path="/courses/:collectionSlug/:courseSlug" element={<Course />}>
          <Route index element={<Lessons />} />
          <Route path=":lessonSlug" element={<Lessons />}/>
        </Route>

        <Route path="exercises/:exerciseSlug" element={<ExerciseRenderer />} />
        <Route path="exercises/code-breaker/:problemSlug" element={<Problem />} />
        <Route path="exercises/css-duel/:duelSlug" element={<Duel />}/>

        <Route path="codebit/:codebitId" element={<CodeBit />}/>

        <Route path="loading" element={<Loading />} />
        
        <Route path="*" element={'404 not found'} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
