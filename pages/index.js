export const getServerSideProps = async () => {
  return { props: {} }
}



export default function Home() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: 800, margin: '60px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#1a3c2e' }}>GlucoseVerified</h1>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        Evidence-based blood sugar supplement reviews — clinically graded, unbiased.
      </p>
      <a href="/reviews" style={{ color: '#2d7a4f', fontWeight: 'bold' }}>
        Browse All Reviews →
      </a>
    </main>
  )
}