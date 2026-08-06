function SettingsPage() {
  return (
    <div>
      <h2>Account Settings</h2>

      <section>
        <h3>Your Current Info</h3>
        <p>Name: </p>
        <p>Email: </p>
        <p>Password: *********</p>
      </section>

      <section>
        <h3>Update Your Profile</h3>
        <p>
          <label>
            Change Name: <input type="text" placeholder="New Name" />
          </label>
        </p>
        <p>
          <label>
            Change Email: <input type="email" placeholder="New Email" />
          </label>
        </p>
        <p>
          <label>
            Change Password:{" "}
            <input type="password" placeholder="New Password" />
          </label>
        </p>
        <button type="button">Save Changes</button>
      </section>
    </div>
  );
}
export default SettingsPage;
