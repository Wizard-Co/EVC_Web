let form = document.getElementById('addForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

document.getElementById('btnSave').addEventListener('click', function () {

    if (form.checkValidity()) {
        const payload = new FormData(form);

        fetch('/baseMgmt/depart/save', {
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

document.getElementById('btnClose').addEventListener('click', function () {
    window.open('', '_self').close();
});

 document.getElementById('btnUpdate').addEventListener('click',function () {
     if (form.checkValidity())
     {
         const payload=new FormData(form);
         const result = document.querySelector('.form-result')

         fetch('/baseMgmt/depart/update',{
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

