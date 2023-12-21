// 프론트엔드 코드 예시
const apiUrl = 'https://magomarket-back.vercel.app/';  // 백엔드 주소로 변경

// Axios를 사용하여 백엔드 API 호출
axios.get(`${apiUrl}/data`)
  .then(response => {
    console.log('백엔드에서 받은 데이터:', response.data);
  })
  .catch(error => {
    console.error('에러:', error);
  });
