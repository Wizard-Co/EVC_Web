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
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;


import java.util.List;
import java.util.Map;
/**
 * packageName      : wizard.naDaum.baseMgmt.basecode
 * fileName         : basecodeController
 * author           : daehyun
 * date             : 2024-10-15
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-15       Daehyun             최초 생성
 */

@Controller
@AllArgsConstructor
@RequestMapping("/baseMgmt/basecode")
@Slf4j

public class basecodeController {

    @Autowired
    private basecodeService service;

    @GetMapping("")
    public String basecode() {
        return "pages/baseMgmt/basecode/basecode";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<basecodeDTO> getBasecodeList(@RequestBody Map<String, Object> param) {
        List<basecodeDTO> data = service.getBasecodeList(param);
        return data;
    }

    @PostMapping("/detail")
    public String searchDetail(@RequestParam(name = "codeID", required = true) String codeID,
                               @RequestParam(name = "checkTF", defaultValue = "", required = true) String checkTF,
                               @RequestParam(name = "codeName",required = false) String codeName,
                               Model model) {

        List<basecodeDTO> data = service.getBasecodeDetail(codeID, checkTF);
        if (data.isEmpty()) {
            basecodeDTO dto = new basecodeDTO();
            dto.setCodeTypeID(codeID);
            dto.setLevel("1");
            dto.setParentID(codeID);
            data = List.of(dto);
        }
        model.addAttribute("basecodeDetail", data);
        model.addAttribute("codeName",codeName);

        return "pages/baseMgmt/basecode/basecodeDetail";
    }


    @PostMapping("/detail/update")
    @ResponseBody
    public void updateDetail(@ModelAttribute() basecodeDTO.ListWrapper wrapper){
        List<basecodeDTO> basecodedto = wrapper.getBasecodelist();
        for(basecodeDTO dto : basecodedto) {
            dto.setLastUpdateUser("admin");
            service.updateBasecodeDetail(dto);  // 단건으로 전달
        }
    }

    @PostMapping("/detail/add")
    @ResponseBody
    public void addDetail(@ModelAttribute() basecodeDTO.ListWrapper wrapper){
        List<basecodeDTO> basecodedto = wrapper.getBasecodelist();
        for(basecodeDTO dto : basecodedto) {
            dto.setCreateUserID("admin");
            if(dto.codeTypeID != null){
                service.addBasecodeDetail(dto);  // 단건으로 전달
            }
        }
    }

    @GetMapping("/detail/delete")
    @ResponseBody
    public void deleteDetail(@RequestParam(name = "codeTypeID") String codeTypeID,
                         @RequestParam(name = "codeID") String codeID) {
        service.deleteBasecodeDetail(codeTypeID, codeID);
    }


}
