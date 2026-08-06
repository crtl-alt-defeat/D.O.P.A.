function HomePage() {
  return (
    <div>
      <h2>Your Stuff</h2>

      <section>
        <h3>Your 3 Goals</h3>
        <ul>
          <li>Goal</li>
          <li>Some Goal</li>
          <li>Some other Goal</li>
        </ul>
      </section>

      <section>
        <h3>Add a New Goal</h3>
        <input type="text" placeholder="Type a new goal..." />
        <button type="button">Add</button>
      </section>

      <footer>
        <p>Streak!</p>
      </footer>
    </div>
  );
}
export default HomePage;
