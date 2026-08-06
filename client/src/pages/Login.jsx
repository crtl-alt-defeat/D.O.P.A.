function LoginPage() {
  /*   const navigate = useNavigate(); */

  function handleLogin(event) {
    event.preventDefault();
    navigate("/home");
  }

  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <p>
          <label>
            Email: <input type="email" placeholder="Your Email" required />
          </label>
        </p>
        <p>
          <label>
            Password:{" "}
            <input type="password" placeholder="Your Password" required />
          </label>
        </p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default LoginPage;
