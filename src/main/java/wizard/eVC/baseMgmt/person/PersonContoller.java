package wizard.eVC.baseMgmt.person;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.person.DTO.Person;

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
                             @RequestParam(name = "mode", required = true) String mode,
                               Model model) {

//        Person person = service.getPersonDetail(personID);
//        List<String> apList = service.getArticleProcess(articleID);
//
//        model.addAttribute("personID", personID);
//        model.addAttribute("apList", apList);
//        model.addAttribute("mode", mode);

        return "/pages/baseMgmt/person/articleDetail";
    }
}
