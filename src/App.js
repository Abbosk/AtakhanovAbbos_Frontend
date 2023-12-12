import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import Todo from './components/Todo/Index'
import PostEdit from './components/Todo/PostEdit'
import SignIn from './components/SignIn'
import {useEffect} from "react";

function App() {
    const navigate=useNavigate()
    useEffect(() => {
        const getToken=localStorage.getItem('seToken')
        if (!getToken){
            navigate('/signin')
        }else{
            navigate('/')
        }
    }, []);
  return (
      <Routes>
          <Route path={'/'} element={<Todo/>}/>
          <Route path={'/add'} element={<PostEdit/>}/>
          <Route path={'/signin'} element={<SignIn/>}/>
      </Routes>
  );
}

export default App;
