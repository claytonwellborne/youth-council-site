export function Badge({ variant='solid', className='', ...props }) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const solid = 'bg-gray-100 text-gray-800';
  const outline = 'border border-gray-300 text-gray-800 bg-white';
  const styles = variant === 'outline' ? outline : solid;
  return <span className={`${base} ${styles} ${className}`} {...props} />;
}
