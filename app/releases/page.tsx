import type { Metadata } from "next";
import { ReleasesListClient } from "@/components/releases-list-client";

export const metadata: Metadata = {
  title: "Releases - Onmyoji AutoVN",
  description: "Theo dõi các bản cập nhật và tính năng mới của Onmyoji AutoVN.",
};

export default function ReleasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">🚀</div>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Lịch sử cập nhật</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Theo dõi các phiên bản và tính năng mới của Onmyoji AutoVN</p>
      </div>

      {/* Timeline - Client Component */}
      <ReleasesListClient />
    </div>
  );
}
