package wizard.eVC.baseMgmt.article;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.baseMgmt.article.DTO.Article;
import wizard.eVC.baseMgmt.article.DTO.ArticleProcess;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.eVC.baseMgmt.article
 * fileName         : ArticleMapper
 * author           : sooJeong
 * date             : 2024-10-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-07         sooJeong             최초 생성
 */
@Mapper
public interface ArticleMapper {

    List<Article> getArticleList(Map<String, Object> params);
    Article getArticleDetail(String articleID);
    Article saveArticle(Article article);
    Article updateArticle(Article article);
    void updateArticleFtp(Article article);
    void deleteArticle(Map<String, Object> params);
    String checkDeleteArticle(Map<String, Object> params);
    List<ArticleProcess> getArticleProcess(String articleID);
    List<ArticleProcess> getProcess(Map<String, String> params);
    List<Map<String, Object>> getProcessPattern(String sArticleGrpID);
    void saveArticleProcess(ArticleProcess articleProcess);
    List<LinkedHashMap<String, Object>> gethsFinder(HashMap<String, Object> param);

}
