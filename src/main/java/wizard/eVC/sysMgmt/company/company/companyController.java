package wizard.eVC.sysMgmt.company.company;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.sysMgmt.company.company.dto.companyDTO;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.naDaum.sysMgmt.company
 * fileName         : companyController
 * author           : daehyun
 * date             : 2024-10-15
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-11-22       Daehyun             최초 생성
 */
@Slf4j
@Controller
@AllArgsConstructor
@RequestMapping("/sysMgmt/company")
public class companyController {

    @Autowired
    private companyService service;


    @GetMapping("")
    public String company() {
        return "pages/sysMgmt/company/company";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<companyDTO> getBasecodeList(@RequestBody Map<String, Object> param) {
        List<companyDTO> data = service.getCompanyList(param);
        return data;
    }

    @PostMapping("/add")
    public String add(Model model) {
        companyDTO companydto = new companyDTO();
        companydto.setCompanyID(""); // 기본값 설정
        companydto.setRpYN("N");
        companydto.setUseYN("Y");
        model.addAttribute("companydto", companydto);
        return "pages/sysMgmt/company/companyDetail";
    }

    @PostMapping("/detail")
    public String searchDetail(@RequestParam(name = "sCompanyID", required = false) String sCompanyID,
                               @RequestParam(name = "sRPYN", required = false) String sRPYN,
                               @RequestParam(name = "sUseYN", required = false) String sUseYN,
                               Model model) {

        companyDTO companydto = service.getCompanyDetail(sCompanyID, sRPYN, sUseYN);
        if(companydto.companyNo != null && !companydto.companyNo.isEmpty()){
            companydto.setCompanyNo(companydto.companyNo.replaceAll("(\\d{3})(\\d{2})(\\d{5})", "$1-$2-$3"));
        }
        model.addAttribute("companydto", companydto);

        return "pages/sysMgmt/company/companyDetail";
    }

    @PostMapping("/save")
    @ResponseBody
    public void save(@ModelAttribute companyDTO companydto) {
         companydto.companyNo =  companydto.companyNo.replace("-","");
         service.saveCompanyDetail(companydto);
    }

    @PostMapping("/delete")
    @ResponseBody
    public String delete(@RequestBody String sCompanyID ) {
        try {
            int result = service.deleteCompanyDetail(sCompanyID);
            if(result == 0) return "대표업체로 설정되어 있습니다. 삭제할 수 없습니다.";
            else return "삭제 되었습니다.";
        } catch (IllegalStateException e) {
            return e.getMessage();
        }
    }
}
