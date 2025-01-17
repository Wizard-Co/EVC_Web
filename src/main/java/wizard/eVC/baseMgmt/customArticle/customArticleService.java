package wizard.eVC.baseMgmt.customArticle;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.eVC.baseMgmt.basecode.dto.basecodeDTO;

import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class customArticleService {

    private final customArticleMapper mapper;

    public List<basecodeDTO> sCustomList(Map<String, Object> p){
        return mapper.sCustomList(p);
    }
    public List<basecodeDTO> sCustomListAll(Map<String, Object>  p){
        return mapper.sCustomListALL(p);
    }
    public List<basecodeDTO> sArticle(Map<String, Object>  p){
        return mapper.sArticle(p);
    }
    public List<basecodeDTO> sArticleCustom(Map<String,Object> p){
        return mapper.sArticleCustom(p);
    }
    public List<basecodeDTO> iArticle(basecodeDTO  payload){
        return mapper.iArticle(payload); // 필요 시 추가 데이터 반환
    }
    void dArticle(basecodeDTO p){
        mapper.dArticle(p);
    }
    public List<basecodeDTO> articleSearch(basecodeDTO p) {
        return mapper.articleSearch(p);
    }
    public List<basecodeDTO> sCustomList(basecodeDTO p){
        return mapper.sCustomList(p);
    }
}
