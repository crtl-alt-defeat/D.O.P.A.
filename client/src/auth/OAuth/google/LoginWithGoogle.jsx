import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";

function LoginWithGoogle() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState(null);

  async function handleLogin({ credential }) {
    setError(null);

    try {
      await loginWithGoogle(credential);
      navigate("/home");
    } catch (e) {
      setError(e.message);
      console.error("error:", e.message);
    }
  }

  return (
    <div className="googleLogin">
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export default LoginWithGoogle;
