package wizard.eVC.common;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.common.dto.CMCode;

import java.util.HashMap;
import java.util.List;
/**
 * packageName      : common
 * fileName         : ArticleService
 * author           : sooJeong
 * date             : 2024-10-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-07         sooJeong             최초 생성
 */
@Mapper
public interface CMMapper {
    List<CMCode> getCmCode(String codeTypeID);
    List<HashMap<String, Object>> getPlusFinder(HashMap<String, Object> param);
}
