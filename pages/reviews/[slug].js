import Head from 'next/head'
import Link from 'next/link'
import { client } from '../../sanity/client'
import { REVIEW_BY_SLUG_QUERY, ALL_SLUGS_QUERY } from '../../sanity/queries'
import styles from '../../styles/ReviewPage.module.css'

const gradeMap = {
  'A': 'A', 'A-': 'A-', 'B+': 'B+', 'B': 'B', 'B-': 'B-', 'C': 'C', 'D': 'D',
  'A - Strong Evidence': 'A',
  'B - Moderate Evidence': 'B',
  'B- - Limited Moderate Evidence': 'B-',
  'C - Preliminary Evidence': 'C',
  'D - No Evidence': 'D',
}
const gradeColors = {
  'A': '#1e5c3a', 'A-': '#2d7a4f', 'B+': '#1a6fa8',
  'B': '#5a7fa8', 'B-': '#7a8fa8', 'C': '#888', 'D': '#aaa'
}
const severityClass = { 'High': styles.high, 'Moderate': styles.moderate, 'Low': styles.low }

export default function ReviewPage({ review }) {
  if (!review) {
    return (
      <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '80px 20px' }}>
        <h1 style={{ marginBottom: 16 }}>Review not found</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>This review may not be published yet.</p>
        <Link href="/reviews" style={{ color: '#1e5c3a', fontWeight: 600 }}>Back to all reviews</Link>
      </div>
    )
  }

  const grade = gradeMap[review.evidenceRating] || review.evidenceRating || '—'
  const gradeColor = gradeColors[grade] || '#888'

  return (
    <>
      <Head>
        <title>{review.productName} Review | GlucoseVerified</title>
        <meta name="description" content={review.summary?.slice(0, 160) || ''} />
      </Head>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.navInner}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark}>G</span>
              <span>GlucoseVerified</span>
            </Link>
            <Link href="/reviews" className={styles.navBack}>Back to Reviews</Link>
          </div>
        </nav>

        <div className={styles.layout}>
          <article className={styles.content}>
            <div className={styles.articleHeader}>
              <div className={styles.breadcrumb}>
                <Link href="/">Home</Link> / <Link href="/reviews">Reviews</Link> / {review.productName}
              </div>
              <div className={styles.gradeBadge} style={{ background: gradeColor }}>
                Evidence Grade: {grade}
              </div>
              <h1 className={styles.title}>{review.productName}</h1>
              {review.summary && <p className={styles.intro}>{review.summary}</p>}
              <div className={styles.metaRow}>
                {review._updatedAt && (
                  <span>Updated: {new Date(review._updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                )}
                {review.clinicalStudies?.length > 0 && (
                  <span>{review.clinicalStudies.length} clinical studies</span>
                )}
              </div>
            </div>

            {(review.a1cEffect || review.studiedDose) && (
              <div className={styles.keyFacts}>
                {review.a1cEffect && (
                  <div className={styles.keyFact}>
                    <div className={styles.keyFactLabel}>A1C Effect</div>
                    <div className={styles.keyFactValue}>{review.a1cEffect}</div>
                  </div>
                )}
                {review.studiedDose && (
                  <div className={styles.keyFact}>
                    <div className={styles.keyFactLabel}>Studied Dose</div>
                    <div className={styles.keyFactValue}>{review.studiedDose}</div>
                  </div>
                )}
                {review.evidenceRating && (
                  <div className={styles.keyFact}>
                    <div className={styles.keyFactLabel}>Evidence</div>
                    <div className={styles.keyFactValue}>{review.evidenceRating}</div>
                  </div>
                )}
              </div>
            )}

            {review.clinicalStudies?.length > 0 && (
              <div className={styles.studiesSection}>
                <h2>Clinical Studies</h2>
                <div className={styles.tableWrap}>
                  <table className={styles.studyTable}>
                    <thead>
                      <tr>
                        <th>Authors</th>
                        <th>Year</th>
                        <th>Findings</th>
                        <th>PubMed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {review.clinicalStudies.map((s, i) => (
                        <tr key={i}>
                          <td>{s.authors}</td>
                          <td>{s.year}</td>
                          <td>{s.description}</td>
                          <td>
                            {s.pubmedId && (
                              <a href={`https://pubmed.ncbi.nlm.nih.gov/${s.pubmedId}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1e5c3a' }}>
                                {s.pubmedId}
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {review.sideEffects?.length > 0 && (
              <div className={styles.interactions}>
                <h2>Side Effects</h2>
                <div className={styles.interactionGrid}>
                  {review.sideEffects.map((s, i) => (
                    <div key={i} className={`${styles.interactionRow} ${styles.low}`}>
                      <strong>{s.effect}</strong>
                      <span className={styles.severity}>{s.frequency}</span>
                      <span>{s.management}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {review.drugInteractions?.length > 0 && (
              <div className={styles.interactions}>
                <h2>Drug Interactions</h2>
                <div className={styles.interactionGrid}>
                  {review.drugInteractions.map((item, i) => (
                    <div key={i} className={`${styles.interactionRow} ${severityClass[item.severity] || styles.low}`}>
                      <strong>{item.drug}</strong>
                      <span className={styles.severity}>{item.severity}</span>
                      <span>{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {review.whatToLookFor && (
              <div className={styles.disclaimer} style={{ background: '#f0f7ff', borderColor: '#b0d0f0', color: '#1a3c6a' }}>
                <strong>What to Look For:</strong> {review.whatToLookFor}
              </div>
            )}

            <div className={styles.disclaimer}>
              <strong>Medical Disclaimer:</strong> This review is for informational purposes only.
              Always consult your physician before starting any supplement.
            </div>
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.buyCard}>
              <div className={styles.buyScore} style={{ color: gradeColor }}>{grade}<span> grade</span></div>
              <div className={styles.buyGrade} style={{ color: gradeColor }}>{review.evidenceRating}</div>
              <div className={styles.buyProduct}>
                <strong>{review.productName}</strong>
              </div>
              {review.recommendedProducts?.map((p, i) => (
                <div key={i}>
                  {p.price && <div className={styles.buyPrice}>{p.price}</div>}
                  {p.affiliateUrl && (
                    <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                      className={i === 0 ? styles.buyPrimary : styles.buySecondary}>
                      {i === 0 ? 'Check Price on Amazon' : `Buy on ${p.affiliateSource || 'iHerb'}`} →
                    </a>
                  )}
                </div>
              ))}
              <p className={styles.affiliateNote}>Affiliate link — commission earned at no cost to you.</p>
            </div>

            <div className={styles.quickFacts}>
              <h3>Quick Facts</h3>
              {review.studiedDose && <div className={styles.fact}><span>Dose</span><strong>{review.studiedDose}</strong></div>}
              {review.a1cEffect && <div className={styles.fact}><span>A1C Effect</span><strong>{review.a1cEffect}</strong></div>}
              {review.clinicalStudies?.length > 0 && <div className={styles.fact}><span>Studies</span><strong>{review.clinicalStudies.length} RCTs</strong></div>}
              <div className={styles.fact}><span>Grade</span><strong style={{ color: gradeColor }}>{grade}</strong></div>
            </div>

            <div className={styles.sidebarRelated}>
              <h3>Browse More</h3>
              <Link href="/reviews" className={styles.relatedLink}>All Supplement Reviews</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  try {
    const slugs = await client.fetch(ALL_SLUGS_QUERY)
    return {
      paths: (slugs || []).map(s => ({ params: { slug: s.slug } })),
      fallback: 'blocking',
    }
  } catch {
    return { paths: [], fallback: 'blocking' }
  }
}

export async function getStaticProps({ params }) {
  try {
    const review = await client.fetch(REVIEW_BY_SLUG_QUERY, { slug: params.slug })
    return {
      props: { review: review || null },
      revalidate: 60,
    }
  } catch {
    return { props: { review: null }, revalidate: 60 }
  }
}