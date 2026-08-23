//components
import GithubRegister from "./github/GithubRegister";
import GoogleRegister from "./google/GoogleRegister";
import LinkedInRegister from "./linkedIn/LinkedInRegister";

function OAuthRegister() {
  return (
    <>
      <GithubRegister />
      <GoogleRegister />
      <LinkedInRegister />
    </>
  );
}
export default OAuthRegister;
