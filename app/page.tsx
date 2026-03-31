import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // test_messages 테이블에서 데이터 읽기
  const { data, error } = await supabase
    .from('test_messages')
    .select('*')

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🔮 사주명리학 웹서비스</h1>
      <h2>Supabase 연동 테스트</h2>

      {error ? (
        <p style={{ color: 'red' }}>❌ 에러: {error.message}</p>
      ) : (
        <div>
          <p style={{ color: 'green' }}>✅ 연동 성공!</p>
          <p>데이터 {data?.length}건:</p>
          <ul>
            {data?.map((row: any) => (
              <li key={row.id}>{row.text}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}