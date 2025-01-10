/**
 작성자:    최대현
 작성일:    2024-11-22
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 * 2024.11.21  최대현      최대현, xp_Info_GetCompanyInfo 웹버전으로 만들면서 프로시저 파라미터 및 조건 수정했습니다.
 *                               이전 파라미터 프로시저 내 주석처리하여 따로 표기했습니다.
 **/


let form = document.getElementById('addForm');
let companyID, kCompany;

window.addEventListener('load', function() {
    companyID = document.getElementById('companyID').value;
    kCompany = document.getElementById('kCompany').value
    mainBtnSetting();

});

//버튼세팅
function mainBtnSetting(){
    document.getElementById('btnClose').addEventListener('click',()=>{window.close()})
    document.getElementById('btnSave').addEventListener('click',save)
    document.getElementById('btnUpdate').addEventListener('click',save)
    document.getElementById('btnDelete').addEventListener('click', ()=>deleteCompanyDetail(companyID,kCompany))
    document.getElementById('btnReset').addEventListener('click',inputTextReset)
    document.getElementById('postBtn').addEventListener('click', execPostCode);
}

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
function save(event) {
    //이메일 형식 검증
    if (!checkEmail()) {
        return;
    }
    //대표전화, 일반전화 중 하나라도 있을 것
    if(!validatePhone()){
        return;
    }

    if (form.checkValidity()) {
        const payload = new FormData(form);

        fetch('/sysMgmt/company/save', {
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
function deleteCompanyDetail(companyID, kCompany){
    const userConfirm = confirm("자사업체(상호명) : "+ kCompany+ "를 삭제하시겠습니까?")
    if(userConfirm){
        if (companyID) {
            fetch('/sysMgmt/company/delete', {
                method : "POST",
                body : companyID
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
                    else{
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                })
                .catch(error => console.log('Unexpected error: ', error))
        }
    }
}

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

//사업자등록번호 자동 하이픈
function setCustomnoHyphen() {
    let input = document.getElementById('companyNo');
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


//전화번호 확인
function validatePhone() {
    const phone1 = document.getElementById('phone1');
    const phone2 = document.getElementById('phone2');

    if (!phone1.value.trim() && !phone2.value.trim()) {
        phone1.classList.add('is-invalid');
        phone2.classList.add('is-invalid');
        alert("전화번호 하나는 입력하셔야 합니다.")
        return false;
    }

    phone1.classList.remove('is-invalid');
    phone2.classList.remove('is-invalid');
    return true;
}

function inputTextReset(){
    const userConfirm = confirm('작성중인 내용을 초기화 하시겠습니까?')
    if(userConfirm){
        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {if(input.id !== 'companyID') input.value = ''});
    }
}


function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
});
