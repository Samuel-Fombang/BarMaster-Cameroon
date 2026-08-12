import {
  Suspense,
  lazy,
} from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import MainLayout from "./components/layout/MainLayout";

import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import VerifyResetCode from "./pages/VerifyResetCode";

const Dashboard = lazy(
  () => import("./pages/Dashboard")
);

const Drinks = lazy(
  () => import("./pages/Drinks")
);

const Categories = lazy(
  () => import("./pages/Categories")
);

const Brands = lazy(
  () => import("./pages/Brands")
);

const BottleSizes = lazy(
  () => import("./pages/BottleSizes")
);

const Suppliers = lazy(
  () => import("./pages/Suppliers")
);

const Locations = lazy(
  () => import("./pages/Locations")
);

const Inventory = lazy(
  () => import("./pages/Inventory")
);

const Transfers = lazy(
  () => import("./pages/Transfers")
);

const Purchases = lazy(
  () => import("./pages/Purchases")
);

const Sales = lazy(
  () => import("./pages/Sales")
);

const Expenses = lazy(
  () => import("./pages/Expenses")
);

const Workers = lazy(
  () => import("./pages/Workers")
);

const Reports = lazy(
  () => import("./pages/Reports")
);

const Settings = lazy(
  () => import("./pages/Settings")
);

function Loader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      Loading...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/verify-reset-code"
            element={<VerifyResetCode />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                element={
                  <RoleRoute
                    allowedRoles={[
                      "Admin",
                      "Manager",
                      "Storekeeper",
                    ]}
                  />
                }
              >
                <Route
                  path="/drinks"
                  element={<Drinks />}
                />

                <Route
                  path="/categories"
                  element={<Categories />}
                />

                <Route
                  path="/brands"
                  element={<Brands />}
                />

                <Route
                  path="/bottle-sizes"
                  element={<BottleSizes />}
                />

                <Route
                  path="/suppliers"
                  element={<Suppliers />}
                />

                <Route
                  path="/locations"
                  element={<Locations />}
                />

                <Route
                  path="/inventory"
                  element={<Inventory />}
                />

                <Route
                  path="/transfers"
                  element={<Transfers />}
                />

                <Route
                  path="/purchases"
                  element={<Purchases />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute
                    allowedRoles={[
                      "Admin",
                      "Manager",
                      "Bartender",
                      "Storekeeper",
                    ]}
                  />
                }
              >
                <Route
                  path="/sales"
                  element={<Sales />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute
                    allowedRoles={[
                      "Admin",
                      "Manager",
                    ]}
                  />
                }
              >
                <Route
                  path="/expenses"
                  element={<Expenses />}
                />

                <Route
                  path="/reports"
                  element={<Reports />}
                />
              </Route>

              <Route
                element={
                  <RoleRoute
                    allowedRoles={["Admin"]}
                  />
                }
              >
                <Route
                  path="/workers"
                  element={<Workers />}
                />

                <Route
                  path="/settings"
                  element={<Settings />}
                />
              </Route>
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;