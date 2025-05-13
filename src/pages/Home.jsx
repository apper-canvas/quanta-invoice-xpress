import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Icons
const FileInvoiceIcon = getIcon('FileText');
const BarChartIcon = getIcon('BarChart');
const UsersIcon = getIcon('Users');
const SettingsIcon = getIcon('Settings');
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');
const PlusIcon = getIcon('Plus');

const Home = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');
  
  // Temporary stats for dashboard demonstration
  const stats = [
    { id: 1, name: 'Invoices Created', value: '142', change: '+12%', icon: FileInvoiceIcon },
    { id: 2, name: 'Total Revenue', value: '$12,430', change: '+8%', icon: BarChartIcon },
    { id: 3, name: 'Active Clients', value: '36', change: '+4', icon: UsersIcon },
    { id: 4, name: 'Pending Payments', value: '$4,182', change: '-$820', isNegative: true, icon: SettingsIcon },
  ];

  const handleCreateInvoice = () => {
    toast.success("New invoice created successfully!");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Navigation Toggle */}
      <button 
        onClick={() => setNavOpen(!navOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-surface-800 shadow-lg"
      >
        {navOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Sidebar Navigation */}
      <motion.aside 
        className={`fixed md:relative z-40 inset-y-0 left-0 w-72 bg-white dark:bg-surface-800 shadow-lg md:shadow-none transform transition-transform duration-300 md:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
        initial={{ x: '-100%' }}
        animate={{ x: navOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className="fixed md:relative inset-y-0 left-0 w-64 md:w-72 bg-white dark:bg-surface-800 shadow-lg md:shadow-none transform transition-transform duration-300 ease-in-out md:translate-x-0 z-50"
        style={{ transform: navOpen ? 'translateX(0)' : 'translateX(-100%)', '@media (min-width: 768px)': { transform: 'translateX(0)' } }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center p-6 border-b border-surface-200 dark:border-surface-700">
            <FileInvoiceIcon className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">InvoiceXpress</h1>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('invoices')} 
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'invoices' ? 'bg-primary bg-opacity-10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  <FileInvoiceIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Invoices</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('clients')} 
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'clients' ? 'bg-primary bg-opacity-10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  <UsersIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Clients</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('analytics')} 
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-primary bg-opacity-10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  <BarChartIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Analytics</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-primary bg-opacity-10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  <SettingsIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Settings</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <motion.button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateInvoice}
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Invoice</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile navigation */}
      {navOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-72">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-surface-500 dark:text-surface-400">Welcome to your invoice management platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat) => (
              <motion.div 
                key={stat.id}
                className="card-neu p-5 transition-all"
                whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">{stat.name}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className={`text-sm mt-1 ${stat.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-primary bg-opacity-10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Feature Component */}
          <MainFeature />
        </div>
      </main>
    </div>
  );
};

export default Home;