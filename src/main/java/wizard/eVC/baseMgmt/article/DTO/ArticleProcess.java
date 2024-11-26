package wizard.eVC.baseMgmt.article.DTO;

import lombok.Data;

/**
 * packageName      : wizard.eVC.baseMgmt.article.DTO
 * fileName         : ArticleProcess
 * author           : sooJeong
 * date             : 2024-10-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-07         sooJeong             최초 생성
 */
@Data
public class ArticleProcess {
    public String articleID;
    public String processID;
    public String process;
    public String useYN;
    public String createUserID;
}

