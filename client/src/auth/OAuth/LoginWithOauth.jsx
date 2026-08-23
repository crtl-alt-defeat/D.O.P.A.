//components
import LoginWithGithub from "./github/LoginWithGithub";
import LoginWithGoogle from "./google/LoginWithGoogle";
import LoginWithLinkedIn from "./linkedIn/LoginWithLinkedIn";

function LoginWithOauth() {
  return (
    <>
      <LoginWithGithub />
      <LoginWithGoogle />
      <LoginWithLinkedIn />
    </>
  );
}
export default LoginWithOauth;
