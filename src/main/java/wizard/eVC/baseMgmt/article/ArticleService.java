package wizard.eVC.baseMgmt.article;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import wizard.eVC.baseMgmt.article.DTO.Article;
import wizard.eVC.baseMgmt.article.DTO.ArticleProcess;
import wizard.eVC.common.enums.IMAGEPATH;
import wizard.eVC.common.util.FTP;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * packageName      : wizard.eVC.baseMgmt.article.DTO
 * fileName         : ArticleService
 * author           : sooJeong
 * date             : 2024-10-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-07         sooJeong             최초 생성
 */
@Service
@AllArgsConstructor
public class ArticleService {

    private ArticleMapper mapper;
    private FTP ftp;

    public List<Article> getArticleList(Map<String, Object> param) {
        return mapper.getArticleList(param);
    }

    public Article getArticleDetail(String articleID) {
        return mapper.getArticleDetail(articleID);
    }


    public List<ArticleProcess> getArticleProcess(String articleID) {
        return mapper.getArticleProcess(articleID);
    }

    public List<String> getArticleProcessID(String articleID) {
        List<ArticleProcess> articleProcessList = getArticleProcess(articleID);
        List<String> apList = articleProcessList.stream().map(pro -> pro.getProcessID()).collect(Collectors.toList());
        return apList;
    }

    public List<ArticleProcess> getProcess(String processID, String process) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("processID", processID);
        params.put("process", process);
        return mapper.getProcess(params);
    }

    public void saveArticle(Article article) {
        if (article.articleID == null || article.articleID.isBlank()) return;

        article.setCreateUserID("admin");  // 로그인한 userID 로 바꾸기

        mapper.saveArticle(article);
        String articleID = article.getArticleID();

        saveArticleProcess(articleID, article.articleProcessList);
        uploadFile(article, article.fileList);

    }

    public void updateArticle(Article article) {
        if (article.articleID == null || article.articleID.isBlank()) return;

        String articleID = article.getArticleID();
        article.setLastUpdateUserID("admin");  // 로그인한 userID 로 바꾸기

        Article oldArticle = mapper.getArticleDetail(articleID);

        List<MultipartFile> newOne = article.getFileList();
        List<String> oldfileNames =  oldArticle.getFileNameList();

        for (int i = 0; i < newOne.size(); i++) {
            MultipartFile file = newOne.get(i);
            if (!file.isEmpty()) {
                if (!file.getOriginalFilename().equals(oldfileNames.get(i))) {
                    String filePath = IMAGEPATH.ARTICLE.getPath() + articleID + "/";
                    ftp.uploadFile(file, filePath);
                    setArticleFile(i, article, file.getOriginalFilename(), filePath);
                } else {
                    setArticleOldFile(i, article, oldArticle);
                }
            }
        }
        mapper.updateArticle(article);
        saveArticleProcess(articleID, article.articleProcessList);
    }

    private void uploadFile(Article article, List<MultipartFile> fileList) {
        if (fileList == null || fileList.isEmpty()) return;

        String articleID = article.getArticleID();

        for (int i = 0; i < fileList.size(); i++) {
            MultipartFile file = fileList.get(i);
            if (!file.isEmpty()) {
                String filePath = IMAGEPATH.ARTICLE.getPath() + articleID + "/";
                ftp.uploadFile(file, filePath);
                setArticleFile(i, article, file.getOriginalFilename(), filePath);
            }
        }
        mapper.updateArticleFtp(article);
    }

    private void setArticleOldFile(int index, Article article, Article oldArticle) {
        switch (index) {
            case 0:
                article.setFileName1(oldArticle.getFileName1());
                article.setFilePath1(oldArticle.getFilePath1());
                break;
            case 1:
                article.setFileName2(oldArticle.getFileName2());
                article.setFilePath2(oldArticle.getFilePath2());
                break;
            case 2:
                article.setFileName3(oldArticle.getFileName3());
                article.setFilePath3(oldArticle.getFilePath3());
                break;
        }
    }

    private void setArticleFile(int index, Article article, String fileName, String filePath) {
        switch (index) {
            case 0:
                article.setFileName1(fileName);
                article.setFilePath1(filePath);
                break;
            case 1:
                article.setFileName2(fileName);
                article.setFilePath2(filePath);
                break;
            case 2:
                article.setFileName3(fileName);
                article.setFilePath3(filePath);
                break;
        }
    }

    private void saveArticleProcess(String article, List<ArticleProcess> articleProcessList) {
        if (articleProcessList == null || articleProcessList.isEmpty()) return;

        for (ArticleProcess ap : articleProcessList) {
            if (ap.processID != null) {
                ap.setArticleID(article);
                ap.setUseYN("Y");
                ap.setCreateUserID("sooJeong");
                mapper.saveArticleProcess(ap);
            }
        }
    }

    public void deleteArticle(String articleID) throws IOException {

        Map<String, Object> params = new HashMap<>();
        params.put("articleID", articleID);
        params.put("message", "");
        params.put("lastUpdateUserID", "");

        String message = mapper.checkDeleteArticle(params);

        if (message != null) {
            throw new IOException(message);
        }
        mapper.deleteArticle(params);
    }

    public List<Map<String, Object>> getProcessPattern(String articleTypeID) {
        return mapper.getProcessPattern(articleTypeID);
    }
}

