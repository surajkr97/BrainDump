import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Home, Navbar, Notes, ViewNote } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navbar />
        <Home />
      </div>
    ),
  },
  {
    path: "/notes",
    element: (
      <div>
        <Navbar />
        <Notes />
      </div>
    ),
  },
  {
    path: "/notes/:id",
    element: (
      <div>
        <Navbar />
        <ViewNote />
      </div>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
