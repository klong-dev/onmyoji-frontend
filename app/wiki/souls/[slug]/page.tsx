import { Metadata } from "next";
import { notFound } from "next/navigation";
import SoulDetailClient from "@/components/wiki/SoulDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Ngự Hồn ${slug} - Wiki Onmyoji AutoVN`,
    description: `Thông tin chi tiết về Ngự Hồn ${slug} trong Onmyoji`,
  };
}

export default async function SoulDetailPage({ params }: Props) {
  const { slug } = await params;

  return <SoulDetailClient slug={slug} />;
}
