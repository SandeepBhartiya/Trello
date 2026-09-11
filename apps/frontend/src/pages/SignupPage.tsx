import {useState} from "react";
import {useNavigate,Link} from "react-router";
import {ToastContainer, toast} from "react-toastify";
import { signup } from "../api/auth";
import {useAuth} from "../context/AuthContext";
import{validators,runValidation,type FieldErrors} from "../utils/validation";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";

type SignupField="email" | "username" | "password";
export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors,setFieldErrors]=useState<FieldErrors<SignupField>>({});
    const [formError, setFormError] = useState("");
    const [loading,setLoading]=useState(false);

    const {login}=useAuth();
    const navigate=useNavigate();

    const handelSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setFormError("");

        const errors=runValidation<SignupField>({
            email:()=>validators.email(email),
            username:()=>validators.username(username),
            password:()=>validators.password(password)
        });
        setFieldErrors(errors);
        if(Object.keys(errors).length>0)return;
        setLoading(true);
        try{
            const {user,token}=await signup(email,username,password);
            toast.success("Signed up successfully");
            login(user,token);
            navigate("/");
        }catch(err:any){
            toast.error(err.message || "SignUp Failed");
        }finally{
            setLoading(false);
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-card">
                <ToastContainer position="top-right" autoClose={4000} />
                <h1>Sign up</h1>
                {formError && <div className="form-error">{formError}</div>}
                <form onSubmit={handelSubmit} noValidate>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={fieldErrors.email ? "input-error" : ""}
                            required
                        />  
                        {fieldErrors?.email && <div className="field-error">{fieldErrors.email}</div>}
                    </div>
                    <div className="field-group">
                        <label htmlFor="password">Username</label>
                        <input  
                            id="username"
                            type="text" 
                            placeholder="Username"
                            value={username}                    
                            onChange={(e) => setUsername(e.target.value)}
                            className={fieldErrors.username ? "input-error" : ""}
                            required
                        />
                        {fieldErrors?.username && <div className="field-error">{fieldErrors.username}</div>}
                    </div>
                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input  
                            id="password"
                            type="password" 
                            placeholder="Password"
                            value={password}                    
                            onChange={(e) => setPassword(e.target.value)}
                            className={fieldErrors?.password ? "input-error" : ""}
                            required
                        />
                        {fieldErrors?.password && <div className="field-error">{fieldErrors.password}</div>}
                    </div>
                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>
                <p>Already have an account? <Link to="/signin">Login</Link></p>
            </div>
        </div>
    )
}
