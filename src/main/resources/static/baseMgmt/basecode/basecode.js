/**
 작성자:    최대현
 작성일:    2024-10-15
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/


window.addEventListener('load', function () {
    srhFocus()
    mainBtnSetting();
});

let selectedRow;

const table = new DataTable('#basecodeTable', {
    searching : false,
    buttons: [{
        extend: 'excel',
        filename: '공통코드',
        title: '공통코드',
        autoFilter : true,
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');

            // 각 열의 너비를 셀 내용에 맞게 조정
            let col = $('col', sheet);
            col.each(function () {
                $(this).attr('width', 15);  // 기본 너비 설정
                $(this).attr('bestFit', '1');  // 최적 너비 적용
            });
        }
    }],
    columns: [
        {
            data: null,
            render: function (data, type, row, meta) {
                return meta.row + 1;
            },
            className: 'center'
        },
        {data: "codeID", className: 'left'},
        {data: "codeName", className: 'left'},
        {data: "codeSize", className: 'right' },
        {data: "comments", className: 'left'},
        {data: "createDate", className: 'left'},
        {data: "createUserID", className: 'left'}
    ],

    scrollX: true
})

//버튼세팅
function mainBtnSetting(){
    document.querySelector("#btnPrint").style.display = 'none';
    document.querySelector("#btnSearch").addEventListener("click", search)
    document.querySelector("#btnDetail").addEventListener("click",codeDetail)
    tbody.addEventListener('dblclick', codeDetail)
    document.getElementById('btnExcel').addEventListener("click", function () {
        if (table.rows().count() > 0) {
            table.button(0).trigger();
        } else {
            alert("엑셀로 내보낼 데이터가 없습니다.")
        }
    });
    document.getElementById('btnClose').addEventListener('click',()=>{window.location.href = "/"});
}

//엔터키 검색, 검색창 포커스
function srhFocus(){
    document.addEventListener('keydown', function(e) {

        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            document.getElementById('inputBaseCodeSrh').focus();
        }
        else if(e.key === 'Enter'){
            e.preventDefault();
            search();
        }
    }, true);
}

//검색
function search() {
    let param= {
        codeSrh: document.getElementById('inputBaseCodeSrh').value,
    }

    loading.visible();
    fetch("/baseMgmt/basecode/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
                table.clear().rows.add(data).draw();
                loading.invisible();
            }
        );
}

//DataTable 행 선택
let tbody = document.querySelector('#basecodeTable tbody');
tbody.onclick = function () {
    let rowElement = event.target.closest('tr');
    selectedRow = table.row(rowElement).data();
};

//DataTable 행 더블클릭
function  codeDetail(){
    let param = {
        codeID: selectedRow.codeID,
    }
    openForm('basecodeDetail', '/baseMgmt/basecode/detail?mode=update', param, '');
}






