
import {Routes,Route} from 'react-router-dom'
import Home from '../pages/student/Home'

const routes=()=>{

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
    </Routes>
  )
}

export default routes;