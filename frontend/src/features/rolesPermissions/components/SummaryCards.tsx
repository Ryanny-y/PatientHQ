import { Card, CardContent } from '@/components/ui/card';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';

const SummaryCards = () => {
  const { data: roles } = useRoles();
  const { data: permissions } = usePermissions();

  const totalRoles = roles?.length || 0;
  const totalPermissions = permissions?.length || 0;
  const usersAssigned = roles?.reduce((sum, r) => sum + r.userCount, 0) || 0;
  const recentlyAdded = roles?.filter(r => {
    const created = new Date(r.createdAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return created > thirtyDaysAgo;
  }).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{totalRoles}</div>
          <div className="text-sm text-gray-600">Total Roles</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{totalPermissions}</div>
          <div className="text-sm text-gray-600">Total Permissions</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-purple-600">{usersAssigned}</div>
          <div className="text-sm text-gray-600">Users Assigned</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-orange-600">{recentlyAdded}</div>
          <div className="text-sm text-gray-600">Recently Added Roles</div>
        </CardContent>
      </Card>
    </div>
  );
};

export { SummaryCards };