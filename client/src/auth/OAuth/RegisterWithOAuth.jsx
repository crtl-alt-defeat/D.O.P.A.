//components
import RegisterWithGithub from "./github/RegisterWithGithub";
import RegisterWithGoogle from "./google/RegisterWithGoogle";
import RegisterWithLinkedIn from "./linkedIn/RegisterWithLinkedIn";

function RegisterWithOAuth() {
  return (
    <>
      <RegisterWithGithub />
      <RegisterWithGoogle />
      <RegisterWithLinkedIn />
    </>
  );
}
export default RegisterWithOAuth;
