package wizard.eVC.baseMgmt.basecode.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class tableDataDTO {
    @JsonProperty("ArticleID")
    private String ArticleID;

    private String CustomID;
    @JsonProperty("InvestmentUnitPrice")
    private BigDecimal InvestmentUnitPrice = BigDecimal.ZERO;

    @JsonProperty("UnitPrice")
    private BigDecimal UnitPrice = BigDecimal.ZERO;

    @JsonProperty("BusinessCommission")
    private BigDecimal BusinessCommission = BigDecimal.ZERO;
    private String PersonId;


}
