import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import ProjectTickets from './pages/ProjectTickets';
import TicketDetails from './pages/TicketDetails';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/projects" 
          element={
            <ProtectedRoute>
              <Layout>
                <Projects />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/members" 
          element={
            <ProtectedRoute>
              <Layout>
                <Members />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/projects/:projectId/tickets" 
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectTickets />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tickets/:ticketId" 
          element={
            <ProtectedRoute>
              <Layout>
                <TicketDetails />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;