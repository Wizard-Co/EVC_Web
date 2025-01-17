package wizard.eVC.baseMgmt.resably;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.eVC.baseMgmt.resably.DTO.Resably;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 *설명          :
 *작성일         : 2024.11월.05일
 *개발자         : jhd
 *======================================================
 *DATE             AUTHOR               NOTE
 *------------------------------------------------------
 *2024.11월.05일           jhd             최초 생성
 **/

@Service
@AllArgsConstructor
public class ResablyService {

    private ResablyMapper mapper;

    public List<Resably> getResablyList(Map<String, Object> param)
    {
        return  mapper.getResablyList(param);
    }
    public Resably getResablyDetail(String resablyID)
    {
        return  mapper.getResablyDetail(resablyID);
    }

    public void saveResably(Resably resably)
    {
        if (resably.resably == null || resably.resably.isBlank())
            return;

        resably.setCreateUserID("admin");
        if (resably.getUseYN() == null)
        {
            resably.setUseYN("N");
        }
//        useClss: getChecked('chkIncludeUseYN') === true ? 'Y' : 'N'
        mapper.saveResably(resably);
        String resablyID = resably.getResablyID();

    }

    public void updateResably(Resably resably)
    {
        if (resably.resablyID == null || resably.resablyID.isBlank()) return;

        resably.setLastUpdateUserID("admin");

        mapper.updateResably(resably);
        String resablyID = resably.getResablyID();

    }

    public void deleteResably(String resablyID) throws IOException
    {
        Map<String, Object> params = new HashMap<>();
        params.put("resablyID",resablyID);

        mapper.deleteResably(params);

    }




}
