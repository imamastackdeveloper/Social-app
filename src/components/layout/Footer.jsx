/**
 * Footer component with copyright and links
 * Displays at the bottom of the public pages
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              SocialApp &copy; {currentYear}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>About</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Help</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
