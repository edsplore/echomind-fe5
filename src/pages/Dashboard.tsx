import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './dashboard/AdminDashboard';
import UserDashboard from './dashboard/UserDashboard';

const Dashboard = () => {
  const { getEffectiveUser, getEffectiveUserData, loading } = useAuth();
  const user = getEffectiveUser();
  const userData = getEffectiveUserData();

  return isAdmin() ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;