import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "store";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/** Everydaycar — navy blue shell behind login / forgot-password flows */
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.authReducer);

  return isLoggedIn ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="relative min-h-screen bg-gradient-to-br from-[#F4F7F9] via-white to-[#e8f0fa] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#007BFF]/12 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-[#003366]/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative flex min-h-screen">
        <div className="flex flex-col justify-center w-full px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-12 lg:py-12 xl:px-20 xl:py-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
