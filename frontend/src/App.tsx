import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Drinks from "./pages/Drinks";

function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>This module will be built soon.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drinks" element={<Drinks />} />
          <Route path="/stock" element={<ComingSoon title="Stock" />} />
          <Route path="/sales" element={<ComingSoon title="Sales" />} />
          <Route path="/purchases" element={<ComingSoon title="Purchases" />} />
          <Route path="/expenses" element={<ComingSoon title="Expenses" />} />
          <Route path="/workers" element={<ComingSoon title="Workers" />} />
          <Route path="/reports" element={<ComingSoon title="Reports" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;