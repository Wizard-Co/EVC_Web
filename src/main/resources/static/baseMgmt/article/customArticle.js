
    /**
     *설명          :
     *작성일         : 2024.월.일
     *개발자         : LJH
     *======================================================
     *DATE             AUTHOR               NOTE
     *------------------------------------------------------
     *2024.월.일       LJH                  최초 생성
     **/
let KCustomTable; // DataTable 객체를 전역으로 선언
let selectedRow;
let Mode ='1'; // 수정 추가 insert 문
let isSearching = false; // 팝업창 띄울때 중복 엔터 방지
let isPlusFinderOpen = false;
let isToggled = false; // 토글 상태 관리 변수
let isProcessing = false; // 처리 중 여부


window.addEventListener('load', function () {
    console.log('load 이벤트 실행됨');
    mainBtnSetting();  // 버튼 이벤트 설정
    KCustomTable = initializeDataTable();  // DataTable 초기화 후 참조
    attachTableEvents();  // 테이블 관련 이벤트 설정
});


function initializeDataTable() {
    console.log("initializeDataTable 함수 호출됨");
    return new DataTable('#KCustomTable', {
        buttons: [{
            extend: 'excel',
            filename: '거래처별 품명코드',
            title: '거래처별 품목코드',
            customize: function (xlsx) {
                let sheet = xlsx.xl.worksheets['sheet1.xml'];
                $('row:first c', sheet).attr('s', '42');
            }
        }],
        columns: [
            {data: "num", className: 'center'},
            {data: "KCustom", className: 'left', orderable: false},
            {data: "comments", className: 'left'},
            {data: "buyerArticleNo", className: 'left', orderable: false},
            {data: "article", className: 'left', orderable: false},
            {data: "CustomID",visible:false},
        ],
        scrollY: '50vh',  // 세로 스크롤을 설정 (화면의 50% 높이로 제한)
        scrollCollapse: true,
        paging: false  // 페이지네이션 비활성화
    });
}
document.getElementById('btnExcel').addEventListener("click", function () {

    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});

// function checkAndShowPersonIDInput() {
//     var sessionPersonID = $('#sessionPersonID').val().trim();
//
//     if (!sessionPersonID) {
//         console.log("세션 PersonID를 찾을 수 없습니다.");
//         window.location.href='/'
//         return ;
//     }
//     // User 객체 문자열에서 personID 값을 추출
//     var match = sessionPersonID.match(/personID=(\w+)\s*,/);
//     var extractedPersonID = match ? match[1].trim() : null;
//
//     console.log("추출된 PersonID:", extractedPersonID);
// }
// checkAndShowPersonIDInput();

function attachTableEvents() {
    // DataTable이 초기화된 후 tbody 요소가 동적으로 생성되므로, rows().nodes()로 접근
    let tbody = document.querySelector('#KCustomTable tbody');
    let tbody1 = document.querySelector('#KCustomTable1 tbody');
    let tbody2 = document.querySelector('#KCustomTable2 tbody');

    // #KCustomTable에서 행을 클릭할 때
    if (tbody) {
        tbody.onclick = function (event) {
            let rowElement = event.target.closest('tr');
            if (rowElement) {
                // 기존에 선택된 행에서 'selected' 클래스 제거
                let previouslySelectedRow = tbody.querySelector('.selected');
                if (previouslySelectedRow) {
                    previouslySelectedRow.classList.remove('selected');
                }

                // 선택된 행에 'selected' 클래스 추가
                rowElement.classList.add('selected');
                selectedRow = KCustomTable.row(rowElement).data(); // 선택된 행의 데이터 저장

                console.log("선택된 행:", selectedRow); // 선택된 행의 데이터 출력

                if (selectedRow && selectedRow.CustomID) {
                    // BusinessTypeCode에 따라 비즈니스 유형 설정
                    const businessTypeMap = {
                        '01': '매입',
                        '02': '매출',
                        // 필요 시 추가 매핑
                    };

                    // selectedRow에서 BusinessTypeCode를 확인하고 해당 값을 찾거나 '알 수 없음'을 기본값으로 사용
                    const businessTypeValue = businessTypeMap[selectedRow.businessTypeCode] || '알 수 없음';

                    // 서버에 전송할 파라미터 설정
                    let param = {
                        CustomID: selectedRow.CustomID,
                        businessType: businessTypeValue, // 비즈니스 유형 값 추가
                    };

                    console.log("서버에 전송할 데이터:", param);

                    // 첫 번째 요청: /article/customArticle/customArticle
                    fetch("/article/customArticle/customArticle", {
                        method: "POST",
                        body: JSON.stringify(param),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); // JSON 형식으로 응답 받기
                            } else {
                                throw new Error("Network response was not ok");
                            }
                        })
                        .then((data) => {
                            console.log("서버에서 받은 데이터:", data); // 서버 응답 확인
                            updateTable2(data); // #KCustomTable2 업데이트
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });

                    // 두 번째 요청: /article/customArticle/customArticleDetail
                    fetch("/article/customArticle/customArticleDetail", {
                        method: "POST",
                        body: JSON.stringify(param),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); // JSON 형식으로 응답 받기
                            } else {
                                throw new Error("Network response was not ok");
                            }
                        })
                        .then((data) => {
                            console.log("서버에서 받은 데이터 (Detail):", data); // 서버 응답 확인
                            updateTable1(data); // #KCustomTable1 업데이트
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });
                    const customIDField = document.getElementById('customID');
                    if (customIDField) {
                        customIDField.value = selectedRow.CustomID;  // 거래처 ID 넣기
                    }

                    // KCustom 텍스트박스에 선택된 거래처의 정보를 넣기
                    const kCustomTextbox = document.getElementById('KCustom');
                    if (kCustomTextbox) {
                        kCustomTextbox.value = selectedRow.KCustom;  // 거래처 이름 넣기 (필요한 값으로 변경 가능)
                    }
                }
            }
        };
    }
    // #KCustomTable1에서 더블클릭 시
    // if (tbody1) {
    //     tbody1.ondblclick = function (event) {
    //         let rowElement = event.target.closest('tr');
    //         if (rowElement) {
    //             // 더블클릭된 행의 데이터 가져오기
    //             let rowData = {
    //                 buyerArticleNo: rowElement.cells[2].innerText, // 품번
    //                 article: rowElement.cells[3].innerText, // 품명
    //                 ArticleID: rowElement.cells[4].innerText, // 추가적인 데이터
    //             };
    //
    //             console.log("선택된 #KCustomTable1 행:", rowData);
    //
    //             // #KCustomTable2에 데이터 추가
    //             addRowToTable(tbody2, rowData, true);
    //
    //             // 행 삭제
    //             rowElement.remove();
    //
    //             // 건수 업데이트
    //             updateCounts();
    //         }
    //     };
    // }
    //
    // if (tbody2) {
    //     tbody2.ondblclick = function (event) {
    //         let rowElement = event.target.closest('tr');
    //         if (rowElement) {
    //             const rowData = {
    //                 buyerArticleNo: rowElement.cells[2].innerText, // 품번
    //                 article: rowElement.cells[3].innerText,       // 품명
    //                 ArticleID: rowElement.cells[4]?.innerText || '',
    //             };
    //
    //             // 행 추가
    //             addRowToTable(tbody1, rowData, false);
    //
    //             // 행 삭제
    //             rowElement.remove();
    //
    //             // 건수 업데이트
    //             updateCounts();
    //         }
    //     };
    // }
}

// 행 추가 함수 (양쪽 테이블에 사용)
function addRowToTable(tbody, rowData, withInputs = true) {
    const noDataRow = tbody.querySelector('#noDataRow');
    if (noDataRow) {
        noDataRow.remove(); // "데이터가 없습니다" 메시지 제거
    }
    const row = document.createElement('tr');
    if (withInputs) {
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${tbody.rows.length + 1}</td>
            <td>${rowData.buyerArticleNo || ''}</td>
            <td>${rowData.article || ''}</td>
            <td><input type="text" placeholder="투자단가" name="InvestmentUnitPrice" value=""></td>
            <td><input type="text" placeholder="단가" name="UnitPrice" value=""></td>
            <td><input type="text" placeholder="영업수수료" name="businessCommission" value=""></td>
            <td style="display:none">${rowData.ArticleID || ''}</td>
        `;
    } else {
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${tbody.rows.length + 1}</td>
            <td>${rowData.buyerArticleNo || ''}</td>
            <td>${rowData.article || ''}</td>
            <td style="display:none">${rowData.ArticleID || ''}</td>
        `;
    }
    tbody.appendChild(row);
}
// 화살표 버튼 클릭 시 이동
function setupArrowButtonEvents() {
    const saveBtn = document.getElementById('btnSave');  // 'saveBtn' -> 'btnSave'로 수정

    if (!saveBtn) {
        console.error("btnSave 요소를 찾을 수 없습니다.");
        return;  // btnSave가 없으면 함수 종료
    }

    // 오른쪽 화살표 버튼
    document.getElementById('rightArrow').addEventListener('click', function() {
        if (isSaveButtonEnabled()) {
            moveCheckedRowsBetweenTables('#KCustomTable1', '#KCustomTable2');
            resetRowNumbers('#KCustomTable1');  // 첫 번째 테이블 순번 초기화
            resetRowNumbers('#KCustomTable2');  // 두 번째 테이블 순번 초기화
        } else {
            alert('수정이나 추가버튼을 눌러주세요');
        }
    });

    // 왼쪽 화살표 버튼
    document.getElementById('leftArrow').addEventListener('click', function() {
        if (isSaveButtonEnabled()) {
            moveCheckedRowsBetweenTables('#KCustomTable2', '#KCustomTable1');
            resetRowNumbers('#KCustomTable1');  // 첫 번째 테이블 순번 초기화
            resetRowNumbers('#KCustomTable2');  // 두 번째 테이블 순번 초기화
        } else {
            alert('수정이나 추가버튼을 눌러주세요');
        }
    });
}
//추가나 수정버튼 눌렷는지 검증하는 함수
function isSaveButtonEnabled() {
    const saveBtn = document.getElementById('btnSave');
    console.log("saveBtn.disabled:", saveBtn.disabled);  // 상태 확인
    return saveBtn && !saveBtn.disabled;  // 저장 버튼이 활성화된 상태인지 확인
}
//순번 초기화 함수
function resetRowNumbers(tableSelector) {
    const table = document.querySelector(tableSelector);
    const rows = table.querySelectorAll('tbody tr');  // 각 행을 선택
    rows.forEach((row, index) => {
        const cell = row.querySelector('td:nth-child(2)');  // 두 번째 셀을 순번 셀로 사용
        if (cell) {
            cell.innerText = index + 1;  // 순번을 1부터 시작하도록 설정
        }
    });
}

function moveCheckedRowsBetweenTables(fromTableId, toTableId) {
    const fromTable = document.querySelector(fromTableId);
    const toTable = document.querySelector(toTableId);

    // 체크된 행들 가져오기
    const checkedRows = fromTable.querySelectorAll('tbody .row-checkbox:checked');
    if (checkedRows.length === 0) {
        alert('선택된 행이 없습니다.');
        return;
    }

    // 각 체크된 행 처리
    checkedRows.forEach((checkbox) => {
        const rowElement = checkbox.closest('tr'); // 체크박스가 속한 행

        if (rowElement) {
            // 행의 데이터 가져오기
            const rowData = {
                buyerArticleNo: rowElement.cells[2].innerText, // 품번
                article: rowElement.cells[3].innerText,       // 품명
                ArticleID: rowElement.cells[4]?.innerText || '' // 추가 데이터
            };

            // 테이블 간 이동 시 withInputs 조정
            const withInputs = toTableId === '#KCustomTable2'; // 테이블 2로 이동 시 true, 테이블 1로 이동 시 false

            // 이동할 테이블에 데이터 추가
            addRowToTable(toTable.querySelector('tbody'), rowData, withInputs);

            // 원래 테이블에서 행 삭제
            rowElement.remove();
        }
    });

    // 건수 업데이트
    updateCounts();
}

// 테이블 행 선택을 위한 이벤트 추가
function setupRowSelection() {
    // #KCustomTable1 행 선택
    document.querySelector('#KCustomTable1 tbody').addEventListener('click', function (event) {
        const row = event.target.closest('tr');
        if (row && event.target.type !== 'checkbox') {
            toggleRowSelection(row);
        }
    });

    // #KCustomTable2 행 선택
    document.querySelector('#KCustomTable2 tbody').addEventListener('click', function (event) {
        const row = event.target.closest('tr');
        if (row && event.target.type !== 'checkbox') {
            toggleRowSelection(row);
        }
    });
    document.querySelectorAll('.row-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const row = this.closest('tr');
            if (this.checked) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });
    });
}

// 선택된 행에 클래스 토글 (선택 상태)
    function toggleRowSelection(row) {
        row.classList.toggle('selected');
    }

// 페이지 로딩 후 설정
window.addEventListener('load', function () {
    setupArrowButtonEvents(); // 화살표 버튼 설정
    //attachTableEvents(); // 더블클릭 이벤트 설정
    setupRowSelection(); // 행 선택 설정

});

function mainBtnSetting() {
    console.log('mainBtnSetting 함수 실행됨');
    const searchBtn = document.getElementById('btnSearch');
    const saveBtn = document.getElementById('btnSave');
    const updateBtn = document.getElementById('btnUpdate');
    const btnAdd = document.getElementById('btnAdd');
    const btnDelete = document.getElementById("btnDelete");
    const btnCancel = document.getElementById("btnCancel");
    // 검색 버튼 클릭 이벤트
    if (searchBtn) {
        console.log("btnSearch 버튼이 로드되었습니다.");
        searchBtn.addEventListener("click", function () {
            console.log("조회 버튼 클릭됨");
            Search();  // 조회 함수 호출
        });
    }

    if (btnDelete) {
        btnDelete.addEventListener("click", function () {
            btnDelete.disabled = true;
            console.log("삭제버튼 클릭됨")
            deleteData();
        });
    }
   //저장
    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            console.log("저장 버튼 클릭됨");

            // 현재 두 테이블 데이터를 저장
            saveInitialTableData();

            // 저장 버튼 비활성화
            saveBtn.disabled = true; // 저장 버튼 비활성화

            // 버튼 가시성 초기화
            toggleButtonsVisibility(true);
        });
    }

// 취소 버튼 클릭 시 두 테이블 복원


// 추가나 수정 버튼 클릭 시 초기 데이터 저장
    if (btnAdd || updateBtn) {
        [btnAdd, updateBtn].forEach(button => {
            if (button) {
                button.addEventListener("click", saveInitialTableData);
            }
        });
    }

// 페이지 로드 시 초기 데이터 저장
    document.addEventListener("DOMContentLoaded", saveInitialTableData);

    if (btnAdd) {
    btnAdd.addEventListener("click", function () {

        console.log("추가 버튼 클릭됨");
        iMode = '1'; // 추가 모드로 설정
        console.log("mode 값:", iMode); // mode 값 확인 (1로 설정되어야 합니다.)

        document.getElementById('KCustom').value = ''; // KCustom 텍스트박스 초기화
        document.getElementById('customID').value = ''; // customID 히든값 초기화

        // 저장 버튼 활성화
        if (saveBtn) {
            saveBtn.disabled = false;  // 저장 버튼 활성화
            saveBtn.style.visibility = 'visible'; // 저장 버튼 보이도록 설정
        }
        // 추가 시 수정, 삭제, 조회 버튼 숨김 처리
        toggleButtonsVisibility(false);  // 추가 모드에서 필요한 버튼만 보이도록 설정
        Search();
    });
}
let originalValues = []; // 원래 값을 저장할 배열

// 수정 버튼 클릭 시
if (updateBtn) {
    updateBtn.addEventListener("click", function () {
        console.log("수정 버튼 클릭됨");
        iMode = '2'; // 수정 모드로 설정

        // #KCustomTable2의 각 행을 순회하며 수정 모드로 전환
        document.querySelectorAll('#KCustomTable2 tbody tr').forEach((row, index) => {
            const cells = row.querySelectorAll('td');

            // 기존 값 저장 (원래 값 저장)
            const investmentCell = cells[4];
            const unitPriceCell = cells[5];
            const commissionCell = cells[6];

            originalValues[index] = {
                investment: investmentCell.innerText.trim(),
                unitPrice: unitPriceCell.innerText.trim(),
                commission: commissionCell.innerText.trim(),
            };

            // 투자단가 (4번째 열)
            const investmentValue = investmentCell.innerText.trim();
            investmentCell.innerHTML = `<input type="text" placeholder="투자단가" name="InvestmentUnitPrice" value="${investmentValue}">`;

            // 단가 (5번째 열)
            const unitPriceValue = unitPriceCell.innerText.trim();
            unitPriceCell.innerHTML = `<input type="text" placeholder="단가" name="UnitPrice" value="${unitPriceValue}">`;

            // 영업수수료 (6번째 열)
            const commissionValue = commissionCell.innerText.trim();
            commissionCell.innerHTML = `<input type="text" placeholder="영업수수료" name="businessCommission" value="${commissionValue}">`;
        });

        // 수정 모드에서 저장 버튼 활성화
        if (saveBtn) {
            saveBtn.disabled = false;  // 저장 버튼 활성화
            saveBtn.style.visibility = 'visible'; // 저장 버튼 보이도록 설정
        }

        // 추가, 삭제 버튼 숨김 처리 (수정 모드에서는 저장만 가능)
        toggleButtonsVisibility(false);
    });
}

// 취소 버튼 클릭 시
    if (btnCancel) {
        btnCancel.addEventListener("click", function () {
            console.log("취소 버튼 클릭됨");

            // 두 테이블을 초기 상태로 복원
            restoreTablesToInitialState();

            // 저장 버튼 비활성화
            saveBtn.disabled = true; // 저장 버튼 비활성화

            // 버튼 가시성 초기화
            toggleButtonsVisibility(true);
        });
    }

// 페이지 로드 시 원래 값을 저장
document.addEventListener("DOMContentLoaded", function () {
    // 페이지 로드 후 원래 값들을 저장
    document.querySelectorAll('#KCustomTable2 tbody tr').forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        originalValues[index] = {
            investment: cells[4].innerText.trim(),
            unitPrice: cells[5].innerText.trim(),
            commission: cells[6].innerText.trim(),
        };
    });
});


// 버튼 보이거나 숨기는 함수 (true = 모두 보이기, false = 수정/추가 시 필요한 버튼만 보이기)
    function toggleButtonsVisibility(showAll) {
        if (updateBtn) {
            updateBtn.style.visibility = showAll ? 'visible' : 'hidden';
        }
        if (btnDelete) {
            btnDelete.style.visibility = showAll ? 'visible' : 'hidden';
        }
        if (searchBtn) {
            searchBtn.style.visibility = showAll ? 'visible' : 'hidden';
        }
        if (btnAdd) {
            btnAdd.style.visibility = showAll ? 'visible' : 'hidden';
        }
        if (btnCancel) {
            btnCancel.style.visibility = 'visible'; // 취소 버튼은 계속 보이도록 설정
        }
    }
}
//Article 플러스파인더

function saveData() {
    if (selectedRow && selectedRow.CustomID) {
        const tableData = [];
        const tbody2 = document.querySelector('#KCustomTable2 tbody');

        // #KCustomTable2가 비어 있는지 체크
        const isTableEmpty = tbody2 && tbody2.rows.length === 0;

        // #KCustomTable2에 데이터가 있을 경우, 각 행을 처리
        if (!isTableEmpty) {
            document.querySelectorAll('#KCustomTable2 tbody tr').forEach(row => {
                if (iMode === '1') {  // mode가 1일 때만 처리
                    const rowData = {
                        CustomID: document.getElementById('customID').value, // hidden input에서 CustomID 가져오기
                        ArticleID: row.cells[7]?.innerText || '', // ArticleID 추가
                        article: row.cells[3]?.innerText || '',  // article 내용 추가
                        buyerArticleNo: row.cells[2]?.innerText || '',  // buyerArticleNo 내용 추가
                        InvestmentUnitPrice: row.cells[4]?.querySelector('input')?.value || '',  // 투자 단가
                        UnitPrice: row.cells[5]?.querySelector('input')?.value || '',  // 단가
                        businessCommission: row.cells[6]?.querySelector('input')?.value || '',  // 사업 수수료
                        PersonId: "admin", // 사용자 ID
                        mode: iMode  // mode는 1
                    };
                    console.log("Row Data (mode 1):", rowData); // mode 1일 때 rowData 출력
                    tableData.push(rowData); // tableData에 추가
                }
                if (iMode === '2') {  // mode가 2일 때만 처리
                    const rowData = {
                        CustomID: document.getElementById('customID').value, // hidden input에서 CustomID 가져오기
                        ArticleID: row.cells[7]?.innerText || '', // ArticleID 추가
                        article: row.cells[3]?.innerText || '',  // article 내용 추가
                        buyerArticleNo: row.cells[2]?.innerText || '',  // buyerArticleNo 내용 추가
                        InvestmentUnitPrice: row.cells[4]?.querySelector('input')?.value || '',  // 투자 단가
                        UnitPrice: row.cells[5]?.querySelector('input')?.value || '',  // 단가
                        businessCommission: row.cells[6]?.querySelector('input')?.value || '',  // 사업 수수료
                        PersonId: "admin", // 사용자 ID
                        mode: "2"  // mode는 2
                    };
                    console.log("Row Data (mode 2):", rowData); // mode 2일 때 rowData 출력
                    tableData.push(rowData); // tableData에 추가
                }
            });
        }

        // #KCustomTable2가 비어있으면 CustomID만 서버로 전송 (mode === '2'일 때만)
        if (isTableEmpty &&  mode==='2') {
            const rowData = {
                CustomID: selectedRow.CustomID, // CustomID 추가
                ArticleID: null,  // ArticleID는 비워둠
                PersonId: "admin",  // 사용자 ID
                mode: '2'  // mode는 2
            };
            console.log("Row Data (Empty Table):", rowData); // rowData 출력
            tableData.push(rowData);  // tableData에 추가
        }
        // 각각의 데이터를 개별적으로 서버로 전송
        tableData.forEach((rowData) => {
            fetch('/article/customArticle/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rowData) // 개별 데이터 전송

            })
                .then(response => {
                    if (!response.ok) {
                        console.log('HTTP 에러 발생: ', response);
                        throw new Error('서버와의 통신 오류');
                    }
                    return response.json(); // JSON 응답 처리
                })
                .then(data => {
                    console.log('저장 성공:', data);
                })
                .catch(error => {
                    console.log('예상치 못한 오류 발생: ', error);
                });
        });

        // 저장 후 페이지 새로고침
        window.addEventListener("load", () => {
            if (typeof Search === "function") {
                Search();
            }
        });
        console.log('저장 프로세스가 완료되었습니다.');
    } else {
        console.log('저장할 항목이 선택되지 않았습니다.');
    }
}
//delete 함수
function deleteData() {
    if (selectedRow && selectedRow.CustomID) {
        const deleteDataArray = [];
        document.querySelectorAll('#KCustomTable2 tbody tr').forEach(row => {
            const rowData = {
                CustomID: selectedRow.CustomID, // CustomID 추가
                ArticleID: row.cells[6]?.innerText || '' // ArticleID
            };
            deleteDataArray.push(rowData);
        });

        // 각각의 데이터를 개별적으로 서버로 전송
        deleteDataArray.forEach((rowData) => {
            fetch('/baseMgmt/customArticle/delete', { // DELETE 요청 엔드포인트 설정
                method: 'POST', // 서버가 DELETE 메소드를 지원하지 않으면 POST 사용
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rowData) // JSON 데이터로 전송
            })
                .then(response => {
                    if (!response.ok) {
                        console.log('HTTP 에러 발생: ', response);
                        throw new Error('서버와의 통신 오류');
                    }
                    return response.json(); // JSON 응답 처리
                })
                .then(data => {
                    console.log('삭제 성공:', data);
                })
                .catch(error => {
                    console.log('예상치 못한 오류 발생: ', error);
                });
        });

        console.log('삭제 프로세스가 완료되었습니다.');
    } else {
        console.log('삭제할 항목이 선택되지 않았습니다.');
    }
}

// Search 함수 정의
document.addEventListener('DOMContentLoaded', function () {
    // 초기 조회 실행
    Search();

    // 토글 버튼 클릭 이벤트
    document.getElementById('toggleButton').addEventListener('click', function () {
        if (isProcessing) {
            return; // 데이터 처리 중이면 클릭을 무시
        }

        isProcessing = true; // 데이터 처리 시작
        isToggled = !isToggled; // 토글 상태 변경

        // 버튼 텍스트 변경
        document.getElementById('toggleButton').textContent =
            isToggled ? "기본 조회로 전환" : "전체 조회로 전환";

        // URL 변경 후 자동 조회
        Search().finally(() => {
            isProcessing = false;  // 처리 완료 후 버튼 활성화
        });
    });
});

// Search 함수 정의
function Search() {
    console.log("Search 함수 호출됨");
    document.getElementById('KCustom').value = ''; // KCustom 텍스트박스 초기화
    document.getElementById('customID').value = ''; // customID 히든값 초기화
    const tbody2 = document.querySelector('#KCustomTable2 tbody');
    tbody2.innerHTML = ''; // 테이블 초기화
    document.querySelector('#selectCount').textContent = '0'; // 결과 건수 초기화

    let param = {
        KCustom: document.getElementById('KCustom').value,
        businessTypeCode: document.getElementById('businessTypeCode').value,
    };


    // URL 설정 (토글 상태에 따라 변경)
    const currentURL = isToggled ? "/article/customArticle/allCustomArticle" : "/article/customArticle/search";

    // 서버로 요청 보내기
    return fetch(currentURL, {
        method: "POST", // 'POST' 방식으로 요청
        body: JSON.stringify(param),
        headers: {
            "Content-Type": "application/json" // 요청 본문이 JSON 형식임을 명시
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // JSON 형식으로 응답 받기
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            if (data && data.length > 0) {
                // 데이터에 번호 추가
                data.forEach((item, index) => {
                    item.num = index + 1;
                });

                // DataTable 업데이트
                KCustomTable.clear().rows.add(data).draw();
                console.log("데이터 테이블 업데이트 완료");

                // 건수 표시 업데이트
                document.querySelector('#resultCount').textContent = data.length;
            } else {
                console.log("데이터가 없습니다.");
                KCustomTable.clear().draw(); // 데이터가 없을 경우 테이블 비우기
            }
        })
        .catch(error => {
            console.error("Error:", error);
        })
        .finally(() => {
            // 첫 번째 요청 처리 후 두 번째 요청 실행
            fetchArticles(param);

        });
}

// 개별 체크박스의 상태가 변경될 때, 전체 선택 체크박스의 상태를 업데이트


    function handleKeyup(event, value) {
        // 입력값을 param 객체에 추가
        let param = {
            KCustom: document.getElementById('KCustom').value,
            businessTypeCode: document.getElementById('businessTypeCode').value,
            article: value  // 입력된 품명값
        };

        if (event.key === 'Enter') {
            fetchArticles(param);  // article 값이 param에 포함되어 서버로 넘겨짐
        }
    }
// 두 번째 fetch 요청 (전체 품목 조회)
    function fetchArticles(searchValue) {
        console.log("검색어:", searchValue);

        fetch("/article/customArticle/article", {
            method: "POST", // 'POST' 방식으로 요청
            body: JSON.stringify(searchValue),
            headers: {
                "Content-Type": "application/json" // 요청 본문이 JSON 형식임을 명시
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json(); // JSON 형식으로 응답 받기
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                console.log("서버에서 받은 데이터:", data); // 서버 응답 확인

                const tbody1 = document.querySelector('#KCustomTable1 tbody');
                tbody1.innerHTML = ''; // 기존 테이블 내용 삭제

                // 품목 건수 업데이트
                const articleCount = data.length;
                document.querySelector('#articleCountValue').textContent = articleCount; // 건수 업데이트

                if (data && data.length > 0) {
                    data.forEach((item, index) => {
                        const row = document.createElement('tr');

                        // 체크박스 추가
                        const checkboxCell = document.createElement('td');
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.classList.add('row-checkbox');  // 체크박스에 클래스 추가
                        checkbox.setAttribute('data-id', item.ArticleID);  // 각 체크박스에 ArticleID를 데이터 속성으로 추가

                        // 초기 상태 설정 (전체선택 체크박스에 따라 체크 여부 설정 가능)
                        checkbox.checked = false; // 기본적으로 체크하지 않음
                        checkboxCell.appendChild(checkbox);

                        // 나머지 데이터 행 추가
                        row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" data-id="${item.ArticleID || ''}"></td> <!-- 체크박스 추가 -->
                    <td>${index + 1}</td>
                    <td>${item.buyerArticleNo || ''}</td>
                    <td>${item.article || ''}</td>
                    <td style="display:none">${item.ArticleID || ''}</td>  
                `;

                        tbody1.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
    function updateTable2(data, businessTypeCode) {
        const tbody2 = document.querySelector('#KCustomTable2 tbody');
        tbody2.innerHTML = '';

        if (data && data.length > 0) {
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" data-id="${item.ArticleID || ''}"></td> <!-- 체크박스 추가 -->
                <td>${index + 1}</td>
                <td>${item.buyerArticleNo || ''}</td>
                <td>${item.article || ''}</td>
                <td>${item.InvestmentUnitPrice || ''}</td>
                <td>${item.UnitPrice || ''}</td>
                <td>${item.businessCommission || ''}</td>
                <td style="display:none">${item.ArticleID || ''}</td> <!-- ArticleID 추가 -->
            `;
                tbody2.appendChild(row);
            });

            // BusinessTypeCode에 맞는 값 표시
            const businessTypeMap = {
                '01': '매입',
                '02': '매출',
                // 필요 시 추가 매핑
            };
            const articleCount = data.length;
            document.querySelector('#selectCount').textContent = articleCount; // 건수를 표시
        }
    }
    function updateTable1(data) {
        console.log("테이블1 업데이트 데이터:", data);

        const tbody1 = document.querySelector('#KCustomTable1 tbody');
        tbody1.innerHTML = ''; // 기존 테이블 내용 삭제

        // 품목 건수 업데이트
        const articleCount = data.length;
        document.querySelector('#articleCountValue').textContent = articleCount; // 건수 업데이트

        if (data && data.length > 0) {
            data.forEach((item, index) => {
                const row = document.createElement('tr');

                // 체크박스 추가
                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('row-checkbox'); // 체크박스에 클래스 추가
                checkbox.setAttribute('data-id', item.ArticleID); // 각 체크박스에 ArticleID를 데이터 속성으로 추가

                // 초기 상태 설정 (전체선택 체크박스에 따라 체크 여부 설정 가능)
                checkbox.checked = false; // 기본적으로 체크하지 않음
                checkboxCell.appendChild(checkbox);

                // 나머지 데이터 행 추가
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.buyerArticleNo || ''}</td>
                <td>${item.article || ''}</td>
                <td style="display:none">${item.ArticleID || ''}</td>
            `;
                // 체크박스 추가
                row.insertBefore(checkboxCell, row.firstChild);

                tbody1.appendChild(row);
            });
        }
    }

//건수 업데이트
function updateCounts() {
    // KCustomTable1의 데이터 건수 업데이트
    const table1Count = document.querySelector('#KCustomTable1 tbody').rows.length;
    document.querySelector('#articleCountValue').textContent = table1Count; // 건수 표시

    // KCustomTable2의 데이터 건수 업데이트
    const table2Count = document.querySelector('#KCustomTable2 tbody').rows.length;
    document.querySelector('#selectCount').textContent = table2Count; // 건수 표시
}
document.querySelector('#selectAll2').addEventListener('change', function () {
    const isChecked = this.checked;
    document.querySelectorAll('#KCustomTable2 tbody input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
});
document.querySelector('#selectAll1').addEventListener('change', function () {
    const isChecked = this.checked;
    document.querySelectorAll('#KCustomTable1 tbody input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
});

function setPlusFinderData(txtID, txtName, PfID, PfName) {
    // 전달받은 값으로 부모창의 필드에 설정
    document.getElementById(txtID).value = PfID;  // CustomID에 값 설정
    document.getElementById(txtName).value = PfName;  // KCustom에 값 설정

    // selectedRow 관련 코드 제거
}

let originalTableData = {
    table1Data: [], // 테이블 1 초기 데이터
    table2Data: []  // 테이블 2 초기 데이터
};

// 현재 두 테이블 데이터를 저장
function saveInitialTableData() {
    // 테이블 1 데이터 저장
    originalTableData.table1Data = [];
    document.querySelectorAll('#KCustomTable1 tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        originalTableData.table1Data.push({
            buyerArticleNo: cells[2].innerText.trim(),
            article: cells[3].innerText.trim(),
            articleID: cells[4]?.innerText.trim() || ''
        });
    });

    // 테이블 2 데이터 저장
    originalTableData.table2Data = [];
    document.querySelectorAll('#KCustomTable2 tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        originalTableData.table2Data.push({
            buyerArticleNo: cells[2].innerText.trim(),
            article: cells[3].innerText.trim(),
            investment: cells[4]?.innerText.trim() || '',
            unitPrice: cells[5]?.innerText.trim() || '',
            commission: cells[6]?.innerText.trim() || '',
            articleID: cells[7]?.innerText.trim() || ''
        });
    });

    console.log("현재 두 테이블 데이터 저장 완료:", originalTableData);
}

// 두 테이블을 초기 상태로 복원
    function restoreTablesToInitialState() {
        // 테이블 1 복원
        const table1Body = document.querySelector('#KCustomTable1 tbody');
        table1Body.innerHTML = ''; // 기존 내용 제거
        originalTableData.table1Data.forEach((data, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${index + 1}</td>
            <td>${data.buyerArticleNo}</td>
            <td>${data.article}</td>
            <td style="display:none">${data.articleID}</td>
        `;
            table1Body.appendChild(row);
        });

        // 테이블 2 복원
        const table2Body = document.querySelector('#KCustomTable2 tbody');
        table2Body.innerHTML = ''; // 기존 내용 제거
        originalTableData.table2Data.forEach((data, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${index + 1}</td>
            <td>${data.buyerArticleNo}</td>
            <td>${data.article}</td>
            <td>${data.investment}</td>
            <td>${data.unitPrice}</td>
            <td>${data.commission}</td>
            <td style="display:none">${data.articleID}</td>
        `;
            table2Body.appendChild(row);
        });

        // 건수 업데이트 (기존 함수 사용)
        updateCounts();

        console.log("두 테이블이 초기 상태로 복원되었습니다.");
    }









