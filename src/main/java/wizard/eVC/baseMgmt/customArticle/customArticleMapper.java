package wizard.eVC.baseMgmt.customArticle;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import wizard.eVC.baseMgmt.basecode.dto.basecodeDTO;

import java.util.List;
import java.util.Map;

@Mapper
public interface customArticleMapper {

    List<basecodeDTO> sCustomList (@Param("p") Map<String, Object> p);

    List<basecodeDTO> sCustomListALL(@Param("p")Map<String, Object> p);

    List<basecodeDTO> sArticle (@Param("p")Map<String, Object> p);

    List<basecodeDTO> sArticleCustom (@Param("p")Map<String, Object> p);

    List<basecodeDTO> iArticle (basecodeDTO payload);

    void dArticle(basecodeDTO p);

    List<basecodeDTO> articleSearch(basecodeDTO p);

    List<basecodeDTO> sCustomList(@Param("p")basecodeDTO p);

}
