package wizard.eVC.baseMgmt.customArticle;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.customArticle.dto.LJHbasecodeDTO;


import java.math.BigDecimal;
import java.util.HashMap;
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

        return "pages/baseMgmt/article/customArticle";
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
    @PostMapping(value = "/customArticleDetail")
    @ResponseBody
    public List<LJHbasecodeDTO> sArticleDetail(@RequestBody Map<String, Object> p){
        List<LJHbasecodeDTO> dtoList =service.sArticleDetail(p);
        System.out.println(p);
        return dtoList;
    }

    @PostMapping(value = "/save")
    @ResponseBody
    public List<LJHbasecodeDTO> iArticle(@RequestBody LJHbasecodeDTO payload) {
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

            // 중복 여부 체크
            List<LJHbasecodeDTO> checkList = service.checkArticle(payload.getCustomID(), payload.getArticleID());
            System.out.println(payload.getCustomID());
            System.out.println(payload.getArticle());
            if (checkList.size() > 0) {
                // 중복된 데이터가 있으면 클라이언트에 해당 데이터를 반환
                System.out.println("중복된 데이터가 존재합니다.");
                return checkList;  // 클라이언트에서 이 데이터를 받아서 처리하도록 합니다.
            } else {
                // 중복이 없으면 새로운 데이터를 저장
                List<LJHbasecodeDTO> dtoList = service.iArticle(payload);
                System.out.println("Response Payload: {}" + dtoList);
                return dtoList;
            }
        } catch (Exception e) {
            // 예외 발생 시 상세 로그 출력
            System.err.println("Error occurred during save operation: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("서버 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.", e);
        }
    }

    @PostMapping(value = "/delete")
    @ResponseBody
    public ResponseEntity<?> dArticle(@RequestBody LJHbasecodeDTO p) {
        System.out.println("Received CustomID: " + p.getCustomID());
        service.dArticle(p);
        return ResponseEntity.ok().body("삭제 성공");  // 성공 메시지 반환(
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
    @PostMapping(value ="/checkArticle")
    @ResponseBody
    public List<LJHbasecodeDTO> checkArticle(@RequestBody LJHbasecodeDTO p) {
        List<LJHbasecodeDTO> checkList = service.checkArticle(p.getCustomID(), p.getArticleID());
        System.out.println(checkList);
        System.out.println("중복체크값"+p.getArticleID());
        System.out.println("중복체크값"+p.getCustomID());
        if (!checkList.isEmpty()) {
            // 중복된 데이터가 있으면 클라이언트에 해당 데이터를 반환
            System.out.println("중복된 데이터가 존재합니다.");
            return checkList;  // 클라이언트에서 이 데이터를 받아서 처리하도록 합니다.
        }

        return checkList; // 중복이 없으면 빈 리스트 반환
    }
}
