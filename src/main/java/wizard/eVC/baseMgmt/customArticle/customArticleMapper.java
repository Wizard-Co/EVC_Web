package wizard.eVC.baseMgmt.customArticle;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import wizard.eVC.baseMgmt.customArticle.dto.LJHbasecodeDTO;


import java.util.List;
import java.util.Map;

@Mapper
public interface customArticleMapper {

    List<LJHbasecodeDTO> sCustomList (@Param("p") Map<String, Object> p);

    List<LJHbasecodeDTO> sCustomListALL(@Param("p")Map<String, Object> p);

    List<LJHbasecodeDTO> sArticle (@Param("p")Map<String, Object> p);

    List<LJHbasecodeDTO> sArticleCustom (@Param("p")Map<String, Object> p);

    List<LJHbasecodeDTO> iArticle (LJHbasecodeDTO payload);

    void dArticle(LJHbasecodeDTO p);

    List<LJHbasecodeDTO> articleSearch(LJHbasecodeDTO p);

    List<LJHbasecodeDTO> sCustomList(@Param("p")LJHbasecodeDTO p);

    List<LJHbasecodeDTO> sArticleDetail(@Param("p") Map<String, Object> p);

}
