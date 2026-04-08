package com.sweetrecipe.recipebook.mapper;

import com.sweetrecipe.recipebook.dto.request.SignUpRequest;
import com.sweetrecipe.recipebook.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    void insertUser(SignUpRequest request);
    User findByEmail(@Param("email") String email);
    boolean existsByEmail(@Param("email") String email);
}
