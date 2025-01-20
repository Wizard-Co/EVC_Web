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
    public String unitType; // 그냥 단위

    public String imageFileName;
    public String imageFileAlias;
    public String imageFilePath;

    public String sketch1File;
    public String sketch1Alias;
    public String sketch1Path;

    public String sketch2File;
    public String sketch2Alias;
    public String sketch2Path;

    public String sketch3File;
    public String sketch3Alias;
    public String sketch3Path;

    public String sketch4File;
    public String sketch4Alias;
    public String sketch4Path;

    public String sketch5File;
    public String sketch5Alias;
    public String sketch5Path;

    public String labelPrintYN;
    public String buyUnitTypeID;
    public double buyUnitPrice; //매입단가
    public String buyUnitType;

    public String outUnitTypeID;
    public double outUnitPrice;
    public String outUnitType;
    public String hsCode;
    public String freeStuffinYN;

    public String buySaleMainYN;
    public String comments;
    public String patternID;
    public String inspectYN;
    public String ftaMgrYN;

    public String coatingSpec;
    public String part_attr;
    public String createDate;
    public String createUserID;
    public String lastUpdateDate;

    public String lastUpdateUserID;
    public List<ArticleProcess> articleProcessList;
    public List<MultipartFile> fileList;
    public List<String> deleteFileList;

    public List<String> getFileNameList() {
        List<String> fileNames = Arrays.asList(imageFileName, sketch1File, sketch2File, sketch3File, sketch4File, sketch5File);
        return fileNames;
    }

}

