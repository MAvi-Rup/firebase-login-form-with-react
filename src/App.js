
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import app from './firbase.init';
import { Button, Form } from 'react-bootstrap';
import {useState} from 'react'


const auth = getAuth(app)
function App() {
  const facebookProvider = new FacebookAuthProvider();
  const [validated, setValidated] = useState(false);
  const [registered,setRegister]=useState(false)
  const [error,setError]=useState('')
  const [success,setSuccess]=useState('')
  const [email,setEmail]=useState('')
  const [name,Setname]=useState('')
  const [pass,setPass]= useState('')
  const handleSubmit = e=>{
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      // e.preventDefault();
      e.stopPropagation();
      return;
    }
    if(!/(?=.*[!@#$%^&*])/.test(pass)){
      setError('Password Should contain atlease one special charecter.')
      return;
    }
    setError('')
    setSuccess('')
    setValidated(true);
    if(registered){
      signInWithEmailAndPassword(auth,email,pass)
      .then(result =>{
        const user = result.user;
        console.log(user)
        setSuccess('Successfully Login')
      })
      .catch(error =>{
        console.error(error)
        setError(error.message)
      })

    }else{
      createUserWithEmailAndPassword(auth, email,pass)
    .then(result =>{
      const user = result.user;
      console.log(user)
      setEmail('');
      setPass('');
      Setname('')
      setSuccess('Successfully Create Your Account')
      verifyEmail();
      setUSerName();
      
    })
    .catch(error =>{
      console.error(error)
      setError(error.message)
    })
    }
    e.preventDefault()
  }
  const verifyEmail =()=>{
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log("verification Send")
    })
  }
  const handleRegisterChange = e =>{
    setRegister(e.target.checked)
  }
  const handleNameBlur = e =>{
    Setname(e.target.value)
  }
  const setUSerName =()=>{
    updateProfile(auth.currentUser,{
      displayName:name
    })
    .then(()=>{
      console.log("Profile Updated")

    })
    .catch(error=>{
      setError(error.message)
    })
  }
  const handleEmailBlur = e=>{
    setEmail(e.target.value)
  }
  const handlePassBlur = e=>{
    setPass(e.target.value)
  }
  const handleFbLogin = ()=>{
    signInWithPopup(auth,facebookProvider)
    .then(result=>{
      const user = result.user
      console.log(user)
    })
    .catch(error=>{
      setError(error.message)
    })
  }
  const handlePassReset = ()=>{
    sendPasswordResetEmail(auth, email)
  .then(() => {

  })
  .catch((error) => {
    setError(error.message)
  });

  }
  return (
    <div className="container w-50 mt-5">
      <h2 className='text-info'>Please {registered ? 'Login':'Register'}</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Your Name</Form.Label>
          <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter your name" required />
          <Form.Control.Feedback type="invalid">
            Please Enter Your Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePassBlur}  type="password" placeholder="Password" required />
        </Form.Group>
        <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={handleRegisterChange} type="checkbox" label="Already Registerd?" />
        </Form.Group>
        {
          error===''? <p className='text-success'>{success}</p>:<p className='text-danger'>{error}</p>
        }
        
        
        <Button  variant="primary" type="submit">
          {registered? 'Login':'Register'}
        </Button>
        <Button  variant="danger" type="submit" onClick={handlePassReset}>
          Reset Password
        </Button>
        <Button variant='info' type='submit' onClick={handleFbLogin}>Facebook SignIn</Button>
      </Form>

    </div>
  );
}

export default App;
