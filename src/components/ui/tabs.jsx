import * as TabsPrimitive from '@radix-ui/react-tabs';
export function Tabs(props){ return <TabsPrimitive.Root {...props} /> }
export function TabsList({ className='', ...props }) {
  return <TabsPrimitive.List className={`inline-flex h-10 items-center justify-center rounded-lg border bg-white p-1 ${className}`} {...props} />;
}
export function TabsTrigger({ className='', ...props }) {
  return <TabsPrimitive.Trigger className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:text-gray-700 ${className}`} {...props} />;
}
export function TabsContent({ className='', ...props }) {
  return <TabsPrimitive.Content className={`mt-4 ${className}`} {...props} />;
}
