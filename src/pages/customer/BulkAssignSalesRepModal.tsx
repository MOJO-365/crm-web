import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { UsersIcon, UserIcon, InfoIcon } from '@/components/icons';
import { BULK_ASSIGN_CUSTOMERS } from '@/graphql';
import { toast } from 'react-toastify';

interface BulkAssignSalesRepModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCustomerIds: string[];
    userOptions: { value: string; label: string }[];
    onSuccess: () => void;
}

export const BulkAssignSalesRepModal: React.FC<BulkAssignSalesRepModalProps> = ({
    isOpen,
    onClose,
    selectedCustomerIds,
    userOptions,
    onSuccess,
}) => {
    const [selectedUserUid, setSelectedUserUid] = useState<string>('');
    const [bulkAssignCustomers, { loading }] = useMutation(BULK_ASSIGN_CUSTOMERS);

    const fullUserOptions = [
        { value: '', label: '— Unassigned —' },
        ...userOptions,
    ];

    const handleAssign = async () => {
        if (!selectedCustomerIds || selectedCustomerIds.length === 0) {
            toast.warn('No customers selected');
            return;
        }

        try {
            const { data } = await bulkAssignCustomers({
                variables: {
                    uids: selectedCustomerIds,
                    userUid: selectedUserUid || null,
                },
            });

            if (data?.bulkAssignCustomers) {
                const assignedUser = userOptions.find((u) => u.value === selectedUserUid);
                if (assignedUser) {
                    toast.success(
                        `Successfully assigned ${selectedCustomerIds.length} customer${
                            selectedCustomerIds.length > 1 ? 's' : ''
                        } to ${assignedUser.label}`
                    );
                } else {
                    toast.success(
                        `Successfully unassigned ${selectedCustomerIds.length} customer${
                            selectedCustomerIds.length > 1 ? 's' : ''
                        }`
                    );
                }
                onSuccess();
                onClose();
            } else {
                toast.error('Failed to update assignment');
            }
        } catch (error: any) {
            console.error('Bulk assign error:', error);
            toast.error(error?.message || 'Failed to assign user');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title={
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <UsersIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Assign User</h3>
                        <p className="text-xs text-muted-foreground font-normal">
                            Update assignment for {selectedCustomerIds.length} selected customer{selectedCustomerIds.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            }
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        isLoading={loading}
                        leftIcon={<UserIcon size={16} />}
                    >
                        Confirm Assignment
                    </Button>
                </div>
            }
        >
            <div className="space-y-4 py-2">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/60 border border-border text-xs text-muted-foreground">
                    <InfoIcon size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>
                        Selected user will be assigned to all <strong>{selectedCustomerIds.length}</strong> customer accounts at once.
                    </span>
                </div>

                <div className="space-y-2">
                    <Select
                        label="Select User"
                        options={fullUserOptions}
                        value={selectedUserUid}
                        onChange={(val) => setSelectedUserUid(val as string)}
                        placeholder="Choose a user..."
                    />
                </div>
            </div>
        </Modal>
    );
};

export default BulkAssignSalesRepModal;
