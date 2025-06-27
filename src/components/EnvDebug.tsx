import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function EnvDebug() {
  const envVars = Object.entries(import.meta.env)
    .filter(([key]) => key.startsWith('VITE_'))
    .map(([key, value]) => ({
      key,
      hasValue: !!value,
      length: value?.toString().length || 0
    }));

  return (
    <Card className="bg-zinc-900 border-zinc-800 mb-4">
      <CardHeader>
        <CardTitle className="text-white text-sm">Environment Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {envVars.map(({ key, hasValue, length }) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-zinc-300">{key}:</span>
              <span className={hasValue ? 'text-green-400' : 'text-red-400'}>
                {hasValue ? `✓ (${length} chars)` : '✗ Missing'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}