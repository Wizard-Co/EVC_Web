/**
 작성자:    최대현
 작성일:    2024-11-25
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/


let selectedRow, customID, kCustom


window.addEventListener('load', function () {
    window.addEventListener('keydown',keyDownSearch)
    srhControl()
    pageFocused()
    mainBtnSetting();
});

const preserveFormat = function(data) {
    return data;
};

const table = new DataTable('#customTable', {
    searching : false,
    info : false,
    paging : false,
    numberFormat: false,
    language: {
        emptyTable : "검색된 항목이 없습니다.",
        zeroRecords : "검색된 항목이 없습니다.",
        sLoadingRecords: "검색된 항목이 없습니다.",
    },
    buttons: [{
        extend: 'excel',
        filename: '거래처 코드 등록',
        title: '거래처 코드 등록',
        autoFilter: true,
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
        {
            data: "customID",
            className: 'center',
            render: function(data, type, row) {
                return data; // 데이터를 있는 그대로 반환
            }
        },
        {data: "kCustom", className: 'left'},
        {data: "shortCustom", className: 'left'},
        {data: "eCustom", className: 'left' },
        {data: "condition", className: 'left'},
        {data: "category", className: 'left'},
        {data: "chief", className: 'left'},
        {data: "customNo",  className: 'left'},
        {data: "tradeName", className: 'left'},
        {data: "repPhone",  className: 'left'},
        {data: "phone", render : preserveFormat, className: 'left'},
        {data: "faxNo", className: 'left'},
        {data: "damdangName1", className: 'left'},
        {data: "damdangPhone1", className: 'left'},
        {data: "damdangComments1", className: 'left'},
        {data: "damdangName2", className: 'left'},
        {data: "damdangPhone2", className: 'left'},
        {data: "damdangComments2", className: 'left'},
        {data: "zipcode", className: 'left'},
        {data: "address1", className: 'left'},
        {data: "homepage", className: 'left'},
        {data: "eMail", className: 'left'},
        {data: "delayedCount", className: 'left'},
        {data: "defectCount", className: 'left'},
        {data: "comments", className: 'left'},
        {data: "createUserID", className: 'left'},
        {data: "createDate", className: 'left'},

    ],
    scrollX: true,
})


function mainBtnSetting(){
    // document.querySelector("#btnPrint").style.display = 'none';
    document.querySelector("#btnSearch").addEventListener("click", search)
    document.querySelector('#btnAdd').addEventListener('click', function () {
        openForm('customDetail', '/baseMgmt/custom/add?mode=add', '', 'width=1500, height=780');
    })
    tbody.addEventListener('dblclick',customDetail)
    document.querySelector('#btnDetail').addEventListener('click', customDetail)
    document.querySelector('#btnExcel').addEventListener("click", function () {
        if (table.rows().count() > 0) {
            table.button(0).trigger();
        } else {
            alert("엑셀로 내보낼 데이터가 없습니다.")
        }
    });
    document.querySelector('#btnDelete').addEventListener('click',()=>{deleteCustomDetail(customID,kCustom)})
    document.getElementById('btnClose').addEventListener('click',()=>{window.location.href = "/"});
}


function pageFocused(){
    // 페이지 로드 시 바로 keydown 이벤트 리스너 추가
    window.addEventListener('keydown', keyDownSearch);

    // focus/blur 시 이벤트 리스너 관리
    window.addEventListener('focus', () => {
        window.addEventListener('keydown', keyDownSearch);
    });

    window.addEventListener('blur', () => {
        window.removeEventListener('keydown', keyDownSearch);
    });
}


//검색
function search() {

    const chkKCustom = document.getElementById('chkKCustom').checked ? 1 : 0
    const kCustom = document.getElementById('inputKCustom').value

    const chkOrganGbn = document.getElementById('chkOrganGbn').checked ? 1 : 0
    const organGbn = document.getElementById('cboOrganGbn').value;

    const chkTradeId = document.getElementById('chkTradeID').checked ? 1 : 0
    const tradeID = document.getElementById('cboTradeID').value;

    const chkCheif = document.getElementById('chkChief').checked ? 1 : 0
    const chief = document.getElementById('inputChief').value;

    const chkDamdangName =  document.getElementById('chkDamdangName').checked ? 1 : 0
    const damdangName = document.getElementById('inputDamdangName').value

    const chkDamdangComment = document.getElementById('chkDamdangComment').checked ? 1 : 0
    const damdangComment = document.getElementById('inputDamdangComment').value

    const chkComments = document.getElementById('chkComments').checked ? 1 : 0
    const comments = document.getElementById('inputComments').value;

    const chkUseYN = document.getElementById('chkUseYN').checked ? 1 : 0

    let param= {

        sCustomID : '',

        chkKCustom : chkKCustom,
        sKCustom : kCustom,

        chkOrganGbn :chkOrganGbn,
        sOrganGbn : organGbn,

        chkTradeID : chkTradeId,
        sTradeID : tradeID,

        chkChief :chkCheif,
        sChief : chief,

        chkDamdang : chkDamdangName,
        sDamdangName : damdangName,

        chkDamdangComments : chkDamdangComment,
        sDamdangComments : damdangComment,

        chkComments: chkComments,
        sComments: comments,

        chkUseYN : chkUseYN,
    }

    loading.visible();
    fetch("/baseMgmt/custom/search", {
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

function deleteCustomDetail(customID, kCustom){
    if(!customID || customID.trim() === ''){
        alert('삭제하실 항목을 선택해주세요')
        return;
    }

    const userConfirm = confirm("거래처 : "+ kCustom+ "를 삭제하시겠습니까?")
    if(userConfirm){
        if (customID) {
            fetch('/baseMgmt/custom/delete', {
                method : "POST",
                body : customID
            })
                .then(res => {
                    if (!res.ok) console.log('http error: ', res)
                    return res.text();
                })
                .then(responseMessage => {
                    alert(responseMessage);
                    if (responseMessage.includes("삭제 되었습니다.")) {
                        search();
                        // window.open('', '_self').close();
                        // opener.search();
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



const keyDownSearch = function(e) {
    if(e.key === 'Enter'){
        search()
    }
}

function srhControl(){
    document.querySelectorAll('tr.v-middle').forEach(row => {

        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            const checkbox = cell.querySelector('input[type="checkbox"]');
            if (checkbox) {
                const nextCell = cell.nextElementSibling;
                if (nextCell) {
                    const inputField = nextCell.querySelector('input[type="text"], select.form-control');
                    if (inputField) {
                        inputField.disabled = !checkbox.checked;
                        checkbox.addEventListener('change', function() {
                            inputField.disabled = !this.checked;

                            if (!inputField.disabled && inputField.type === 'text') {
                                inputField.focus()
                            }
                        });
                    }
                }
            }
        });
    });
}


//DataTable 행 선택
let tbody = document.querySelector('#customTable tbody');
tbody.onclick = function (event) {
    let rowElement = event.target.closest('tr');
    selectedRow = table.row(rowElement).data();
    customID = selectedRow.customID;
    kCustom = selectedRow.kCustom;
};

//DataTable 행 더블클릭 -> 소분류 팝업 창
function customDetail(){
    let param = {

        sCustomID : selectedRow.customID,

        chkKCustom : 0,
        sKCustom : '',

        chkOrganGbn :0,
        sOrganGbn : '',

        chkTradeID : 0,
        sTradeID : '',

        chkChief :0,
        sChief : '',

        chkDamdang : 0,
        sDamdangName : '',

        chkDamdangComments : 0,
        sDamdangComments : '',

        chkComments:0,
        sComments: '',

        chkUseYN : 1
    }
    openForm('customDetail', '/baseMgmt/custom/detail?mode=update', param, 'width=1500, height=780');
}