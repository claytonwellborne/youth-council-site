export function Button({ variant='solid', size='md', className='', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const solid = 'bg-gray-900 text-white hover:bg-black';
  const outline = 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50';
  const v = variant === 'outline' ? outline : solid;
  const s = size === 'sm' ? 'h-8 px-3' : 'h-10 px-4';
  return <button className={`${base} ${v} ${s} ${className}`} {...props} />;
}
