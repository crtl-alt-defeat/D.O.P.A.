//components
import GithubLogin from "./github/GithubLogin";
import GoogleLogin from "./google/GoogleLogin";
import LinkedInLogin from "./linkedIn/LinkedInLogin";

function OAuthLogin() {
  return (
    <>
      <GithubLogin />
      <GoogleLogin />
      <LinkedInLogin />
    </>
  );
}
export default OAuthLogin;
