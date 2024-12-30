import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start">
          <img
            src="/asset/KMITL_Logo.png"
            alt="KMITL Logo"
            className="h-12 mb-4"
          />
          <a href="https://www.facebook.com/sekmitl/" target="_blank" rel="noopener noreferrer">
            <img
              src="/asset/facebook.png"
              alt="Facebook"
              className="h-6"
            />
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2022 Software Engineering, King Mongkut's Institute of Technology Ladkrabang
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
