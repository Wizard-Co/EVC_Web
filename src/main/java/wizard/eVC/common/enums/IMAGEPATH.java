package wizard.eVC.common.enums;

/**
 * packageName      : wizard.eVC.common.enums
 * fileName         : IMAGEPATH
 * author           : sooJeong
 * date             : 2024-10-14
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-14         sooJeong             최초 생성
 */
public enum IMAGEPATH {
    DEFAULT("/ImageData"),
    ARTICLE("/article/"),
    PERSON("/person/");

    private String path;

    private IMAGEPATH(String path){
        this.path = path;
    }

    public String getPath() {
        return DEFAULT.path + path;
    }
}
