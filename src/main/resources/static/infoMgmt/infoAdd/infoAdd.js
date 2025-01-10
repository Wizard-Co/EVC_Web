/*
설명: 공지사항 추가 js 파일
작성일: 2024.10.08
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

*/

//TODO 엑셀
//TODO toastr 전역변수 처리

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

/*선택한 행 변수*/
let selectedRow;

//전월, 당월 클릭 이벤트
document.querySelector("#preMonth").addEventListener("click", function() {getDate("preMonth")}); //전월
document.querySelector("#month").addEventListener("click", function() {getDate("month")});  //당월
document.querySelector("#preDay").addEventListener("click", function() {getDate("preDay")});  //전일
document.querySelector("#today").addEventListener("click", function() {getDate("today")});  //금일

/*행 클릭시 행 데이터 가져오기*/
$('#infoTable').on('click', 'tr', function () {
    infoTable.$('tr.selected').removeClass('selected');
    $(this).addClass('selected');
    selectedRow = infoTable.row(this).data();
})

/*행 더블 클릭시 상세 화면*/
$('#infoTable').on('dblclick', 'tr', function () {
    let param = {
        infoID: selectedRow.infoID,
        userID: 'admin',
        companyID: ''
    }

    openForm('infoAddDetail', '/infoMgmt/infoAdd/update?mode=update', param, '');
})

//조회 클릭 이벤트
document.querySelector("#btnSearch").addEventListener("click", function() {search()});  //조회

/*등록 클릭 이벤트*/
document.getElementById('btnAdd').addEventListener('click', function () {

    let param = {
        userID: 'admin',
        companyID: ''
    }

    openForm('infoAddDetail', '/infoMgmt/infoAdd/add?mode=add', param, '');
})

/*상세 클릭 이벤트*/
document.getElementById('btnDetail').addEventListener('click', function () {
    //선택한 행이 없는 경우 메세지창
    if(infoTable.rows(".selected").data().length == 0){
        alert('선택한 데이터가 없습니다. \r\n데이터를 선택한 후에 진행 해주세요.');
    }
    else{
        let param = {
            infoID: selectedRow.infoID,
            userID: 'admin',
            companyID: ''
        }
        openForm('infoAddDetail', '/infoMgmt/infoAdd/update?mode=update', param, '');
    }

})

/*삭제 클릭 이벤트*/
document.getElementById('btnDelete').addEventListener('click', function () {
    //선택한 행이 없는 경우 메세지창
    if(infoTable.rows(".selected").data().length == 0){
        alert('선택한 데이터가 없습니다. \r\n데이터를 선택한 후에 진행 해주세요.');
    }
    else{
        let baseUrl = '/infoMgmt/infoAdd/delete';
        let param = new URLSearchParams({
            infoID: selectedRow.infoID
        });
        let urlWithParam = `${baseUrl}?${param}`

        fetch(urlWithParam)
            .then(response => {
                if (!response.ok) {
                    console.log('http error: ', response);
                    throw new Error('http error: ', res);
                }
            })
            .then(() => {
                toastr.success("데이터가 성공적으로 삭제되었습니다.",'삭제',{ onHidden : function(){ search();}// 성공 알림이 사라진 후 호출
                                                                });

            })
            .catch(error =>{
                                //console.log('Unexpected error: ', error)
                                toastr.error("에러 발생","에러");
                           }
            );
    }

})

/*엑셀 이벤트*/
document.getElementById('btnExcel').addEventListener('click', function () {
                                                                            let dataheader = [];    //테이블 헤더
                                                                            let datalst = [];       //테이블 데이터

                                                                            let rn;                 //순번 데이터
                                                                            let infoID;             //공지사항 번호 데이터
                                                                            let allYNName;          //구분(전체, 개별) 데이터
                                                                            let fromDate;           //시작일 데이터
                                                                            let toDate;             //종료일 데이터
                                                                            let info;               //공지사항 데이터
                                                                            let personName;         //공지대상자 데이터
                                                                            let attachFile;         //첨부문서 데이터
                                                                            let hitCount;           //조회수 데이터
                                                                            let createUser;         //작성자 데이터
                                                                            let createDate;         //작성일자 데이터

                                                                            $('#infoTable thead th').each(function() {
                                                                                dataheader.push($(this).text()); // 헤더의 텍스트 값 가져오기
                                                                            });

                                                                            infoTable.rows().every(function (rowIdx) {
                                                                                let data = this.data();
                                                                                //엑셀 다운로드 공통으로 사용하기 위해 조회시 보이는 데이터만 가져감
                                                                                rn = data["rn"];                        //순번 데이터
                                                                                infoID = data["infoID"];                //공지사항 번호 데이터
                                                                                allYNName = data["allYNName"];          //구분(전체, 개별) 데이터
                                                                                fromDate = data["fromDate"];            //시작일 데이터
                                                                                toDate = data["toDate"];                //종료일 데이터
                                                                                info = data["info"];                    //공지사항 데이터
                                                                                personName = data["personName"];        //공지대상자 데이터
                                                                                attachFile = data["attachFile"];        //첨부문서 데이터
                                                                                hitCount = data["hitCount"];            //조회수 데이터
                                                                                createUser = data["createUser"];        //작성자 데이터
                                                                                createDate = data["createDate"];        //작성일자 데이터
                                                                                //필요한 데이터만 가져오기
                                                                                datalst.push({rn, infoID, allYNName, fromDate, toDate, info, personName, attachFile, hitCount, createUser, createDate});

                                                                            })

                                                                             if(datalst.length < 1){
                                                                                 alert("조회 된 데이터가 없습니다");
                                                                                 return;
                                                                             } else {
                                                                                fetch("/infoMgmt/infoAdd/excel", {
                                                                                    method: "POST",
                                                                                    body: JSON.stringify({headers: dataheader, data: datalst}),
                                                                                    headers: {
                                                                                        'Content-Type': 'application/json'
                                                                                    }
                                                                                })
                                                                                .then(response => response.blob())  // 서버에서 파일을 Blob 형식으로 받음
                                                                                .then(blob => {
                                                                                      // Blob 데이터를 이용해 파일 다운로드
                                                                                      var link = document.createElement('a');
                                                                                      link.href = URL.createObjectURL(blob);
                                                                                      link.download = 'infoAdd.xlsx';
                                                                                      link.click();
                                                                                })
                                                                                .catch(error => {
                                                                                    console.error('엑셀 내보내기 실패:', error);
                                                                                });
                                                                             }
})

/*로드 이벤트*/
$(document).ready(function() {formLoad();
                              window.scrollTo(0, 0);
                              //toastr 옵션 설정
                              toastr.options = {
                                    closeButton: true,
                                    progressBar: true,
                                    showMethod: 'slideDown',
                                    timeOut: 2000,
                                    positionClass: "toast-top-center",
                              };
                             });

/*웹 상단 X표시로 닫을 경우 이벤트*/
window.addEventListener('beforeunload', function (event) {
                                                            navigator.sendBeacon("/pages/infoMgmt/infoAdd/infoAdd/close")
                                                         });

/*화면 로드 함수*/
function formLoad(){
    //기간 설정
    getDate('');

    //기본 공지일자 선택, 기본 전체 선택
    checkboxGbn();

    //검색
    search();

}

/*일자 가져오기*/
function getDate(gbn){

        //전월
        if(gbn == 'preMonth'){

            // 현재 날짜를 가져오기
            currentDate = new Date(document.querySelector("#inputSDateSearch").value);
            // 현재 월의 첫날 설정
            firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 2);
            formattedFirstDay = firstDayOfMonth.toISOString().slice(0, 10);

            // 현재 월의 마지막 날 설정
            lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            formattedLastDay = lastDayOfMonth.toISOString().slice(0, 10);

            document.querySelector("#inputSDateSearch").value = formattedFirstDay;
            document.querySelector("#inputEDateSearch").value = formattedLastDay;

        }
        //전일
        else if(gbn == 'preDay'){
            //sDate기준으로 전일 처리 (기준점이 있어야 전일을 계속 클릭시 일자가 수정됨)
            currentDate = new Date(document.querySelector("#inputSDateSearch").value);

            //현재 날짜로 초기화
            yesterDay =  new Date(currentDate);

            //어제 날짜 가져오기
            yesterDay.setDate(currentDate.getDate() - 1);

            //타입 수정
            yesterDay = yesterDay.toISOString().slice(0, 10);

            // 결과를 HTML에 표시
            document.querySelector("#inputSDateSearch").value = yesterDay;
            document.querySelector("#inputEDateSearch").value = yesterDay;
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
            document.querySelector("#inputSDateSearch").value = formattedFirstDay;
            document.querySelector("#inputEDateSearch").value = formattedLastDay;

        }
        //금일
        else if(gbn == 'today'){

            // 현재 날짜를 가져오기
            currentDate = new Date();

            //타입 수정
            toDay = currentDate.toISOString().slice(0, 10);

            // 결과를 HTML에 표시
            document.querySelector("#inputSDateSearch").value = toDay;
            document.querySelector("#inputEDateSearch").value = toDay;

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
            document.querySelector("#inputSDateSearch").value = formattedFirstDay;
            document.querySelector("#inputEDateSearch").value = formattedLastDay;

        }


}

/*로드시 전체 자동 체크표시*/
function checkboxGbn(){

    let chkDate = document.querySelector("#chkDate");
    let chkAll = document.querySelector("#chkAllGbn");
    let chkPerson = document.querySelector("#chkPersonGbn");
    chkDate.checked = true;
    chkAll.checked = true;
    chkPerson.checked = false;
}

/*조회 함수*/
function search() {

    //검색시 일자 조건 추가
    if(getChecked('chkDate') == true){
        if(document.querySelector("#inputSDateSearch").value.split('-').join('') > document.querySelector("#inputEDateSearch").value.split('-').join('')){
            message = '공지기간을 확인해주세요.';
            alert(message);
            return;
        }
    }

    //전체 개별 구분자 처리
    let allGbn = ''
    //전체 하나만 체크
    if(getChecked('chkAllGbn') == true && getChecked('chkPersonGbn') == false){
        allGbn = 'Y';
    }
    //개별 하나만 체크
    else if(getChecked('chkPersonGbn') == true && getChecked('chkAllGbn') == false){
        allGbn = 'N';
    }
    //2개다 체크, 2개다 체크 안함
    else{
        allGbn = '';
    }

    let param = {
                 sDate: getChecked('chkDate') == true && nullCheck("#inputSDateSearch").Trim != ' ' ? document.querySelector("#inputSDateSearch").value.split('-').join('') : '00000000',      /*시작일*/
                 eDate: getChecked('chkDate') == true && nullCheck("#inputEDateSearch").Trim != ' ' ? document.querySelector("#inputEDateSearch").value.split('-').join('') : '99999999',       /*종료일*/
                 allGbn: allGbn,            /*구분*/
    }

    loading.visible();
    fetch("/infoMgmt/infoAdd/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
                        if(!response.ok){
                            return response.json().then(errorData => {
                            throw new Error(`Error: ${errorData.userMessage}`)});
                        }
                        return response.json();
    })
    .then((data) => {
        infoTable.clear().rows.add(data).draw();
        loading.invisible();
        }
    )
    .catch(error => {
        loading.invisible();
        console.error('Error occurred:', error.message);
        toastr.error(`${error.message}`);

    });
}

/*NULLCheck처리 함수*/
function nullCheck(ID) {
    let id = document.getElementById(ID);
    if (id && id.value !== null && id.value !== undefined) {
        return id.value;
    } else {
        return '';
    }
}

/*공지사항 메인 테이블*/
const infoTable = $('#infoTable').DataTable({
    select: true,
    dom: '<"d-none"B><"mb-2 right"f>t<"mt-2 center"p>',
    buttons: [{
        extend: 'excel',
        filename: "공지사항등록",
        title: "공지사항등록",
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    language: {
        lengthMenu: "페이지당 _MENU_ 개의 목록 표시",
        search: "통합 검색:",
        zeroRecords: "검색된 항목이 없습니다.",
        info: "_PAGES_ / _PAGE_ 페이지",
        infoEmpty: "검색된 항목이 없습니다.",
        infoFiltered: "(전체 _MAX_개의 항목에서 검색)",
        paginate: {
            previous: "<<",
            next: ">>"
        }
    },
    scrollY: true,
    columns: [
        {data: "rn", className:'center'} ,                      /*순번*/
        {data: "infoID", className: 'center'},                  /*공지번호*/
        {data: "allYNName", className: 'left'},               /*구분이름*/
        {data: "fromDate", className: 'left'},                /*시작일*/
        {data: "toDate", className: 'left'},                  /*종료일*/
        {data: "info", className: 'left'},                    /*공지내용*/
        {data: "personName", className: 'left'},              /*공지대상자*/
        {data: "attachFile", className: 'left'},              /*첨부문서*/
        {data: "attachPath", className: 'left'},              /*첨부문서경로*/
        {data: "hitCount", className: 'right'},                /*조회수*/
        {data: "createUser", className: 'left'},              /*작성자*/
        {data: "createDate", className: 'center'},              /*작성일*/
    ],

    columnDefs:[{
            target : [8],
            visible : false,
            serchable : false
        }]

});