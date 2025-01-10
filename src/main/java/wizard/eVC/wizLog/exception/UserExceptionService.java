/*
설명: 사용자 예외 처리 Service
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.eVC.wizLog.exception;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wizard.eVC.wizLog.exception.dto.UserExceptionDto;

@Service
public class UserExceptionService {
    @Autowired
    private UserExceptionMapper ueMapper;

    @Transactional()
    public Integer insertErrLog(UserExceptionDto userExceptionDto) {
        ueMapper.xp_iErrLog(userExceptionDto);
        return userExceptionDto.getNErrID();
    }

    @Transactional()
    public void insertErrLogSub(UserExceptionDto userExceptionDto) {
        ueMapper.xp_iErrLogSub(userExceptionDto);
    }
}
