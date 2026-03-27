import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { client } from '../../sanity/client'
import { ALL_REVIEWS_QUERY } from '../../sanity/queries'
import styles from '../../styles/Reviews.module.css'

// Grade colors
const gradeColors = {
  'A': '#1e5c3a', 'A-': '#2d7a4f', 'B+': '#1a6fa8',
  'B': '#5a7fa8', 'B-': '#7a8fa8', 'C': '#888'
}

// Map evidenceRating values to short grade labels
const gradeMap = {
  'A': 'A',
  'A-': 'A-', 
  'B': 'B',
  'B+': 'B+',
  'B-': 'B-',
  'C': 'C',
  'D': 'D',
  'A - Strong Evidence': 'A',
  'B - Moderate Evidence': 'B',
  'B- - Limited Moderate Evidence': 'B-',
  'B-- - Limited Moderate Evidence': 'B-',
  'C - Preliminary Evidence': 'C',
  'D - No Evidence': 'D',
}

const getShortGrade = (rating) => {
  if (!rating) return '-'
  
  if (gradeMap[rating]) return gradeMap[rating]

  return rating.split(' ')[0]  // fallback
}

const categories = ['All', 'Blood Sugar', 'Insulin Resistance', 'Neuropathy', 'PCOS', 'Weight Management']

export default function ReviewsPage({ reviews }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('updated')

  const filtered = reviews
    .filter(r => activeCategory === 'All' || r.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'name') return (a.productName || '').localeCompare(b.productName || '')
      if (sortBy === 'grade') {
        const order = ['A', 'A-', 'B+', 'B', 'B-', 'C', 'D']
        return order.indexOf(gradeMap[a.evidenceRating] || 'D') - order.indexOf(gradeMap[b.evidenceRating] || 'D')
      }
      return 0 // default: server order (_updatedAt desc)
    })

  return (
    <>
      <Head>
        <title>All Supplement Reviews | GlucoseVerified</title>
        <meta name="description" content="Browse all evidence-based blood sugar supplement reviews, clinically graded A through D." />
      </Head>

      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.navInner}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark}>G</span>
              <span>GlucoseVerified</span>
            </Link>
            <div className={styles.navLinks}>
              <Link href="/reviews" className={styles.navActive}>All Reviews</Link>
              <Link href="/about">About</Link>
              <Link href="/methodology">Our Method</Link>
            </div>
          </div>
        </nav>

        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderInner}>
            <h1>Supplement Reviews</h1>
            <p>Every supplement graded by clinical evidence strength — not marketing claims.</p>
            <div className={styles.headerStats}>
              <span><strong>{reviews.length}</strong> Reviews</span>
              <span><strong>{reviews.reduce((a, r) => a + (r.trialCount || 0), 0)}+</strong> Trials Analyzed</span>
              <span><strong>A–D</strong> Evidence Scale</span>
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.filters}>
            <div className={styles.categoryFilters}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.catBtn} ${activeCategory === cat ? styles.catActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.sortRow}>
              <label>Sort by:</label>
              <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="updated">Recently Updated</option>
                <option value="grade">Best Evidence</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          <div className={styles.resultsCount}>
            Showing {filtered.length} supplement{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          </div>

          <div className={styles.reviewList}>
            {filtered.map((r, i) => {
              const grade = gradeMap[r.evidenceRating] || r.evidenceRating || '—'
              const gradeColor = gradeColors[grade] || '#888'
              return (
                <article key={r.slug || i} className={styles.reviewRow}>
                  <div className={styles.rankNum}>#{i + 1}</div>

                  <div className={styles.gradeBox} style={{ borderColor: gradeColor }}>
                    <div className={styles.gradeVal} style={{ color: gradeColor }}>{grade}</div>
                    <div className={styles.gradeLabel}>Grade</div>
                  </div>

                  <div className={styles.reviewInfo}>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewBrand}>{r.evidenceRating}</span>
                      {r.featured && (
                        <span className={styles.reviewBadge} style={{ background: '#1e5c3a' }}>
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className={styles.reviewName}>
                      <Link href={`/reviews/${r.slug}`}>{r.productName || r.slug}</Link>
                    </h2>
                    <p className={styles.reviewSummary}>{r.summary}</p>
                    <div className={styles.reviewTags}>
                      {r.a1cEffect && (
                        <span className={styles.tag}>A1C: {r.a1cEffect}</span>
                      )}
                      {r.studiedDose && (
                        <span className={styles.tag}>Dose: {r.studiedDose}</span>
                      )}
                      {r.trialCount > 0 && (
                        <span className={styles.trialCount}>{r.trialCount} clinical studies</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.reviewRight}>
                    <div className={styles.scoreCircle} style={{ borderColor: gradeColor }}>
                      <div className={styles.scoreNum} style={{ color: gradeColor }}>{grade}</div>
                      <div className={styles.scoreOf}>grade</div>
                    </div>
                    <div className={styles.reviewActions}>
                      <Link href={`/reviews/${r.slug}`} className={styles.readBtn}>
                        Full Review
                      </Link>
                      {r.affiliateUrl && (
                        <a
                          href={r.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className={styles.buyBtn}
                        >
                          Buy {r.price ? r.price.split(' ')[0] : '→'}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <p>
              <strong>Affiliate Disclosure:</strong> GlucoseVerified earns a commission on purchases
              made through links on this site at no extra cost to you. Rankings are never influenced
              by affiliate relationships. Always consult your physician before starting any supplement.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const reviews = await client.fetch(ALL_REVIEWS_QUERY)
    return {
      props: { reviews: reviews || [] },
      revalidate: 60,
    }
  } catch (err) {
    console.error('Sanity fetch error:', err)
    return { props: { reviews: [] }, revalidate: 60 }
  }
}