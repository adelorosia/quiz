import {  Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500">
      <div className="container px-5">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
