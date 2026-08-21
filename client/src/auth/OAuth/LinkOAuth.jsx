//components
import LinkGithub from "./github/LinkGithub";
import LinkGoogle from "./google/LinkGoogle";
import LinkLinkedIn from "./linkedIn/LinkLinkedIn";

function LinkOAuth() {
  return (
    <>
      <LinkGithub />
      <LinkGoogle />
      <LinkLinkedIn />
    </>
  );
}
export default LinkOAuth;
