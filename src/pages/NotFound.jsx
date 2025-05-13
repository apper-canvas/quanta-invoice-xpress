import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icons
const HomeIcon = getIcon('Home');
const AlertTriangleIcon = getIcon('AlertTriangle');

const NotFound = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-8 text-secondary-dark"
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
      >
        <AlertTriangleIcon className="w-24 h-24 mx-auto" />
      </motion.div>

      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">404</h1>
      
      <div className="max-w-md mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to the dashboard.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium transition-all">
            <HomeIcon className="w-5 h-5" />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="h-2 bg-gradient-to-r from-secondary via-primary to-accent rounded-full" />
      </div>
    </motion.div>
  );
};

export default NotFound;