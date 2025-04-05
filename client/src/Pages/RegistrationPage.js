import {useState} from "react";
import '../App.css';
import { Navigate } from "react-router-dom";
export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message,setMessage]=useState('');
  const [redirect, setRedirect] = useState(false);
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch('https://blog-app-25of.onrender.com/register', {
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
    });
    if (response.status === 200) {
        setMessage("Registration Successful");
      alert('registration successful');
      setRedirect(true);
    }else if(response.status===400){
      setMessage("User already Exists");
      alert('User already Exists');
    } 
    else {
        setMessage("Registration Failed");
      alert('registration failed');
    }
  }

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <label className="username">UserName:</label>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
             <br></br>
    <label className="password">Password:</label>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
             <br>
             </br>
      <button type="submit">Register</button>
    </form>
    <p className="RegistrationMessage">{message}</p>
    </div>
  );
}