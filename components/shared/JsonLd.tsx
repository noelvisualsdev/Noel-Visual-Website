import React from 'react';

export const JsonLd = () => {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NOEL VISUALS',
    url: 'https://noelvisuals.com',
    logo: 'https://noelvisuals.com/images/featured_edit_city_nights.jpg',
    description:
      'NOEL VISUALS delivers high-impact video editing, scroll-stopping thumbnails, and modern brand design for creators and global brands.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zurich',
      addressCountry: 'Switzerland',
    },
    sameAs: [
      'https://twitter.com/noelvisuals',
      'https://instagram.com/noelvisuals',
      'https://youtube.com/@noelvisuals',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
};
