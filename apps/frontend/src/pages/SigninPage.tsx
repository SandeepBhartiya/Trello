import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {ToastContainer, toast} from "react-toastify";
import { signin } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import{validators,runValidation,type FieldErrors} from "../utils/validation";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";

type SigninField = "email" | "password";

export  default function SigninPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors,setFieldErrors]=useState<FieldErrors<SigninField>>({});
    const [formError, setFormError] = useState("");
    const [loading,setLoading]=useState(false);
    
    const {login}=useAuth();
    const navigate=useNavigate();

    const handelSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setFormError("");
        
        const errors=runValidation<SigninField>({
            email:()=>validators.email(email),
            password:()=>validators.password(password)
        });
        setFieldErrors(errors);
        if(Object.keys(errors).length>0)return;
        setLoading(true);
        try{
            const {user,token}=await signin(email,password);
            toast.success("Signed in successfully");
            login(user,token);
            navigate("/organizations");
        }catch(err:any){
            toast.error(err.message || "SignIn Failed");
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="auth-page">
            <div className="auth-card">
                <ToastContainer position="top-right" autoClose={4000} />
                <h1>Sign in</h1>

                {formError && <div className="form-error">{formError}</div>}
                <form onSubmit={handelSubmit} noValidate>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            className={fieldErrors.email ? "input-error" : ""}
                            required
                        />
                        {fieldErrors?.email && <div className="field-error">{fieldErrors.email}</div>}
                    </div>
                    <div className="field-group">    
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            className={fieldErrors?.password ? "input-error" : ""}
                            required
                        />
                        {fieldErrors?.password && <div className="field-error">{fieldErrors.password}</div>}
                    </div>
                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
             <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
    )
}