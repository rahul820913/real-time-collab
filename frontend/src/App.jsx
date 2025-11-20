import { BrowserRouter as Router, Routes, Route , useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/check/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import InviteCollaborators from "./components/InviteCollaborators";
import ProfilePage from "./pages/ProfilePage";
import AllProjects from "./pages/allProjects";
import EditorPage from "./pages/EditorPage";
import LoadingSpinner from "./components/check/LoadingSpinner";
import { FileContextProvider } from "./context/FileContext";
import SearchPage from "./pages/SearchPage";
import { CodeProvider } from "./context/CodeContext";


function ProjectSocketWrapper({ children }) {
  const { projectId } = useParams();   // <-- Now correctly extracted

  return (
    <CodeProvider projectId={projectId}>
      <FileContextProvider projectId={projectId}>
        {children}
      </FileContextProvider>
    </CodeProvider>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/search" element={<SearchPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateProject />
            </PrivateRoute>
          }
        />

        {/* 👇 SocketProvider wraps only project routes */}
        <Route
          path="/project/:projectId"
          element={
            <PrivateRoute>
              <ProjectSocketWrapper>
                <ProjectDetails />
              </ProjectSocketWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId/invite"
          element={
            <PrivateRoute>
              <ProjectSocketWrapper>
                <InviteCollaborators />
              </ProjectSocketWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId/editor"
          element={
            <PrivateRoute>
              <ProjectSocketWrapper>
                <EditorPage />
              </ProjectSocketWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/allprojects"
          element={
            <PrivateRoute>
              <AllProjects />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
