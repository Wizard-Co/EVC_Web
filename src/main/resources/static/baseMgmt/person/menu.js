/**
 작성자:    김수정
 작성일:    2024-11-08
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/


const urlParam = new URLSearchParams(window.location.search);
const mode = urlParam.get('mode');

const labels = document.querySelectorAll('.menu-item input[type="checkbox"]');
labels.forEach(x => {
    x.addEventListener('click', () => {
        let parent = x.parentElement;
        if (!!parent.nextElementSibling) {
            let child = parent.nextElementSibling;
            child.classList.toggle("off");
        }
    })
})

const btnSave = document.getElementById('btnSave');
btnSave.addEventListener("click", function () {
    let menuList = collectMenuList();

    if (menuList.length > 0) {
        window.open('', '_self').close();
        opener.sendMenuList(menuList);
    }

    // if(menuList.length > 0){
    //     fetch('/baseMgmt/person/user-menu/save', {
    //         method: 'post',
    //         headers: { "Content-Type": "application/json",},
    //         body: JSON.stringify(menuList),
    //     })
    //         .then(res => {
    //             if (!res.ok) {
    //                 return res.text().then(err => {
    //                     throw new Error(err)
    //                 });
    //             }
    //         })
    //         .then(() => {
    //             window.open('', '_self').close();
    //         })
    //         .catch(error => {
    //             console.dir(error);
    //                const result = document.querySelector('.form-result');
    //             result.innerHTML = `저장에 실패하였습니다. 오류 발생: ${error.message}`
    //         });
    // }
})

function collectMenuList() {
    let lstMenu = [];
    let menuList = [...document.querySelectorAll('.menu-item')].slice(1);

    menuList.forEach(x => {
        let menu = {
            menuID: x.querySelector('input:first-of-type').id,
            menu: x.querySelector('label').textContent,
            parentID: x.querySelector('input:first-of-type').getAttribute('data-parentID'),
            searchYN: x.querySelector('[data-group="search"]').checked ? 'Y' : 'N',
            addYN: x.querySelector('[data-group="add"]').checked ? 'Y' : 'N',
            updateYN: x.querySelector('[data-group="update"]').checked ? 'Y' : 'N',
            deleteYN: x.querySelector('[data-group="delete"]').checked ? 'Y' : 'N',
            printYN: x.querySelector('[data-group="print"]').checked ? 'Y' : 'N',
        }
        lstMenu.push(menu);
    });

    return lstMenu;
}

document.getElementById('btnClose').addEventListener("click", () => {
    window.open('', '_self').close();
})


// 아이템 선택 이벤트
// btns.forEach((item) => {
//     item.onchange = (e) => {
//         btnAll.checked = btns.every((item) => item.checked);
//         btnAllSearch.checked = sels.every((item) => item.checked);
//         btnAllAdd.checked = adds.every((item) => item.checked);
//         btnAllUpdate.checked = upds.every((item) => item.checked);
//         btnAllDelete.checked = dels.every((item) => item.checked);
//         btnAllPrint.checked = prts.every((item) => item.checked);
//         checkChild(item);
//     }
// });
const btns = [...document.querySelectorAll('.checkbox-container input[type="checkbox"]')];
btns.forEach((btn) => btn.addEventListener("change", checkChild(btn)));

function checkChild(btn) {
    // 내 지금 현 메뉴
    let meBox = btn.closest('.menu-item');
    let meItems = meBox.querySelectorAll('[data-group]');
    let child = meBox.nextElementSibling;
    const groupName = btn.dataset.group;
    //하위 있으면
    if (child) {
        let items;

        if (groupName == "all") {
            let childItems = child.querySelectorAll('[data-group]');
            items = [...meItems, ...childItems];
        } else {
            items = child.querySelectorAll(`[data-group=${groupName}]`);
        }

        btn.addEventListener('change', (e) => {
            items.forEach((item) => (item.checked = e.target.checked));
        });
    } else {
        if (groupName == "all") {
            btn.addEventListener('change', (e) => {
                meItems.forEach((item) => (item.checked = e.target.checked));
            });
        }

    }
}
