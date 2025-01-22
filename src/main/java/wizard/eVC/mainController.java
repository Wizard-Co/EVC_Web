package wizard.eVC;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import wizard.eVC.baseMgmt.person.DTO.Person;
import wizard.eVC.sysMgmt.login.LoginManager;


@Controller
public class mainController {

    @Autowired
    private LoginManager loginManager;

    @GetMapping("/")
    public String login(Model model) {

        Person loginUser = loginManager.getLoginUser();

        if (loginUser != null) {
            return "pages/main";
        }else {
            return "/pages/baseMgmt/article/customArticle";
        }
        //pages/sysMgmt/login/login

        // /pages/baseMgmt/article/customArticle
    }

}
