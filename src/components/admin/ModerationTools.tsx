'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ClockIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  XCircleIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { 
  Report, 
  ModerationAction, 
  UserBan,
  Comment,
  Poll
} from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

interface ModerationToolsProps {
  view?: 'reports' | 'actions' | 'bans';
}

const ModerationTools: React.FC<ModerationToolsProps> = ({
  view = 'reports',
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(view);
  const [reports, setReports] = useState<Report[]>([]);
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [bans, setBans] = useState<UserBan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchModerationData();
  }, [activeTab]);

  const fetchModerationData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [reportsRes, actionsRes, bansRes] = await Promise.all([
      //   fetch('/api/admin/reports'),
      //   fetch('/api/admin/moderation-actions'),
      //   fetch('/api/admin/bans'),
      // ]);

      // Mock implementation
      const mockReports: Report[] = Array.from({ length: 10 }, (_, i) => ({
        id: `report_${i}`,
        reporterId: `user_${i % 3}`,
        reportedUserId: `user_${(i + 1) % 3}`,
        entityType: ['comment', 'poll', 'user'][i % 3] as any,
        entityId: `entity_${i}`,
        reason: ['spam', 'inappropriate', 'harassment', 'misinformation'][i % 4] as any,
        description: `This content violates community guidelines - ${i}`,
        status: ['pending', 'reviewed', 'resolved', 'dismissed'][i % 4] as any,
        moderatorId: i % 2 === 0 ? user?.id : undefined,
        moderatorNotes: i % 2 === 0 ? 'Reviewed and action taken' : undefined,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        resolvedAt: i % 2 === 0 ? new Date(Date.now() - i * 1800000).toISOString() : undefined,
      }));

      const mockActions: ModerationAction[] = Array.from({ length: 8 }, (_, i) => ({
        id: `action_${i}`,
        moderatorId: user?.id || 'mod_1',
        targetType: ['user', 'comment', 'poll'][i % 3] as any,
        targetId: `target_${i}`,
        action: ['warn', 'timeout', 'ban', 'delete', 'pin'][i % 5] as any,
        reason: `Action taken for violation ${i}`,
        duration: i % 2 === 0 ? 24 : undefined,
        createdAt: new Date(Date.now() - i * 7200000).toISOString(),
      }));

      const mockBans: UserBan[] = Array.from({ length: 5 }, (_, i) => ({
        id: `ban_${i}`,
        userId: `user_${i}`,
        moderatorId: user?.id || 'mod_1',
        reason: `Repeated violations of community guidelines - ${i}`,
        type: i % 2 === 0 ? 'temporary' : 'permanent',
        endsAt: i % 2 === 0 ? new Date(Date.now() + 7 * 24 * 3600000).toISOString() : undefined,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      }));

      setReports(mockReports);
      setActions(mockActions);
      setBans(mockBans);
    } catch (error) {
      console.error('Error fetching moderation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: 'approve' | 'dismiss', notes?: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/reports/${reportId}/action`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ action, notes }),
      // });

      // Mock implementation
      setReports(prev => prev.map(report => 
        report.id === reportId
          ? {
              ...report,
              status: action === 'approve' ? 'resolved' : 'dismissed',
              moderatorId: user!.id,
              moderatorNotes: notes,
              resolvedAt: new Date().toISOString(),
            }
          : report
      ));
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return;

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/admin/bulk-action', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ action, itemIds: selectedItems }),
      // });

      // Mock implementation
      console.log(`Bulk ${action} on items:`, selectedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const moderateContent = async (
    targetType: string,
    targetId: string,
    action: 'delete' | 'hide' | 'pin' | 'warn' | 'timeout' | 'ban',
    reason: string,
    duration?: number
  ) => {
    try {
      const moderationAction: ModerationAction = {
        id: `action_${Date.now()}`,
        moderatorId: user!.id,
        targetType: targetType as any,
        targetId,
        action: action as any,
        reason,
        duration,
        createdAt: new Date().toISOString(),
      };

      // TODO: Replace with actual API call
      // await fetch('/api/admin/moderate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(moderationAction),
      // });

      // Mock implementation
      setActions(prev => [moderationAction, ...prev]);
    } catch (error) {
      console.error('Error moderating content:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'timeout': return 'bg-orange-100 text-orange-800';
      case 'ban': return 'bg-red-100 text-red-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'pin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!user || user.username !== 'admin') { // Simple admin check - should be more robust
    return (
      <div className="moderation-unauthorized text-center py-12">
        <ShieldCheckIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to access moderation tools.</p>
      </div>
    );
  }

  return (
    <div className="moderation-tools">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Moderation Tools</h1>
            <p className="text-sm text-gray-600">Manage community content and users</p>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedItems.length} selected
            </span>
            <button
              onClick={() => handleBulkAction('approve')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleBulkAction('dismiss')}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'reports', label: 'Reports', icon: FlagIcon, count: reports.filter(r => r.status === 'pending').length },
            { key: 'actions', label: 'Actions', icon: ShieldCheckIcon, count: actions.length },
            { key: 'bans', label: 'Bans', icon: NoSymbolIcon, count: bans.filter(b => b.type === 'temporary').length },
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {count > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="loading-state py-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading moderation data...</p>
        </div>
      ) : (
        <div className="moderation-content">
          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="reports-section">
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="report-item bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(report.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(prev => [...prev, report.id]);
                              } else {
                                setSelectedItems(prev => prev.filter(id => id !== report.id));
                              }
                            }}
                            className="rounded"
                          />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <span className="text-sm text-gray-600">
                            {report.entityType} reported for {report.reason}
                          </span>
                        </div>

                        <p className="text-sm text-gray-900 mb-2">
                          {report.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Reported {formatDate(report.createdAt)}</span>
                          <span>Reporter ID: {report.reporterId}</span>
                          {report.reportedUserId && (
                            <span>Reported User: {report.reportedUserId}</span>
                          )}
                        </div>

                        {report.moderatorNotes && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <strong>Moderator Notes:</strong> {report.moderatorNotes}
                          </div>
                        )}
                      </div>

                      {report.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReportAction(report.id, 'approve', 'Content moderated')}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, 'dismiss', 'No violation found')}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            <XCircleIcon className="w-4 h-4" />
                            <span>Dismiss</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="actions-section">
              <div className="space-y-4">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="action-item bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(action.action)}`}>
                          {action.action}
                        </span>
                        <span className="text-sm text-gray-900">
                          {action.targetType} • {action.reason}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(action.createdAt)}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Target: {action.targetId}</span>
                      <span>Moderator: {action.moderatorId}</span>
                      {action.duration && (
                        <span>Duration: {action.duration}h</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bans Tab */}
          {activeTab === 'bans' && (
            <div className="bans-section">
              <div className="space-y-4">
                {bans.map((ban) => (
                  <div
                    key={ban.id}
                    className="ban-item bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ban.type === 'permanent' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {ban.type}
                        </span>
                        <span className="text-sm text-gray-900">
                          User: {ban.userId}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {ban.type === 'temporary' && ban.endsAt ? (
                          `Ends ${formatDate(ban.endsAt)}`
                        ) : (
                          'Permanent'
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mt-2">
                      {ban.reason}
                    </p>

                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Banned {formatDate(ban.createdAt)}</span>
                      <span>By: {ban.moderatorId}</span>
                    </div>

                    {ban.type === 'temporary' && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            // Lift ban early
                            console.log('Lift ban for:', ban.userId);
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Lift Ban
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModerationTools;
