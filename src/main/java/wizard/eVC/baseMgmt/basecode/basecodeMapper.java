package wizard.eVC.baseMgmt.basecode;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.http.ResponseEntity;
import wizard.eVC.baseMgmt.basecode.dto.basecodeDTO;
import wizard.eVC.baseMgmt.depart.DTO.Depart;

import java.util.List;
import java.util.Map;

@Mapper
public interface basecodeMapper {
    List<basecodeDTO> getBasecodeList(Map<String, Object> param);
    List<basecodeDTO> getBasecodeDetail(String codeID, String checkTF);
    void updateBasecodeDetail(basecodeDTO basecodeDTO);
    void addBasecodeDetail(basecodeDTO basecodeDTO);
    void deleteBasecodeDetail(String codeTypeID, String codeID);

}



