import { getSession } from "@/lib/auth";
import { getFilesForUser } from "@/lib/aws";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { FilesTable } from "@/components/dashboard/FilesTable";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        return null; // Should be handled by middleware
    }

    const files = await getFilesForUser(session.username);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">My Files</h1>
                <FileUploader username={session.username} />
            </div>
            <div
                className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm"
            >
                <FilesTable files={files} username={session.username} />
            </div>
        </>
    );
}
