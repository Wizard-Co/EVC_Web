package wizard.eVC.baseMgmt.customArticle;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import wizard.eVC.baseMgmt.customArticle.dto.LJHbasecodeDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class customArticleService {

    private final customArticleMapper mapper;

    public List<LJHbasecodeDTO> sCustomList(Map<String, Object> p){
        return mapper.sCustomList(p);
    }
    public List<LJHbasecodeDTO> sCustomListAll(Map<String, Object>  p){
        return mapper.sCustomListALL(p);
    }
    public List<LJHbasecodeDTO> sArticle(Map<String, Object>  p){
        return mapper.sArticle(p);
    }
    public List<LJHbasecodeDTO> sArticleCustom(Map<String,Object> p){
        return mapper.sArticleCustom(p);
    }
    public List<LJHbasecodeDTO> iArticle(LJHbasecodeDTO  payload){
        return mapper.iArticle(payload); // 필요 시 추가 데이터 반환
    }
    void dArticle(LJHbasecodeDTO p){
        mapper.dArticle(p);
    }
    public List<LJHbasecodeDTO> articleSearch(LJHbasecodeDTO p) {
        return mapper.articleSearch(p);
    }
    public List<LJHbasecodeDTO> sCustomList(LJHbasecodeDTO p){
        return mapper.sCustomList(p);
    }
    public List<LJHbasecodeDTO>sArticleDetail(Map<String, Object> p){
        return mapper.sArticleDetail(p);
    }
    public List<LJHbasecodeDTO> checkArticle(String customID, String articleID) {
        // customID와 articleID를 Map에 담아서 전달합니다.
        Map<String, Object> params = new HashMap<>();
        params.put("CustomID", customID);
        params.put("ArticleID", articleID);

        return mapper.checkArticle(params); // Mapper 메서드 호출
    }

}
