export const ALL_REVIEWS_QUERY = `
  *[_type == "supplementReview" && defined(slug)] | order(_updatedAt desc) {
    _id,
    "productName": supplementName,
    "slug": slug.current,
    evidenceRating,
    summary,
    a1cEffect,
    studiedDose,
    featured,
    "affiliateUrl": recommendedProducts[0].affiliateUrl,
    "price": recommendedProducts[0].price,
    "trialCount": count(clinicalStudies)
  }
`

export const REVIEW_BY_SLUG_QUERY = `
  *[_type == "supplementReview" && slug.current == $slug][0] {
    _id,
    "productName": supplementName,
    "slug": slug.current,
    evidenceRating,
    summary,
    a1cEffect,
    studiedDose,
    whatToLookFor,
    "clinicalStudies": clinicalStudies[] {
      authors, description, pubmedId, year
    },
    "drugInteractions": drugInteractions[] {
      drug, "severity": riskLevel, note
    },
    "sideEffects": sideEffects[] {
      effect, frequency, management
    },
    contraindications,
    "recommendedProducts": recommendedProducts[] {
      name, price, form, affiliateUrl, affiliateSource, thirdPartyTesting, notable
    },
    _updatedAt
  }
`

export const ALL_SLUGS_QUERY = `
  *[_type == "supplementReview" && defined(slug)] {
    "slug": slug.current
  }
`