import "./App.css";

import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { UserContextProvider } from "./context/UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

function App() {
  return (
<UserContextProvider>
<Routes>
      <Route path="/" element={<Layout />}>
       
      <Route index element={<IndexPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path='/create' element={<CreatePost/>}/>
         <Route path="/post/:id" element={<PostPage/>} />
         <Route path="/edit/:id" element={<EditPost/>}/>
      </Route>
    </Routes>
</UserContextProvider>
  );
}

export default App;
