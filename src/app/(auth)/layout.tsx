const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      {children}
    </div>
  );
};

export default AuthLayout;
