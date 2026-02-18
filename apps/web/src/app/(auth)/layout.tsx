export default function AuthLayout({ children }: { children: React.ReactNode }) { 
  return (
    <div className='auth-layout min-h-screen w-full flex bg-background'>
      {children}
    </div>
  ); 
}
