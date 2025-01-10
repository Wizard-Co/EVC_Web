/**
 작성자:    최대현
 작성일:    2024-10-15
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 * 2024.10.15   최대현         최초작성
 **/

document.addEventListener('DOMContentLoaded',()=>{
    mainBtnSetting();
})

window.addEventListener('load', function () {
    originCmCode = table.data().toArray();
    codeTypeID = document.getElementById('codeTypeID').textContent.trim() //th:text로 렌더링한 것은 textContent나 innerText를 가져와야 한다.
    codeSize = document.getElementById('codeSize').textContent.match(/\d+/);
    level = document.getElementById('level').textContent;
    parentID = document.getElementById('parentID').textContent;

    //상세페이지에서 사용안함 체크박스 기억하기
    const checkbox = document.getElementById('chkUseYn');
    const savedState = localStorage.getItem('checkboxState');
    if (savedState !== null) {
        checkbox.checked = savedState === 'true';
        table.column(3).search(checkbox.checked ? '' : 'Y').draw();
    }

});



let currentMode = ''
let originCmCode = [];
let codeTypeID, codeSize, level, parentID;



const table = new DataTable('#basecodeDetailTable', {
    language :{
        emptyTable: "데이터가 없습니다.",
        zeroRecords: "검색 결과가 없습니다."
    },
    searching : true,
    dom: 't',
    select : {style: 'single'},
    buttons: [{
        filename: '공통코드',
        title: '공통코드',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {
            //순 1씩 자동증가
            data :null,
            render: function (data, type, row, meta) {
                return meta.row + 1;
            },
            className: 'center'
        },
        {
            //ColumnDefs를 했을때 DataTable의 값은 있으나
            //개발자도구에서 확인해보면 codeTypeID에 대한 DOM요소가 사라지기때문에
            //DOM요소를 살리기 위해서 Render 넣음
            //data속성을 사용하기 위함
            data: "codeTypeID",  className: 'hide-column',
            render: function(data, type, row) {
                return data;
            }
        },
        {
            data: "codeID",
            render: function (data, type, row) {
                return type === 'display'
                    ? data.toString().replace(/[^a-zA-Z0-9]/g, '') //특수문자 제거 코드자리가 긴거 나오면 콤마가 자동 찍혀서 나옴 thousand 옵션 걸어도 제거 안되어서 작성
                    : data;
            },
            className: 'left'
        },
        { data: "useYN", className: 'center' },
        { data: "codeName", className: 'left' },
        { data: "codeEName", className: 'left' },
        { data: "seq", className: 'right' },
        { data: "relation", className: 'left' },
        { data: "comments", className: 'left' },
        {
            data: "codeSize",  className: 'hide-column',
            render: function(data, type, row) {
                return data;
            }
        },
        {
            data: "level",  className: 'hide-column',
            render: function(data, type, row) {
                return data;
            }
        },
        {
            data: "parentID", className: 'hide-column',
            render: function(data, type, row) {
                return data;
            }
        },
    ],
    scrollX: true,
    scrollY: '500px',
    paging : false,
});


function mainBtnSetting(){

    document.getElementById('btnUpdate').addEventListener('click', update)
    document.getElementById('btnClose').addEventListener('click',()=>{window.close()})
    document.getElementById('btnCancel').addEventListener('click', cancel)
    document.getElementById('btnReset').addEventListener('click',reset);
    document.getElementById('btnSave').addEventListener('click',save);
    document.getElementById('btnDelete').addEventListener('click',deleteData);
    document.getElementById('btnClose').addEventListener('click',()=>{window.location.href = "/"});

    //새 행 추가
    document.getElementById('btnAdd').addEventListener('click', function() {

        const rowCount= table.rows().count();

        currentMode = 'add';
        const newRow = {
            codeTypeID : codeTypeID,
            codeID: '',
            useYN: 'Y',
            codeName: '',
            codeEName: '',
            seq: '',
            relation: '',
            comments: '',
            codeSize: codeSize,
            level: level,
            parentID: parentID
        };

        const row = table.row.add(newRow).draw().node();
        $(row).attr('data-new-row','true');

        const deleteButton = `
        <div class="delete-row-btn" style="cursor: pointer; display: flex; justify-content: center; align-items: center">
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" fill="#ff4444"/>
                <rect x="5" y="9" width="10" height="2" fill="white"/>
            </svg>
        </div>
        `;

        $(row).find('td:first').html(deleteButton);

        //$(row).find('td:first').text(rowCount + 1); //화면에 보이는 행 숫자 이후부터, 타임리프가 처리하도록 하니 번호가 꼬임...

        Object.keys(newRow).forEach((field, index) => {
            $(row).find(`td:eq(${index + 1})`).attr('data-field', field);
        });

        // 삭제 버튼 클릭 이벤트
        $(row).find('.delete-row-btn').on('click', function() {
            table.row($(row)).remove().draw();
        });

        cantBtnSetting('add')
        setEditableCell(row);
    });

    ['spanUseYn', 'chkUseYn'].forEach(id => {
        document.getElementById(id).addEventListener('click', function(e) {
            const checkbox = document.getElementById('chkUseYn');

            if (this.id === 'spanUseYn') {
                checkbox.checked = !checkbox.checked;
            }

            // 체크박스 상태 저장
            localStorage.setItem('checkboxState', checkbox.checked);

            table.column(3).search(checkbox.checked ? '' : 'Y').draw();
        });
    });

    let tbody = document.querySelector('#basecodeDetailTable tbody');
    tbody.onclick = function (e) {

        const btndelete = document.getElementById('btnDelete')

        let tr = e.target.closest('tr');
        if (!tr) return;

        let useYN = tr.cells[3].textContent;

        if(currentMode === '' && useYN === 'Y') {
            btndelete.style.display = 'inline-block'
        }
        if(currentMode === '' && useYN === 'N') {
            btndelete.style.display = 'none'
        }
    };
}

//수정
function update(){
    currentMode = 'update'
    cantBtnSetting('update')
    setAllRowsEditable()
}

//취소
function  cancel(){
    setTableOrigin();
    currentMode = ''
    canBtnSetting()
}

//초기화 -> 작성 전 이전으로 돌아감
function reset(){
    if(currentMode === 'update'){
        setTableOrigin()
        setAllRowsEditable()
    }
    else if(currentMode === 'add'){
         const newRows = $('tr[data-new-row="true"]');
         if(newRows.length > 0) {
             newRows.each(function() {

                 const neededValue = ['codeTypeID', 'codeSize', 'level', 'parentID'];

                 $(this).find('input').each(function() {
                     const field = $(this).closest('td').attr('data-field');
                     if (!neededValue.includes(field)) {
                         $(this).val('');
                     }
                 });
                 $(this).find('select').val('Y');
             });
         }
    }
}

//저장
function save(){

    let userConfirm = confirm('저장 하시겠습니까?')
    if(userConfirm){
        saveData()
    }
}

//저장 - 실제 작업
//DataTable의 셀(td)에 input, select태그를 추가한 값에 data- 속성을 주어
//해당 태그의 속성이 가진 값들을 form객체로 controller에 전달
function saveData(){
    if(checkData()) {
        const formData = new FormData();

        if(currentMode === 'add') {
            // btnAdd를 실행할때 새행 속성을 추가하였고, 모든 새로운 행을 선택
            const newRows = document.querySelectorAll('tr[data-new-row="true"]');

            // 각 새로운 행마다 데이터 처리, input, select 태그를 선택하여 값을 담는다.
            newRows.forEach((row, index) => {
                const inputs = row.querySelectorAll('input');
                const selects = row.querySelectorAll('select');

                //새 행의 데이터만 반복하여 form에 담는다.
                inputs.forEach(input => {
                    if(input.name) {
                        // 현재 행의 인덱스를 사용
                        const newName = input.name.replace(/\[\d+\]/, `[${index}]`); //basecodelist = name
                        formData.append(newName, input.value);
                    }
                });
                selects.forEach(select => {
                    if(select.name) {
                        // 현재 행의 인덱스를 사용
                        const newName = select.name.replace(/\[\d+\]/, `[${index}]`); //basecodelist = name
                        formData.append(newName, select.value);
                    }
                });
            });
        }
        else if(currentMode === 'update') {
            // 수정 모드: 모든 행의 input 데이터 수집
            const rows = document.querySelectorAll('table tbody tr');

            rows.forEach((row, index) => {
                const inputs = row.querySelectorAll('input');
                const selects = row.querySelectorAll('select');

                inputs.forEach(input => {
                    if(input.name && input.value.trim() !== '') {  // 빈 값이 아닌 경우만
                        formData.append(input.name, input.value);
                    }
                });
                selects.forEach(select => {
                    if(select.name && select.value.trim() !== '') {  // 빈 값이 아닌 경우만
                        formData.append(select.name, select.value);
                    }
                });
            });
        }
        //데이터 담기 끝

        const baseUrl = '/baseMgmt/basecode/detail/'
        const requestUrl = currentMode === 'update' ? baseUrl + currentMode : baseUrl + currentMode

        fetch(requestUrl, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if(response.ok) {
                    alert("저장되었습니다.");
                    currentMode = "";
                    location.reload()

                } else {
                    throw new Error('저장 실패');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('저장 중 오류가 발생했습니다.');
            });
    }
}

//저장전 체크
function checkData(){

    if(checkDuplicated() && checkEmptyCell()){
        return true;
    }
}

//저장전 필수 입력 체크
function checkEmptyCell() {
    const allRows = table.rows().nodes();
    let isEmpty = true;
    let isNotNumber = true;
    let isPrefixZero = true;
    let hasSpecialChar = true;

    $(allRows).each(function() {
        const $row = $(this);
        // input이 있는 td 찾기
        const input = $row.find('td[data-field="codeID"] input');
        const seqKey = $row.find('td[data-field="seq"] input');

        // input이 하나라도 있는 경우만 검사
        if(input.length > 0 || seqKey.length > 0) {
            const codeID = input.val();
            const seq = seqKey.val();

            if((!codeID || codeID.trim() === '') || (!seq || seq.trim() === '')) {
                let message = "코드, Seq를 입력하세요."
                alert(message)
                return isEmpty = false;
            }

            if (seq && isNaN(seq)) {
                let message = "Seq는 숫자이어야 합니다."
                alert(message)
                return isNotNumber = false;
            }

            if (seq && /^0\d+$/.test(seq)) {
                let message = "Seq가 문자열 형태 숫자 입니다. 예시:(09)"
                alert(message)
                return isPrefixZero = false;
            }

            if(seq && /[^a-zA-Z0-9 ]/.test(seq)) {
                let message = "seq에 특수문자가 있습니다."
                alert(message)
                return hasSpecialChar = false;
            }
        }
    });

    return true;
}

//저장 전 중복 체크
function checkDuplicated(){

    const allRows = table.rows().nodes(); //테이블의 모든 행
    const values = {}; //테이블 값을 저장할 공간
    let hasDuplicate = false;

    // 첫 번째 순회, 값의 출현 횟수를 기록
    $(allRows).each(function(index) {
        let codeID, key, seq;
        const input = $(this).find('td:eq(2) input'); //codeID열
        const keyName = $(this).find('td:eq(4) input'); //codeName열


        //input태그의 codeID와 codeName값을 가져오기
        if(input.length > 0) {
            codeID = input.val();
            key = keyName.val();
        } else {
            codeID = table.row(this).data().codeID;
            key = table.row(this).data().codeName;
        }

        //가져온 값을 검증하기
        //values는 위에 미리 선언한 JSON객체
        if(codeID && codeID.trim() !== '') {
            if(!values[codeID]) { // 이 키 이름에 값이 없을 경우, 첫번째일 때 정보를 저장
                values[codeID] = {
                    count: 1,
                    items: [{key: key}]
                };
            } else { //이제 중복일때 계속 저장
                values[codeID].count++;
                values[codeID].items.push({key: key});
                hasDuplicate = true;
            }
        }
    });

    // 중복 항목 처리
    if(hasDuplicate) {
        let message = "서로 중복된 코드ID가 있습니다:\n";

        // 중복된 항목만 필터링하여 처리
        // JSON객체의 key값을 풀어서 배열[]로 저장한다. 배열 내용은 codeName이 될 것임
        Object.keys(values).forEach(value => {
            if(values[value].count > 1) { //위에서 저장한 JSON객체의 저장된 갯수가 1이상일때
                values[value].items.forEach(item => { //JSON객체의 키 값을 순회하면서 메세지에 덧붙임
                    message += `${item.key}, `;
                });
            }
        });

        alert(message.slice(0, -2)); // 마지막 쉼표와 공백 제거
        return false;
    }

    return true
}

//삭제 (사용안함 처리)
function deleteData(){
    let row = table.row('.selected').data();

    const userConfirm = confirm(`선택하신 데이터\n코드: ${row.codeID}   코드명: ${row.codeName} 를 삭제(사용안함)하시겠습니까?`)
    if(userConfirm){
        let baseUrl = '/baseMgmt/basecode/detail/delete';
        let param = new URLSearchParams({
            codeTypeID: row.codeTypeID,
            codeID : row.codeID
        });
        let urlWithParam = `${baseUrl}?${param}`

        fetch(urlWithParam)
            .then(res => {
                if (!res.ok) {
                    return res.text().then(err => {throw new Error(err)});
                }
            })
            .then(() => {
                alert("삭제(사용안함) 처리 되었습니다.")
                location.reload()
            })
            .catch(error => console.log('Unexpected error: ', error))

    }
}



//로드할때 저장했던 테이블 내용으로 되돌리기 - 초기화, 취소 버튼 관련
function  setTableOrigin(){
    // new-row 행들 제거
    $('tr[data-new-row="true"]').each(function() {
        table.row(this).remove();
    });

    // input, select를 제거하고 원본 텍스트만 복원
    table.rows().every(function(rowIdx) {
        let originalData = originCmCode[rowIdx];
        let row = $(this.node());

        row.find('td').each(function() {
            // input, select는 제거하고 텍스트만 남기기
            $(this).find('input, select').remove();
            // data-field 속성은 그대로 두고 내용만 원본으로
            const fieldName = $(this).data('field');
            if(fieldName && originalData) {
                $(this).text(originalData[fieldName] || '');
            }
        });
    });

    table.draw(false);
}

//수정, 추가 버튼 눌렀을 때 hidden or show
function cantBtnSetting(key){
    const btnadd = document.getElementById('btnAdd')
    const btndelete = document.getElementById('btnDelete')
    const btnupdate = document.getElementById('btnUpdate')
    const btncancel = document.getElementById('btnCancel')
    const btnreset = document.getElementById('btnReset')
    const btnsave = document .getElementById('btnSave')

    if(key === "update"){
        btnadd.style.display = 'none'
        btndelete.style.display = 'none'
        btnupdate.style.display = 'none'
    }
    else if(key === "add"){

        btnupdate.style.display = 'none'
        btndelete.style.display = 'none'

    }
    btnreset.style.display = 'inline-block'
    btnsave.style.display = 'inline-block'
    btncancel.style.display = 'inline-block'

}

//취소 눌렀을 때
function canBtnSetting(){

    const btnadd = document.getElementById('btnAdd')
    const btndelete = document.getElementById('btnDelete')
    const btnupdate = document.getElementById('btnUpdate')
    const btncancel = document.getElementById('btnCancel')
    const btnreset = document.getElementById('btnReset')
    const btnsave = document .getElementById('btnSave')

    btnadd.style.display = 'inline-block'
    btnupdate.style.display = 'inline-block'

    btnreset.style.display = 'none'
    btnsave.style.display = 'none'
    btncancel.style.display = 'none'


}

//DataTable 스타일 유지, 기존 행 좌우 정렬 맞추기
//현재 데이터테이블에 입력 가능한 input, select 태그 한줄을 추가한다.
//td 셀 아래 input태그 추가하여 편집할 수 있도록 함
//편집가능한 한줄 만들기
function setEditableCell(row) {
    const cells = $(row).find('td');
    const rowIndex = $(row).index();  // 행의 인덱스 가져오기

    cells.each(function(cellIndex) {
        const fieldName = $(this).data('field');  // data-field 값 가져오기

        if (cellIndex === 0) {
            return;  // 첫 번째 열은 건너뛰기
        }


        const currentText = $(this).text();
        const width = $(this).width();

        // codeID 필드일 경우 maxlength 추가
        if (fieldName === "codeID") {
            $(this).html(`<input type="text"  
                class="custom-table-input" 
                value="${currentText}"
                style="width:${width}px" 
                name="basecodelist[${rowIndex}].${fieldName}"
                maxlength="${codeSize}">`); //codeSize 전역변수
        }
        else if (fieldName === "useYN") {
            $(this).html(`
                <select 
                    class="custom-table-input"
                    style="width:${width}px" 
                    name="basecodelist[${rowIndex}].${fieldName}">
                    <option value="Y" ${currentText === 'Y' ? 'selected' : ''}>Y</option>
                    <option value="N" ${currentText === 'N' ? 'selected' : ''}>N</option>
                </select>
            `);
        }
        else {
            $(this).html(`<input type="text"  
                class="custom-table-input" 
                value="${currentText}"
                style="width:${width}px" 
                name="basecodelist[${rowIndex}].${fieldName}">`);
        }

        // 오른쪽 정렬이 필요한 셀 처리
        if($(this).hasClass('right')) {
            $(this).find('input').css('text-align', 'right');
        }
    });

    // 첫 번째 입력 필드에 포커스
    $(row).find('input:first').focus();
}

//현재 데이터테이블의 tr td아래 편집가능한 input, select태그 추가
function setAllRowsEditable() {
    const rows = $('table tbody tr');

    rows.each(function(index) {
        const cells = $(this).find('td');

        cells.each(function(cellIndex) {
            const fieldName = $(this).data('field');  // data-field 값 가져오기

            if (cellIndex === 0) {
                return;  // 첫 번째 열은 건너뛰기
            }

            const currentText = $(this).text();
            const width = $(this).width();

            if (fieldName === "codeID") {
                $(this).html(`<input type="text"  
                    class="custom-table-input" 
                    value="${currentText}"
                    style="width:${width}px" 
                    name="basecodelist[${index}].${fieldName}"
                    maxlength="${codeSize}">`); //codeSize 전역변수
            }else if (fieldName === "useYN") {
                // useYN인 경우 select 박스 생성
                $(this).html(`
                    <select 
                        class="custom-table-input"
                        style="width:${width}px" 
                        name="basecodelist[${index}].${fieldName}">
                        <option value="Y" ${currentText === 'Y' ? 'selected' : ''}>Y</option>
                        <option value="N" ${currentText === 'N' ? 'selected' : ''}>N</option>
                    </select>
                `);
            }
            else{
                $(this).html(`<input type="text"  
                    class="custom-table-input" 
                    value="${currentText}"
                    style="width:${width}px" 
                    name="basecodelist[${index}].${fieldName}">`);
            }

            if($(this).hasClass('right')) {
                $(this).find('input').css('text-align', 'right');
            }
        });
    });
}



