export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#000', 
        color: '#fff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
