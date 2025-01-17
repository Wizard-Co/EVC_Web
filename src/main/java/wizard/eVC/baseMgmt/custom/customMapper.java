package wizard.eVC.baseMgmt.custom;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.baseMgmt.custom.dto.customDTO;

import java.util.List;
import java.util.Map;

@Mapper
public interface customMapper {
    List<customDTO> getCustomList(Map<String, Object> param);
    void saveCustomDetail(customDTO customdto);
    void updateCustomDetail(customDTO customdto);
    String deleteCustomDetail(String sCustomID);

}
