export default function UserInfo({ user }) {
  return (
    <section>
      <h3>Your Current Info</h3>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: *********</p>
    </section>
  );
}
