import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, UserCheck, UserX, Crown, User, Plus, Eye, EyeOff, RefreshCw, X } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  createdByAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showCredentials, setShowCredentials] = useState<{[key: string]: boolean}>({});
  const [tempPasswords, setTempPasswords] = useState<{[key: string]: string}>({});
  const [addUserForm, setAddUserForm] = useState({
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [addingUser, setAddingUser] = useState(false);
  const [resettingPassword, setResettingPassword] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      console.log('Total users found:', snapshot.docs.length);

      const usersData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('User data:', doc.id, data);

        return {
          id: doc.id,
          email: data.email || 'No email',
          role: data.role || 'user',
          status: data.status || 'disabled',
          createdByAdmin: data.createdByAdmin || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }) as User[];

      console.log('Processed users:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (!user) return;

    setUpdating(userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date(),
      });

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole, updatedAt: new Date() } : u
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role: ' + error);
    } finally {
      setUpdating(null);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setAddingUser(true);
    try {
      // Create a secondary Firebase app instance to avoid signing out the current admin
      const secondaryApp = initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      }, 'Secondary');

      const secondaryAuth = getAuth(secondaryApp);

      // Create user in Firebase Auth using secondary instance
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        addUserForm.email, 
        addUserForm.password
      );
      const newUser = userCredential.user;

      // Create user document in Firestore
      const userData = {
        email: newUser.email!,
        role: addUserForm.role,
        status: 'active' as const,
        createdByAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', newUser.uid), userData);

      // Sign out the new user from secondary auth to prevent them from being logged in
      await signOut(secondaryAuth);

      // Delete the secondary app
      await secondaryApp.delete();

      // Store temporary password for display
      setTempPasswords(prev => ({
        ...prev,
        [newUser.uid]: addUserForm.password
      }));

      // Add to local state
      setUsers(prev => [...prev, {
        id: newUser.uid,
        ...userData
      }]);

      // Reset form and close modal
      setAddUserForm({ email: '', password: '', role: 'user' });
      setShowAddUserModal(false);

      alert('User created successfully! The user account is active and ready to use.');
    } catch (error: any) {
      console.error('Error creating user:', error);
      let errorMessage = 'Failed to create user';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      alert(errorMessage);
    } finally {
      setAddingUser(false);
    }
  };

  const handleResetPassword = async (userEmail: string, userId: string) => {
    if (!user) return;

    setResettingPassword(userId);
    try {
      await sendPasswordResetEmail(auth, userEmail);
      alert(`Password reset email sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Error sending password reset email');
    } finally {
      setResettingPassword(null);
    }
  };

  const toggleCredentialsVisibility = (userId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const filteredUsers = users.filter(user => {
    const email = user?.email || '';
    return email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user roles and permissions ({users.length} total users)
          </p>
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search and Stats */}
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-100 rounded-lg leading-5 bg-white dark:bg-dark-100 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Search users..."
            />
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-gray-500 dark:text-gray-400">
                {users.filter(u => u.role === 'admin').length} Admins
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-gray-500 dark:text-gray-400">
                {users.filter(u => u.role === 'user').length} Users
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-dark-100">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    user.role === 'admin' 
                      ? 'bg-amber-100 dark:bg-amber-900/20' 
                      : 'bg-blue-100 dark:bg-blue-900/20'
                  }`}>
                    {user.role === 'admin' ? (
                      <Crown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Joined {user.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Credentials Section */}
                  {tempPasswords[user.id] && (
                    <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        Password: {showCredentials[user.id] ? tempPasswords[user.id] : '••••••••'}
                      </span>
                      <button
                        onClick={() => toggleCredentialsVisibility(user.id)}
                        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                      >
                        {showCredentials[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {/* Reset Password Button */}
                  <button
                    onClick={() => handleResetPassword(user.email, user.id)}
                    disabled={resettingPassword === user.id}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-100 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-100 hover:bg-gray-50 dark:hover:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${resettingPassword === user.id ? 'animate-spin' : ''}`} />
                    {resettingPassword === user.id ? 'Sending...' : 'Reset Password'}
                  </button>

                  {/* Role Management */}
                  {user.role === 'user' ? (
                    <button
                      onClick={() => updateUserRole(user.id, 'admin')}
                      disabled={updating === user.id}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      {updating === user.id ? 'Updating...' : 'Make Admin'}
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUserRole(user.id, 'user')}
                      disabled={updating === user.id}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-100 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-100 hover:bg-gray-50 dark:hover:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      {updating === user.id ? 'Updating...' : 'Remove Admin'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search term.' : 'No users have been registered yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-200 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Add New User
                  </h3>
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={addUserForm.email}
                      onChange={(e) => setAddUserForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-lg bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        required
                        value={addUserForm.password}
                        onChange={(e) => setAddUserForm(prev => ({ ...prev, password: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-lg bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setAddUserForm(prev => ({ ...prev, password: generateRandomPassword() }))}
                        className="px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-lg bg-white dark:bg-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      value={addUserForm.role}
                      onChange={(e) => setAddUserForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-100 rounded-lg bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-100 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-100 hover:bg-gray-50 dark:hover:bg-dark-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingUser}
                      className="flex-1 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingUser ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;