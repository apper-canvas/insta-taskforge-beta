import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const activeRoute = routeArray.find(route => route.path === location.pathname);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-surface-200">
        {/* Logo */}
<div className="flex items-center px-6 py-5 border-b border-surface-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">Visionware</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
              {route.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
<div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900">Visionware</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6 text-surface-700" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 shadow-xl"
            >
<div className="p-6 border-b border-surface-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-surface-900">Visionware</span>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {routeArray.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                    {route.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Header */}
        <header className="flex-shrink-0 bg-white border-b border-surface-200 px-6 py-4">
<div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">
                {activeRoute?.label || 'Visionware'}
              </h1>
              <p className="text-sm text-surface-600 mt-1">
                Manage your projects efficiently
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors">
                <ApperIcon name="Bell" className="w-5 h-5" />
              </button>
              <button className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors">
                <ApperIcon name="Settings" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 max-w-full">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;