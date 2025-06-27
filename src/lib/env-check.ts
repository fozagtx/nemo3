// Environment variable checker for debugging
export function checkEnvironment() {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY,
  };

  console.group('🔍 Environment Variables Check');
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    const status = value ? '✅' : '❌';
    const length = value ? `(${value.length} chars)` : '(missing)';
    console.log(`${status} ${key}: ${length}`);
    
    if (key === 'VITE_ELEVENLABS_API_KEY' && value && !value.startsWith('sk-')) {
      console.warn(`⚠️  ${key} should start with "sk-"`);
    }
  });
  
  console.groupEnd();
  
  return requiredVars;
}

// Call this in development mode
if (import.meta.env.DEV) {
  checkEnvironment();
}