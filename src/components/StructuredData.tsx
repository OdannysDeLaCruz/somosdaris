export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SomosDaris",
    "description": "Servicio profesional de limpieza en Valledupar, Cesar",
    "url": "https://somosdaris.com",
    "telephone": "+57-322-637-0671",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Dirección", 
      "addressLocality": "Valledupar",
      "addressRegion": "Cesar",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.4631",
      "longitude": "-73.2532"
    },
    "areaServed": {
      "@type": "City",
      "name": "Valledupar"
    },
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Servicio de Limpieza",
    "provider": {
      "@type": "LocalBusiness",
      "name": "SomosDaris"
    },
    "areaServed": {
      "@type": "City",
      "name": "Valledupar"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
