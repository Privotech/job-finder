import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { JobDetail } from './pages/JobDetail';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Resumes } from './pages/Resumes';
import { Recommendations } from './pages/Recommendations';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { EmployerJobs } from './pages/EmployerJobs';
import { JobForm } from './pages/JobForm';
import { ApplicantView } from './pages/ApplicantView';
import { EmployerCompany } from './pages/EmployerCompany';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminJobs } from './pages/AdminJobs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/dashboard" element={<PrivateRoute allowedRoles={['job_seeker']}><Dashboard /></PrivateRoute>} />
      <Route path="/dashboard/profile" element={<PrivateRoute allowedRoles={['job_seeker']}><Profile /></PrivateRoute>} />
      <Route path="/dashboard/resumes" element={<PrivateRoute allowedRoles={['job_seeker']}><Resumes /></PrivateRoute>} />
      <Route path="/recommendations" element={<PrivateRoute allowedRoles={['job_seeker']}><Recommendations /></PrivateRoute>} />
      <Route path="/employer" element={<PrivateRoute allowedRoles={['employer']}><EmployerDashboard /></PrivateRoute>} />
      <Route path="/employer/jobs" element={<PrivateRoute allowedRoles={['employer']}><EmployerJobs /></PrivateRoute>} />
      <Route path="/employer/jobs/new" element={<PrivateRoute allowedRoles={['employer']}><JobForm /></PrivateRoute>} />
      <Route path="/employer/jobs/:id/edit" element={<PrivateRoute allowedRoles={['employer']}><JobForm /></PrivateRoute>} />
      <Route path="/employer/jobs/:id" element={<PrivateRoute allowedRoles={['employer']}><ApplicantView /></PrivateRoute>} />
      <Route path="/employer/company" element={<PrivateRoute allowedRoles={['employer']}><EmployerCompany /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><AdminUsers /></PrivateRoute>} />
      <Route path="/admin/jobs" element={<PrivateRoute allowedRoles={['admin']}><AdminJobs /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
