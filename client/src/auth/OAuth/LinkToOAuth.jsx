//components
import LinkToGithub from "./github/LinkToGithub";
import LinkToGoogle from "./google/LinkToGoogle";
import LinkToLinkedIn from "./linkedIn/LinkToLinkedIn";

function LinkToOAuth() {
  return (
    <>
      <LinkToGithub />
      <LinkToGoogle />
      <LinkToLinkedIn />
    </>
  );
}
export default LinkToOAuth;
