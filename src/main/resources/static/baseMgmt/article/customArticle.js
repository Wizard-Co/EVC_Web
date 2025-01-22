
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
                selectedRow = KCustomTable.row(rowElement).data();  // 선택된 행의 데이터 저장

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
                        businessType: businessTypeValue  // 비즈니스 유형 값 추가
                    };

                    console.log("서버에 전송할 데이터:", param);

                    // 서버 요청
                    fetch("/article/customArticle/customArticle", {
                        method: "POST",
                        body: JSON.stringify(param),
                        headers: {
                            "Content-Type": "application/json"
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
                            updateTable2(data); // #KCustomTable2 업데이트

                            // UI 업데이트: BusinessTypeCode에 맞는 값 표시
                            document.getElementById('businessTypeCaptionValue').textContent = businessTypeValue;
                        })
                        .catch(error => {
                            console.error("Error:", error);
                        });
                }
            }
        };
    }
    // #KCustomTable1에서 더블클릭 시
    if (tbody1) {
        tbody1.ondblclick = function (event) {
            let rowElement = event.target.closest('tr');
            if (rowElement) {
                // 더블클릭된 행의 데이터 가져오기
                let rowData = {
                    buyerArticleNo: rowElement.cells[1].innerText, // 품번
                    article: rowElement.cells[2].innerText, // 품명
                    ArticleID: rowElement.cells[3].innerText, // 추가적인 데이터
                };

                console.log("선택된 #KCustomTable1 행:", rowData);

                // #KCustomTable2에 데이터 추가
                addRowToTable(tbody2, rowData, true);

                // 행 삭제
                rowElement.remove();

                // 건수 업데이트
                updateCounts();
            }
        };
    }

    if (tbody2) {
        tbody2.ondblclick = function (event) {
            let rowElement = event.target.closest('tr');
            if (rowElement) {
                const rowData = {
                    buyerArticleNo: rowElement.cells[1].innerText, // 품번
                    article: rowElement.cells[2].innerText,       // 품명
                    ArticleID: rowElement.cells[3]?.innerText || '',
                };

                // 행 추가
                addRowToTable(tbody1, rowData, false);

                // 행 삭제
                rowElement.remove();

                // 건수 업데이트
                updateCounts();
            }
        };
    }
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
    // 오른쪽 화살표 버튼
    document.getElementById('rightArrow').addEventListener('click', function () {
        moveRowBetweenTables('#KCustomTable1', '#KCustomTable2');
    });

    // 왼쪽 화살표 버튼
    document.getElementById('leftArrow').addEventListener('click', function () {
        moveRowBetweenTables('#KCustomTable2', '#KCustomTable1');
    });
}

// 화살표를 클릭했을 때 행 이동 함수
function moveRowBetweenTables(fromTableId, toTableId) {
    const fromTable = document.querySelector(fromTableId);
    const toTable = document.querySelector(toTableId);
    const selectedRow = fromTable.querySelector('tr.selected'); // 선택된 행

    if (selectedRow) {
        const rowData = {
            buyerArticleNo: selectedRow.cells[1].innerText,  // 품번
            article: selectedRow.cells[2].innerText,         // 품명
        };

        // 선택된 행 삭제
        selectedRow.remove();

        // 다른 테이블로 추가
        addRowToTable(toTable.querySelector('tbody'), rowData, false);

        // 건수 업데이트
        updateCounts();
    } else {
        alert('선택된 행이 없습니다.');
    }
}

// 테이블 행 선택을 위한 이벤트 추가
function setupRowSelection() {
    // #KCustomTable1 행 선택
    document.querySelector('#KCustomTable1 tbody').addEventListener('click', function (event) {
        const row = event.target.closest('tr');
        if (row) {
            toggleRowSelection(row);
        }
    });

    // #KCustomTable2 행 선택
    document.querySelector('#KCustomTable2 tbody').addEventListener('click', function (event) {
        const row = event.target.closest('tr');
        if (row) {
            toggleRowSelection(row);
        }
    });
}

// 선택된 행에 클래스 토글 (선택 상태)
function toggleRowSelection(row) {
    const previouslySelectedRow = document.querySelector('.selected');
    if (previouslySelectedRow && previouslySelectedRow !== row) {
        previouslySelectedRow.classList.remove('selected');
    }
    row.classList.toggle('selected');
}

// 페이지 로딩 후 설정
window.addEventListener('load', function () {
    setupArrowButtonEvents(); // 화살표 버튼 설정
    attachTableEvents(); // 더블클릭 이벤트 설정
    setupRowSelection(); // 행 선택 설정

});

function mainBtnSetting() {
    console.log('mainBtnSetting 함수 실행됨');
    const searchBtn = document.getElementById('btnSearch');
    const saveBtn = document.getElementById('btnSave');
    const updateBtn = document.getElementById('btnUpdate');
    const btnAdd = document.getElementById('btnAdd');
    const btnDelete = document.getElementById("btnDelete");
    // 검색 버튼 클릭 이벤트
    if (searchBtn) {
        console.log("btnSearch 버튼이 로드되었습니다.");
        searchBtn.addEventListener("click", function () {
            console.log("조회 버튼 클릭됨");
            Search();  // 조회 함수 호출
        });
    }

    // 저장 버튼 클릭 이벤트
    if (saveBtn) {
        saveBtn.disabled = true;  // 처음에는 비활성화
        saveBtn.addEventListener("click", function () {
            console.log("저장 버튼 클릭됨");
            saveData();  // 저장 로직 호출

            saveBtn.disabled = true;

            // showModal();
        });

    }
    //모달 표시함수
    // function showModal() {
    //     const modal = document.getElementById("saveModal");
    //     const backdrop = document.getElementById("modalBackdrop");
    //
    //     modal.style.display = "block";
    //     backdrop.style.display = "block";
    //
    //     const closeModalBtn = document.getElementById("closeModalBtn");
    //     closeModalBtn.addEventListener("click", () => {
    //             modal.style.display = "none";
    //             backdrop.style.display = "none";
    //         }
    //     );
    // }
    if(btnDelete){
        btnDelete.addEventListener("click", function(){
            btnDelete.disabled =true;
            console.log("삭제버튼 클릭됨")
            deleteData();
        });
    }

    // 수정 버튼 클릭 이벤트
    if (updateBtn) {
        updateBtn.addEventListener("click", function () {
            console.log("수정 버튼 클릭됨");
            iMode = '2'; // 수정 모드로 설정
            console.log("mode 값:", iMode); // mode 값 확인 (2로 설정되어야 합니다.)

            // 저장 버튼 활성화
            if (saveBtn) {
                saveBtn.disabled = false;  // 수정 모드에서만 저장 버튼 활성화
            }
            // 모든 행에 대해 투자단가, 단가, 영업수수료를 입력할 수 있도록 변환
            document.querySelectorAll('#KCustomTable2 tbody tr').forEach(row => {
                const cells = row.querySelectorAll('td');

                // 투자단가 (4번째 열)
                const investmentCell = cells[3];
                const investmentValue = investmentCell.innerText.trim(); // 기존 값 저장
                investmentCell.innerHTML = `<input type="text" placeholder="투자단가" name="InvestmentUnitPrice" value="${investmentValue}">`;

                // 단가 (5번째 열)
                const unitPriceCell = cells[4];
                const unitPriceValue = unitPriceCell.innerText.trim(); // 기존 값 저장
                unitPriceCell.innerHTML = `<input type="text" placeholder="단가" name="UnitPrice" value="${unitPriceValue}">`;

                // 영업수수료 (6번째 열)
                const commissionCell = cells[5];
                const commissionValue = commissionCell.innerText.trim(); // 기존 값 저장
                commissionCell.innerHTML = `<input type="text" placeholder="영업수수료" name="businessCommission" value="${commissionValue}">`;
            });
        });
    }
    if(btnAdd){
        btnAdd.addEventListener("click",function () {
            console.log("추가 버튼 클릭됨");
            iMode = '1'; // 수정 모드로 설정
            console.log("mode 값:", iMode); // mode 값 확인 (2로 설정되어야 합니다.)

            // 저장 버튼 활성화
            if (saveBtn) {
                saveBtn.disabled = false;  // 저장  모드에서만 저장 버튼 활성화
            }
        });
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
                        CustomID: selectedRow.CustomID, // CustomID 추가
                        ArticleID: row.cells[6]?.innerText || '', // ArticleID 추가
                        article: row.cells[2]?.innerText || '',  // article 내용 추가
                        buyerArticleNo: row.cells[1]?.innerText || '',  // buyerArticleNo 내용 추가
                        InvestmentUnitPrice: row.cells[3]?.querySelector('input')?.value || '',  // 투자 단가
                        UnitPrice: row.cells[4]?.querySelector('input')?.value || '',  // 단가
                        businessCommission: row.cells[5]?.querySelector('input')?.value || '',  // 사업 수수료
                        PersonId: "admin", // 사용자 ID
                        mode: iMode  // mode는 1
                    };
                    console.log("Row Data (mode 1):", rowData); // mode 1일 때 rowData 출력
                    tableData.push(rowData); // tableData에 추가
                }
                if (iMode === '2') {  // mode가 2일 때만 처리
                    const rowData = {
                        CustomID: selectedRow.CustomID, // CustomID 추가
                        ArticleID: row.cells[6]?.innerText || '', // ArticleID 추가
                        article: row.cells[2]?.innerText || '',  // article 내용 추가
                        buyerArticleNo: row.cells[1]?.innerText || '',  // buyerArticleNo 내용 추가
                        InvestmentUnitPrice: row.cells[3]?.querySelector('input')?.value || '',  // 투자 단가
                        UnitPrice: row.cells[4]?.querySelector('input')?.value || '',  // 단가
                        businessCommission: row.cells[5]?.querySelector('input')?.value || '',  // 사업 수수료
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

    const tbody2 = document.querySelector('#KCustomTable2 tbody');
    tbody2.innerHTML = ''; // 테이블 초기화

    let param = {
        KCustom: document.getElementById('KCustom').value,
        businessTypeCode: document.getElementById('businessTypeCode').value
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

// 두 번째 fetch 요청 (전체 품목 조회)
function fetchArticles(param) {
    fetch("/article/customArticle/article", {
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
            console.log("서버에서 받은 데이터:", data); // 서버 응답 확인
            const tbody1 = document.querySelector('#KCustomTable1 tbody');
            tbody1.innerHTML = ''; // 기존 테이블 내용 삭제

            if (data && data.length > 0) {
                data.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.buyerArticleNo || ''}</td>
                        <td>${item.article || ''}</td>
                        <td style="display:none">${item.ArticleID || ''}</td>  
                    `;
                    tbody1.appendChild(row);
                });

                // 품목 건수 표시 업데이트
                const articleCount = data.length;
                document.querySelector('#articleCountValue').textContent = articleCount; // 건수를 표시
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

        const businessTypeValue = businessTypeMap[businessTypeCode] || '알 수 없음';
        document.getElementById('businessTypeCaptionValue').textContent = businessTypeValue;

        const articleCount = data.length;
        document.querySelector('#selectCount').textContent = articleCount; // 건수를 표시
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








