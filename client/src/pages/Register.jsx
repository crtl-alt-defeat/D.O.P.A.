function RegisterPage() {
  const navigate = useNavigate();

  function handleRegister(event) {
    event.preventDefault();
    navigate("/intake");
  }

  return (
    <div>
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <p>
          <label>
            Name: <input type="text" placeholder="Your Name" required />
          </label>
        </p>
        <p>
          <label>
            Email: <input type="email" placeholder="Your Email" required />
          </label>
        </p>
        <p>
          <label>
            Password:{" "}
            <input type="password" placeholder="Choose Password" required />
          </label>
        </p>
        <button type="submit">Submit & Continue</button>
      </form>
    </div>
  );
}
export default RegisterPage;
