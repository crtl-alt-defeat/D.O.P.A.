import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";

function RegisterWithGoogle({ setAccountMade }) {
  const navigate = useNavigate();
  const { registerWithGoogle } = useAuth();
  const [error, setError] = useState(null);

  async function handleRegister({ credential }) {
    setError(null);

    try {
      await registerWithGoogle(credential);
      setAccountMade(true);
    } catch (e) {
      setError(e.message);
      console.error(e);
    }
  }

  return (
    <>
      <GoogleLogin
        onSuccess={handleRegister}
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap
      />
      {error && <p role="alert">{error}</p>}
    </>
  );
}
export default RegisterWithGoogle;
