package wizard.eVC.baseMgmt.person;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.person.DTO.Person;
import wizard.eVC.common.CMService;
import wizard.eVC.common.dto.CMCode;
import wizard.eVC.common.dto.Menu;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.eVC.baseMgmt.person
 * fileName         : PersonContoller
 * author           : sooJeong
 * date             : 2024-10-18
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-18         sooJeong             최초 생성
 */

@Controller
@AllArgsConstructor
@RequestMapping("/baseMgmt/person")
public class PersonContoller {

    private PersonService service;
    private CMService cmService;

    @ModelAttribute
    public void setting(Model model) {
        List<CMCode> cboDepart = service.getDeart(); //부서
        List<CMCode> cboPosition = service.getPosition(); //강사 직위
        List<CMCode> cboDuty = cmService.getCmCode("INSADUTY"); //직무
        List<CMCode> cboDutyDTL = cmService.getCmCode("INSADUTYDTL"); //강사구분
        List<CMCode> cboArea = cmService.getCmCode("INSAAREA"); //거주지역
        List<CMCode> cboSolar = cmService.getCmCode("SLR"); // 양음력

        model.addAttribute("person", new Person());
        model.addAttribute("cboDepart", cboDepart);
        model.addAttribute("cboPosition", cboPosition);
        model.addAttribute("cboDuty", cboDuty);
        model.addAttribute("cboDutyDTL", cboDutyDTL);
        model.addAttribute("cboArea", cboArea);
        model.addAttribute("cboSolar", cboSolar);
    }

    @GetMapping("")
    public String home (){
        return "/pages/baseMgmt/person/person";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Person> getPersonList(@RequestBody Map<String, Object> param) {
        List<Person> data = service.getPersonList(param);
        return data;
    }

    @PostMapping("/detail")
    public String searchDetail(@RequestParam(name = "personID", required = true) String personID,
                               Model model) {

        Person person = service.getPersonDetail(personID);

        model.addAttribute("person", person);
        return "/pages/baseMgmt/person/personDetail";
    }
    @PostMapping("/add")
    public String add() {
        return "/pages/baseMgmt/person/personDetail";
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@ModelAttribute Person person) {
        service.updatePerson(person);
    }

    @PostMapping("/save")
    @ResponseBody
    public void save(@ModelAttribute Person person) {
        service.savePerson(person);
    }

    @GetMapping("/delete")
    @ResponseBody
    public ResponseEntity<Object> delete(@RequestParam String personID) {
        try {
            service.deletePerson(personID);
            return ResponseEntity.ok().build();
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

    @PostMapping("/user-menu")
    public String getMenu(Model model, String personID,String mode) {
        List<Menu> menuTree = service.getMenuTree();
        model.addAttribute("mode", mode);
        model.addAttribute("menuTree", menuTree);

        if(mode.equals("update")) {
            Map<String, Menu> menuMap = service.getPersonMenuTree(personID);
            model.addAttribute("menuMap", menuMap);
        }

        return "/pages/baseMgmt/person/user-menu";
    }

    @ResponseBody
    @GetMapping("/checkID")
    public ResponseEntity<Boolean> checkID(String loginID) {
        if(service.checkID(loginID)){
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(false);
        }
    }

}
