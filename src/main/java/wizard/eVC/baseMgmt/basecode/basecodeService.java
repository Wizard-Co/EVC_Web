package wizard.eVC.baseMgmt.basecode;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wizard.eVC.baseMgmt.basecode.dto.basecodeDTO;

//import wizard.eVC.baseMgmt.basecode.dto.tableDataDTO;

import java.util.List;
import java.util.Map;


@Service
@AllArgsConstructor
public class basecodeService {

    @Autowired
    private basecodeMapper mapper;

    @Transactional(readOnly = true)
    public List<basecodeDTO> getBasecodeList(Map<String, Object> param) {return mapper.getBasecodeList(param); }

    @Transactional(readOnly = true)
    public List<basecodeDTO> getBasecodeDetail(String codeID, String checkTF) { return mapper.getBasecodeDetail(codeID, checkTF);}


    public void updateBasecodeDetail(basecodeDTO basecodedto) {mapper.updateBasecodeDetail(basecodedto);}
    public void addBasecodeDetail(basecodeDTO basecodedto) {mapper.addBasecodeDetail(basecodedto);}
    public void deleteBasecodeDetail(String codeTypeID, String codeID) {mapper.deleteBasecodeDetail(codeTypeID, codeID);}


}


