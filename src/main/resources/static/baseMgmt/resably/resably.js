let resablyTable; // DataTable 객체를 전역으로 선언
let selectedRow;
let option  = 'width=950 height=260';

window.addEventListener('load', function () {
    mainBtnSetting();
    resablyTable = initializeDataTable();  // DataTable 초기화 후 참조
    attachTableEvents();

});

function initializeDataTable() {
    return new DataTable('#resablyTable', {
        buttons: [{
            extend: 'excel',
            filename: '직책코드',
            title: '직책코드',
            customize: function (xlsx) {
                let sheet = xlsx.xl.worksheets['sheet1.xml'];
                $('row:first c', sheet).attr('s', '42');
            }
        }],
        columns: [ //여기서 뿌려지는 놈들 순서대로 조회됨
            {data: "num", className: 'center'},
            {data: "resablyID", className: 'left', orderable: false ,
                render: function(data, type, row) { //render 함수 안에서 data.replace(/,/g, '')를 사용하여 콤마를 제거
                    return data.replace(/,/g, '');} //모든 콤마를 제거하는 정규 표현식
            }, //orderable: false <<정렬여부 ㅇㅇ ㄴㄴ
            {data: "resably", className: 'left'},
            {data: "useYN", className: 'left', orderable: false},
            {data: "numSeq", className: 'left', orderable: false},
            {data: "comments", className: 'left', orderable: false },
            {data: "createUserID", className: 'left', orderable: false},
            {data: "createDate", className: 'left', orderable: false},

        ],
        scrollX: true
    });
}

function attachTableEvents() {
    // DataTable이 초기화된 후 tbody 요소가 동적으로 생성되므로, rows().nodes()로 접근
    let tbody = document.querySelector('#resablyTable tbody');

    if (tbody) {
        tbody.onclick = function (event) {
            let rowElement = event.target.closest('tr');
            if (rowElement) {
                selectedRow = resablyTable.row(rowElement).data();  // 선택된 행의 데이터 저장
                console.log("선택된 행:", selectedRow); // 선택된 행의 데이터 출력

                // 행 선택 여부를 확인 후, 해당하는 경로로 이동
                if (selectedRow) {
                    let param = {
                        resablyID: selectedRow.resablyID
                    };
                    // alert('선택된 부서 ID: ' + selectedRow.departID); // 선택된 부서 ID를 알림
                    // selectedRow 값에 따라 다른 작업 수행
                } else {
                    alert('행을 선택하지 않았습니다.');
                }
            }
        };

        // 상세 열기 (더블 클릭)
        tbody.ondblclick = function (event) {
            if (selectedRow) {
                let param = {
                    resablyID: selectedRow.resablyID

                };
                openForm('resablyDetail', '/baseMgmt/resably/detail?mode=update', param, option);
            } else {
                alert("수정할 행을 선택하세요.");
            }
        };
    } else {
        console.log('tbody 요소가 없습니다.');
    }
}


function mainBtnSetting() {
    document.getElementById('btnSearch').addEventListener("click", Search);
}

document.getElementById('btnAdd').addEventListener('click', function () {
    openForm('resablyDetail', '/baseMgmt/resably/add?mode=add', '', option);
});


document.getElementById('inputResablySrh').addEventListener('keyup', function (event) {


    // let input = this.value.trim(); << ID값 불러올떄 사용
    let input = this.innerText.trim();  // 입력값 공백 제거 + text값으로 받아 올떄 사용

    // 검색어가 없으면 전체 조회
    if (input === '') {
        resablyTable.column(1).search('').draw();  // 빈 문자열로 검색 시 모든 데이터 표시
    } else {
        // departTable.column(1).search(input).draw();
        resablyTable.column(1).search(input, true, false).draw();  // ( 두번쨰 true = 정규 표현식 사용) , (false = 대소문자 구분 없음 )
    }
    //
    // console.log('현재 입력 값: ', event.target.value); //백스페이스 눌렀을떄 나오는 키값 확인 용
    // console.log("데이터테이블 값" +resablyTable);
    // console.log("데이터테이블 로우즈값" + resablyTable.rows);

});

function getChecked(id) {
    let checkbox = document.getElementById(id);
    return checkbox ? checkbox.checked : false;
}

function Search() {
    let param = {
        // depart: document.getElementById('inputDepartSrh').value(),
        resably: document.getElementById('inputResablySrh').value,  // text 값 가져오기
        useYN: getChecked('chkIncludeUseYN') === true ? 'Y' : 'N'
    };

    loading.visible();

    fetch("/baseMgmt/resably/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    data[i]['num'] = data[i]['numSeq'] = i + 1;
                    // data[i]['num'] = i + 1;

                }
                resablyTable.clear().rows.add(data).draw(true);  // 이제 departTable은 DataTable 객체
                // departTable.clear(); //데이터 클리어
                // departTable.rows.add(data);  // 데이터 추가
                // departTable.draw();  // 화면에 리렌더링 draw 라는게 데이터를 화면에 그리는거임

                console.log("데이터테이블 값" + resablyTable);
                console.log("데이터테이블 로우즈값" + resablyTable.rows);
                console.log("데이터값" + data); //배열형태로 뿌리기
                console.table(data); //데이터테이블 형식으로 콘솔창에 뿌리기
                // console.log("데이터값" + departTable.draw);

            } else {
                alert("데이터가 없습니다.");
            }
            loading.invisible();
        })
        .catch(error =>{
            console.error('에러', error);
            loading.invisible();
        });
}

document.getElementById('btnDelete').addEventListener('click', function () {
    if (!!selectedRow){
        let baseUrl = '/baseMgmt/resably/delete';
        let param = new URLSearchParams({
            resablyID : selectedRow.resablyID
        });
        let urlWithParam = `${baseUrl}?${param}`

        console.log(urlWithParam);

        fetch(urlWithParam)
            .then(response => {
                if (!response.ok) console.log('http error: ', response);
            })
            .then(() => {
                Search();
            })
            .catch(error => console.log('Unexpected error: ', error));
    }

})