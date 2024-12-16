package wizard.eVC.baseMgmt.basecode;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.basecode.dto.basecodeDTO;
import wizard.eVC.baseMgmt.basecode.dto.tableDataDTO;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;


@Controller
@AllArgsConstructor
@RequestMapping("/baseMgmt/basecode")
@Slf4j
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
