"use client"

interface JsonLdProps {
  type: 'Organization' | 'WebSite' | 'SoftwareApplication' | 'Article' | 'BreadcrumbList' | 'FAQPage'
  data: Record<string, unknown>
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Pre-built JSON-LD components for common use cases

export function OrganizationJsonLd() {
  return (
    <JsonLd
      type="Organization"
      data={{
        name: 'OnmyojiAutoVN',
        url: 'https://onmyojivn.site',
        logo: 'https://onmyojivn.site/logo.png',
        description: 'Cộng đồng Auto Script Onmyoji lớn nhất Việt Nam. Tool tự động, wiki thức thần, diễn đàn.',
        sameAs: [
          'https://github.com/klong-dev/OnmyojiAutoVN',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          availableLanguage: ['Vietnamese', 'English'],
        },
      }}
    />
  )
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      type="WebSite"
      data={{
        name: 'OnmyojiAutoVN',
        url: 'https://onmyojivn.site',
        description: 'Tool auto Onmyoji miễn phí, wiki thức thần, ngự hồn đầy đủ',
        inLanguage: 'vi-VN',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://onmyojivn.site/wiki?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

export function SoftwareApplicationJsonLd() {
  return (
    <JsonLd
      type="SoftwareApplication"
      data={{
        name: 'OnmyojiAutoVN',
        operatingSystem: 'Windows 10, Windows 11',
        applicationCategory: 'GameApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'VND',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1000',
        },
        description: 'Phần mềm auto farm Onmyoji miễn phí. Hỗ trợ LDPlayer, BlueStacks, MuMu Player.',
        downloadUrl: 'https://onmyojivn.site/download',
        softwareVersion: '1.0.0',
        author: {
          '@type': 'Organization',
          name: 'OnmyojiAutoVN',
        },
      }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      type="BreadcrumbList"
      data={{
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}

interface FAQItem {
  question: string
  answer: string
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  return (
    <JsonLd
      type="FAQPage"
      data={{
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  )
}

interface ShikigamiJsonLdProps {
  name: string
  nameVi?: string
  description?: string
  image?: string
  rarity: string
  role: string
}

export function ShikigamiJsonLd({ name, nameVi, description, image, rarity, role }: ShikigamiJsonLdProps) {
  return (
    <JsonLd
      type="Article"
      data={{
        headline: `${nameVi || name} - Thức Thần ${rarity} ${role}`,
        description: description || `Thông tin chi tiết về ${nameVi || name} trong Onmyoji`,
        image: image,
        author: {
          '@type': 'Organization',
          name: 'OnmyojiAutoVN',
        },
        publisher: {
          '@type': 'Organization',
          name: 'OnmyojiAutoVN',
          logo: {
            '@type': 'ImageObject',
            url: 'https://onmyojivn.site/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://onmyojivn.site/wiki/shikigami/${name.toLowerCase().replace(/\s+/g, '-')}`,
        },
      }}
    />
  )
}
