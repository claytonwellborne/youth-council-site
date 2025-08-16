export default function AdminPlain() {
  return (
    <div style={{padding: 24}}>
      <h1>🛠 Admin (Plain)</h1>
      <p>This is an unprotected admin landing page to verify routing.</p>
      <p>Once this loads in prod, we’ll point back to /admin/login.</p>
    </div>
  );
}
