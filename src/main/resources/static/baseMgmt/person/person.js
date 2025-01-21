/**
 작성자:    김수정
 작성일:    2024-10-21
 내용:     person.js
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

window.addEventListener('load', function () {
    mainBtnSetting();
});

let selectedRow;

const table = new DataTable('#table', {
    buttons: [{
        extend: 'excel',
        filename: '사원코드',
        title: '사원코드',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num", className: 'center'},
        {data: "personID", className: 'left'},
        {data: "name", className: 'left'},
        {data: "depart", className: 'left', orderable: false},
        {data: "position", className: 'left', orderable: false},

        {data: "duty", className: 'left', orderable: false},
        {data: "registNo", className: 'left', orderable: false},
        {data: "birth", className: 'center', orderable: false},
        {data: "email", className: 'left', orderable: false},
        {data: "loginID", className: 'left', orderable: false},

        {data: "startDate", className: 'center', orderable: false},
        {data: "endDate", className: 'center', orderable: false},
        {data: "handPhone", className: 'center', orderable: false},
        {data: "phone", className: 'right', orderable: false},

        {data: "zipCode", className: 'center', orderable: false},
        {data: "address", className: 'left', orderable: false},
        {data: "addressDetail", className: 'left', orderable: false},
        {data: "addressJibun", className: 'left', orderable: false},
        {data: "addressDetail", className: 'left', orderable: false},

        {data: "bankAccount", className: 'left', orderable: false},
        {data: "fileName", className: 'left', orderable: false},
        {data: "remark", className: 'left', orderable: false},

    ],
    scrollX: true
})

let tbody = document.querySelector('#table tbody');
tbody.onclick = function () {
    let rowElement = event.target.closest('tr');
    selectedRow = table.row(rowElement).data();
};
tbody.ondblclick = function (event) {
    let param = {
        personID: selectedRow.personID
    }
    openForm('personDetail', '/baseMgmt/person/detail?mode=update', param, '');
}

function mainBtnSetting() {
    document.getElementById('btnSearch').addEventListener("click", Search);
}

document.getElementById('btnAdd').addEventListener('click', function () {
    openForm('personDetail', '/baseMgmt/person/add?mode=add', '', '');
})

document.getElementById('btnDelete').addEventListener('click', function () {
    if (!!selectedRow) {
        let baseUrl = '/baseMgmt/person/delete';
        let param = new URLSearchParams({
            personID: selectedRow.personID
        });
        let urlWithParam = `${baseUrl}?${param}`

        fetch('/baseMgmt/person/save', {
            method: 'post',
            body: formData,
            headers: {},
        })
            .then(response => {
                if (!response.ok) console.log('http error: ', response);
            })
            .then(() => {
                Search();
            })
            .catch(error => console.log('Unexpected error: ', error));
    }
})


function Search() {
    let param = {
        depart: document.getElementById('inputDepartSrh').value,
        name: document.getElementById('inputNameSrh').value,
        areaID: document.getElementById('cboAreaSrh').value,
        licenseID: document.getElementById('cboQualifiedSrh').value,
        includeAdminYN: getChecked('chkIncludeAdminYN') == true ? 'Y' : 'N',
        includeEndYN: getChecked('chkIncludeEndYN') == true ? 'Y' : 'N'
    }

    loading.visible();

    fetch("/baseMgmt/person/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
                for (let i = 0; i < data.length; i++) {
                    data[i]['num'] = i + 1;
                }
                table.clear().rows.add(data).draw();
                loading.invisible();
            }
        );
}


document.getElementById('btnExcel').addEventListener("click", function () {

    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});



