import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import './App.css';
import Header from "./components/header/header";
import Leftbar from "./components/leftbar/leftbar";
import Rightbar from "./components/rightbar/rightbar";
import Search from "./pages/search/search";
import Chat from "./pages/chat/chat";
import { UserContextProvider } from "./context/userContext";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./ChangePassword/ChangePassword";
import Error from "./pages/error/error";
import Error404 from "./pages/error/404";

function App() {
  const { currentUser } = useContext(AuthContext);
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
        <div className="App">
          <header className="header">
            <Header />
          </header>
          <div className="leftbar p-3">
              <Leftbar />
            </div>
          <div className="content">
            
            <div className="main-content">
              <Outlet />
            </div>
            <div className="rightbar">
              <div className="p-3"><Rightbar /></div>
            </div>
          </div>
          </div>
        </UserContextProvider>
      </QueryClientProvider>
    );
  };

  const ChatLayout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
        <div className="App">
          <header className="header">
            <Header />
          </header>
          <div className="container-fluid">
             <Outlet />
          </div>
         
          </div>
          </UserContextProvider>
      </QueryClientProvider>
    );
  };
  const ProtectedRouteUser = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  const ProtectedRouteVerified = ({ children }) => {
    const isVerified = sessionStorage.getItem('isVerified') === 'true';

    if (!isVerified) {
      return <Navigate to={"/error/401"} />;
    }
  return children;
};

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRouteUser>
          <Layout />
        </ProtectedRouteUser>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/search/:key",
          element: <Search />,
        },
      ],
    },
    {
      path: "/chat",
      element: (
        <ProtectedRouteUser>
          <ChatLayout />
        </ProtectedRouteUser>
      ),
      children: [
        {
          path: "/chat/:id",
          element: <Chat />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/confirm_email/:type",
      element: <VerifyEmail />,
    },
    {
      path: "/change_password",
      element:
        <ProtectedRouteVerified>
              <ChangePassword />
          </ProtectedRouteVerified>,
    },
     {
      path: "/reset_password",
      element: <ResetPassword />,
    },
     {
      path: "/error/:error",
      element: <Error />,
    },
    {
    path: "*",
    element: <Error404 />, // Trang 404
  },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
  
}

export default App;
