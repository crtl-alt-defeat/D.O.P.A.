import { GoogleLogin } from "@react-oauth/google";

function GoogleLogin() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      useOneTap
    />
  );
}
export default GoogleLogin;
