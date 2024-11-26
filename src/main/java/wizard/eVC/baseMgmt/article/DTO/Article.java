package wizard.eVC.baseMgmt.article.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

/**
 * packageName      : wizard.eVC.baseMgmt.article.DTO
 * fileName         : Article
 * author           : sooJeong
 * date             : 2024-10-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-07         sooJeong             최초 생성
 */
@Data
public class Article {

    public String articleID;
    public String article;
    public String companyID;
    public String buyerArticleNo;
    public String articleTypeID;

    public String articleType;
    public String productTypeID;
    public String productType;
    public String supplyTypeID;
    public String supplyType;

    public String partTypeID;
    public String partType;
    public double exDiameter;
    public double inDiameter;
    public double width;

    public double weight;
    public double length;
    public String useYN;
    public String spec;
    public double needStockQty;

    public double prodQtyPerBox;
    public double outQtyPerBox;
    public String unitTypeID;
    public String unitType;
    public String fileName1;

    public String filePath1;
    public String fileName2;
    public String filePath2;
    public String fileName3;
    public String filePath3;

    public String fileName4;
    public String filePath4;
    public String fileName5;
    public String filePath5;
    public String labelPrintYN;

    public double unitPrice;
    public String unitPriceTypeID;
    public double outUnitPrice;
    public String hsCode;
    public String freeStuffinYN;

    public String buySaleMainYN;
    public String comments;
    public String patternID;
    public String inspectYN;
    public String createDate;

    public String createUserID;
    public String lastUpdateDate;
    public String lastUpdateUserID;
    public List<ArticleProcess> articleProcessList;
    public List<MultipartFile> fileList;

    public List<String> getFileNameList() {
        List<String> fileNames = Arrays.asList(fileName1, fileName2, fileName3, fileName4, fileName5);
        return fileNames;
    }
}

