
/**
  *설명          :
  *작성일         : 2024.월.일
  *개발자         : jhd
  *======================================================
  *DATE             AUTHOR               NOTE
  *------------------------------------------------------
  *2024.월.일           jhd             최초 생성
**/

let departTable; // DataTable 객체를 전역으로 선언
let selectedRow;

window.addEventListener('load', function () {
    mainBtnSetting();
    departTable = initializeDataTable();  // DataTable 초기화 후 참조
    attachTableEvents();

});

function initializeDataTable() {
    return new DataTable('#departTable', {
        buttons: [{
            extend: 'excel',
            filename: '부서코드',
            title: '부서코드',
            customize: function (xlsx) {
                let sheet = xlsx.xl.worksheets['sheet1.xml'];
                $('row:first c', sheet).attr('s', '42');
            }
        }],
        columns: [ //여기서 뿌려지는 놈들 순서대로 조회됨
            {data: "num", className: 'center'},
            {data: "departID", className: 'left', orderable: false}, //orderable: false <<정렬여부 ㅇㅇ ㄴㄴ
            {data: "depart", className: 'left'},
            {data: "useClss", className: 'left', orderable: false},
            {data: "setDate", className: 'left', orderable: false},
            {data: "comments", className: 'left', orderable: false },
            {data: "groupID", className: 'left', orderable: false},
            {data: "groupName", className: 'left', orderable: false },
            {data: "createDate", className: 'left', orderable: false},
            {data: "createUserID", className: 'left', orderable: false},
        ],
        scrollX: true
    });
}

function attachTableEvents() {
    // DataTable이 초기화된 후 tbody 요소가 동적으로 생성되므로, rows().nodes()로 접근
    let tbody = document.querySelector('#departTable tbody');
    if (tbody) {
        tbody.onclick = function (event) {
            let rowElement = event.target.closest('tr');
            if (rowElement) {
                selectedRow = departTable.row(rowElement).data();  // 선택된 행의 데이터 저장
                console.log("선택된 행:", selectedRow); // 선택된 행의 데이터 출력

                // 행 선택 여부를 확인 후, 해당하는 경로로 이동
                if (selectedRow) {
                    let param = {
                        departID: selectedRow.departID
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
                    departID: selectedRow.departID

                };
                openForm('departDetail', '/baseMgmt/depart/detail?mode=update', param, '');
            } else {
                alert("수정할 행을 선택하세요.");
            }
        };
    } else {
        console.log('tbody 요소가 없습니다.');
    }
}

//
// let tbody = document.querySelector('#departTable tbody');
//
// if (tbody) {
//     tbody.onclick = function (event) {
//         alert(tbody);
//         let rowElement = event.target.closest('tr');
//         if (rowElement) {
//             selectedRow = departTable.row(rowElement).data();
//             console.log("선택된 행:", selectedRow);
//         }
//     };
//
//     // 상세열어라
//     tbody.ondblclick = function (event) {
//         alert("수정 열리니?");
//         let param = {
//             departID: selectedRow.departID
//         };
//         openForm('departDetail', '/baseMgmt/depart/detail?mode=update', param, '');
//     };
// } else {
//     console.log('tbody 없다.');
// }



function mainBtnSetting() {
    document.getElementById('btnSearch').addEventListener("click", Search);
}

document.getElementById('btnAdd').addEventListener('click', function () {
    openForm('departDetail', '/baseMgmt/depart/add?mode=add', '', '');
});

document.getElementById('inputDepartSrh').addEventListener('keyup', function () {
    let input = this.value;
    departTable.column(1).search(input).draw();
});

function getChecked(id) {
    let checkbox = document.getElementById(id);
    return checkbox ? checkbox.checked : false;
}

function Search() {
    let param = {
        depart: document.getElementById('inputDepartSrh').value,
        useClss: getChecked('chkIncludeUseYN') == true ? 'Y' : 'N'
    };

    loading.visible();

    fetch("/baseMgmt/depart/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    data[i]['num'] = i + 1;
                }
                departTable.clear().rows.add(data).draw();  // 이제 departTable은 DataTable 객체
            } else {
                alert("데이터가 없습니다.");
            }
            loading.invisible();
        });
}

document.getElementById('btnDelete').addEventListener('click',function () {
    if (!!selectedRow){
        let baseUrl = '/baseMgmt/depart/delete';
        let param = new URLSearchParams({
            departID : selectedRow.departID
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


