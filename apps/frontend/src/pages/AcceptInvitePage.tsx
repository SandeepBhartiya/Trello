import { useState,useEffect } from "react";
import { useSearchParams,useNavigate,Link } from "react-router";
import { acceptInvite } from "../api/membership";
import { useAuth } from "../context/AuthContext";

export default function AcceptInvitePage(){
    const [searchParams]=useSearchParams();
    const orgId=Number(searchParams.get("orgId"));
    const navigate=useNavigate();
    const {user,loading:authLoading,logout}=useAuth();
    const [status,setStatus]=useState<"idle" | "accepting" | "error" | "success">("idle");
    const [error, setError] = useState("");

    useEffect(()=>{
        if(authLoading)return;
        if(!user)return;    
        handleAccept();
    },[authLoading,user]);

    const handleAccept=async()=>{
        setStatus("accepting");
        setError("");
        try{
            await acceptInvite(orgId);
            setStatus("success");
            setTimeout(()=>navigate(`/organizations/${orgId}/boards`),1200);
            
        }catch(err:any){
            setError(err.message || "Failed to accept invite");
            setStatus("error");
        }
    }

    const handleSwitchAccount = () => {
        logout();
        navigate(`/signin?redirect=/accept-invite?orgId=${orgId}`);
    };

    if(authLoading)return null;
    if(!user){
        return(
            <div className="auth-page">
                <div className="auth-card">
                    <h1>Sign in to accept this invite</h1>
                    <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 20 }}>
                        You need an account to join this organization.
                    </p>
                    <Link
                        to={`/signin?redirect=/accept-invite?orgId=${orgId}`}
                        className="auth-submit"
                        style={{ display: "block", textAlign: "center", textDecoration: "none" }}
                    >
                        Sign in
                    </Link>
                    <p className="auth-switch">
                        No account? <Link to={`/signup?redirect=/accept-invite?orgId=${orgId}`}>Sign up</Link>
                    </p>
                </div>
            </div>
        )
    }

    return(
        <div className="auth-page">
            <div className="auth-card" style={{textAlign:"center"}}>
                {status === "accepting" && <h1>Joining organization...</h1>}
                {status === "success" && <h1>You're in! Redirecting...</h1>}
                {status === "error" && (
                    <>
                        <h1>Couldn't accept invite</h1>
                        <p style={{ color: "var(--color-error)", fontSize: 14 }}>{error}</p>
                        <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginTop: 12 }}>
                        Make sure you're signed in with the email address this invite was sent to.
                        </p>
                        <button className="auth-submit" style={{ marginTop: 16 }} onClick={() => { handleSwitchAccount(); }}>
                        Sign in with a different account
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}