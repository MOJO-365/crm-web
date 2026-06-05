import { LeadSourceTable } from './components/LeadSourceTable';
import { DocumentTypeTable } from './components/DocumentTypeTable';
import { NoteTypeTable } from './components/NoteTypeTable';

export const MasterDataPage = () => {
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Master Data Management</h1>
                <p className="text-muted-foreground text-sm max-w-2xl">
                    Manage global lookup values and dropdown fields across the CRM system.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                {/* Lead Sources Table */}
                <div className="h-full">
                    <LeadSourceTable />
                </div>

                {/* Document Types Table */}
                <div className="h-full">
                    <DocumentTypeTable />
                </div>

                {/* Note Types Table */}
                <div className="h-full">
                    <NoteTypeTable />
                </div>
            </div>

            {/* Note: More master tables can be added here in future rows */}
        </div>
    );
};
