package wizard.eVC.baseMgmt.resably;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.baseMgmt.resably.DTO.Resably;

import java.util.List;
import java.util.Map;

@Mapper
public interface ResablyMapper {

    List<Resably> getResablyList (Map<String, Object> params);
    Resably saveResably(Resably resably);
    Resably updateResably(Resably resably);

    void deleteResably(Map<String, Object> params);

    String chkDeleteResably(Map<String, Object> params);

    Resably getResablyDetail(String resablyID);

}
