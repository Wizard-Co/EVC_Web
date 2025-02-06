/**
 작성자:    김수정
 작성일:    2024-10-10
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
let form = document.getElementById('addForm');
let realFileList = document.querySelectorAll('.fileList');

form.addEventListener('submit', (e) => {
    e.preventDefault();
});
document.getElementById('btnSave').addEventListener('click', function () {

    if (form.checkValidity()) {
        const formData = new FormData(form);

        fetch('/baseMgmt/article/save', {
            method: 'post',
            body: formData,
            headers: {},
        })
            .then(res => {
                if (!res.ok) console.log('http error: ', res)
            })
            .then(() => {
                window.open('', '_self').close();
                opener.Search();
            })
            .catch(error => console.log('Unexpected error: ', error));
    }
})

document.getElementById('btnUpdate').addEventListener('click', function () {

    if (form.checkValidity) {

        let array = Array.from(realFileList);

        let isValid = array.every(realFile => {
            if (realFile.files[0]) {
                return checkImageValidity(realFile);
            }
            return true;
        });

        if (isValid) {
            const formData = new FormData(form);
            const result = document.querySelector('.form-result');

            fetch('/baseMgmt/article/update', {
                method: 'post',
                body: formData,
                headers: {},
            })
                .then(res => {
                    if (!res.ok) {
                        return res.text().then(err => {
                            throw new Error(err)
                        });
                    }
                })
                .then(() => {
                    // window.open('', '_self').close();
                    result.innerHTML = '저장이 완료되었습니다';
                    refreshForm();
                    opener.Search();
                })
                .catch(error => {
                    console.dir(error);
                    result.innerHTML = `저장에 실패하였습니다. 오류 발생: ${error.message}`
                });
        }

    }
})

document.getElementById('btnDelete').addEventListener('click', function () {
    let articleID = document.getElementById('articleID').value;

    if (!!articleID) {

        let baseUrl = '/baseMgmt/article/delete';
        let param = new URLSearchParams({
            articleID: articleID
        });
        let urlWithParam = `${baseUrl}?${param}`

        fetch(urlWithParam)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => {
                        throw new Error(err.message)
                    });
                }
            })
            .then(() => {
                window.open('', '_self').close();
                opener.Search();
            })
            .catch(error => alert(error));
    }
})

document.getElementById('btnClose').addEventListener('click', function () {
    window.open('', '_self').close();
})
realFileList.forEach(realFile => realFile.addEventListener('change', function (event) {
    checkImageValidity(event.currentTarget);
}));

function checkImageValidity(realFile) {
    let file = realFile.files[0];
    let input = realFile.closest('td').querySelector('input[type="text"]');
    return checkImage(file, realFile, input);
}

function checkImage(file, realFile, input) {
    let maxsize = 1024 * 1024; // 1MB
    if (!file.type.match("image/.*")) {
        alert('이미지 파일만 업로드가 가능합니다.');
        return;
    }
    if (file.size > maxsize) {
        alert("이미지 용량은 1MB 이내로 등록 가능합니다.");
        return;
    }
    input.value = file.name;
    return true;
}

document.querySelectorAll('[popover]').forEach((pop) => {
    pop.addEventListener('beforetoggle', showImage);
});

document.querySelectorAll('.btnImageDel').forEach((btn) => {
    btn.addEventListener('click', deleteValue);
});

function showImage(e) {
    let btn = e.currentTarget;
    let input = btn.previousElementSibling;
    let path = input.dataset.path;
    let filename = input.value;

    if (!isEmpty(path)) {
        console.log(path);
        if (event.newState === "open") {
            let location = '/baseMgmt/article/detail/image?filename=' + filename + '&filepath=' + path;
            let child = btn.firstElementChild;
            child.src = location;
        }
    }
}

function deleteValue(e) {
    let btn = e.currentTarget;
    let input = btn.closest('td').querySelector('input[type="text"]');
    let del = btn.parentNode.querySelector('[data-group="delete"]');
    del.value = input.value;
    input.value = '';
}

document.getElementById('hsCode').addEventListener('click', function () {
    hsFinder('hsCodeID', 'hsCode', 20, '');
})

function hsFinder(txtID, txtName, nLarge, sMiddle) {

    let baseurl = "/pages/article/hsFinder";
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
