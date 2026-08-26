import "../oauth.css";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../AuthContext";
import { useState } from "react";

function LinkToGoogle({ user, syncUser }) {
  const { linkToGoogle, unlinkFromGoogle } = useAuth();
  const [error, setError] = useState(null);

  //handlers
  async function handleLink({ credential }) {
    setError(null);

    try {
      await linkToGoogle(credential);
      syncUser();
    } catch (e) {
      console.error(e);
      setError(e);
    }
  }

  async function handleUnlink({ credential }) {
    setError(null);

    try {
      await unlinkFromGoogle(credential);
      syncUser();
    } catch (e) {
      console.error(e);
      setError(e);
    }
  }

  return !user.google_sub ? (
    <div className="LinkBox">
      <h4>Link Google:</h4>
      <GoogleLogin
        onSuccess={handleLink}
        onError={() => {
          console.log("Link Failed");
        }}
        text="continue_with"
      />
      {error && <p role="alert">{error}</p>}
    </div>
  ) : (
    <div className="LinkBox">
      <h4>Unlink Google:</h4>
      <GoogleLogin
        onSuccess={handleUnlink}
        onError={() => {
          console.log("Unlink Failed");
        }}
        text="continue_with"
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export default LinkToGoogle;
