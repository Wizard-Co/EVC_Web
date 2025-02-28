package wizard.eVC.baseMgmt.article;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.article.DTO.Article;
import wizard.eVC.baseMgmt.article.DTO.ArticleProcess;
import wizard.eVC.common.CMService;
import wizard.eVC.common.dto.CMCode;

import java.io.IOException;
import java.util.*;

/**
 * packageName      : wizard.eVC.baseMgmt.article.DTO
 * fileName         : ArticleController
 * author           : sooJeong
 * date             : 2024-10-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-07         sooJeong             최초 생성
 */
@Controller
@AllArgsConstructor
@RequestMapping("/baseMgmt/article")
public class ArticleController {

    private ArticleService service;
    private CMService cmService;

    @ModelAttribute
    public void setting(Model model) {
        List<CMCode> cboArticleType = cmService.getCmCode("ArticleType"); //품명그룹
        List<CMCode> cboProductType = cmService.getCmCode("CMPRDGRPID"); //제품군
        List<CMCode> cboSupplyType = cmService.getCmCode("CMMASPLTYPE"); //공급유형
        List<CMCode> cboPartType = cmService.getCmCode("PARTGBNID"); //품목분류
        List<CMCode> cboUnitType = cmService.getCmCode("MTRUNIT"); //단위
        List<CMCode> cboPriceType = cmService.getCmCode("currency"); //화폐단위

        List<ArticleProcess> cboProcess = service.getProcess("", "");
        List<Map<String, Object>> cboPattern = service.getProcessPattern("");

        Article article = new Article();
        article.setUseYN("Y");

        model.addAttribute("article", article);
        model.addAttribute("cboArticleType", cboArticleType);
        model.addAttribute("cboProcess", cboProcess);
        model.addAttribute("cboProductType", cboProductType);
        model.addAttribute("cboSupplyType", cboSupplyType);
        model.addAttribute("cboPartType", cboPartType);
        model.addAttribute("cboUnitType", cboUnitType);
        model.addAttribute("cboPriceType", cboPriceType);
    }

    @GetMapping("")
    public String home() {

        return "/pages/baseMgmt/article/article";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Article> getArticleData(@RequestBody Map<String, Object> param) {

        List<Article> data = service.getArticleList(param);
        return data;
    }

    @PostMapping("/detail")
    public String searchDetail(@RequestParam(name = "articleID", required = true) String articleID,
                               @RequestParam(name = "mode", required = true) String mode,
                               Model model) {

        Article article = service.getArticleDetail(articleID);
        List<String> apList = service.getArticleProcessID(articleID);
        boolean update = true;

        model.addAttribute("article", article);
        model.addAttribute("apList", apList);
        model.addAttribute("mode", mode);

        return "/pages/baseMgmt/article/articleDetail";
    }

    @PostMapping("/add")
    public String add() {
        return "/pages/baseMgmt/article/articleDetail";
    }

    @PostMapping("/save")
    @ResponseBody
    public void save(@ModelAttribute Article article) {

        service.saveArticle(article);
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@ModelAttribute Article article) {
        try {
            service.updateArticle(article);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @GetMapping("/delete")
    @ResponseBody
    public ResponseEntity<Object> delete(@RequestParam String articleID) {
        try {
            service.deleteArticle(articleID);
            return ResponseEntity.ok().build();
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

    @GetMapping("/detail/image")
    public void showImage(@RequestParam String filename, @RequestParam String filepath,
                          HttpServletResponse response) {
        try {
            service.showImage(filename, filepath, response);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    //hscode finder
    @GetMapping("pages/article/hsFinder")
    public String home(Model model, @RequestParam(value = "nLarge", defaultValue = "0") int nLarge,
                       @RequestParam(value = "sMiddle", defaultValue = "") String sMiddle) {

        HashMap<String, Object> params = new HashMap<>();
        params.put("nLarge", nLarge);
        params.put("sMiddle", sMiddle);

        List<LinkedHashMap<String, Object>> lstpf = service.gethsFinder(params);

        if (lstpf.size() != 0) {
            List<String> lstColName = new ArrayList<>();
            Map<String, Object> firstItem = lstpf.get(0);

            for (String key : firstItem.keySet()) {
                lstColName.add(key.trim());
            }
            model.addAttribute("lstpf", lstpf);
            model.addAttribute("lstColName", lstColName);
        }

        return "/pages/baseMgmt/article/hsFinder";
    }
}
