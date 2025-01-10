
/**
 *설명          :
 *작성일         : 2024.월.일
 *개발자         : jhd
 *======================================================
 *DATE             AUTHOR               NOTE
 *------------------------------------------------------
 *2024.월.일           jhd             최초 생성 ㅋㅋ
 **/

//현재 일자 변수
let currentDate;

// 현재 월의 첫날 설정 변수
let firstDayOfMonth;
let formattedFirstDay;

// 현재 월의 마지막 날 설정 변수
let lastDayOfMonth;
let formattedLastDay;

//전일, 당일 설정 변수
let yesterDay;
let toDay;

let userlogTable; // DataTable 객체를 전역으로 선언
let selectedRow;
let option  = 'width=950 height=260';


window.addEventListener('load', function () {
    // srhControl();
    mainBtnSetting();
    getDate('');
    checkboxGbn();
    userlogTable = initializeDataTable();  // DataTable 초기화 후 참조

    // 전월, 전일, 당월, 금일 버튼 클릭 이벤트 추가
    document.getElementById('preMonth').addEventListener("click", function() {
        getDate('preMonth');
    });
    document.getElementById('preDay').addEventListener("click", function() {
        getDate('preDay');
    });
    document.getElementById('month').addEventListener("click", function() {
        getDate('month');
    });
    document.getElementById('today').addEventListener("click", function() {
        getDate('today');
    });


});

function initializeDataTable() {
    return new DataTable('#userlogTable', {
        buttons: [{
            extend: 'excel',
            filename: '사용자로그',
            title: '사용자로그',
            customize: function (xlsx) {
                let sheet = xlsx.xl.worksheets['sheet1.xml'];
                $('row:first c', sheet).attr('s', '42');
            }
        }],
        columns: [
            {data: "num", className: 'center'},
            {data: "WorkDate", className: 'left', orderable: false},
            {data: "UserID", className: 'left'},
            {data: "Name", className: 'left', orderable: false},
            {data: "Menu", className: 'left', orderable: false},
            {data: "StartDate", className: 'left', orderable: false },
            {data: "StartTime", className: 'left', orderable: false},
            {data: "EndDate", className: 'left', orderable: false},
            {data: "EndTime", className: 'left', orderable: false},
            {data: "Duration", className: 'left', orderable: false},
            {data: "C", className: 'left', orderable: false},
            {data: "R", className: 'left', orderable: false},
            {data: "U", className: 'left', orderable: false},
            {data: "D", className: 'left', orderable: false}
        ],
        scrollX: true
    });
}

function mainBtnSetting() {
    document.getElementById('btnSearch').addEventListener("click", Search);
}

function getChecked(id) {
    const element = document.getElementById(id);
    if (element) {
        return element.checked;
    }
    return false;  // element가 없으면 false 반환
}

function Search() {
    let param = {
        sCompanyID:'', // 회사 ID 값 가져오기
        chkDate: getChecked('chkDate') ? 1 : 0,
        sFromDate: document.getElementById('inputFromDate').value.split('-').join(''),  // 시작 날짜 값
        sToDate: document.getElementById('inputToDate').value.split('-').join(''),  // 종료 날짜 값
        chkPerson: getChecked('inputPersonSrh') ? 1 : 0,  // 체크된 경우 'Y', 아닌 경우 'N'
        sPerson: document.getElementById('inputPersonName').value  // 사원명 값
    };
    console.log(param);

    loading.visible();

    fetch("/sysMgmt/userlog/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                data.forEach((item, index) => {
                    item['num'] = index + 1; // 순번 추가
                });
                userlogTable.clear().rows.add(data).draw(true);  // DataTable에 데이터 추가
            } else {
                alert("데이터가 없습니다.");
            }
            loading.invisible();
        })
        .catch(error => {
            console.error('에러', error);
            loading.invisible();
        });
}

function getDate(gbn){

    //전월
    if(gbn == 'preMonth'){

        // 현재 날짜를 가져오기
        currentDate = new Date(document.querySelector("#inputFromDate").value);
        // 현재 월의 첫날 설정
        firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 2);
        formattedFirstDay = firstDayOfMonth.toISOString().slice(0, 10);

        // 현재 월의 마지막 날 설정
        lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        formattedLastDay = lastDayOfMonth.toISOString().slice(0, 10);

        document.querySelector("#inputFromDate").value = formattedFirstDay;
        document.querySelector("#inputToDate").value = formattedLastDay;

    }
    //전일
    else if(gbn == 'preDay'){
        //sDate기준으로 전일 처리 (기준점이 있어야 전일을 계속 클릭시 일자가 수정됨)
        currentDate = new Date(document.querySelector("#inputFromDate").value);

        //현재 날짜로 초기화
        yesterDay =  new Date(currentDate);

        //어제 날짜 가져오기
        yesterDay.setDate(currentDate.getDate() - 1);

        //타입 수정
        yesterDay = yesterDay.toISOString().slice(0, 10);

        // 결과를 HTML에 표시
        document.querySelector("#inputFromDate").value = yesterDay;
        document.querySelector("#inputToDate").value = yesterDay;
    }
    //당월
    else if(gbn == 'month'){

        // 현재 날짜를 가져오기
        currentDate = new Date();

        // 현재 월의 첫날 설정
        firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
        formattedFirstDay = firstDayOfMonth.toISOString().slice(0, 10);

        // 현재 월의 마지막 날 설정
        lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        formattedLastDay = lastDayOfMonth.toISOString().slice(0, 10);

        // 결과를 HTML에 표시
        document.querySelector("#inputFromDate").value = formattedFirstDay;
        document.querySelector("#inputToDate").value = formattedLastDay;

    }
    //금일
    else if(gbn == 'today'){

        // 현재 날짜를 가져오기
        currentDate = new Date();

        //타입 수정
        toDay = currentDate.toISOString().slice(0, 10);

        // 결과를 HTML에 표시
        document.querySelector("#inputFromDate").value = toDay;
        document.querySelector("#inputToDate").value = toDay;

    }
    //로드시 기본 일자 가져오기
    else{

        // 현재 날짜를 가져오기
        currentDate = new Date();

        // 현재 월의 첫날 설정
        firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
        formattedFirstDay = firstDayOfMonth.toISOString().slice(0, 10);

        // 현재 월의 마지막 날 설정
        lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        formattedLastDay = lastDayOfMonth.toISOString().slice(0, 10);

        // 결과를 HTML에 표시
        document.querySelector("#inputFromDate").value = formattedFirstDay;
        document.querySelector("#inputToDate").value = formattedLastDay;

    }


}



function checkboxGbn(){

    // chkDate 체크박스
    let chkDate = document.querySelector("#chkDate");
    let inputFromDate = document.querySelector("#inputFromDate");
    let inputToDate = document.querySelector("#inputToDate");

    // inputPersonSrh 체크박스
    let chkPerson = document.querySelector("#inputPersonSrh");
    let inputPersonName = document.querySelector("#inputPersonName");

    // chkDate 체크박스 상태에 따라 날짜 입력 필드를 활성화/비활성화
    chkDate.addEventListener('change', function() {
        if (this.checked) {
            inputFromDate.disabled = false;
            inputToDate.disabled = false;
        } else {
            inputFromDate.disabled = true;
            inputToDate.disabled = true;
        }
    });

    // inputPersonSrh 체크박스 상태에 따라 사원명 입력 필드를 활성화/비활성화
    chkPerson.addEventListener('change', function() {
        if (this.checked) {
            inputPersonName.disabled = false;
        } else {
            inputPersonName.disabled = true;
        }
    });

    // 페이지 로드 시 기본적으로 chkDate와 inputPersonSrh 상태에 맞게 처리
    if (chkDate.checked) {
        inputFromDate.disabled = false;
        inputToDate.disabled = false;
    } else {
        inputFromDate.disabled = true;
        inputToDate.disabled = true;
    }

    if (chkPerson.checked) {
        inputPersonName.disabled = false;
    } else {
        inputPersonName.disabled = true;
    }


}




// function srhControl(){
//     document.querySelectorAll('tr.v-middle').forEach(row => {
//
//         const cells = row.querySelectorAll('td');
//         cells.forEach(cell => {
//             const checkbox = cell.querySelector('input[type="checkbox"]');
//             if (checkbox) {
//                 const nextCell = cell.nextElementSibling;
//                 if (nextCell) {
//                     const inputField = nextCell.querySelector('input[type="text"], select.form-control');
//                     if (inputField) {
//                         inputField.disabled = !checkbox.checked;
//                         checkbox.addEventListener('change', function() {
//                             inputField.disabled = !this.checked;
//
//                             if (!inputField.disabled && inputField.type === 'text') {
//                                 inputField.focus()
//                             }
//                         });
//                     }
//                 }
//             }
//         });
//     });
// }
//
