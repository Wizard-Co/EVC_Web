const loginBtnElem = document.querySelector('#loginBtn');
const loginFormElem = document.querySelector('#loginForm');
const UserIDElem = document.querySelector('#userID');
const passwordElem = document.querySelector('#password');

// 정규식
let chkPw = /(?=.*[~`!@#$%\^&*()-+=]{2,50}).{8,50}$/;

function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
window.addEventListener('DOMContentLoaded',function () {

    // URL에서 userID와 password 값을 가져오기
    const userID = getQueryParameter("userID");
    const password = getQueryParameter("password");

    // 콘솔에 userID와 password 값을 출력하여 확인
    console.log(`userID from URL: ${userID}`);
    console.log(`password from URL: ${password}`);

    // userID와 password가 URL에 있다면 폼에 채우기
    if (userID && password) {
        UserIDElem.value = userID;
        passwordElem.value = password;

        document.getElementById("loginBtn").click();

    } else {
        console.error("userID or password missing in URL parameters.");
    }
})

// 세션, 쿠키 아이디 저장
$(document).ready(function () {
    if (sessionStorage.length !== 0) {
        sessionStorage.clear();
        console.log(sessionStorage.length);
    }


    // 로그아웃 처리
    document.getElementById("logoutBtn").addEventListener("click", function () {
        console.log("로그아웃 버튼이 클릭되었습니다.");

        // 로그아웃을 위한 POST 요청을 보냄
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/login";
                } else {
                    alert("로그아웃 중 오류가 발생했습니다.");
                }
            })
            .catch(error => {
                console.error("로그아웃 요청 실패:", error);
                alert("로그아웃 중 문제가 발생했습니다.");
            });
    });

    // 쿠키에서 userID와 password 값을 가져옴
    const UserID = getCookie("userID");
    const password = getCookie("password");
    $("input[name='userID']").val(UserID);
    $("input[name='password']").val(password);

    if ($("input[name='userID']").val() !== "" && $("input[name='password']").val() !== "") {
        $("#saveIdChk").attr("checked", true);
        if ($("#saveIdChk").is(":checked")) {
            loginProc();
        }
    }

    $("#saveIdChk").change(function () {
        if ($("#saveIdChk").is(":checked")) {
            const UserID = $("input[name='userID']").val();
            const password = $("input[name='password']").val();
            setCookie("userID", UserID, 365);
            setCookie("password", password, 365);
        } else {
            deleteCookie("userID");
            deleteCookie("password");
        }
    });

    $("input[name='userID']").keyup(function () {
        if ($("#saveIdChk").is(":checked")) {
            const UserID = $("input[name='userID']").val();
            setCookie("userID", UserID, 365);
        }
    });

    $("input[name='password']").keyup(function () {
        if ($("#saveIdChk").is(":checked")) {
            const password = $("input[name='password']").val();
            setCookie("password", password, 365);
        }
    });
});

// 로그인 실패 횟수를 추적하고 메시지 표시
function loginProc(e) {
    const currentID = document.loginForm.userID.value;
    const password = document.loginForm.password.value;

    // 로그인 정보가 비어있으면 처리
    if (!currentID || !password) {
        alert("아이디와 비밀번호를 입력해 주세요.");
        e.preventDefault(); // 기본 동작(폼 제출) 막기
        return;
    }

    // 로그인 시도
    fetch('/sysMgmt/userLogin/Login', {
        method: 'POST',
        body: new URLSearchParams({
            userID: currentID,
            password: password
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            console.log('Response Status:', response.status); // 응답 상태 출력
            if (!response.ok) {
                return Promise.reject('Failed to login'); // 응답이 성공적이지 않으면 예외 발생
            }
            return response.json();
        })
        .then(result => {
            console.log('Login success', result);
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl; // 리디렉션
            }
        })
        .catch(error => {
            console.error('Login failed:', error); // 에러 출력
        });
}

// 로그인 버튼 클릭 시 로그인 처리
loginBtnElem.addEventListener('click', (e) => {
    loginProc(e);
});

// 엔터 키로 로그인 처리
loginFormElem.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) { // Enter 키가 눌렸을 때
        loginProc(e);
    }
});