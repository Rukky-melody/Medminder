
import React from 'react';
import { Calendar, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow dark:bg-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Calendar className="h-6 w-6 text-med-blue-600 mr-2" />
            <p className="text-med-blue-700 dark:text-white font-semibold">
              MediReminder © {new Date().getFullYear()}
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-med-blue-600 hover:text-med-blue-800 dark:text-med-blue-400 dark:hover:text-white transition-colors">
              <span className="sr-only">Contact Support</span>
              <Mail className="h-5 w-5" />
            </a>
            <a href="#" className="text-med-blue-600 hover:text-med-blue-800 dark:text-med-blue-400 dark:hover:text-white transition-colors">
              <span className="sr-only">Emergency Contact</span>
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>This app is for demonstration purposes only and not intended to replace professional medical advice.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
