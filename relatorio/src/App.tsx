import { Agentation } from "agentation";
import { Dashboard } from "./components/Dashboard";

function App() {
  return (
    <>
      <Dashboard />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}

export default App;
