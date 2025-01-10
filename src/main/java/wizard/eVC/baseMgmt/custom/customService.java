package wizard.eVC.baseMgmt.custom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wizard.eVC.baseMgmt.custom.dto.customDTO;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class customService {

    @Autowired
    private customMapper mapper;

    @Transactional(readOnly = true)
    public List<customDTO> getCustomList(Map<String, Object> param) {return mapper.getCustomList(param); }

    @Transactional(readOnly = true)
    customDTO getCustomDetail(Map<String, Object> param) {List<customDTO> list = mapper.getCustomList(param); return list.isEmpty() ? null : list.get(0);}

    public void saveCustomDetail(customDTO customdto) {
        if(customdto.createUserID == null || customdto.createUserID.isBlank()){customdto.setCreateUserID("admin");}
        mapper.saveCustomDetail(customdto);
    }
    public void updateCustomDetail(customDTO customdto) {
        if(customdto.lastUpdateUserID == null || customdto.lastUpdateUserID.isBlank()){customdto.setLastUpdateUserID("admin");}
        mapper.updateCustomDetail(customdto); }
    public String deleteCustomDetail(String sCustomID) { return mapper.deleteCustomDetail(sCustomID);}
}
