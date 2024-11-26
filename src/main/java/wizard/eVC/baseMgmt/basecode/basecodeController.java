package wizard.eVC.baseMgmt.basecode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class basecodeController {

    @Autowired
    basecodeService service;

    @GetMapping("/basecode")
//    public String basecode(Model model){
    public String basecode() {
//        basecodeDTO basecodedto = new basecodeDTO();
//        model.addAttribute("basecodedto", basecodedto);
        return "/pages/baseMgmt/basecode/basecode";
    }


}
