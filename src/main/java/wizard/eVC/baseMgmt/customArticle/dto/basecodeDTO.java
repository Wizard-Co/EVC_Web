package wizard.eVC.baseMgmt.customArticle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class basecodeDTO {
    public String departID;
    public String depart;
    public String useClss;
    public String GroupID;
    public String GroupName;
    public String LastUpdateUserID;
    public String KCustom; // 거래처 한글명
    public String Article; //품명
    public String BuyerArticleNo; //품번
//    public String UnitPrice; // 단가
    public String BuyUnitPrice; //매입단가
    public String OutUnitPrice; //출하단가
    public String BusinessTypeCode;
    public String comments;
    public String CustomID;
//    public String InvestmentUnitPrice;
//    public String businessCommission;

    public String ArticleID;

    public String PersonId;

    public int iMode; // 수정 시 =2 추가시 =1  로직 을다르게 하기위한 코드

    @JsonProperty("InvestmentUnitPrice")
    private BigDecimal InvestmentUnitPrice = BigDecimal.ZERO;

    @JsonProperty("UnitPrice")
    private BigDecimal UnitPrice = BigDecimal.ZERO;

    @JsonProperty("BusinessCommission")
    private BigDecimal BusinessCommission = BigDecimal.ZERO;

    private List<tableDataDTO> tableData;

}
