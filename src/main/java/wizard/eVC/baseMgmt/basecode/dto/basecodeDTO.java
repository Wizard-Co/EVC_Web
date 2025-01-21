package wizard.eVC.baseMgmt.basecode.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.List;

@Data
public class basecodeDTO {


    public String codeTypeID;
    public String codeID;
    public String codeName;
    public String codeEName;
    public String parentID;
    public String level;
    public String relation;
    public int seq;
    public int codeSize;
    public String useYN;
    public String comments;
    public String createDate;
    public String createUserID;
    public String lastUpdateDate;
    public String lastUpdateUser;


    @Data
    public static class ListWrapper {
        private List<basecodeDTO> basecodelist = new ArrayList<>();
    }



}
