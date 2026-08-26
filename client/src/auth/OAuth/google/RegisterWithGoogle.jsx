import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../AuthContext";
import { useState } from "react";

function RegisterWithGoogle({ setAccountMade }) {
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
    <div className="googleRegister">
      <GoogleLogin
        onSuccess={handleRegister}
        onError={() => {
          console.log("Register Failed");
        }}
        useOneTap
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export default RegisterWithGoogle;
