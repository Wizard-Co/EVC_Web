/*DataTable.type('num', 'className', '');*/

/**
 * 김수정, 2024
 * dataTable 라이브러리 공통 초기화
 */
$.extend($.fn.dataTable.defaults, {
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
    // columnDefs: [
    //     {
    //         targets: '_all',
    //         render: function (data, type, row) {
    //             if ($.isNumeric(data)) {
    //                 return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //             }
    //             return data;
    //         }
    //     }
    // ],
    scrollY: true
})

/**
 * 김수정, 2024
 * DOM 로드 공통
 * loading 이미지, 폼 유효성 검사 추가
 */
document.addEventListener('DOMContentLoaded', function () {
    let loading = document.getElementById('loading');
    validate();
})

/**
 * 김수정, 2024
 * 추가.저장 버튼
 * @type {URLSearchParams}
 */
const urlParam = new URLSearchParams(window.location.search);
const mode = urlParam.get('mode');

if (mode === 'add') {
    hideElementsByID('btnUpdate', 'btnDelete');
} else if (mode === 'update') {
    hideElementsByID('btnSave');
}

/**
 * 김수정, 2024
 * classname으로 숨김 처리
 * @param classname
 */
function hideElementesByClass(classname) {
    let icon = document.querySelectorAll(classname);
    icon.forEach(x => x.disabled = true);
}

/**
 * 김수정, 2024
 * classname으로 보임 처리
 * @param classname
 */
function showElementsByClass(classname) {
    let icon = document.querySelectorAll(classname);
    icon.forEach(x => x.disabled = false);
}

/**
 * 김수정, 2024
 * ID로 보임 처리
 * @param id
 */
function showElementsByID(...id) {
    id.forEach(x => {
        let btn = document.getElementById(x);
        btn.style.display = 'inline';
    })
}

/**
 * 김수정, 2024
 * ID로 숨김 처리
 * @param id
 */
function hideElementsByID(...id) {
    id.forEach(x => {
        let btn = document.getElementById(x);
        btn.style.display = 'none';
    })
}

/**
 * 김수정, 2024
 * ID로 체크여부 가져오기
 * @param id
 * @returns {boolean|boolean|*}
 */
function getChecked(id) {
    let isChecked;
    let ele = document.getElementById(id);
    isChecked = ele.checked;
    return isChecked;
}

/**
 * 김수정, 2024
 * classname으로 input 초기화 하기
 * @param classname
 */
function initInput(classname) {
    let lst = document.querySelectorAll(classname);
    lst.forEach(x => x.value = '');
}

/**
 * 김수정, 2024
 * ID로 콤보박스 선택된 인덱스 가져오기 -> return 값의 text,value로 활용
 * @param id
 * @returns {*}
 */
function getCombo(id) {
    let obj = id.options[id.selectedIndex];
    return obj;
}

/**
 * 김수정, 2024
 * pop up post형식으로 열기
 * @param popName
 * @param url
 * @param param
 * @param option
 */
function openForm(popName, url, param, option) {
    if (option === '') option = 'width=950 height=700';

    let pop = window.open('', popName, option);

    let form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = popName;

    for (let key in param) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.id = key;
        input.name = key;
        input.value = param[key];
        form.appendChild(input);
    }

    pop.document.body.appendChild(form);
    form.submit();

}

/**
 * 김수정, 2024
 * 유효성 검사 (부트스트랩 참조)
 */
function validate() {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
}

/**
 * 김수정, 2024
 * 유효성검사 제거
 */
function refreshForm() {
    form.classList.remove('was-validated');
}

/**
 * 김수정, 2024
 * string null, 공백, undefined 체크
 * @param str
 * @returns {boolean}
 */
function isEmpty(str){
    return !str || str.trim().length === 0;
}

/**
 * 김수정, 2024
 * 플러스파인더
 * @param txtID
 * @param txtName
 * @param nLarge
 * @param sMiddle
 * @constructor
 */
//#region 플러스파인더
function PlusFinder(txtID, txtName, nLarge, sMiddle) {
    console.log('PlusFinder 호출됨');
    let baseurl = "/pages/common/plusFinder";
    let url = baseurl + "?txtID=" + txtID + "&txtName=" + txtName + "&nLarge=" + nLarge + "&sMiddle=" + sMiddle;
    let encodeUrl = encodeURI(url);
    let name = "plusfinder";

    let _width = 400;
    let _height = 600;
    let _left = Math.ceil((window.screen.width - _width) / 2);
    let _top = Math.ceil((window.screen.height - _height) / 2);
    let option = "width=" + _width + ", height=" + _height + ", top=" + _top + ", left=" + _left;
    let openPf = window.open(encodeUrl, name, option);
    openPf.setPlusFinderData = setPlusFinderData; // 팝업에서 부모 창의 setPlusFinderData 함수에 접근할 수 있도록 설정

}

function setPlusFinderData(txtID, txtName, PfID, PfName) {
    document.getElementById(txtID).value = PfID;
    document.getElementById(txtName).value = PfName;
}
/**
 * 김수정, 2024.12.05
 * MES 프로그램 바로가기
 * 이준협, 2024.01.09 MES 자동로그인 위해서 로직수정
 */
function goMES() {
    // 세션에서 userID와 password를 가져오기 위한 GET 요청
    fetch('/sysMgmt/userLogin/getSessionInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 쿠키 포함
    })
        .then(response => response.json())
        .then(data => {
            // 세션에서 userID와 password를 가져왔다면
            if (data.userID && data.Password) {
                const userID = data.userID;
                const Password = data.Password;

                console.log("Received userID:", userID, "Received Password:", Password); // 디버깅용 로그

                // wizardMES2:// 프로토콜 호출
                const url = `wizardmes1://login?userID=${encodeURIComponent(userID)}&Password=${encodeURIComponent(Password)}`;

                window.location.href = url; // 해당 프로토콜 호출
            } else {
                console.error("로그인 정보가 부족합니다.");
            }
        })
        .catch(error => {
            console.error("API 호출 실패:", error);
        });
}

//#endregion
