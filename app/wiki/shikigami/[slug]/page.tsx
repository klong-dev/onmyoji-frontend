import { Metadata } from "next";
import ShikigamiDetailClient from "@/components/wiki/ShikigamiDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3020/api";

async function getShikigami(slug: string) {
  try {
    const res = await fetch(`${API_URL}/shikigami/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.shikigami;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const shikigami = await getShikigami(slug);

  if (!shikigami) {
    return {
      title: `Thức Thần - Wiki Onmyoji AutoVN`,
      description: `Thông tin chi tiết về Thức Thần trong Onmyoji`,
    };
  }

  const name = shikigami.nameVi || shikigami.name;
  const rarityLabel = shikigami.rarity === 'SSR' ? 'SSR' : shikigami.rarity === 'SP' ? 'SP' : shikigami.rarity;

  return {
    title: `${name} - Thức Thần ${rarityLabel} | Build & Ngự Hồn Onmyoji`,
    description: `${name} (${shikigami.name}) - ${rarityLabel} ${shikigami.role}. ${shikigami.description?.slice(0, 100) || 'Thông tin chi tiết về chỉ số, kỹ năng và ngự hồn phù hợp.'}`,
    keywords: [
      name, shikigami.name, `${name} Onmyoji`, `build ${name}`,
      `ngự hồn ${name}`, `${rarityLabel} Onmyoji`, "thức thần"
    ],
    openGraph: {
      title: `${name} - Thức Thần ${rarityLabel} Onmyoji`,
      description: `Thông tin chi tiết ${name}: chỉ số, kỹ năng, ngự hồn phù hợp`,
      images: shikigami.image ? [shikigami.image] : ["/og-shikigami.png"],
    },
    alternates: {
      canonical: `/wiki/shikigami/${slug}`,
    },
  };
}

export default async function ShikigamiDetailPage({ params }: Props) {
  const { slug } = await params;

  return <ShikigamiDetailClient slug={slug} />;
}
