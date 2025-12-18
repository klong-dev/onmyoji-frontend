import { Metadata } from "next";
import ShikigamiDetailClient from "@/components/wiki/ShikigamiDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Thức Thần ${slug} - Wiki Onmyoji AutoVN`,
    description: `Thông tin chi tiết về Thức Thần ${slug} trong Onmyoji`,
  };
}

export default async function ShikigamiDetailPage({ params }: Props) {
  const { slug } = await params;

  return <ShikigamiDetailClient slug={slug} />;
}
