/**
 작성자:    최대현
 작성일:    2024-11-25
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/


let year, customID, kCustom;

let form = document.getElementById('addForm');
const currentUrl = new URLSearchParams(window.location.search);
// let inputRegYear = document.getElementById('inputRegYear');

window.addEventListener('load', function() {
    // document.getElementById('btnRegYearUpdate').style.display = 'none'
    // if(currentUrl.get('mode') === 'add'){
    //     document.getElementById('cboRegYear').value = new Date().getFullYear();
    // }
    customID = document.getElementById('customID').value;
    kCustom = document.getElementById('kCustom').value;

    if(currentUrl.get('mode') === 'add'){

        const btnSave=  document.getElementById('btnSave');


        btnSave.style.display = 'inline-block';
    }
    else{
        const btnUpdate = document.getElementById('btnUpdate');
        const btnDelete =document.getElementById('btnDelete');

        btnUpdate.style.display = 'inline-block';
        btnDelete.style.display = 'inline-block'
    }

    mainBtnSetting();
});


//버튼세팅
function mainBtnSetting(){
    document.getElementById('btnClose').addEventListener('click',()=>{window.close()})
    document.getElementById('postBtn').addEventListener('click', execPostCode);
    document.getElementById('btnSave').addEventListener('click',()=>save("I"))
    document.getElementById('btnUpdate').addEventListener('click',()=>save("U"))
    document.getElementById('btnReset').addEventListener('click', inputTextReset)
    // document.getElementById('btnRegYearModify').addEventListener('click',modifyRegYear)
    // document.getElementById('btnRegYearUpdate').addEventListener('click',updateRegYear)
    document.getElementById('btnDelete').addEventListener('click', ()=>deleteCustomDetail(customID,kCustom))

}


// document.getElementById('inputRegYear').addEventListener('focus',function (){
//     year = document.getElementById('inputRegYear').value
// },{once:true})


//등록연도 수정시 사용 키제어
// window.addEventListener('keydown', function(e) {
//     if (document.activeElement === inputRegYear) {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             updateRegYear();
//         }
//         else if (e.key === 'Escape') {
//             e.preventDefault();
//             modifyRegYear();
//             const select = document.getElementById('cboRegYear');
//             select.value = year.toString();
//         }
//     }
//     else if(e.key === 'Enter'){
//         e.preventDefault();
//     }
// }, true);


//다음 주소 API
function loadDaumPostcodeScript(callback) {
    if (window.daum) {
        callback();
        return;
    }

    //주소찾기 스크립트가 안 만들어졌을 때 만듦
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = callback;
    document.head.appendChild(script);
}

//주소찾기 API
function execPostCode() {
    loadDaumPostcodeScript(function() {
        new daum.Postcode({
            oncomplete: function(data) {
                let address1;
                let address2;

                let addressJiBun1;
                let addressJiBun2;

                document.getElementById('zipcode').value = data.zonecode;
                address1 = document.getElementById('address1')
                address2 = document.getElementById('address2')

                addressJiBun1 =document.getElementById('addressJiBun1')
                addressJiBun2= document.getElementById('addressJiBun2')

                address1.value = data.roadAddress;
                address2.value = data.buildingName;

                addressJiBun1.value = data.jibunAddress;
                addressJiBun2.value = data.buildingName;

                if(address1.value !== "" && addressJiBun1.value !== ""){
                    address2.readOnly = false;
                    addressJiBun2.readOnly = false;

                    address2.classList.remove('pt-e-none')
                    addressJiBun2.classList.remove('pt-e-none')
                }

            }
        }).open();
    });
}

//저장
function save(strFlag) {
    //이메일 형식 검증
    if (!checkEmail()) {
        return;
    }
    //대표전화, 일반전화 중 하나라도 있을 것
    // if(!validatePhone()){
    //     return;
    // }
    //사업자번호 검증
    // if(!validateCustomNo()){
    //     return;
    // }

    if (form.checkValidity()) {
        const payload = new FormData(form);

        const useYN = document.getElementById('useYN');
        payload.set('useYN', useYN.checked ? 'N' : 'Y');

        const baseUrl = strFlag === "I" ? "/baseMgmt/custom/save" : "/baseMgmt/custom/update"


        fetch(baseUrl, {
            method: 'post',
            body: payload,
        })
            .then(res => {
                if (!res.ok) {
                    console.log('http error: ', res);
                    throw new Error('저장 실패');
                }
                alert("저장 되었습니다.");
            })
            .then(() => {
                if (opener && !opener.closed) {
                    opener.search();
                }
                window.close(); // 현재 창 닫기
            })
            .catch(error => {
                console.log('Unexpected error: ', error);
                alert('저장 중 오류가 발생했습니다.');
            });
    }
}

//삭제
function deleteCustomDetail(customID, kCustom){
    if(!customID || customID.trim() === ''){
        alert('삭제하실 항목을 선택해주세요')
        return;
    }

    const userConfirm = confirm("거래처 : "+ kCustom+ "를 삭제하시겠습니까?")
    if(userConfirm){
        if (customID) {
            fetch('/baseMgmt/custom/delete', {
                method : "POST",
                body : customID
            })
                .then(res => {
                    if (!res.ok) console.log('http error: ', res)
                    return res.text();
                })
                .then(responseMessage => {
                    alert(responseMessage);
                    if (responseMessage.includes("삭제 되었습니다.")) {
                        window.open('', '_self').close();
                        opener.search();
                    }
                })
                .catch(error => console.log('Unexpected error: ', error))
        }
    }
}

//사업자등록번호 자동 하이픈
function setCustomnoHyphen() {
    let input = document.getElementById('customNo');
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 10);

    let formatted = '';
    for(let i = 0; i < value.length; i++) {
        if(i === 3) formatted += '-';
        if(i === 5) formatted += '-';
        formatted += value[i];
    }
    input.value = formatted;
}

//숫자, 하이픈, 점, 괄호 정규식
function numericalType(id) {
    let input = document.getElementById(id);
    input.value = input.value.replace(/[^0-9-.()]/g, '')
}



//등록연도 버튼 hidden/visible
function modifyRegYear() {
    const select = document.getElementById('cboRegYear');
    const input = document.getElementById('inputRegYear');
    const updateBtn = document.getElementById('btnRegYearUpdate');
    const modifyBtn = document.getElementById('btnRegYearModify');

    if(updateBtn.style.display === 'none'){
        updateBtn.style.display = 'inline-block'
        input.style.display = 'inline-block'
        select.style.display = 'none'
        modifyBtn.style.display = 'none'
        select.classList.remove('display-inline-block')
        year = select.value;
        input.value = select.value
        input.select();
        input.focus();
    }else{
        updateBtn.style.display = 'none'
        input.style.display = 'none'
        select.style.display = 'inline-block'
        modifyBtn.style.display = 'inline-block'
        select.classList.add('display-inline-block')
    }
}

//등록연도 직접 수정(목록에 없을 경우)
// function updateRegYear() {
//     const select = document.getElementById('cboRegYear');
//     const input = document.getElementById('inputRegYear');
//     const modifyBtn = document.getElementById('btnRegYearModify');
//     const updateBtn = document.getElementById('btnRegYearUpdate');
//
//     const inputYear = parseInt(input.value);
//     const currentYear = new Date().getFullYear();
//
//     // 입력값 검증
//     if (isNaN(inputYear)) {
//         alert('올바른 숫자를 입력해주세요.');
//         input.value = year.toString();
//         input.select();
//         input.focus();
//         return;
//     }
//     if (inputYear < 1000 || inputYear > 9999) {
//         alert('년도는 4자리 숫자로 입력해주세요.');
//         input.value = year.toString();
//         input.select();
//         input.focus();
//         return;
//     }
//     if (Math.abs(currentYear - inputYear) > 100) {
//         alert('현재연도와 입력연도 기간차이가 너무 큽니다.');
//         input.value = year.toString();
//         input.select();
//         input.focus();
//         return;
//     }
//
//     // select에 해당 년도가 없는 경우 새로운 option 추가
//     if (!Array.from(select.options).some(option => option.value === inputYear.toString())) {
//         const newOption = new Option(inputYear.toString(), inputYear.toString());
//         select.add(newOption);
//     }
//
//     // 모든 검증을 통과하면 select 업데이트
//     select.style.display = 'inline';
//     input.style.display = 'none';
//     select.value = inputYear.toString();
//     modifyBtn.style.display = 'inline';
//     updateBtn.style.display = 'none';
//
// }


//이메일 형식 확인
function checkEmail() {
    const emailInput = document.getElementById('eMail');
    const emailError = document.getElementById('emailError');

    // 이메일이 비어있으면 true 반환 (선택 입력인 경우)
    if (!emailInput.value) {
        emailError.style.display = 'none';
        return true;
    }

    // 이메일 유효성 검사
    if (isValidEmail(emailInput.value)) {
        emailError.style.display = 'none';
        return true;
    } else {
        emailError.style.display = 'block';
        emailInput.classList.add('is-invalid');
        emailInput.classList.remove('is-valid');
        alert("올바른 이메일 주소가 아닙니다.")
        return false;  // 유효하지 않은 경우 false 반환
    }
}

//전화번호 확인
function validatePhone() {
    const repPhone = document.getElementById('repPhone');
    const phone = document.getElementById('phone');

    if (!repPhone.value.trim() && !phone.value.trim()) {
        repPhone.classList.add('is-invalid');
        phone.classList.add('is-invalid');
        alert("전화번호 하나는 입력하셔야 합니다.")
        return false;
    }

    repPhone.classList.remove('is-invalid');
    phone.classList.remove('is-invalid');
    return true;
}

//사업자번호
function validateCustomNo(){
    const customNo =document.getElementById('customNo');
    //하이픈 포함
    if(customNo.value.length < 12){
        alert("올바른 사업자 번호가 아닙니다.")
        return false;
    }

    return true;
}


//유효 이메일
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

function inputTextReset(){
    const userConfirm = confirm('작성중인 내용을 초기화 하시겠습니까?')
    if(userConfirm){
        const inputs = document.querySelectorAll('input[type="text"]');
        const textAreas = document.querySelectorAll('textarea')
        inputs.forEach(input => {if(input.id !== 'customID') input.value = ''});
        textAreas.forEach(textarea => textarea.value = '')
    }
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
});





