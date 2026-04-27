import { type ReactElement } from 'react';
import { ShieldX, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UnauthorizedState = (): ReactElement => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Card className="w-full max-w-md border-red-100 bg-red-50/30">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <ShieldX className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-lg text-slate-900">Access Restricted</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        <p className="text-sm text-slate-600">
          You don't have permission to view audit logs. This feature is restricted to administrators only.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          <span>Admin access required</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default UnauthorizedState;