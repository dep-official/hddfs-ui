// 고유 ID 생성 함수
const generateId = (prefix = 'uid') => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${prefix}_${timestamp}_${random}`
}

