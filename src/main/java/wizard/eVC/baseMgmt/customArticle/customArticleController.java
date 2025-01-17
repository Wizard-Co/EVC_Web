package wizard.eVC.baseMgmt.customArticle;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.basecode.dto.basecodeDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
@RequestMapping("/article/customArticle")
@Slf4j
public class customArticleController {

    private final  customArticleService service;

    @GetMapping("")
    public String home() {

        return "/pages/baseMgmt/article/customArticle";
    }
    @PostMapping(value = "/searchDetail")
    @ResponseBody
    public List<basecodeDTO> sCustomList(@RequestBody Map<String, Object> p) {
        List<basecodeDTO> dtoList = service.sCustomList(p);
        return dtoList;
    }
    @PostMapping(value = "/search")
    @ResponseBody
    public List<basecodeDTO> sCustomListALL(@RequestBody Map<String, Object> p) {
        List<basecodeDTO> dtoList = service.sCustomListAll(p);
        return dtoList;
    }
    @PostMapping(value = "/article")
    @ResponseBody
    public List<basecodeDTO> sArticle(@RequestBody Map<String, Object> p) {
        List<basecodeDTO> dtoList = service.sArticle(p);
        return dtoList;
    }
    @PostMapping(value = "/customArticle")
    @ResponseBody
    public List<basecodeDTO> sArticleCustom(@RequestBody Map<String, Object> p) {
        List<basecodeDTO> dtoList = service.sArticleCustom(p);
        return dtoList;
    }
    @PostMapping(value = "/save")
    @ResponseBody
    @Transactional
    public List<basecodeDTO> iArticle(@RequestBody basecodeDTO payload , HttpServletRequest request) {
        if (payload.getInvestmentUnitPrice() == null) {
            payload.setInvestmentUnitPrice(BigDecimal.ZERO);
        }
        if (payload.getUnitPrice() == null) {
            payload.setUnitPrice(BigDecimal.ZERO);
        }
        if (payload.getBusinessCommission() == null) {
            payload.setBusinessCommission(BigDecimal.ZERO);
        }

        List<basecodeDTO> dtoList = service.iArticle(payload);


        return dtoList;
    }
    @GetMapping(value = "/delete")
    @ResponseBody
    public void dArticle(@RequestParam basecodeDTO p){
        service.dArticle(p);
    }

    @PostMapping(value = "/articleSearch")
    @ResponseBody
    public List<basecodeDTO> articleSearch(@RequestBody basecodeDTO p){
        System.out.println(p.getArticleID());
        System.out.println(p);
        List<basecodeDTO> dtoList = service.articleSearch(p);
        return dtoList;
    }

    @PostMapping(value ="/allCustomArticle")
    @ResponseBody
    public List<basecodeDTO> sCustomList(@RequestBody basecodeDTO p){
        System.out.println(p);
        List<basecodeDTO> dtoList = service.sCustomList(p);
        return dtoList;
    }
}
