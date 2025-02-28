window.addEventListener('load', function () {
    mainBtnSetting();
});

let selectedRow;

const articleTable = new DataTable('#articleTable', {
    buttons: [{
        extend: 'excel',
        filename: '품명코드',
        title: '품명코드',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num", className: 'center'},
        {data: "article", className: 'left'},
        {data: "buyerArticleNo", className: 'left'},
        {data: "spec", className: 'left', orderable: false},
        {data: "articleType", className: 'center', orderable: false},

        {data: "useYN", className: 'center', orderable: false},
        {data: "unitType", className: 'center', orderable: false},
        {data: "needStockQty", className: 'right', orderable: false},
        {data: "prodQtyPerBox", className: 'right', orderable: false},
        {data: "outQtyPerBox", className: 'right', orderable: false},

        {data: "supplyType", className: 'center', orderable: false},
        {data: "productType", className: 'center', orderable: false},
        {data: "partType", className: 'center', orderable: false},
        {data: "labelPrintYN", className: 'center', orderable: false},
        {data: "buyUnitPrice", className: 'right', orderable: false},

        {data: "outUnitPrice", className: 'right', orderable: false},
        {data: "hsCode", className: 'left', orderable: false},
        {data: "exDiameter", className: 'right', orderable: false},
        {data: "inDiameter", className: 'right', orderable: false},
        {data: "width", className: 'right', orderable: false},

        {data: "weight", className: 'right', orderable: false},
        {data: "length", className: 'right', orderable: false},
        {data: "freeStuffinYN", className: 'center', orderable: false},
        {data: "patternID", className: 'center', orderable: false},
        {data: "imageFileName", className: 'left', orderable: false},

        {data: "imageFilePath", className: 'left', orderable: false},
        {data: "comments", className: 'left', orderable: false},
        {data: "createUserID", className: 'left', orderable: false},
        {data: "createDate", className: 'center', orderable: false},
    ],

    scrollX: true
})

let tbody = document.querySelector('#articleTable tbody');
tbody.onclick = function () {
    let rowElement = event.target.closest('tr');
    selectedRow = articleTable.row(rowElement).data();
};
tbody.ondblclick = function (event) {
    let param = {
        articleID: selectedRow.articleID
    }
    openForm('articleDetail', '/baseMgmt/article/detail?mode=update', param, '');
}

function mainBtnSetting() {
    document.getElementById('btnSearch').addEventListener("click", Search);
}

document.getElementById('btnAdd').addEventListener('click', function () {
    openForm('articleDetail', '/baseMgmt/article/add?mode=add', '', '');
})

document.getElementById('btnDelete').addEventListener('click', function () {
    if (!!selectedRow) {
        let baseUrl = '/baseMgmt/article/delete';
        let param = new URLSearchParams({
            articleID: selectedRow.articleID
        });
        let urlWithParam = `${baseUrl}?${param}`

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


// table filter
document.getElementById('inputArticleSrh').addEventListener('keyup', function () {
    let input = this.value;
    articleTable.column(1).search(input).draw();
})

function Search() {
    let param = {
        buyerArticleNo: document.getElementById('inputArticleSrh').value,
        includeUseYN: getChecked('chkIncludeUseYN') == true? 'Y' : 'N',
        supplyTypeID: document.getElementById('cboSupplyTypeSrh').value,
        articleTypeID: document.getElementById('cboArticleTypeSrh').value,
    }

    loading.visible();
    fetch("/baseMgmt/article/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
                for(let i =0; i < data.length; i++){
                    data[i]['num'] = i+1;
                }
                articleTable.clear().rows.add(data).draw();
                loading.invisible();
            }
        );
}

document.getElementById('btnExcel').addEventListener("click", function () {

    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});




