package wizard.eVC.baseMgmt.person;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import wizard.eVC.baseMgmt.person.DTO.Person;
import wizard.eVC.common.dto.CMCode;
import wizard.eVC.common.dto.Menu;
import wizard.eVC.common.enums.IMAGEPATH;
import wizard.eVC.common.util.Date;
import wizard.eVC.common.util.FTP;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * packageName      : wizard.eVC.baseMgmt.person
 * fileName         : PersonService
 * author           : sooJeong
 * date             : 2024-10-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-21         sooJeong             최초 생성
 */
@Service
@AllArgsConstructor
public class PersonService {

    private PersonMapper mapper;
    private FTP ftp;
    private Date date;

    public List<Person> getPersonList(Map<String, Object> params) {
        return mapper.getPersonList(params);
    }

    public Person getPersonDetail(String personID) {
        return mapper.getPersonDetail(personID);
    }

    public List<CMCode> getDeart() {
        return mapper.getDepart();
    }

    public List<CMCode> getPosition() {
        return mapper.getPosition();
    }

    public void savePerson(Person person) {
        person.setCreateUserID("admin");  // 로그인한 userID 로 바꾸기
        person.setUseYN("Y");

        mapper.savePerson(person);
        String personID = person.getPersonID();

        if (personID.isBlank()) return;

        savePersonMenu(person);

        if (!person.getFile().isEmpty()) {
            String filePath = IMAGEPATH.PERSON.getPath() + personID + "/";
            ftp.uploadFile(person.getFile(), filePath);
            person.setFilePath(filePath);
            mapper.updatePersonFTP(person);
        }
    }

    public void updatePerson(Person person) {
        if (person.personID == null || person.personID.isBlank()) return;

        String personID = person.getPersonID();
        person.setLastUpdateUserID("admin");  // 로그인한 userID 로 바꾸기
        person.setUseYN("Y");

        if (!person.getFile().isEmpty()) {
            Person oldPerson = mapper.getPersonDetail(personID);
            String oldfileNames = oldPerson.getFileName();
            MultipartFile newOne = person.getFile();

            if (!newOne.getOriginalFilename().equals(oldfileNames)) {
                String filePath = IMAGEPATH.PERSON.getPath() + personID + "/";
                ftp.uploadFile(person.getFile(), filePath);
                person.setFilePath(filePath);
            } else {
                person.setFilePath(oldPerson.filePath);
            }
        }
        mapper.updatePerson(person);
        savePersonMenu(person);

    }

    public void deletePerson(String personID) throws IOException {
        String today = date.getStringToday();
        mapper.deletePerson(personID, today);
    }

    public List<Menu> getMenuTree() {
        String pgGubun = "7";
        List<Menu> menuList = mapper.getMenuList(pgGubun);
        return setMenuTree(menuList);
    }

    public Map<String, Menu> getPersonMenuTree(String personID) {
        String pgGubun = "7";
        List<Menu> list = mapper.getPersonMenu(personID, pgGubun);

        Map<String, Menu> menuMap = list.stream().collect(Collectors.toMap(Menu::getMenuID, Function.identity()));
        return menuMap;
    }

    private List<Menu> setMenuTree(List<Menu> menuList) {
        Map<String, Menu> menuMap = new HashMap<>();
        List<Menu> menuTree = new ArrayList<>();

        for (Menu menu : menuList) {

            menuMap.put(menu.getMenuID(), menu);

            if (menu.getParentID().trim().equals("0")) {
                menuTree.add(menu);
            } else {
                Menu parentMenu = menuMap.get(menu.getParentID().trim());
                if (parentMenu != null) {
                    parentMenu.getSubMenu().add(menu);
                } else {
                    System.out.println(menu.menu);
                }
            }
        }
        return menuTree;
    }

    public List<Menu> getPersonMenu(String personID){
        String pgGubun = "7";
        List<Menu> list = mapper.getPersonMenu(personID, pgGubun);
        return setMenuTree(list);
    }

    private void savePersonMenu(Person person) {
        if (CollectionUtils.isEmpty(person.getMenuList())) return;

        String pgGubun = "7"; // 사무실은 7번
        mapper.deletePersonMenu(person.getPersonID(), "7");

        for (int i = 0; i < person.getMenuList().size(); i++) {
            Menu menu = person.getMenuList().get(i);
            menu.setLevel(menu.getParentID().length() == 1 ? 0 : 3);

            Map<String, Object> params = new HashMap<>();
            params.put("personID", person.getPersonID());
            params.put("pgGubun", pgGubun);
            params.put("menuID", menu.getMenuID());
            params.put("seq", i + 1);
            params.put("level", menu.getLevel());
            params.put("parentID", menu.getParentID());
            params.put("searchYN", menu.getSearchYN());
            params.put("addYN", menu.getAddYN());
            params.put("updateYN", menu.getUpdateYN());
            params.put("deleteYN", menu.getDeleteYN());
            params.put("printYN", menu.getPrintYN());
            params.put("createUserID", person.getLoginID());

            mapper.savePersonMenu(params);
        }
    }
    public boolean checkID(String loginID) {
        int result = mapper.checkID(loginID);
        if (result > 0) {
            return false;
        } else return true;
    }
}
