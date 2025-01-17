/**
 작성자:    김수정
 작성일:    2024-10-10
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

let form = document.getElementById('addForm');

let menuList = [];

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

document.getElementById('btnUpdate').addEventListener('click', async function () {
    const result = document.querySelector('.form-result');

    try {

        if (!form.checkValidity()) return;
        if (!CheckImageBeforeSave()) return;

        const formData = new FormData(form);
        AddFormData(menuList, formData);

        const response = await fetch('/baseMgmt/person/update', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);

        } else {
            result.innerHTML = '저장이 완료되었습니다';
            refreshForm();
            opener.Search();
        }

    } catch(error) {
        console.error(error);
        result.innerHTML = `저장에 실패하였습니다. 오류 발생: ${error.message}`
    }
})

document.getElementById('btnSave').addEventListener('click', async function () {
    try {

        if (!form.checkValidity()) return;
        if (!CheckMenuList(menuList)) return;
        if (!CheckImageBeforeSave()) return;

        const formData = new FormData(form);
        AddFormData(menuList, formData);

        const response = await fetch('/baseMgmt/person/save', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        } else {
            alert("저장이 완료되었습니다");
            window.open('', '_self').close();
            opener.Search();
        }

    } catch (error) {
        console.error(error);
        alert(`'저장실패: ${error.message}`);
    }
});


document.getElementById('btnDelete').addEventListener('click', function () {
    p
    let personID = document.getElementById('personID').value;

    if (!!personID) {

        let baseUrl = '/baseMgmt/person/delete';
        let param = new URLSearchParams({
            personID: personID
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

document.getElementById('btnMenu').addEventListener('click', function () {
    const urlParam = new URLSearchParams(window.location.search);
    const mode = urlParam.get('mode');

    let param = {
        personID: document.getElementById('personID').value
    }

    let option = 'width=650, height=700';
    openForm('userMenu', `/baseMgmt/person/user-menu?mode=${mode}`, param, option);
})

document.getElementById('btnInit').addEventListener('click', function () {
    let inputs = document.querySelectorAll(`#addForm input:not([id='personID'], [type=button])`);
    inputs.forEach(input => input.value = '');
});

function CheckImageBeforeSave() {
    let realFileList = document.querySelectorAll('.fileList');
    let array = Array.from(realFileList);
    let isValid = array.every(realFile => {
        if (realFile.files[0]) {
            return checkImageValidity(realFile);
        }
        return true;
    });
    return isValid;
}

function checkImageValidity(realFile) {
    let file = realFile.files[0];
    let input = realFile.closest('td').querySelector('input[type="text"]');
    return checkImage(file, realFile, input);
}

function checkImage(file, realFile, input) {
    let maxsize = 1024 * 1024; // 1MB

    if (!file.type.match("image/.*")) {
        alert('이미지 파일만 업로드가 가능합니다.');
        return false;
    }
    if (file.size > maxsize) {
        alert("이미지 용량은 1MB 이내로 등록 가능합니다.");
        return false;
    }
    input.value = file.name;
    return true;
}

function sendMenuList(list) {
    menuList = list;
    console.log("저장된 메뉴: " + menuList);
}

function AddFormData(menuList, formData) {
    menuList.forEach((menu, index) => {
        formData.append(`menuList[${index}].menuID`, menu.menuID);
        formData.append(`menuList[${index}].menu`, menu.menu);
        formData.append(`menuList[${index}].parentID`, menu.parentID);
        formData.append(`menuList[${index}].searchYN`, menu.searchYN);
        formData.append(`menuList[${index}].addYN`, menu.addYN);
        formData.append(`menuList[${index}].updateYN`, menu.updateYN);
        formData.append(`menuList[${index}].deleteYN`, menu.deleteYN);
        formData.append(`menuList[${index}].printYN`, menu.printYN);
    });
}

function CheckMenuList(menuList) {
    if (!menuList.length) {
        alert("메뉴 권한을 저장해주세요");
        return;
    }
    return true;
}
