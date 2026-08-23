import OAuthLogin from "./LoginWithOauth";
import OAuthRegister from "./RegisterWithOAuth";

function TestOAuth() {
  return (
    <>
      <div>
        <h2>login</h2>
        <OAuthLogin />
      </div>
      <div>
        <h2>register</h2>
        <OAuthRegister />
      </div>
    </>
  );
}
export default TestOAuth;
