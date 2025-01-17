/**
 작성자:    최대현
 작성일:    2024-11-22
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/


window.addEventListener('load', function () {
    document.getElementById('chkRpYN').checked = true;
    pageFocused()
    mainBtnSetting();
});


let selectedRow, companyID, kCompany;


const table = new DataTable('#companyTable', {
    searching : false,
    info : false,
    paging : false,
    language: {
        emptyTable : "검색된 항목이 없습니다.",
        zeroRecords : "검색된 항목이 없습니다.",
        sLoadingRecords: "검색된 항목이 없습니다.",
    },
    buttons: [{
        extend: 'excel',
        filename: '자사정보설정',
        title: '자사정보설정',
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
        {data: "companyID", className: 'left'},
        {data: "companyNo", className: 'left'},
        {data: "registID", className: 'left'},
        {data: "kCompany", className: 'right' },
        {data: "eCompany", className: 'left'},
        {data: "chief", className: 'left'},
        {data: "category", className: 'left'},
        {data: "condition", className: 'left'}
    ],
    columnDefs: [
        {
            targets: 1,
            type: 'string'
        }],
    scrollX: true,
    rowCallback: function (row, data, index) {
        if (index === 0) {
            $(row).css('background-color', 'lightgreen');
        }
    }
})


//버튼세팅
function mainBtnSetting(){
    // document.querySelector("#btnPrint").style.display = 'none';
    document.querySelector("#btnSearch").addEventListener("click", search)
    document.querySelector('#btnAdd').addEventListener('click', function () {
        openForm('companyDetail', '/sysMgmt/company/add?mode=add', '', '');
    })
    document.querySelector('#btnDetail').addEventListener('click', companyDetail)
    tbody.addEventListener('dblclick',companyDetail);
    document.querySelector('#btnExcel').addEventListener("click", function () {
        if (table.rows().count() > 0) {
            table.button(0).trigger();
        } else {
            alert("엑셀로 내보낼 데이터가 없습니다.")
        }
    });
    document.querySelector('#btnDelete').addEventListener('click',()=>{deleteCompanyDetail(companyID,kCompany)})
    document.getElementById('btnClose').addEventListener('click',()=>{window.location.href = "/"});
}

//엔터 눌러서 검색(화면을 보고 있을때만)
function pageFocused(){

    window.addEventListener('keydown', keyDownSearch);

    window.addEventListener('focus', () => {
        window.addEventListener('keydown', keyDownSearch);
    });
    window.addEventListener('blur', () => {
        window.removeEventListener('keydown', keyDownSearch);
    });
}

//검색
function search() {
    const rpYN = document.getElementById('chkRpYN').checked ? 'Y' : '';
    const useYN =document.getElementById('chkUseYN').checked ? '' : 'Y';

    let param= {
        sCompanyID : '',
        sRPYN : rpYN,
        sUseYN : useYN
    }

    loading.visible();
    fetch("/sysMgmt/company/search", {
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
let tbody = document.querySelector('#companyTable tbody');
tbody.onclick = function (event) {
    let rowElement = event.target.closest('tr');
    selectedRow = table.row(rowElement).data();
    companyID = selectedRow.companyID;
    kCompany = selectedRow.kCompany;
};

//DataTable 행 더블클릭 -> 소분류 팝업 창
function companyDetail(){
    let param = {
        sCompanyID: selectedRow.companyID,
        sRPYN : '',
        sUseYN : ''
    }
    openForm('companyDetail', '/sysMgmt/company/detail?mode=update', param, '');
}


const keyDownSearch = function(e) {
    if(e.key === 'Enter'){
        search()
    }
}

//삭제
function deleteCompanyDetail(companyID, kCompany){
    console.log(selectedRow)
    if(selectedRow != null){
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
                            search();
                            selectedRow = null;
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
    else{
        alert("삭제하실 자사정보를 선택해주세요.")
    }
}

