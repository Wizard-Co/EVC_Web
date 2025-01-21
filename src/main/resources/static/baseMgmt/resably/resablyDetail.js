let form = document.getElementById('addForm');

form.addEventListener('submit', (e) =>{
    e.preventDefault();
});

document.getElementById('btnSave').addEventListener('click', function () {

    if (form.checkValidity()) {
        const payload = new FormData(form);

        console.log('뜨냐', payload);
        fetch('/baseMgmt/resably/save', {
            method: 'post',
            body: payload,
            headers: {},
        })
            .then(res => {
                if (!res.ok) console.log('http error: ', res)
            })
            .then(() => {
                window.open('', '_self').close();
                opener.Search();
            })
            .catch(error => console.log('Unexpected error: ', error));
    }
});
//     const form = document.getElementById('addForm');
//     if (form.checkValidity()) { // 폼이 유효한지 확인
//         const payload = new FormData(form);
//         fetch('/baseMgmt/resably/save', {
//             method: 'POST',
//             body: payload
//         })
//             .then(res => {
//                 if (!res.ok) {
//                     console.log('HTTP 오류:', res);
//                     throw new Error('서버 오류');
//                 }
//                 return res.text(); // 먼저 텍스트로 응답을 받음
//             })
//             .then(data => {
//                 if (!data) {
//                     console.log(data);
//                     console.error('서버에서 빈 응답을 받았습니다.');
//                     alert('서버 응답이 없습니다.');
//                     return;
//                 }
//                 try {
//                     const jsonData = JSON.parse(data); // 텍스트를 JSON으로 파싱
//                     console.log('서버 응답:', jsonData);
//                     // JSON 응답에 따른 후속 처리
//                     window.open('', '_self').close();
//                     opener.Search(); // 부모 창에서 Search 함수 호출
//                 } catch (e) {
//                     console.error('JSON 파싱 오류:', e);
//                     alert('서버에서 올바른 데이터를 받지 못했습니다.');
//                 }
//             })
//             .catch(error => {
//                 console.log('예상치 못한 오류:', error);
//                 alert('저장 중 오류가 발생했습니다.');
//             });
//     } else {
//         console.log('폼이 유효하지 않습니다.');
//     }
// });

document.getElementById('btnClose').addEventListener('click', function () {
    window.open('', '_self').close();
});

document.getElementById('btnUpdate').addEventListener('click',function () {
    if (form.checkValidity())
    {
        const payload=new FormData(form);
        const result = document.querySelector('.form-result')

        fetch('/baseMgmt/resably/update',{
            method:'post',
            body: payload,
            headers:{},
        })
            .then(res=>{
                if (!res.ok){
                    return res.text().then(err=>{
                        throw  new  Error(err)
                    });
                }
            })
            .then(()=>{
                alert("저장이 완료 되었습니다.")
                // result.innerHTML = '저장이 완료되었습니다.';
                refreshForm();
                opener.Search();
            })
            .catch(error=>{
                console.dir(error);
                result.innerHTML = `저장에 실패하였습니다. 오류 발생: ${error.message}`
            });
    }

})

