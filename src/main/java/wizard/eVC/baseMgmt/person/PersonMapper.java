package wizard.eVC.baseMgmt.person;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.baseMgmt.person.DTO.Person;
import wizard.eVC.common.dto.CMCode;
import wizard.eVC.common.dto.Menu;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.eVC.baseMgmt.person
 * fileName         : PersonMapper
 * author           : sooJeong
 * date             : 2024-10-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-21         sooJeong             최초 생성
 */
@Mapper
public interface PersonMapper {

    List<Person> getPersonList(Map<String, Object> params);
    Person getPersonDetail(String personID);
    Person savePerson(Person person);
    Person updatePerson(Person person);
    void updatePersonFTP(Person person);
    void deletePerson(String personID, String endDate);
    void savePersonMenu(Map<String, Object> menu);
    void deletePersonMenu(String personID, String pgGubun);
    List<CMCode> getDepart();
    List<CMCode> getPosition();
    List<Menu> getMenuList(String sPgGubun);
    List<Menu> getPersonMenu(String personID, String pgGubun);
    int checkID(String loginID);
}
