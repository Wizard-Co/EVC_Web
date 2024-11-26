package wizard.eVC.baseMgmt.article;

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
import java.util.List;
import java.util.Map;

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
        List<CMCode> cboPartType = cmService.getCmCode("PARTGBNID"); //부품분류
        List<CMCode> cboUnitType = cmService.getCmCode("MTRUNIT"); //단위

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
                               Model model) {

        Article article = service.getArticleDetail(articleID);
        List<String> apList = service.getArticleProcessID(articleID);
        boolean update = true;

        model.addAttribute("article", article);
        model.addAttribute("apList", apList);
        model.addAttribute("update", update);

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

        service.updateArticle(article);

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
}
