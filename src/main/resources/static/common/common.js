// DataTable.type('num', 'className', '');

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
    columnDefs: [
        {
            targets: '_all',
            render: function (data, type, row) {
                if ($.isNumeric(data)) {
                    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                console.log(type);
                return data;
            }
        }
    ],
    scrollY: true
})

document.addEventListener('DOMContentLoaded', function () {
    let loading = document.getElementById('loading');
    validate();
})

const urlParam = new URLSearchParams(window.location.search);
const mode = urlParam.get('mode');

if (mode === 'add') {
    hideElementsByID('btnUpdate', 'btnDelete');
} else if (mode === 'update') {
    hideElementsByID('btnSave');
}

function hideElementesByClass(classname) {
    let icon = document.querySelectorAll(classname);
    icon.forEach(x => x.disabled = true);
}

function showElementsByClass(classname) {
    let icon = document.querySelectorAll(classname);
    icon.forEach(x => x.disabled = false);
}

function showElementsByID(...id) {
    id.forEach(x => {
        let btn = document.getElementById(x);
        btn.style.display = 'inline';
    })
}

function hideElementsByID(...id) {
    id.forEach(x => {
        let btn = document.getElementById(x);
        btn.style.display = 'none';
    })
}

function getChecked(id) {
    let isChecked;
    let ele = document.getElementById(id);
    isChecked = ele.checked;
    return isChecked;
}

function readOnly(classname) {
    let lst = document.querySelectorAll(classname);
    lst.forEach(x => x.disabled = true);
}

function writeOnly(classname) {
    let lst = document.querySelectorAll(classname);
    lst.forEach(x => x.disabled = false);
}

function initInput(classname) {
    let lst = document.querySelectorAll(classname);
    lst.forEach(x => x.value = '');
}

function getCombo(id) {
    let obj = id.options[id.selectedIndex];
    return obj;
}

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

//#region 플러스파인더
function PlusFinder(txtID, txtName, nLarge, sMiddle) {

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

}

function setPlusFinderData(txtID, txtName, PfID, PfName) {
    document.getElementById(txtID).value = PfID;
    document.getElementById(txtName).value = PfName;
}

function refreshForm() {
    form.classList.remove('was-validated');
}

//#endregion
