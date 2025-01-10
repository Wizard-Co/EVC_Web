/*
설명: 공지사항 추가 상세 js 파일
작성일: 2024.10.11
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

*/


//TODO 파일, toastr 구현

//변수 선언

//infoID
//빈칸이면 추가, 빈칸이 아니면 수정
let infoID;

//현재 일자 변수
let currentDate;

// 현재 월의 첫날 설정 변수
let firstDayOfMonth;
let formattedFirstDay;

// 현재 월의 마지막 날 설정 변수
let lastDayOfMonth;
let formattedLastDay;

//선택한 하위 노드
let personNode;

//선택한 하위 노드의 부모 노드
let departNode;

//메세지
let message;

//form 이벤트
let form = document.getElementById('addForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
});

/*전체 개별 클릭 이벤트*/
document.querySelector("#chkAllGbn").addEventListener("click", function() {tbState("all")});
document.querySelector("#chkPersonGbn").addEventListener("click", function() {tbState("person")});

/*주강사 클릭 이벤트*/
document.querySelector("#chkMain").addEventListener("click", function() {chkMainState()});
/*저장 클릭 이벤트*/
document.querySelector("#btnSave").addEventListener("click", function() {save('add')});
/*수정 클릭 이벤트*/
document.querySelector("#btnUpdate").addEventListener("click", function() {save('update')});
/*초기화 클릭 이벤트*/
document.querySelector("#btnClear").addEventListener("click", function() {dataClear()});
/*닫기 클릭 이벤트*/
document.getElementById("btnClose").addEventListener("click", function() {formClose()});

/*공지대상자 이동 버튼 이벤트*/
document.querySelector("#btnRight").addEventListener("click", function() {Move('btnRight')});
document.querySelector("#btnLeft").addEventListener("click", function() {Move('btnLeft')});

/*첨부문서 텍스트 클릭 이벤트*/
document.querySelector("#saveFile").addEventListener("click", function() {
                                                                            document.querySelector('#uploadFile').click();
                                                                         });

/*첨부문서 입력시 파일 이름 text 수정*/
document.querySelector("#uploadFile").addEventListener("change", function() {
                                                                                let fis = document.querySelector('#uploadFile');
                                                                                if(fis.files.length > 0){
                                                                                    $('#saveFile').val(fis.files[0].name);
                                                                                }
                                                                                else{
                                                                                    $('#saveFile').val('');
                                                                                }
                                                                            });

/*파일 삭제 버튼 이벤트*/
document.querySelector("#fileDelete").addEventListener("click", function() {
                                                                            $('#saveFile').val('');
                                                                           });

/*로드 이벤트*/
$(document).ready(function() {formLoad('load');
                              window.scrollTo(0, 0);
                              //toastr 옵션 설정
                              window.toastroptions = {
                                      closeButton: true,
                                      progressBar: true,
                                      showMethod: 'slideDown',
                                      timeOut: 2000,
                                      positionClass: "toast-top-center",
                              };
                             });

/*웹 상단 X표시로 닫을 경우 이벤트*/
window.addEventListener('beforeunload', function (event) {
                                                            opener.search();
                                                         });

/*화면 로드 함수*/
function formLoad(gbn){
    //초기화인 경우와 화면 로드인 경우 조건 추가
    if(gbn == 'clear'){
            //기간 설정
            getDate('add');

            //기본 전체 선택, 기본 상단 게시글 선택 안 함
            checkboxGbn('add');

            //그리드 설정
            personData('add');

            //공지대상자 그리드 기본값은 disabled
            const row = document.querySelector('tbody tr:nth-child(3)'); // 세번째 행 선택
            row.classList.add('disabled'); // 'disabled' 클래스 토글

            //공지내용
            let textarea = document.getElementById('taInf');
            textarea.value = '';

            //첨부문서
            $('#saveFile').val('');

    }else{
        const infoData = new FormData(form);

        //infoID가 빈칸이면 추가
        if(infoData.get('infoID') == ''){
            //기간 설정
            getDate('add');

            //기본 전체 선택, 기본 상단 게시글 선택 안 함
            checkboxGbn('add');

            //그리드 설정
            personData('add');

            //공지대상자 그리드 기본값은 disabled
            const row = document.querySelector('tbody tr:nth-child(3)'); // 세번째 행 선택
            row.classList.add('disabled'); // 'disabled' 클래스 토글

            //공지내용
            let textarea = document.getElementById('taInf');
            textarea.value = '';

        }
        else{
            //기본 전체 선택, 기본 상단 게시글 선택 안 함
            checkboxGbn('update');

            //그리드 설정
            personData('update');

            //상세시 전체면 disable
            if(document.querySelector("#chkAllGbn").checked){
                //공지대상자 그리드 기본값은 disabled
                const row = document.querySelector('tbody tr:nth-child(3)'); // 세번째 행 선택
                row.classList.add('disabled'); // 'disabled' 클래스 토글
            }

        }
    }

}

/*오늘일자 기준으로 첫날과 마지막 날 가져오기*/
function getDate(gbn){

        //add면 추가
        if(gbn == 'add'){
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
function checkboxGbn(gbn){
    if(gbn == 'add'){
        let chkAll = document.querySelector("#chkAllGbn");
        let chkPerson = document.querySelector("#chkPersonGbn");
        chkAll.checked = true;
        chkPerson.checked = false;
    }

    let chkMain = document.querySelector("#chkMain");
    chkMain.checked = true;
}

/*왼쪽 사원 트리 데이터, 조건 주강사 여부 추가하여 파라미터 사용*/
function leftPersonDataTree(){

    let mainWorkYN = {
                mainWorkYN : '',
             }
     if(chkMain.checked){
         mainWorkYN = {
            mainWorkYN : 'Y',
         }
     }
     else{
         mainWorkYN = {
            mainWorkYN : 'N',
         }
     }

     $.ajax({
         type: "POST",
         url: "/infoLeftPersonData",
         contentType: 'application/json',
         data: JSON.stringify(mainWorkYN),
         success: function(data) {
             var treeData = new Array();
             $.each(data, function(idx, item) {

                 /*부서 말고 사원만*/
                 if(item.dpParentID !== "#"){
                    item.dpName = "&nbsp;&nbsp;&nbsp;&nbsp;" + item.dpName; /*좀더 안쪽에서 보이기 위해 공백추가해서 처리*/
                 }

                 treeData[idx] = {
                     id: item.dpID.trim(),
                     parent: item.dpParentID, // 부모 노드 ID, 루트 노드는 '#'로 설정
                     text: item.dpName,     // 노드에 표시될 텍스트
                     icon: false,
                     //data: {'mainWorkYN' : item.mainWorkYN} //주강사 여부
                 };
             });
             $("#tree").jstree({
                 core: {
                     data: treeData // 데이터 연결
                 },
                 plugins: ['wholerow','types'], // 사용할 플러그인
             })
             .bind('select_node.jstree', function(event, treeData) {
                   // 노드 선택 이벤트
                   // 사원 노드
                   personNode = treeData.node;
                   // 부모 노드
                   departNode = $('#tree').jstree().get_node(personNode.parent)
             });
         },
         error: function(xhr, status, error) {
             console.error('AJAX Error:', status, error); // 오류 처리
         }
     });
}

/*로드시 사원 명단 데이터*/
function personData(gbn) {
        //사원 왼쪽 그리드
        //트리 구조로 변경
        leftPersonDataTree();

        //사원 오른쪽 그리드
        let rightPersonData ={
            infoID : '',
        }

        //상세인 경우 입력한 개별사원이 있으면 조회 되야 되서 infoID 가져가서 조회
        if(gbn == 'update'){
            //사원 오른쪽 그리드
            rightPersonData.infoID = document.querySelector("#txtInfoID").value;
        }

        //사원 오른쪽 그리드
/*        let rightPersonData ={
            infoID : '',
        }*/

        $.ajax({
                type: "POST",
                url: "/infoRightPersonData",
                contentType: 'application/json',
                data: JSON.stringify(rightPersonData),
                success: function (data) {
                    rightPersonTable.clear().rows.add(data).draw();
                    //rightPersonTable.rows.add(data).draw();
                },
                error: function (error) {
                    console.log(error);
                }
        })
}

/*전체, 개별 체크박스 이벤트 처리 함수*/
function tbState(gbn){
    //all : 전체클릭
    //person : 개별클릭
    if(gbn == 'all'){
         //개별이 클릭되어 있는 경우 해제
         const chkPerson = document.getElementById('chkPersonGbn');
         const checkAll = document.getElementById('chkAllGbn');

         if(checkAll.checked){
             if(chkPerson.checked){
                chkPerson.checked = false;

                //전체인 경우 disabled
                const row = document.querySelector('tbody tr:nth-child(3)'); // 세번째 행 선택
                if(row.classList.contains('disabled')){
                }
                else{
                    row.classList.toggle('disabled'); // 'disabled' 클래스 토글
                }
             }
         }
         else{
             if(!chkPerson.checked){
                chkPerson.checked = true;

                //개별인 경우 enabled
                const row = document.querySelector('tbody tr:nth-child(3)'); // 세번째 행 선택
                if(row.classList.toggle('disabled')){
                    row.classList.toggle('enabled');
                }
                else{
                }
             }
         }
    }else{
        //전체가 클릭되어 있는 경우 해제
        const checkAll = document.getElementById('chkAllGbn');
        const chkPerson = document.getElementById('chkPersonGbn');

        if(chkPerson.checked){
            if(checkAll.checked){
               checkAll.checked = false;

               //개별인 경우 enabled
               const row = document.querySelector('tbody tr:nth-child(3)'); // 세번째 행 선택
               if(row.classList.toggle('disabled')){
                   row.classList.toggle('enabled');
               }
               else{
               }
            }
        }
        else{
            if(!checkAll.checked){
               checkAll.checked = true;

               //전체인 경우 disabled
               const row = document.querySelector('tbody tr:nth-child(3)'); // 세번째 행 선택
               if(row.classList.contains('disabled')){
               }
               else{
                   row.classList.toggle('disabled'); // 'disabled' 클래스 토글
               }
            }
        }


    }

}

/*주강사 이벤트 처리 함수*/
function chkMainState(){
    //인스턴스 제거해야 트리가 재생성 됨
    $('#tree').jstree("destroy");
    //트리 비우기
    $('#tree').empty();

    leftPersonDataTree();
}

/*저장 이벤트 처리 함수*/
function save(gbn){


    if (form.checkValidity()) {
        const infoSave = new FormData(form);

        //파일 크기 확인
        if(infoSave.get('attachFileDetail').name != ''){
            //업로드 파일 최대 용량
            let maxSize = 1024 * 1024; // 1MB
            let file = infoSave.get('attachFileDetail');
            if (file.size > maxSize) {
                alert("파일 용량은 1MB 이내로 등록 가능합니다.");
                return;
            }
        }

        //데이터타입을 String으로 수정
        //allYN 전체 개별 체크박스
        //topNotifyYN 상단게시글 여부 체크박스
        //attachFile 파일이름

        //companyID 빈칸 처리
        infoSave.set('companyID','');

        infoSave.set('fromDate', stringToDateAndFormat(infoSave.get('fromDate')));
        infoSave.set('toDate', stringToDateAndFormat(infoSave.get('toDate')));

        //일자 비교하여 toDate보다 fromDate가 크면 진행하면 안 됨
        if( infoSave.get('fromDate') > infoSave.get('toDate') ){
            message = '공지기간을 확인해주세요.';
            alert(message);
            return;
        }

        //allYN 체크 안 했을 경우 빈칸 처리
        //N 개별 Y 전체
        if(infoSave.get('allYN') != 'Y' && infoSave.get('allYN') != 'N'){
            infoSave.set('allYN', '');
        }

        //topNotifyYN 체크여부에 따라 YN 처리
        if(infoSave.has('topNotifyYN') == true){
            infoSave.set('topNotifyYN', 'Y');
        }
        else{
            infoSave.set('topNotifyYN', 'N');
        }

        //개별이 여러명인 경우 리스트로 처리 함
        let rowDataPersonID;
        let personList = [];

        //전체인 경우에는 처리 안 되도록 조건
        if(infoSave.get('allYN') == 'N'){
            if(rightPersonTable.page.info().end > 0){
                rightPersonTable.rows().every(function() {
                    personList.push(this.data().personID.trim()); // 현재 행의 데이터 가져오기
                });
            }
            else{
                //개별인데 공지대상자 선택 안 한 경우
                message = '공지대상자를 선택해주세요.';
                alert(message);
                return;
            }
        }

        infoSave.set('personIDList', personList);

        if(gbn == 'add'){
                fetch('/infoMgmt/infoAddDetail/save', {
                    method: 'POST',
                    body: infoSave,
                    headers: {},
                })
                .then(res => {
                    if (!res.ok) {
                        console.log('http error: ', res);
                        throw new Error('http error: ', res);
                    }
                })
                .then(() => {
                    toastr.success("데이터가 성공적으로 저장되었습니다.",'성공',{ onHidden : function(){window.open('', '_self').close();
                                                                                        }// 성공 알림이 사라진 후 호출
                                                                    });
                })
                .catch(error => {
                                 toastr.error("에러 발생","에러");
                                 }
                );
        }
        else{
                fetch('/infoMgmt/infoAddDetail/update', {
                    method: 'POST',
                    body: infoSave,
                    headers: {},
                })
                .then(res => {
                    if (!res.ok) {
                        console.log('http error: ', res);
                        throw new Error('http error: ', res);
                    }
                })
                .then(() => {
                    toastr.success("데이터가 성공적으로 저장되었습니다.",'성공',{ onHidden : function(){window.open('', '_self').close();
                                                                                        }// 성공 알림이 사라진 후 호출
                                                                    });
                })
                .catch(error => {
                                 toastr.error("에러 발생","에러");
                                 }
                );

        }

    }
    else{
        message = '필수기입사항이 입력되지 않았습니다. \r\n필수기입사항을 확인해주세요.';
        alert(message);
    }
}

/*화면 닫는 함수*/
function formClose(){
        window.open('', '_self').close();
        opener.search();
}

/*데이터 초기화 함수*/
function dataClear(){
        formLoad('clear');
}

/*공지대상자 이동 함수*/
function Move(ButtonGbn){

    if(ButtonGbn == 'btnRight'){

        //부서는 입력되면 안 됨
        //부모노드가 null인 경우 부서라고 판단함
        if(departNode.parent === null){
            return;
        }
        else{
            //똑같은 personID가 있으면 입력되면 안됨

            for(let i = 0; i < rightPersonTable.rows().count(); i++){
                if(rightPersonTable.cell(i, 3).data() === personNode.id){
                    return;
                }
            }

            rightPersonTable.rows.add([{'depart' : departNode.text,'person' : personNode.text, 'departID' : departNode.id, 'personID' : personNode.id}]).draw();
            //복사
            const rightPerson = rightPersonTable.rows().data().toArray();
            //클리어 후 복사한 데이터 입력
            rightPersonTable.clear().rows.add(rightPerson).draw();
        }
    }
    else{

        rightPersonTable.rows({ selected: true }).remove().draw();

        rightPersonTable.rows().every( function () {
                //console.log(this.index());
            });
    }

}

/*오른쪽 사원 명단*/
const rightPersonTable = $('#idRightPersonTable').DataTable({
    select: true,
    dom: '<"d-none"B><"mb-2 right"f>t<"mt-2 center"p>',
    language: {
        zeroRecords: "검색된 항목이 없습니다.",
        infoEmpty: "검색된 항목이 없습니다.",
        infoFiltered: "(전체 _MAX_개의 항목에서 검색)",
        select: {
             rows: "", // 선택된 행 메시지를 비웁니다
             style: "single" // 단일 선택 모드 설정
        },
    },
    paging: false, //페이지 사용 안 함
    searching: false, //검색 기능 사용 안 함
    ordering: false, //자동정렬 사용 안 함
    scrollY: true,
    columns: [
        {data: "depart", className:'center'},                  /*부서*/
        {data: "person", className: 'center'},                  /*사원*/
        {data: "departID", className: 'center'},                /*부서ID*/
        {data: "personID", className: 'center'},                /*사원ID*/
    ],

     //th 숨기기
     columnDefs:[{
        target : [2, 3],
        visible : false,
        serchable : false
     }]
});

/*date를 yyyymmdd 형식으로 변경*/
function stringToDateAndFormat(dateString) {
    const date = new Date(dateString); // 문자열을 Date 객체로 변환
    return formatDateToYYYYMMDD(date); // YYYYMMDD 형식으로 변환
}

/*date를 yyyymmdd 형식으로 변경*/
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear(); // 연도
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
    const day = String(date.getDate()).padStart(2, '0'); // 일

    return `${year}${month}${day}`; // YYYYMMDD 형식으로 조합
}