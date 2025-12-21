import { Metadata } from "next";
import SoulDetailClient from "@/components/wiki/SoulDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3020/api";

async function getSoul(slug: string) {
  try {
    const res = await fetch(`${API_URL}/souls/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.soul;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const soul = await getSoul(slug);

  if (!soul) {
    return {
      title: `Ngự Hồn - Wiki Onmyoji AutoVN`,
      description: `Thông tin chi tiết về Ngự Hồn trong Onmyoji`,
    };
  }

  const name = soul.nameVi || soul.name;

  return {
    title: `${name} - Ngự Hồn Onmyoji | Hiệu Ứng & Build Guide`,
    description: `${name} (${soul.name}). Hiệu ứng 2 mảnh: ${soul.effect2pcVi?.slice(0, 60) || 'Xem chi tiết'}. Hiệu ứng 4 mảnh và thức thần phù hợp.`,
    keywords: [
      name, soul.name, `${name} Onmyoji`, `ngự hồn ${name}`,
      `hiệu ứng ${name}`, "ngự hồn Onmyoji", "soul Onmyoji"
    ],
    openGraph: {
      title: `${name} - Ngự Hồn Onmyoji`,
      description: `Hiệu ứng 2 mảnh, 4 mảnh và thức thần phù hợp`,
      images: soul.image ? [soul.image] : ["/og-souls.png"],
    },
    alternates: {
      canonical: `/wiki/souls/${slug}`,
    },
  };
}

export default async function SoulDetailPage({ params }: Props) {
  const { slug } = await params;

  return <SoulDetailClient slug={slug} />;
}
