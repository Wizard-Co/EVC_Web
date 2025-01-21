package wizard.eVC.baseMgmt.customArticle;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.customArticle.dto.LJHbasecodeDTO;


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
    public List<LJHbasecodeDTO> sCustomList(@RequestBody Map<String, Object> p) {
        List<LJHbasecodeDTO> dtoList = service.sCustomList(p);
        return dtoList;
    }

    @PostMapping(value = "/article")
    @ResponseBody
    public List<LJHbasecodeDTO> sArticle(@RequestBody Map<String, Object> p) {
        List<LJHbasecodeDTO> dtoList = service.sArticle(p);
        return dtoList;
    }
    @PostMapping(value = "/customArticle")
    @ResponseBody
    public List<LJHbasecodeDTO> sArticleCustom(@RequestBody Map<String, Object> p) {
        List<LJHbasecodeDTO> dtoList = service.sArticleCustom(p);
        return dtoList;
    }
    @PostMapping(value = "/save")
    @ResponseBody
    @Transactional
    public List<LJHbasecodeDTO> iArticle(@RequestBody LJHbasecodeDTO payload, HttpServletRequest request) {
        try {
            // Null 값에 대한 기본값 설정
            if (payload.getInvestmentUnitPrice() == null) {
                payload.setInvestmentUnitPrice(BigDecimal.ZERO);
            }
            if (payload.getUnitPrice() == null) {
                payload.setUnitPrice(BigDecimal.ZERO);
            }
            if (payload.getBusinessCommission() == null) {
                payload.setBusinessCommission(BigDecimal.ZERO);
            }

            // 서비스 호출 및 결과 반환
            List<LJHbasecodeDTO> dtoList = service.iArticle(payload);

            System.out.println("Response Payload: {}" + dtoList);;
            log.info("Request Payload: {}", payload.toString());

            return dtoList;
        } catch (Exception e) {
            // 예외 발생 시 상세 로그 출력
            log.error("Error occurred during save operation", e);

            // 사용자 친화적인 에러 메시지 반환
            throw new RuntimeException("서버 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.", e);
        }
    }
    @GetMapping(value = "/delete")
    @ResponseBody
    public void dArticle(@RequestParam LJHbasecodeDTO p){
        service.dArticle(p);
    }

    @PostMapping(value = "/articleSearch")
    @ResponseBody
    public List<LJHbasecodeDTO> articleSearch(@RequestBody LJHbasecodeDTO p){
        System.out.println(p.getArticleID());
        System.out.println(p);

        List<LJHbasecodeDTO> dtoList = service.articleSearch(p);
        return dtoList;
    }
    @PostMapping(value = "/search")
    @ResponseBody
    public List<LJHbasecodeDTO> sCustomListALL(@RequestBody Map<String, Object> p) {
        try {
            log.info("Received parameters: {}", p); // 요청 데이터 로깅
            List<LJHbasecodeDTO> dtoList = service.sCustomListAll(p);
            return dtoList;
        } catch (Exception e) {
            log.error("Error occurred in /search: ", e); // 에러 로깅
            throw e; // 에러를 클라이언트로 전달 (또는 사용자 친화적인 메시지로 처리 가능)
        }
    }

    @PostMapping(value ="/allCustomArticle")
    @ResponseBody
    public List<LJHbasecodeDTO> sCustomList(@RequestBody LJHbasecodeDTO p){
        System.out.println(p);
        List<LJHbasecodeDTO> dtoList = service.sCustomList(p);
        return dtoList;
    }
}
