package wizard.eVC.sysMgmt.userlog;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.sysMgmt.userlog.DTO.Userlog;

import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
@RequestMapping("/sysMgmt/userlog")
public class UserlogController {

    private UserlogService service;

    @ModelAttribute
    public void setting(Model model)
    {
        Userlog userlog = new Userlog();
        model.addAttribute("userlog",userlog);

    }

    @GetMapping("")
    public String home() {

        return "/pages/sysMgmt/userlog/userlog";
    }


    @PostMapping(value = "/search")
    @ResponseBody
    public List<Userlog> getUserlogData(@RequestBody Map<String, Object> param){
        List<Userlog> data = service.getUserlogList(param);
        return data;
    }


}
