/**
 * Backend removed: this stub makes any remaining imports no-op.
 * All methods return { data: null, error: new Error('Backend removed') }.
 */
const noop = async () => ({ data: null, error: new Error('Backend removed') });

export const supabase = new Proxy({}, {
  get: () => new Proxy(noop, {
    apply: () => noop(),
    get: () => noop
  })
});

export default supabase;
