package wizard.eVC.baseMgmt.person;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.baseMgmt.person.DTO.Person;

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
    void updatePersonFtp(Person person);

}
