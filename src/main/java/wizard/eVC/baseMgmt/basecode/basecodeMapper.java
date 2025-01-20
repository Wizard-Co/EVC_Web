package wizard.eVC.baseMgmt.basecode;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.baseMgmt.basecode.dto.basecodeDTO;

import java.util.List;
import java.util.Map;
/**
 * packageName      : wizard.naDaum.baseMgmt.basecode
 * fileName         : basecodeMapper
 * author           : daehyun
 * date             : 2024-10-15
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-15       Daehyun             최초 생성
 */

@Mapper
public interface basecodeMapper {
    List<basecodeDTO> getBasecodeList(Map<String, Object> param);
    List<basecodeDTO> getBasecodeDetail(String codeID, String checkTF);
    void updateBasecodeDetail(basecodeDTO basecodeDTO);
    void addBasecodeDetail(basecodeDTO basecodeDTO);
    void deleteBasecodeDetail(String codeTypeID, String codeID);

}
