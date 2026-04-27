import { useUser, useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { LogOutIcon, CustomerIcon, PlusIcon } from '@/components/icons';

export function BranchDashboardPage() {
    const user = useUser();
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background p-6 flex flex-col items-center">
            <div className="w-full max-w-5xl bg-white dark:bg-card shadow-sm rounded-xl border border-border p-8">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <div>
                        <h1 className="text-3xl font-bold text-title dark:text-title">Branch Portal</h1>
                        <p className="text-subtitle dark:text-subtitle mt-1">Welcome back, {user?.name}</p>
                    </div>
                    <Button variant="outline" onClick={logout} leftIcon={<LogOutIcon size={16} />}>
                        Log out
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Enrollments Card */}
                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 flex flex-col items-start hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                            <CustomerIcon size={24} />
                        </div>
                        <h3 className="font-semibold text-lg text-title dark:text-title mb-2">My Enrollments</h3>
                        <p className="text-subtitle dark:text-subtitle mb-6 flex-1">
                            View and track the status of your customer enrollments.
                        </p>
                        <Button className="w-full" leftIcon={<CustomerIcon size={16} />} onClick={() => navigate('/branch-portal/enrollments')}>
                            View Enrollments
                        </Button>
                    </div>
                    
                    {/* New Enrollment Card */}
                    <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 flex flex-col items-start hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                            <PlusIcon size={24} />
                        </div>
                        <h3 className="font-semibold text-lg text-title dark:text-title mb-2">New Enrollment</h3>
                        <p className="text-subtitle dark:text-subtitle mb-6 flex-1">
                            Start a new enrollment for a customer at this branch.
                        </p>
                        <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                            leftIcon={<PlusIcon size={16} />}
                            onClick={() => navigate('/branch-portal/enroll')}
                        >
                            Start New Enrollment
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
