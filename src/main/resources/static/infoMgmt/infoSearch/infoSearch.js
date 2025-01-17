/*
설명: 공지사항 조회 js 파일
작성일: 2024.10.31
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

*/

//TODO 타이머, 파일 조회

//타이머 변수
let countdown = null;
//타이머 초기값
let timeRemaining = 30;

//다운로드할 파일 이름, 파일 주소
let fileName;
let filePath;

//변경 여부
let updateYN = 'N';

//메세지 숨김 여부
const element = document.getElementById('hiddenTimer');

//조회 클릭 이벤트
document.querySelector("#btnSearch").addEventListener("click", function() {search();
                                                                            //스크롤 초기화
                                                                            const allTextScroll = document.querySelector('#allText'); // 전체공지 스크롤
                                                                            const personTextScroll = document.querySelector('#personText'); // 개별공지 스크롤
                                                                            allTextScroll.scrollTop = 0;
                                                                            allTextScroll.scrollLeft = 0;
                                                                            personTextScroll.scrollTop = 0;
                                                                            personTextScroll.scrollLeft = 0;
                                                                            window.scrollTo(0, 0);

});  //조회

//TODO 정리해야 됨
//엑셀 클릭 이벤트
document.querySelector("#btnExcel").addEventListener("click", function() {
                                                                            let dataheader = []; //테이블 헤더
                                                                            let datalst = [];    //테이블 데이터

                                                                            dataheader.push("전체 공지", "개별 공지");
                                                                            $('#infoAttachFileTable thead th').each(function() {
                                                                                dataheader.push($(this).text()); // 헤더의 텍스트 값 가져오기
                                                                            });

                                                                            let allText = document.getElementById('allText').value;
                                                                            let personText = document.getElementById('personText').value;

                                                                            let infoFileTable = $('#infoAttachFileTable').DataTable();

                                                                             if(infoFileTable.rows().count() < 1){
                                                                                rn = "";                            //순번 데이터
                                                                                infoID = "";                        //공지사항 번호 데이터
                                                                                allYNName = "";                     //구분(전체, 개별) 데이터
                                                                                fromDate = "";                      //시작일 데이터
                                                                                toDate = "";                        //종료일 데이터
                                                                                attachFile = "";                    //첨부문서 데이터
                                                                                datalst.push({allText, personText,rn, infoID, allYNName, fromDate, toDate, attachFile});

                                                                             } else {
                                                                                infoAttachFileTable.rows().every(function (rowIdx) {
                                                                                         let data = this.data();
                                                                                         //엑셀 다운로드 공통으로 사용하기 위해 조회시 보이는 데이터만 가져감
                                                                                         rn = data["rn"];                   //순번 데이터
                                                                                         infoID = data["infoID"];           //공지사항 번호 데이터
                                                                                         allYNName = data["allYNName"];     //구분(전체, 개별) 데이터
                                                                                         fromDate = data["fromDate"];       //시작일 데이터
                                                                                         toDate = data["toDate"];           //종료일 데이터
                                                                                         attachFile = data["attachFile"];   //첨부문서 데이터
                                                                                         //필요한 데이터만 가져오기
                                                                                         datalst.push({allText, personText,rn, infoID, allYNName, fromDate, toDate, attachFile});

                                                                                })
                                                                             }

                                                                              fetch("/infoMgmt/infoSearch/excel", {
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
                                                                                   link.download = 'infoSearch.xlsx';
                                                                                   link.click();
                                                                              })
                                                                              .catch(error => {
                                                                                 console.error('엑셀 내보내기 실패:', error);
                                                                              });

});

/*로드 이벤트*/
$(document).ready(function() {formLoad();
                              window.scrollTo(0, 0); //스크롤 초기화(새로고침인 경우)
                              //toastr 옵션 처리
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
                                                            navigator.sendBeacon("/pages/infoMgmt/infoSearch/infoSearch/close")
                                                         });

/*다운로드 클릭 이벤트*/
$(document).on('click', '.btn-download', function(){
    var rowData = infoAttachFileTable.row($(this).closest('tr')).data();  // 행 데이터 가져오기
    fileName = rowData.attachFile;
    filePath = rowData.attachPath;

    location.href = "http://localhost:8080/infoMgmt/infoSearch/download?filePath=" + encodeURI(filePath) + "&fileName=" + encodeURI(fileName);

});

/*화면 로드 함수*/
function formLoad(){
    infoData();
    Timer();
}

/*조회 함수*/
function search(){
    infoData();
    updateYN = 'N';
    element.style.display = 'none'
    Timer();
}

/*데이터 조회*/
function infoData(){

    //TODO 추후 로그인한 ID
    let param = {
        userID:'admin'
    }

    //전체 공지
    let text = '';
    //개별 공지
    let ptext = '';

    //전체 공지
    loading.visible();
    fetch("/infoMgmt/infoSearch/search/all", {
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
        data.forEach(item => {
            text += '공지번호 : ' + item.infoID + '\n' + '내용 : ' +item.info + '\n\n';
        })

        $('#allText').val(text);
        loading.invisible();
        }
    )
    .catch(error => {
            loading.invisible();
            console.error('Error occurred:', error.message);
            toastr.error(`${error.message}`);
    });

    //개별 공지
    loading.visible();
    fetch("/infoMgmt/infoSearch/search/person", {
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
         data.forEach(item => {
            ptext += '공지번호 : ' + item.infoID + '\n' + '내용 : ' + item.info + '\n\n';

        })

        $('#personText').val(ptext);
        loading.invisible();
        }
    )
    .catch(error => {
            loading.invisible();
            console.error('Error occurred:', error.message);
            toastr.error(`${error.message}`);
    });

    //첨부 문서
    loading.visible();
    fetch("/infoMgmt/infoSearch/search/attachFile", {
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
        infoAttachFileTable.clear().rows.add(data).draw();
        loading.invisible();
        }
    )
    .catch(error => {
            loading.invisible();
            console.error('Error occurred:', error.message);
            toastr.error(`${error.message}`);
    });
}

/*타이머 시작 함수*/
function Timer(){
        // 조회클릭시 메세지 안 보이게
        // 업데이트 일자 비교
        // 타이머가 이미 진행 중인 경우 중복 시작 방지
        if (countdown) {
            clearInterval(countdown);
        }

        timeRemaining = 30; // 타이머 초기화
        updateDisplay();    // 타이머 화면 표시

        //타이머 시작
        countdown = setInterval(() => {
            timeRemaining--;
            updateDisplay();

            if (timeRemaining <= 0) {
                checkSearch();
                Timer();
            }
        }, 1000);

}

/*화면에 시간 표시 함수*/
function updateDisplay() {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `남은 시간: ${timeRemaining}초`;
}


/*타이머 정지 함수*/
function stopFetchingData() {
    clearInterval(countdown); // 설정된 타이머 중지
    countdown = null; // 타이머 상태 초기화
}

/*공지사항 추가, 수정사항 확인 함수*/
function checkSearch(){

    //추가, 삭제인 경우 count
    //수정인 경우 마지막 updateDate확인
    //조회 클릭시 해당 시간과 행의 갯수 저장한 후에 해당 데이터와 비교하여 판단

    //TODO 추후 로그인한 ID
    let param = {
        userID:'admin'
    }

    fetch("/infoMgmt/infoSearch/search/log", {
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
                            return response.json()
    })
    .then((data) => {
            //데이터가 있는지 확인
            if (data) {
                if(data.updateCount > 0){
                    updateYN = 'Y';
                }
                else{
                    updateYN = 'N';
                }
            }
            else{
                updateYN = 'N';
            }

            //수정한 경우 Y, 아닌 경우 N
            if(updateYN == 'Y'){
                element.style.display = 'block' //보임
            }else{
                element.style.display = 'none'  //안 보임
            }
        }
    )
    .catch(error => {
                  loading.invisible();
                  console.error('Error occurred:', error.message);
                  toastr.error(`${error.message}`);

    });
}

/*공지사항 첨부문서 테이블*/
const infoAttachFileTable = $('#infoAttachFileTable').DataTable({
    select: true,
    dom: '<"d-none"B><"mb-2 right"f>t<"mt-2 center"p>',
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
        {data: "allYNName", className: 'center'},               /*구분이름*/
        {data: "fromDate", className: 'center'},                /*시작일*/
        {data: "toDate", className: 'center'},                  /*종료일*/
        {data: "attachFile",  //버튼과 데이터 같이 생성
            defaultContent: '',
            render: function(data, type, row, meta) {
            if(row.attachFile != ''){
                return '<div class="flx"><button class="btn-download" id ="btnDownLoad" data-id="' + row.infoID + '"">다운로드</button>'+ row.attachFile + '</div>'}
            }

        },                                                      /*첨부문서*/
        {data: "attachPath", className: 'center'},              /*첨부문서경로*/

    ],

    columnDefs:[{
            target : [6],
            visible : false,
            serchable : false
        }
    ]

});

