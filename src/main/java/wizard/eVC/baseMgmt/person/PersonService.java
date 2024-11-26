package wizard.eVC.baseMgmt.person;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.eVC.baseMgmt.person.DTO.Person;
import wizard.eVC.common.util.FTP;

import java.util.List;
import java.util.Map;

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

    List<Person> getPersonList(Map<String, Object> params){
        return mapper.getPersonList(params);
    }
    Person getPersonDetail(String personID){
        return mapper.getPersonDetail(personID);
    }
}
