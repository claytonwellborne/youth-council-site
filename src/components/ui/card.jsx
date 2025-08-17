export function Card({ className='', ...props }) {
  return <div className={`rounded-xl border bg-white shadow-sm ${className}`} {...props} />;
}
export function CardHeader({ className='', ...props }) {
  return <div className={`p-6 pb-2 ${className}`} {...props} />;
}
export function CardTitle({ className='', ...props }) {
  return <h3 className={`text-lg font-semibold tracking-tight ${className}`} {...props} />;
}
export function CardContent({ className='', ...props }) {
  return <div className={`p-6 pt-2 ${className}`} {...props} />;
}
